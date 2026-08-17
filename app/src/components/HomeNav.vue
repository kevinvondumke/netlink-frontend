<script setup lang="ts">
import { RouterLink } from "vue-router";

// STYLES
import "../styles/homenav.css";
import "../styles/utilities.css";

// SMOOTH SCROLL FUNCTION
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    const navOffset = 70;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}
</script>

<template>
  <header class="home-nav-wrapper">
    <div class="home-nav-container">
      <RouterLink
        :to="{ name: 'home' }"
        class="home-nav-brand"
        aria-label="Netlink Home"
      >
        <img
          src="../assets/logos/netlink-logo.png"
          alt="Netlink Logo"
          class="home-nav-logo"
        />
      </RouterLink>
      <nav class="home-nav-center" aria-label="Landing page navigation">
        <ul class="home-nav-links">
          <li>
            <a
              href="#experience"
              class="home-nav-link"
              @click.prevent="scrollToSection('experience')"
            >
              Workspace
            </a>
          </li>
          <li>
            <a
              href="#features"
              class="home-nav-link"
              @click.prevent="scrollToSection('features')"
            >
              Capabilities
            </a>
          </li>
          <li>
            <a
              href="#privacy"
              class="home-nav-link"
              @click.prevent="scrollToSection('privacy')"
            >
              Privacy
            </a>
          </li>
        </ul>
      </nav>
      <div class="home-nav-actions">
        <RouterLink
          :to="{ name: 'login' }"
          class="home-btn-signin"
          id="nav-signin-btn"
        >
          Sign In
        </RouterLink>
        <RouterLink
          :to="{ name: 'register' }"
          class="home-btn-signup"
          id="nav-signup-btn"
        >
          Sign Up
        </RouterLink>
      </div>
    </div>
  </header>
</template>
