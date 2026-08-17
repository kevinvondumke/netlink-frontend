<script setup lang="ts">
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/homeprinciples.css";
import "../styles/utilities.css";
</script>

<template>
  <section
    class="home-principles-section"
    id="privacy"
    aria-label="Experience Principles"
  >
    <div class="home-principles-container">
      <!-- SECTION HEADER -->
      <div class="home-principles-header">
        <div class="home-principles-badge">
          <SpriteIcon name="lock" size="14" color="#006145" />
          <span>Experience & Privacy Principles</span>
        </div>
        <h2 class="home-principles-title">
          Built on trust, transparency, and user control.
        </h2>
        <p class="home-principles-desc">
          We believe social networking should be predictable, safe, and respectful of your time and attention.
        </p>
      </div>

      <!-- 3-COLUMN PRINCIPLES CARDS -->
      <div class="home-principles-grid">
        <!-- PRINCIPLE 1: CHRONOLOGICAL FEEDS -->
        <article class="home-principle-card">
          <div class="home-principle-top">
            <div class="home-principle-icon-wrap" aria-hidden="true">
              <SpriteIcon name="checked" size="24" color="#006145" />
            </div>
            <span class="home-principle-num">01</span>
          </div>
          <h3 class="home-principle-heading">Chronological Feeds</h3>
          <p class="home-principle-body">
            See updates from the people you choose, strictly when they post them.
          </p>
          <div class="home-principle-tag">
            <SpriteIcon name="checked" size="12" color="#006145" />
            <span>Zero Algorithmic Injections</span>
          </div>
        </article>

        <!-- PRINCIPLE 2: COMPLETE CONTENT OWNERSHIP -->
        <article class="home-principle-card">
          <div class="home-principle-top">
            <div class="home-principle-icon-wrap" aria-hidden="true">
              <SpriteIcon name="lock" size="24" color="#006145" />
            </div>
            <span class="home-principle-num">02</span>
          </div>
          <h3 class="home-principle-heading">Complete Content Ownership</h3>
          <p class="home-principle-body">
            Edit, delete, and manage post visibility at any time.
          </p>
          <div class="home-principle-tag">
            <SpriteIcon name="lock" size="12" color="#006145" />
            <span>Granular Audience Management</span>
          </div>
        </article>

        <!-- PRINCIPLE 3: BUILT-IN USER PROTECTION -->
        <article class="home-principle-card">
          <div class="home-principle-top">
            <div class="home-principle-icon-wrap" aria-hidden="true">
              <SpriteIcon name="restrict" size="24" color="#006145" />
            </div>
            <span class="home-principle-num">03</span>
          </div>
          <h3 class="home-principle-heading">Built-in User Protection</h3>
          <p class="home-principle-body">
            Restrict or report abusive accounts directly from any post or message.
          </p>
          <div class="home-principle-tag">
            <SpriteIcon name="restrict" size="12" color="#006145" />
            <span>Direct Moderation Tools</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
