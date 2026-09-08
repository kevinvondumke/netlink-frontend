// VUE
import { reactive, ref } from "vue";

// SERVICES, STORES AND ROUTES
import axios from "axios";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { router } from "../router";
import { idEquals, isPresentId } from "./idUtils";
import {
  consoleMutationFeedback,
  runLikeMutation,
  runCreateComment,
  runDeleteComment,
  runRepostMutation,
  runCreatePost,
  runEditPost,
  runDeletePost,
} from "./actions";

// TYPES
import type {
  PostType,
  UniquePost,
  Comment,
  EditingComment,
  CreatePost,
  UserMention,
  SpecificFollower,
} from "../types/types.ts";

// POSTS
export const userdata = ref<PostType[]>([]);
export const selectedPostId = ref<string | number>("");
export const uniquePostType = ref<"Post" | "Share">("Post");
export const uniquePost = ref<UniquePost>({} as UniquePost);

// STATES

const loadingComments = ref(false);
const commentsError = ref("");

export function usePosts() {
  const authStore = useAuthStore();

  // CREATE POST
  const createPostData: CreatePost = reactive({
    content: "",
    mentions: [] as UserMention[],
    location: "",
    imageUrl: "",
    visibility: "PUBLIC",
    specificFollowers: [] as SpecificFollower[],
    hideLikes: false,
    disableComments: false,
  });

  // POST COMPONENT OPTIONS
  const openOptionsFor = ref<number | string>("");
  const openEditModalFor = ref<number | string>("");
  const openCommentOptions = ref<number | string | null>(null);
  const closeCommentOptions = ref<boolean>(false);

  // EDIT POST
  const editingPost = ref<PostType | UniquePost | null>(null);

  // EDIT COMMENT
  const editingComment: EditingComment = reactive({
    postComment: "",
    editedCommentContent: "",
    openCommentPostId: null as number | string | null,
    editingCommentId: null as number | string | null,
    openCommentActions: null as number | string | null,
  });

  // CREATE POST
  async function createPost() {
    try {
      const optimisticPost: PostType = {
        id: `temp-${Date.now()}` as any,
        content: createPostData.content,
        author: {
          id: authStore.user?.id,
          name: authStore.user?.name,
          username: authStore.user?.username,
          avatarUrl: authStore.user?.avatarUrl,
        },
        createdAt: new Date().toISOString(),
        _count: { likes: 0, comments: 0, shares: 0 },
        isRepost: false,
      } as PostType;

      await runCreatePost({
        posts: userdata,
        post: optimisticPost,
        onRequest: async () => {
          const response = await api.post("/post/", {
            content: createPostData.content,
            visibility: createPostData.visibility,
            specificFollowers: createPostData.specificFollowers,
            location: createPostData.location,
            imageUrl: createPostData.imageUrl,
            hideLikes: createPostData.hideLikes,
            disableComments: createPostData.disableComments,
            mentions: createPostData.mentions,
          });
          return response.data as PostType;
        },
        onFeedback: consoleMutationFeedback,
      });

      createPostData.content = "";
      createPostData.mentions = [];
      createPostData.visibility = "PUBLIC";
      createPostData.specificFollowers = [];
      createPostData.location = "";
      createPostData.imageUrl = "";
      createPostData.hideLikes = false;
      createPostData.disableComments = false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // LOAD POST
  const loadingPosts = ref(false);
  const postsError = ref("");
  const cursors = ref<Record<string, string | null>>({});
  const hasMore = ref<Record<string, boolean>>({});
  const currentRoute = ref<string | null>(null);

  async function loadPosts(route: string) {
    // CHECK IF USER IS AUTHENTICATED
    if (!authStore.isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (currentRoute.value !== route) {
      currentRoute.value = route;
      userdata.value = [];
      cursors.value[route] = null; // INIT ALL, 'USER/:ID', ETC. ROUTE POSTS
      hasMore.value[route] = true; // ROUTE STRING
    }

    if (loadingPosts.value || hasMore.value[route] === false) return;

    loadingPosts.value = true;
    postsError.value = "";

    try {
      const cursor = cursors.value[route];
      const params = new URLSearchParams({ limit: "10" });
      if (cursor) params.append("cursor", cursor);

      const response = await api.get(`/post/${route}?${params}`);
      const { posts: newPosts, nextCursor } = response.data;

      userdata.value.push(...(newPosts || []));
      cursors.value[route] = nextCursor;
      hasMore.value[route] = nextCursor !== null;

      if (route === "following" && userdata.value.length === 0) {
        currentRoute.value = null; // RST
        loadingPosts.value = false;
        await loadPosts("all");
      }
    } catch (error) {
      postsError.value = "Failed to load posts.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingPosts.value = false;
    }
  }

  async function loadPost(postId: number | string) {
    try {
      // CHECK IF USER IS AUTHENTICATED
      if (!authStore.isAuthenticated()) {
        router.push("/login");
        return;
      }
      const response = await api.get(`/post/p/${postId}`);
      if (!response.data) {
        postsError.value = "Post not found.";
        return;
      }
      uniquePost.value = response.data;
    } catch (error) {
      console.error("Error loading post:", error);
    }
  }

  async function loadShare(shareId: number | string) {
    try {
      // CHECK IF USER IS AUTHENTICATED
      if (!authStore.isAuthenticated()) {
        router.push("/login");
        return;
      }
      
      const response = await api.get(`/post/share/${shareId}`);
      uniquePost.value = response.data.post;
    } catch (error) {
      console.error("Error loading share: ", error);
    }
  }

  // DELETE POST
  async function deletePost(postId: number | string) {
    try {
      await runDeletePost({
        posts: userdata,
        postId,
        onRequest: async (pId) => {
          await api.delete(`/post/delete/${pId}`);
        },
        onFeedback: consoleMutationFeedback,
      });
      openOptionsFor.value = "";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // SAVE EDITED POST
  async function saveEdit(postId: number | string) {
    if (!editingPost.value) return;
    try {
      const selectedPost = userdata.value.find((p) => p.id === postId);
      if (!selectedPost) return;

      await runEditPost({
        post: selectedPost,
        newContent: editingPost.value.content,
        onRequest: async (pId, content) => {
          await api.put(`/post/update/${pId}`, { content });
        },
        onFeedback: consoleMutationFeedback,
      });

      closeEditModal();
      openOptionsFor.value = "";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // LIKE / UNLIKE POST
  async function likePost(postId: number, state: boolean) {
    try {
      const selectedPost = userdata.value.find((post) => post.id === postId);
      if (!selectedPost) return;

      await runLikeMutation({
        post: selectedPost,
        nextLiked: !state,
        onRequest: async (currentPostId, nextLiked) => {
          if (nextLiked) {
            await api.post(`/post/like/${currentPostId}`);
          } else {
            await api.post(`/post/unlike/${currentPostId}`);
          }
        },
        onFeedback: consoleMutationFeedback,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // LOAD COMMENTS
  async function loadComments(postId: number | string) {
    loadingComments.value = true;
    commentsError.value = "";

    try {
      const response = await api.get(`/post/comments/all/${postId}`);
      const comments: Comment[] = response.data?.comments || [];
      const post = userdata.value.find((p) => p.id === postId);

      if (!post) return;

      post.comments = comments;
    } catch (error) {
      commentsError.value = "Failed to load comments.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingComments.value = false;
    }
  }

  // NEW COMMENT
  async function newComment(postId: number | string) {
    try {
      if (!editingComment.postComment.trim()) return;

      const selectedPost = userdata.value.find((p) => p.id === postId);
      if (!selectedPost) return;

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}` as any,
        content: editingComment.postComment,
        author: authStore.user as any,
        createdAt: new Date().toISOString(),
      } as Comment;

      await runCreateComment({
        post: selectedPost,
        comment: optimisticComment,
        onRequest: async (currentPostId, content) => {
          const response = await api.post(`/post/comment/${currentPostId}`, {
            content,
          });
          return response.data as Comment;
        },
        onFeedback: consoleMutationFeedback,
      });

      editingComment.postComment = "";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // UNIQUE POST NEW COMMENT
  const uniquePostComment = ref<string>("");
  async function newUniqueComment(postId: number | string) {
    try {
      const response = await api.post(`/post/comment/${postId}`, {
        content: uniquePostComment.value,
      });
      uniquePost.value.comments?.unshift(response.data);
      uniquePostComment.value = "";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // EDIT COMMENT
  async function editComment(
    commentId: number | string,
    postId: number | string,
  ) {
    try {
      if (!editingComment.editedCommentContent.trim()) return;

      await api.put(`/post/comment/${commentId}`, {
        content: editingComment.editedCommentContent,
        createdAt: new Date().toISOString(),
      });

      // UPDATE COMMENT LOCALLY
      const selectedPost = userdata.value.find((p) => p.id === postId);

      if (selectedPost) {
        const selectedComment = selectedPost.comments?.find(
          (comment) => comment.id === commentId,
        );

        if (selectedComment) {
          selectedComment.content = editingComment.editedCommentContent;
        }
      }

      editingComment.editingCommentId = null;
      editingComment.editedCommentContent = "";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // DELETE COMMENT
  async function deleteComment(
    commentId: number | string,
    postId: number | string,
  ) {
    try {
      const selectedPost = userdata.value.find((p) => p.id === postId);
      if (!selectedPost) return;

      await runDeleteComment({
        post: selectedPost,
        commentId,
        onRequest: async (cId) => {
          await api.delete(`/post/comment/${cId}`);
        },
        onFeedback: consoleMutationFeedback,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // REPOST
  async function repost(postId: number | string, state: boolean) {
    try {
      const selectedPost = userdata.value.find((p) => p.id === postId);
      if (!selectedPost) return;

      await runRepostMutation({
        post: selectedPost,
        posts: userdata,
        nextState: state,
        onRequest: async (currentPostId, nextState) => {
          if (nextState === true) {
            await api.delete(`/post/repost/${currentPostId}`);
          } else {
            await api.post(`/post/repost/${currentPostId}`);
          }
        },
        onFeedback: consoleMutationFeedback,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // OPTION MODALS
  function displayPostOptions(postId: number | string) {
    openOptionsFor.value = openOptionsFor.value === postId ? "" : postId;
  }
  function openEditModal(post: PostType | UniquePost) {
    openEditModalFor.value = openEditModalFor.value === post.id ? "" : post.id;
    editingPost.value = { ...post };
  }
  function closeEditModal() {
    openEditModalFor.value = "";
  }
  function toggleCommentInput(postId: number | string) {
    editingComment.openCommentPostId =
      editingComment.openCommentPostId === postId ? null : postId;
    loadComments(postId);
  }
  function toggleCommentOptions(commentId: number | string) {
    openCommentOptions.value = commentId;
    closeCommentOptions.value = !closeCommentOptions.value;
  }
  function toggleCommentActions(commentId: number | string) {
    editingComment.openCommentActions =
      editingComment.openCommentActions === commentId ? null : commentId;
  }
  function startEditComment(commentId: number | string, content: string) {
    editingComment.editingCommentId = commentId;
    editingComment.editedCommentContent = content;
    editingComment.openCommentActions = null;
  }

  // HELPER FUNCTIONS
  function toUtcDateTime(date: string): string {
    if (!date) return "";

    const utcDate = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }).format(utcDate);
  }
  function isAuthorComment(commentAuthorId: number | string): boolean {
    const currentUser = authStore.user as {
      id?: number | string;
      userId?: number | string;
    } | null;
    const currentUserId = currentUser?.id ?? currentUser?.userId;

    if (!isPresentId(currentUserId)) return false;
    return idEquals(commentAuthorId, currentUserId);
  }
  function isAuthorPost(postAuthorId: number | string): boolean {
    const currentUser = authStore.user as {
      id?: number | string;
      userId?: number | string;
    } | null;
    const currentUserId = currentUser?.id ?? currentUser?.userId;

    if (!isPresentId(currentUserId)) return false;
    return !idEquals(postAuthorId, currentUserId);
  }
  function validatePostOwnership(postAuthorId: number | string): boolean {
    const currentUser = authStore.user as {
      id?: number | string;
      userId?: number | string;
    } | null;
    const currentUserId = currentUser?.id ?? currentUser?.userId;

    if (!isPresentId(currentUserId)) return false;
    return idEquals(postAuthorId, currentUserId);
  }
  async function selectMention(username: string) {
    createPostData.mentions.push({ username });
  }
  async function addSpecificFollowers(id: string | number) {
    if (
      createPostData.specificFollowers.some((follower) =>
        idEquals(follower.id, id),
      )
    ) {
      createPostData.specificFollowers =
        createPostData.specificFollowers.filter(
          (follower) => !idEquals(follower.id, id),
        );
    } else {
      createPostData.specificFollowers.push({ id });
    }
  }
  function addLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        createPostData.location = `${latitude}, ${longitude}`;
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve location.");
      },
    );
  }
  function changeVisibility(mode: CreatePost["visibility"]) {
    createPostData.visibility = mode;
    switch (mode) {
      case "PUBLIC":
        createPostData.visibility = "PUBLIC";
        break;
      case "FOLLOWERS":
        createPostData.visibility = "FOLLOWERS";
        break;
      case "ONLY_ME":
        createPostData.visibility = "ONLY_ME";
        break;
      case "SPECIFIC":
        createPostData.visibility = "SPECIFIC";
        break;
      default:
        createPostData.visibility = "PUBLIC";
    }
  }
  function toggleHideLikes() {
    createPostData.hideLikes = !createPostData.hideLikes;
  }
  function toggleDisableComments() {
    createPostData.disableComments = !createPostData.disableComments;
  }

  return {
    // VARIABLES
    userdata,
    uniquePost,
    uniquePostType,
    selectedPostId,
    createPostData,
    openOptionsFor,
    openEditModalFor,
    openCommentOptions,
    closeCommentOptions,
    editingPost,
    editingComment,
    uniquePostComment,
    loadingPosts,
    postsError,
    hasMore,
    currentRoute,
    loadingComments,
    commentsError,

    // CREATE POST FUNCTIONS
    createPost,
    addLocation,
    selectMention,
    addSpecificFollowers,

    // POST FUNCTIONS
    loadPosts,
    loadPost,
    loadShare,
    deletePost,
    saveEdit,
    likePost,
    repost,

    // COMMENTS FUNCTIONS
    loadComments,
    newComment,
    newUniqueComment,
    editComment,
    deleteComment,

    // OPTION MODALS
    displayPostOptions,
    openEditModal,
    closeEditModal,
    changeVisibility,
    toggleHideLikes,
    toggleDisableComments,
    toggleCommentInput,
    toggleCommentOptions,
    toggleCommentActions,
    startEditComment,

    // HELPER FUNCTIONS
    toUtcDateTime,
    isAuthorComment,
    isAuthorPost,
    validatePostOwnership,
  };
}
