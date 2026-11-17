<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Notifications from "./Notifications.vue";
import Post from "./Posts.vue";
import SpriteIcon from "./SpriteIcon.vue";
import ErrorState from "./states/ErrorState.vue";
import EmptyState from "./states/EmptyState.vue";
import SkeletonUserRow from "./states/SkeletonUserRow.vue";
import SkeletonPost from "./states/SkeletonPost.vue";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// STYLES
import "../styles/app-layout.css";
import "../styles/dashboard.css";
import "../styles/userbutton.css";
import "../styles/input.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  favoriteUsers,
  loadingFavoriteUsers,
  favoriteUsersError,
  suggestedUsers,
  loadingSearchFavoriteUsers,
  searchFavoriteUsersError,
  loadingSuggestedUsers,
  suggestedUsersError,
  favSearchQuery,
  favStateEdit,
  selectedUserId,

  // FUNCTIONS
  loadFavoriteUsers,
  searchFavoriteUsers,
  addFavoriteUser,
  deleteFavoriteUser,
  removeAllFavoriteUsers,
  loadSuggestedUsers,
  selectedUser,
} = useUserData();

// POST FUNCTIONS
const { userdata, loadingPosts, postsError, loadPosts } = usePosts();

async function refreshDashboardFavorites() {
  if (favStateEdit.value && favSearchQuery.value.trim()) {
    await searchFavoriteUsers(favSearchQuery.value);
    return;
  }

  await loadFavoriteUsers();
  await loadSuggestedUsers("favorites");
}

async function refreshDashboardFeed() {
  if (selectedUserId.value) {
    await loadPosts(`user/${selectedUserId.value}`);
    return;
  }

  await loadPosts("following");
}

watch(favSearchQuery, (newQuery) => {
  if (newQuery.trim() === "") {
    loadFavoriteUsers();
    loadSuggestedUsers("favorites");
  } else {
    searchFavoriteUsers(newQuery);
  }
});

watch(selectedUserId, async (newUserId) => {
  if (newUserId) {
    await loadPosts(`user/${newUserId}`);
  }
});

onMounted(async () => {
  selectedUserId.value = "";
  await loadFavoriteUsers();
  await loadSuggestedUsers("favorites");
  await loadPosts("following");
});
</script>

<template>
  <div class="app-layout">
    <Navigation />
    <div class="dash-sidepanel scrollable-hidden">
      <div class="dash-fav-base">
        <div class="fav-head">
          <h2>Favorites</h2>
          <button
            class="button"
            type="button"
            @click="favStateEdit = !favStateEdit"
          >
            <SpriteIcon
              name="list"
              size="22"
              color="#535353"
              title="Toggle favorites"
            />
          </button>
        </div>
        <div class="fav-user-list" v-if="!favStateEdit">
          <SkeletonUserRow v-if="loadingFavoriteUsers" :count="4" />
          <ErrorState
            v-else-if="favoriteUsersError"
            :message="favoriteUsersError"
            @retry="refreshDashboardFavorites"
          />
          <div
            v-else-if="favoriteUsers.length > 0"
            class="bar-user-box"
            :class="{ selected: selectedUserId === user.id }"
            v-for="user in favoriteUsers"
            :key="user.id"
          >
            <button class="button" type="button" @click="selectedUser(user.id)">
              <div class="bar-user-info">
                <AvatarIcon />
                <div class="bar-userdata">
                  <h2 class="bar-user-name">{{ user.name }}</h2>
                  <p class="bar-user-username">@{{ user.username }}</p>
                </div>
              </div>
            </button>
          </div>
          <EmptyState
            v-else
            title="No favorites yet"
            message="Choose your favorite users to keep them here."
            icon="connections"
          />
        </div>
        <div class="dash-fav-edit" v-else>
          <div class="fav-edit-search">
            <input
              type="search"
              name="search"
              id="fav-search"
              placeholder="Search"
              v-model="favSearchQuery"
            />
            <SpriteIcon
              name="search"
              size="22"
              color="#535353"
              title="Search"
            />
          </div>
          <div class="fav-edit-favorites">
            <SkeletonUserRow v-if="loadingSearchFavoriteUsers" :count="4" />
            <ErrorState
              v-else-if="searchFavoriteUsersError"
              :message="searchFavoriteUsersError"
              @retry="refreshDashboardFavorites"
            />
            <template v-else-if="favoriteUsers.length > 0">
              <div class="fav-edit-listhead">
                <p>Users</p>
                <button
                  class="button"
                  type="button"
                  @click="removeAllFavoriteUsers()"
                >
                  Remove all
                </button>
              </div>
              <div class="fav-edit-users">
                <div
                  class="fav-user"
                  v-for="user in favoriteUsers"
                  :key="user.id"
                >
                  <div class="fav-user-data">
                    <div class="fav-user-icon">
                      <AvatarIcon />
                    </div>
                    <div class="fav-user-names">
                      <p>{{ user.name }}</p>
                      <p>@{{ user.username }}</p>
                    </div>
                  </div>
                  <button
                    class="button"
                    type="button"
                    @click="deleteFavoriteUser(user.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </template>
            <EmptyState
              v-else
              title="No favorites yet"
              message="Add users here to manage your favorites."
              icon="connections"
            />
          </div>
          <div class="fav-add-suggestions">
            <p>Suggestions</p>
            <SkeletonUserRow v-if="loadingSuggestedUsers" :count="4" />
            <ErrorState
              v-else-if="suggestedUsersError"
              :message="suggestedUsersError"
              @retry="loadSuggestedUsers('favorites')"
            />
            <div class="fav-add-users" v-else-if="suggestedUsers.length > 0">
              <div
                class="fav-user"
                v-for="user in suggestedUsers"
                :key="user.id"
              >
                <div class="fav-user-data">
                  <div class="fav-user-icon">
                    <AvatarIcon />
                  </div>
                  <div class="fav-user-names">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                  </div>
                </div>
                <button
                  class="button"
                  type="button"
                  @click="addFavoriteUser(user.id)"
                >
                  Add
                </button>
              </div>
            </div>
            <EmptyState
              v-else
              title="No suggestions available"
              message="Follow more users to expand your favorites list."
              icon="connections"
            />
          </div>
        </div>
      </div>
      <Notifications />
    </div>
    <div class="dash-content scrollable-hidden">
      <div class="dash-lposts">
        <h2>Latest Posts</h2>
        <SkeletonPost v-if="loadingPosts" />
        <ErrorState
          v-else-if="postsError"
          :message="postsError"
          @retry="refreshDashboardFeed"
        />
        <Post v-else-if="userdata.length > 0" />
        <EmptyState
          v-else
          title="No posts yet"
          message="There is nothing to show in this feed right now."
          icon="dashboard"
        />
      </div>
    </div>
  </div>
</template>
