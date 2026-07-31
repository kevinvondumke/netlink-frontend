import type { Ref } from "vue";

import { idEquals } from "../idUtils";
import type { PostType } from "../../types/types";
import type { MutationFeedbackHandler } from "./feedback";

export interface LikeSnapshot {
  postId: number | string;
  liked: boolean;
  likes: number;
}

export interface PostLikeState {
  post: PostType;
}

export function createLikeSnapshot(post: PostType): LikeSnapshot {
  return {
    postId: post.id,
    liked: post.author.liked,
    likes: post._count.likes ?? 0,
  };
}

export function applyOptimisticLike(post: PostType, nextLiked: boolean) {
  const snapshot = createLikeSnapshot(post);

  post.author.liked = nextLiked;
  post._count.likes = nextLiked
    ? (post._count.likes ?? 0) + 1
    : Math.max(0, (post._count.likes ?? 0) - 1);

  return snapshot;
}

export function rollbackOptimisticLike(post: PostType, snapshot: LikeSnapshot) {
  if (!idEquals(post.id, snapshot.postId)) return;

  post.author.liked = snapshot.liked;
  post._count.likes = snapshot.likes;
}

export interface LikeMutationOptions {
  post: PostType;
  nextLiked: boolean;
  onRequest: (postId: number | string, nextLiked: boolean) => Promise<void>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runLikeMutation({
  post,
  nextLiked,
  onRequest,
  onFeedback,
}: LikeMutationOptions) {
  const snapshot = applyOptimisticLike(post, nextLiked);

  try {
    await onRequest(post.id, nextLiked);
    onFeedback?.({
      kind: "success",
      title: nextLiked ? "Post liked" : "Post unliked",
      description: "Local state and server state are now aligned.",
    });
  } catch (error) {
    rollbackOptimisticLike(post, snapshot);
    onFeedback?.({
      kind: "error",
      title: "Could not update like",
      description: "The post state was restored because the request failed.",
      error,
    });

    throw error;
  }
}

export interface PostLookup {
  posts: Ref<PostType[]>;
}

// CREATE POST
export interface CreatePostSnapshot {
  previousPosts?: PostType[];
}

export function applyOptimisticCreatePost(
  posts: Ref<PostType[]>,
  post: PostType,
) {
  const snapshot: CreatePostSnapshot = { previousPosts: [...posts.value] };
  posts.value.unshift(post);
  return snapshot;
}

export function rollbackCreatePost(
  posts: Ref<PostType[]>,
  snapshot: CreatePostSnapshot | null,
) {
  if (!snapshot) return;
  posts.value = snapshot.previousPosts ?? [];
}

export interface CreatePostOptions {
  posts: Ref<PostType[]>;
  post: PostType;
  onRequest: (payload: Partial<PostType>) => Promise<PostType>;
  onFeedback?: MutationFeedbackHandler;
}

function mergeCreatedPost(
  optimisticPost: PostType,
  serverPost: PostType,
): PostType {
  return {
    ...optimisticPost,
    ...serverPost,
    author: {
      ...optimisticPost.author,
      ...(serverPost.author ?? {}),
    },
    repostedBy: serverPost.repostedBy
      ? {
          ...optimisticPost.repostedBy,
          ...serverPost.repostedBy,
        }
      : optimisticPost.repostedBy,
    _count: {
      ...optimisticPost._count,
      ...(serverPost._count ?? {}),
    },
    comments: serverPost.comments ?? optimisticPost.comments,
    mentions: serverPost.mentions ?? optimisticPost.mentions,
  };
}

export async function runCreatePost({
  posts,
  post,
  onRequest,
  onFeedback,
}: CreatePostOptions) {
  const snapshot = applyOptimisticCreatePost(posts, post);

  try {
    const serverPost = await onRequest(post as Partial<PostType>);
    const idx = posts.value.findIndex((p) => p.id === post.id);
    const optimisticPost = posts.value[idx];
    if (optimisticPost)
      posts.value[idx] = mergeCreatedPost(optimisticPost, serverPost);
    onFeedback?.({ kind: "success", title: "Post created" });
    return serverPost;
  } catch (error) {
    rollbackCreatePost(posts, snapshot);
    onFeedback?.({ kind: "error", title: "Could not create post", error });
    throw error;
  }
}

// EDIT POST
export interface EditPostSnapshot {
  postId: number | string;
  previousContent: string;
}

export function applyOptimisticEdit(post: PostType, newContent: string) {
  const snapshot: EditPostSnapshot = {
    postId: post.id,
    previousContent: post.content,
  };
  post.content = newContent;
  return snapshot;
}

export function rollbackEdit(
  post: PostType,
  snapshot: EditPostSnapshot | null,
) {
  if (!snapshot) return;
  if (!idEquals(post.id, snapshot.postId)) return;
  post.content = snapshot.previousContent;
}

export interface EditPostOptions {
  post: PostType;
  newContent: string;
  onRequest: (postId: number | string, content: string) => Promise<void>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runEditPost({
  post,
  newContent,
  onRequest,
  onFeedback,
}: EditPostOptions) {
  const snapshot = applyOptimisticEdit(post, newContent);
  try {
    await onRequest(post.id, newContent);
    onFeedback?.({ kind: "success", title: "Post updated" });
  } catch (error) {
    rollbackEdit(post, snapshot);
    onFeedback?.({ kind: "error", title: "Could not update post", error });
    throw error;
  }
}

// DELETE POST
export interface DeletePostSnapshot {
  previousPosts?: PostType[];
}

export function applyOptimisticDeletePost(
  posts: Ref<PostType[]>,
  postId: number | string,
) {
  const snapshot: DeletePostSnapshot = { previousPosts: [...posts.value] };
  const idx = posts.value.findIndex((p) => idEquals(p.id, postId));
  if (idx >= 0) posts.value.splice(idx, 1);
  return snapshot;
}

export function rollbackDeletePost(
  posts: Ref<PostType[]>,
  snapshot: DeletePostSnapshot | null,
) {
  if (!snapshot) return;
  posts.value = snapshot.previousPosts ?? [];
}

export interface DeletePostOptions {
  posts: Ref<PostType[]>;
  postId: number | string;
  onRequest: (postId: number | string) => Promise<void>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runDeletePost({
  posts,
  postId,
  onRequest,
  onFeedback,
}: DeletePostOptions) {
  const snapshot = applyOptimisticDeletePost(posts, postId);
  try {
    await onRequest(postId);
    onFeedback?.({ kind: "success", title: "Post deleted" });
  } catch (error) {
    rollbackDeletePost(posts, snapshot);
    onFeedback?.({ kind: "error", title: "Could not delete post", error });
    throw error;
  }
}

export interface RepostSnapshot {
  postId: number | string;
  previousShares: number;
  previousPosts?: PostType[];
}

export function createRepostSnapshot(post: PostType, posts?: Ref<PostType[]>) {
  return {
    postId: post.id,
    previousShares: post._count.shares ?? 0,
    previousPosts: posts?.value ? [...posts.value] : undefined,
  } as RepostSnapshot;
}

export function applyOptimisticRepost(
  post: PostType,
  posts: Ref<PostType[]> | undefined,
  nextState: boolean,
) {
  const snapshot = createRepostSnapshot(post, posts);

  if (nextState === true) {
    // un-repost
    if (post._count.shares && post._count.shares > 0) post._count.shares--;
    if (posts) {
      posts.value = posts.value.filter((p) => !idEquals(p.id, post.id));
    }
  } else {
    // repost
    post._count.shares = (post._count.shares ?? 0) + 1;
  }

  return snapshot;
}

export function rollbackRepost(
  post: PostType,
  snapshot: RepostSnapshot | null,
  posts?: Ref<PostType[]>,
) {
  if (!snapshot) return;
  if (!idEquals(post.id, snapshot.postId)) return;

  post._count.shares = snapshot.previousShares;
  if (posts && snapshot.previousPosts) {
    posts.value = snapshot.previousPosts;
  }
}

export interface RepostOptions {
  post: PostType;
  posts?: Ref<PostType[]>;
  nextState: boolean;
  onRequest: (postId: number | string, nextState: boolean) => Promise<void>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runRepostMutation({
  post,
  posts,
  nextState,
  onRequest,
  onFeedback,
}: RepostOptions) {
  const snapshot = applyOptimisticRepost(post, posts, nextState);

  try {
    await onRequest(post.id, nextState);
    onFeedback?.({
      kind: "success",
      title: nextState ? "Repost removed" : "Post reposted",
    });
  } catch (error) {
    rollbackRepost(post, snapshot, posts);
    onFeedback?.({ kind: "error", title: "Could not update repost", error });
    throw error;
  }
}
