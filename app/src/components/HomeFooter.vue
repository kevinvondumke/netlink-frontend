<script setup lang="ts">
import { RouterLink } from "vue-router";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/homefooter.css";
import "../styles/utilities.css";

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
  <footer class="home-footer-wrapper" aria-label="Site Footer">
    <div class="home-footer-container">
      <!-- TOP FOOTER ROW -->
      <div class="home-footer-top">
        <!-- BRAND COLUMN -->
        <div class="home-footer-brand-col">
          <RouterLink :to="{ name: 'home' }" aria-label="Netlink Home">
            <img
              src="../assets/logos/netlink-logo.png"
              alt="Netlink Logo"
              class="home-footer-logo"
            />
          </RouterLink>
          <p class="home-footer-tagline">Stay connected and share together.</p>
          <p class="home-footer-platform">
            Vue 3 · TypeScript · Xenon Design System
          </p>
        </div>

        <!-- NAVIGATION GROUPS -->
        <div class="home-footer-links-col">
          <div class="home-footer-nav-group">
            <h4 class="home-footer-nav-heading">Platform</h4>
            <a
              href="#experience"
              class="home-footer-link"
              @click.prevent="scrollToSection('experience')"
            >
              Workspace
            </a>
            <a
              href="#features"
              class="home-footer-link"
              @click.prevent="scrollToSection('features')"
            >
              Capabilities
            </a>
            <a
              href="#privacy"
              class="home-footer-link"
              @click.prevent="scrollToSection('privacy')"
            >
              Experience & Privacy
            </a>
          </div>

          <div class="home-footer-nav-group">
            <h4 class="home-footer-nav-heading">Account</h4>
            <RouterLink :to="{ name: 'login' }" class="home-footer-link">
              Sign In
            </RouterLink>
            <RouterLink :to="{ name: 'register' }" class="home-footer-link">
              Sign Up
            </RouterLink>
            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="home-footer-link"
            >
              Reset Password
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- BOTTOM COPYRIGHT ROW -->
      <div class="home-footer-bottom">
        <p class="home-footer-copy">
          © 2026 Netlink. Built for intentional social networking.
        </p>

        <div class="home-footer-badges">
          <div class="home-footer-developer-badge">
            <span>Developed by</span>
            <a
              href="https://kevinvondumke.com"
              target="_blank"
              rel="noopener noreferrer"
              class="home-footer-developer-link"
            >
              Kevin von Dumke
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
