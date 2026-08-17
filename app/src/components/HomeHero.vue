<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/homehero.css";
import "../styles/utilities.css";

const isPostLiked = ref(false);
const likeCount = ref(18);

function toggleLike() {
  isPostLiked.value = !isPostLiked.value;
  if (isPostLiked.value) {
    likeCount.value++;
  } else {
    likeCount.value--;
  }
}
</script>

<template>
  <section class="home-hero-section" aria-label="Introduction">
    <div class="home-hero-container">
      <div class="home-hero-copy">
        <div class="home-hero-badge">
          <SpriteIcon name="followers" size="22" color="#006145" />
          <span>Intentional Social Platform</span>
        </div>

        <h1 class="home-hero-headline">
          Connect with intention. <br />
          <span class="highlight">Publish with control.</span>
        </h1>

        <p class="home-hero-subtitle">
          Netlink gives you a clean social space to share updates, curate your favorite circles, and chat directly—free from algorithmic noise and distractions.
        </p>

        <div class="home-hero-actions">
          <RouterLink
            :to="{ name: 'register' }"
            class="home-hero-btn-primary"
            id="hero-signup-cta"
          >
            <span>Sign Up</span>            
          </RouterLink>
          <RouterLink
            :to="{ name: 'login' }"
            class="home-hero-btn-secondary"
            id="hero-signin-cta"
          >
            <span>Sign In</span>
          </RouterLink>
        </div>

        <ul class="home-hero-signals">
          <li class="home-hero-signal-item">
            <SpriteIcon name="checked" size="22" color="#006145" />
            <span>Chronological Feed</span>
          </li>
          <li class="home-hero-signal-item">
            <SpriteIcon name="lock" size="22" color="#006145" />
            <span>Audience Privacy</span>
          </li>
          <li class="home-hero-signal-item">
            <SpriteIcon name="messages" size="22" color="#006145" />
            <span>Direct Messaging</span>
          </li>
        </ul>
      </div>

      <div class="home-hero-visual">
        <div class="home-hero-stack">
          <div class="hero-float-message" aria-hidden="true">
            <SpriteIcon name="messages" size="20" color="#006145" />
            <div class="hero-float-msg-text">
              <p class="hero-float-msg-title">Marcus Vance</p>
              <p class="hero-float-msg-preview">Let's catch up on the project!</p>
            </div>
            <SpriteIcon name="checked" size="16" color="#00aaff" />
          </div>

          
          <article class="hero-post-card" aria-label="Netlink post preview">
            <div class="hero-post-header">
              <div class="hero-post-author">
                <img
                  src="../assets/avatars/40x40.png"
                  alt="Alexandra Miller Avatar"
                  class="hero-author-avatar"
                />
                <div class="hero-author-info">
                  <h3 class="hero-author-name">Alexandra Miller</h3>
                  <p class="hero-author-username">@alexandra_dev</p>
                </div>
              </div>

              <div class="hero-audience-pill" title="Visibility: Specific Followers">
                <SpriteIcon name="followers" size="16" color="#006145" />
                <span>Specific Circle</span>
              </div>
            </div>
            <div class="hero-post-content">
              <p>
                Just published our team's latest update on Netlink. Loving the ability to select specific audiences per post without broadcast fatigue. 🚀
                <span class="hero-post-mention">@netlink_team</span>
              </p>
            </div>
            <div class="hero-post-actions">
              <button
                type="button"
                class="hero-post-action-btn"
                :class="{ liked: isPostLiked }"
                @click="toggleLike"
                aria-label="Like post"
              >
                <SpriteIcon
                  name="heart"
                  size="16"
                  :color="isPostLiked ? '#c31010' : '#535353'"
                />
                <span>{{ likeCount }}</span>
              </button>

              <div class="hero-post-action-btn commented" aria-label="Comments count">
                <SpriteIcon name="comment" size="16" color="#006145" />
                <span>4</span>
              </div>

              <div class="hero-post-action-btn" aria-label="Shares count">
                <SpriteIcon name="share" size="16" color="#535353" />
                <span>2</span>
              </div>
            </div>
          </article>
          <div class="hero-float-favorites" aria-hidden="true">
            <div class="hero-float-fav-avatars">
              <img src="../assets/avatars/40x40.png" alt="User 1" />
              <img src="../assets/avatars/40x40.png" alt="User 2" />
              <img src="../assets/avatars/40x40.png" alt="User 3" />
            </div>
            <p class="hero-float-fav-label">★ Curated Favorites</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
