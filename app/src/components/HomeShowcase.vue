<script setup lang="ts">
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/homeshowcase.css";
import "../styles/utilities.css";
</script>

<template>
  <section
    class="home-showcase-section"
    id="experience"
    aria-label="Product Showcase"
  >
    <div class="home-showcase-container">
      <!-- SECTION HEADER -->
      <div class="home-showcase-header">
        <div class="home-showcase-badge">
          <SpriteIcon name="dashboard" size="14" color="#006145" />
          <span>The Netlink Workspace</span>
        </div>
        <h2 class="home-showcase-title">
          Designed for clarity and effortless navigation.
        </h2>
        <p class="home-showcase-desc">
          Netlink combines quick-access navigation, customizable favorite
          sidepanels, and focused content streams into a unified desktop and
          mobile interface.
        </p>
      </div>

      <!-- BROWSER APP FRAME -->
      <div
        class="showcase-browser-frame"
        role="region"
        aria-label="Netlink app interface mockup"
      >
        <div class="showcase-browser-topbar">
          <div class="showcase-window-dots" aria-hidden="true">
            <span class="showcase-dot red"></span>
            <span class="showcase-dot yellow"></span>
            <span class="showcase-dot green"></span>
          </div>

          <div class="showcase-url-bar">
            <SpriteIcon name="lock" size="16" color="#006145" />
            <span>https://net1ink.netlify.app/dashboard</span>
          </div>

          <div class="showcase-topbar-meta">            
            <span>Dashboard</span>
          </div>
        </div>

        <div class="showcase-app-workspace">
          <img
            src="../assets/images/desktop-main.webp"
            alt="Netlink Desktop Dashboard and Feed Interface Preview"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>
