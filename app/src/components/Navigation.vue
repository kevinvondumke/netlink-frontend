<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";

// STYLES
import "../styles/navigation-layout.css";

// COMPONENTS
import SpriteIcon from "./SpriteIcon.vue";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { unreadMessagesCount, getUnreadMessagesCount } = useUserData();

onMounted(async () => {
  await getUnreadMessagesCount();
});

async function signOut() {
  try {
    authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Error during logout: ", error);
  }
}
</script>

<template>
  <div class="browser-navbar">
    <div class="dash-baselogo">
      <img
        src="../assets/logos/netlink-logo-06.png"
        alt="Netlink Logo"
        width="200px"
      />
    </div>
    <div>
      <div class="dash-mainnav">
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'dashboard' }"
        >
          <router-link to="/dashboard">
            <button class="button">
              <SpriteIcon name="dashboard" size="22" title="Dashboard" />
              <span>Dashboard</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'create-post' }"
        >
          <router-link to="/create">
            <button class="button">
              <SpriteIcon name="create" size="22" title="Create" />
              <span>Create & Post</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'explore' }"
        >
          <router-link to="/explore">
            <button class="button">
              <SpriteIcon name="explore" size="22" title="Explore" />
              <span>Explore</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'connections' }"
        >
          <router-link to="/connections">
            <button class="button">
              <SpriteIcon name="connections" size="22" title="Connections" />
              <span>Connections</span>
            </button>
          </router-link>
        </div>
      </div>
      <div class="dash-lownav">
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'account' }"
        >
          <router-link to="/account">
            <button class="button">
              <SpriteIcon name="profile" size="22" title="Account" />
              <span>Account</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns dash-msg-count"
          :class="{ 'dash-navactive': route.name === 'messages' }"
        >
          <router-link to="/messages">
            <button class="button">
              <SpriteIcon
                name="messages"
                size="24"
                color="#FFFFFF"
                title="Messages"
              />
              <span>Messages</span>
            </button>
          </router-link>
          <div class="message-count" v-if="unreadMessagesCount > 0">
            <span>{{ unreadMessagesCount }}</span>
          </div>
        </div>
        <div class="dash-navbtns">
          <button class="button">
            <SpriteIcon
              name="settings"
              size="24"
              color="#FFFFFF"
              title="Settings"
            />
            <span>Settings</span>
          </button>
        </div>
        <div class="dash-navbtns">
          <button class="button">
            <SpriteIcon name="more" size="24" color="#FFFFFF" title="More" />
            <span>More</span>
          </button>
        </div>
        <div class="dash-navbtns">
          <button class="button" @click="signOut">
            <SpriteIcon
              name="logout"
              size="24"
              color="#FFFFFF"
              title="Logout"
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="mobile-navbar">
    <router-link
      to="/dashboard"
      :class="{ 'mobile-navactive': route.name === 'dashboard' }"
    >
      <button class="button">
        <SpriteIcon
          name="dashboard"
          size="30"
          color="#FFFFFF"
          title="Dashboard"
        />
      </button>
      <span>Dashboard</span>
    </router-link>
    <router-link
      to="/create"
      :class="{ 'mobile-navactive': route.name === 'create-post' }"
    >
      <button class="button">
        <SpriteIcon name="create" size="30" color="#FFFFFF" title="Create" />
      </button>
      <span>Create</span>
    </router-link>
    <router-link
      to="/explore"
      :class="{ 'mobile-navactive': route.name === 'explore' }"
    >
      <button class="button">
        <SpriteIcon name="explore" size="30" color="#FFFFFF" title="Explore" />
        <span>Explore</span>
      </button>
    </router-link>
    <router-link
      to="/connections"
      :class="{ 'mobile-navactive': route.name === 'connections' }"
    >
      <button class="button">
        <SpriteIcon
          name="connections"
          size="30"
          color="#FFFFFF"
          title="Connections"
        />
        <span>Connections</span>
      </button>
    </router-link>
    <router-link
      to="/menu"
      :class="{ 'mobile-navactive': route.name === 'menu' }"
    >
      <button type="button">
        <SpriteIcon name="menu" size="30" color="#FFFFFF" title="Menu" />
      </button>
      <span>Menu</span>
    </router-link>
  </div>
</template>
