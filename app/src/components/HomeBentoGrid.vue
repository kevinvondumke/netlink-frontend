<script setup lang="ts">
import { ref } from "vue";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/homebentogrid.css";
import "../styles/utilities.css";

// 1. AUDIENCE CONTROL STATE
const selectedAudience = ref<string>("SPECIFIC");
function setAudience(mode: string) {
  selectedAudience.value = mode;
}

// 2. CURATED FAVORITES STATE
const selectedFavorite = ref<string>("@elena_ux");
function setFavorite(user: string) {
  selectedFavorite.value = user;
}

// 3. TARGETED EXPLORE STATE
const selectedExploreFilter = ref<string>("following");
function setExploreFilter(filter: string) {
  selectedExploreFilter.value = filter;
}

// 4. PRIVACY & SAFETY TOGGLES
const isAccountProtected = ref<boolean>(true);
function toggleAccountPrivacy() {
  isAccountProtected.value = !isAccountProtected.value;
}

const isCommentControl = ref<boolean>(true);
function toggleCommentControl() {
  isCommentControl.value = !isCommentControl.value;
}
</script>

<template>
  <section
    class="home-bento-section"
    id="features"
    aria-label="Platform Capabilities"
  >
    <div class="home-bento-container">
      <!-- SECTION HEADER -->
      <div class="home-bento-header">
        <div class="home-bento-badge">
          <SpriteIcon name="create" size="14" color="#006145" />
          <span>Platform Capabilities</span>
        </div>
        <h2 class="home-bento-title">
          Everything you need for clean, intentional networking.
        </h2>
        <p class="home-bento-desc">
          Netlink gives you complete control over your social circle, post
          privacy, real-time messaging, and content discovery.
        </p>
      </div>
      <div class="bento-grid">
        <article class="bento-card bento-card-audience">
          <div class="bento-card-info">
            <div class="bento-card-icon-wrap">
              <SpriteIcon name="followers" size="20" color="#006145" />
            </div>
            <h3 class="bento-card-title">Granular Audience Visibility</h3>
            <p class="bento-card-text">
              Select precisely who can view and interact with every post. Choose
              from Public broadcast, Followers only, Specific circles, or Only
              Me.
            </p>
          </div>
          <div class="bento-audience-chips">
            <div
              class="bento-chip"
              :class="{ active: selectedAudience === 'PUBLIC' }"
              @click="setAudience('PUBLIC')"
            >
              <SpriteIcon
                name="public"
                size="18"
                :color="selectedAudience === 'PUBLIC' ? '#006145' : '#868686'"
              />
              <div class="bento-chip-text">
                <span class="bento-chip-label">Public</span>
                <span class="bento-chip-sub">Visible to anyone</span>
              </div>
            </div>

            <div
              class="bento-chip"
              :class="{ active: selectedAudience === 'FOLLOWERS' }"
              @click="setAudience('FOLLOWERS')"
            >
              <SpriteIcon
                name="followers"
                size="18"
                :color="
                  selectedAudience === 'FOLLOWERS' ? '#006145' : '#868686'
                "
              />
              <div class="bento-chip-text">
                <span class="bento-chip-label">Followers</span>
                <span class="bento-chip-sub">Your followers only</span>
              </div>
            </div>

            <div
              class="bento-chip"
              :class="{ active: selectedAudience === 'SPECIFIC' }"
              @click="setAudience('SPECIFIC')"
            >
              <SpriteIcon
                name="followers"
                size="18"
                :color="selectedAudience === 'SPECIFIC' ? '#006145' : '#868686'"
              />
              <div class="bento-chip-text">
                <span class="bento-chip-label">Specific Followers</span>
                <span class="bento-chip-sub">Curated custom circle</span>
              </div>
            </div>

            <div
              class="bento-chip"
              :class="{ active: selectedAudience === 'ONLY_ME' }"
              @click="setAudience('ONLY_ME')"
            >
              <SpriteIcon
                name="lock"
                size="18"
                :color="selectedAudience === 'ONLY_ME' ? '#006145' : '#868686'"
              />
              <div class="bento-chip-text">
                <span class="bento-chip-label">Only Me</span>
                <span class="bento-chip-sub">Private personal log</span>
              </div>
            </div>
          </div>
        </article>
        <article class="bento-card bento-card-favorites">
          <div class="bento-card-info">
            <div class="bento-card-icon-wrap">
              <SpriteIcon name="list" size="20" color="#006145" />
            </div>
            <h3 class="bento-card-title">Curated Favorites</h3>
            <p class="bento-card-text">
              Pin your closest connections directly to your dashboard sidepanel
              to filter updates and jump into profiles with one click.
            </p>
          </div>
          <div class="bento-favorites-preview">
            <div
              class="bento-fav-item"
              :class="{ active: selectedFavorite === '@elena_ux' }"
              @click="setFavorite('@elena_ux')"
            >
              <div class="bento-fav-user">
                <img src="../assets/avatars/40x40.png" alt="Elena Avatar" />
                <div class="bento-fav-meta">
                  <p class="bento-fav-name">Elena Rostova</p>
                  <p class="bento-fav-handle">@elena_ux</p>
                </div>
              </div>
              <span class="bento-fav-badge">★ Pinned</span>
            </div>

            <div
              class="bento-fav-item"
              :class="{ active: selectedFavorite === '@david_tech' }"
              @click="setFavorite('@david_tech')"
            >
              <div class="bento-fav-user">
                <img src="../assets/avatars/40x40.png" alt="David Avatar" />
                <div class="bento-fav-meta">
                  <p class="bento-fav-name">David Chen</p>
                  <p class="bento-fav-handle">@david_tech</p>
                </div>
              </div>
              <span class="bento-fav-badge">★ Pinned</span>
            </div>
          </div>
        </article>
        <article class="bento-card bento-card-chat">
          <div class="bento-card-info">
            <div class="bento-card-icon-wrap">
              <SpriteIcon name="messages" size="20" color="#006145" />
            </div>
            <h3 class="bento-card-title">Direct Messaging</h3>
            <p class="bento-card-text">
              Fast, focused 1-on-1 conversations with timestamps and message
              delivery confirmations.
            </p>
          </div>

          <div class="bento-chat-preview">
            <div class="bento-chat-msg-received">
              <p>Hey! Ready for the sprint review?</p>
            </div>
            <div class="bento-chat-msg-sent">
              <p>Yes, all features ready!</p>
              <SpriteIcon name="checked" size="14" color="#00aaff" />
            </div>
          </div>
        </article>
        <article class="bento-card bento-card-explore">
          <div class="bento-card-info">
            <div class="bento-card-icon-wrap">
              <SpriteIcon name="search" size="20" color="#006145" />
            </div>
            <h3 class="bento-card-title">Targeted Explore</h3>
            <p class="bento-card-text">
              Find relevant discussions by filtering posts by people you follow,
              format, or date ranges.
            </p>
          </div>

          <div class="bento-explore-preview">
            <div class="bento-search-box">
              <SpriteIcon name="search" size="14" color="#868686" />
              <span>{{
                selectedExploreFilter === "following"
                  ? "Search following circle..."
                  : selectedExploreFilter === "posts"
                    ? "Search posts & topics..."
                    : "Search recent discussions..."
              }}</span>
            </div>
            <div class="bento-filter-pills">
              <span
                class="bento-filter-pill"
                :class="{ active: selectedExploreFilter === 'following' }"
                @click="setExploreFilter('following')"
              >
                Following
              </span>
              <span
                class="bento-filter-pill"
                :class="{ active: selectedExploreFilter === 'posts' }"
                @click="setExploreFilter('posts')"
              >
                Posts only
              </span>
              <span
                class="bento-filter-pill"
                :class="{ active: selectedExploreFilter === 'recent' }"
                @click="setExploreFilter('recent')"
              >
                Recent
              </span>
            </div>
          </div>
        </article>
        <article class="bento-card bento-card-safety">
          <div class="bento-card-info">
            <div class="bento-card-icon-wrap">
              <SpriteIcon name="lock" size="20" color="#006145" />
            </div>
            <h3 class="bento-card-title">Privacy & Safety</h3>
            <p class="bento-card-text">
              Complete boundary control: account locking, like count privacy,
              comment toggles, and user restriction.
            </p>
          </div>

          <div class="bento-safety-preview">
            <div
              class="bento-safety-row"
              :class="{ active: isAccountProtected }"
              @click="toggleAccountPrivacy"
              title="Click to toggle"
            >
              <div class="bento-safety-label">
                <SpriteIcon
                  name="lock"
                  size="14"
                  :color="isAccountProtected ? '#006145' : '#868686'"
                />
                <span>Account Privacy</span>
              </div>
              <span class="bento-safety-status">
                {{ isAccountProtected ? "Protected" : "Public" }}
              </span>
            </div>

            <div
              class="bento-safety-row"
              :class="{ active: isCommentControl }"
              @click="toggleCommentControl"
              title="Click to toggle"
            >
              <div class="bento-safety-label">
                <SpriteIcon
                  name="comment"
                  size="14"
                  :color="isCommentControl ? '#006145' : '#868686'"
                />
                <span>Comment Control</span>
              </div>
              <span class="bento-safety-status">
                {{ isCommentControl ? "Restricted" : "Open" }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
