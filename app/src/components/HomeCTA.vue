<script setup lang="ts">
import { RouterLink } from "vue-router";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/homecta.css";
import "../styles/utilities.css";
</script>

<template>
  <section class="home-cta-section" aria-label="Join Netlink">
    <div class="home-cta-container">
      <div class="home-cta-card">
        <div class="home-cta-badge">
          <SpriteIcon name="followers" size="14" color="#FFFFFF" />
          <span>Start Connecting</span>
        </div>

        <h2 class="home-cta-headline">Join Netlink today.</h2>

        <p class="home-cta-subtitle">
          Start sharing updates with the circles that matter most to you.
        </p>

        <div class="home-cta-actions">
          <RouterLink
            :to="{ name: 'register' }"
            class="home-cta-btn-primary"
            id="bottom-signup-cta"
          >
            <span>Sign Up</span>            
          </RouterLink>

          <RouterLink
            :to="{ name: 'login' }"
            class="home-cta-btn-secondary"
            id="bottom-signin-cta"
          >
            <span>Sign In</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
