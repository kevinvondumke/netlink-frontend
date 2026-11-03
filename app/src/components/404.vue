<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isVisible = ref(false);

onMounted(() => {
  // Stagger entrance animation
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

// Dynamic home link depending on authentication state
const homeRoute = computed(() => {
  return authStore.user ? "/dashboard" : "/";
});

const homeLabel = computed(() => {
  return authStore.user ? "Back to Dashboard" : "Back to Home";
});

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(homeRoute.value);
  }
}
</script>
  
<template>
  <div class="not-found-page" :class="{ 'is-visible': isVisible }">
    <!-- FLOATING NETWORK NODES (DECORATIVE) -->
    <div class="network-bg" aria-hidden="true">
      <div class="node node-1"></div>
      <div class="node node-2"></div>
      <div class="node node-3"></div>
      <div class="node node-4"></div>
      <div class="node node-5"></div>
      <svg class="network-lines" viewBox="0 0 800 600" fill="none">
        <line x1="120" y1="140" x2="350" y2="280" stroke-dasharray="6 6" />
        <line x1="680" y1="120" x2="450" y2="300" stroke-dasharray="6 6" />
        <line x1="160" y1="480" x2="380" y2="340" stroke-dasharray="6 6" />
        <line x1="650" y1="500" x2="420" y2="320" stroke-dasharray="6 6" />
      </svg>
    </div>

    <div class="not-found-content">
      <!-- DISCONNECTED ICON -->
      <div class="disconnect-icon">
        <div class="disconnect-circle">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16.5 9.4l-9-5.19" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
            <!-- Disconnected indicator -->
            <line x1="4" y1="20" x2="20" y2="4" stroke-width="2" stroke="currentColor" opacity="0.35" stroke-dasharray="3 3" />
          </svg>
        </div>
      </div>

      <!-- ERROR CODE -->
      <div class="error-code-wrapper">
        <span class="error-digit">4</span>
        <span class="error-dot">
          <span class="dot-ring"></span>
        </span>
        <span class="error-digit">4</span>
      </div>

      <!-- HEADLINE -->
      <h1 class="not-found-title">
        Lost in the <span class="title-highlight">Network</span>?
      </h1>

      <!-- DESCRIPTION -->
      <p class="not-found-description">
        This link seems to be disconnected. The page may have been moved, deleted, or the URL might be incorrect.
      </p>

      <!-- MISSING PATH -->
      <div v-if="route.params.pathMatch" class="missing-path-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <code>/{{ Array.isArray(route.params.pathMatch) ? route.params.pathMatch.join('/') : route.params.pathMatch }}</code>
      </div>

      <!-- ACTIONS -->
      <div class="actions-group">
        <router-link :to="homeRoute" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>{{ homeLabel }}</span>
        </router-link>
        <button type="button" @click="goBack" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Go Back</span>
        </button>
      </div>

      <!-- HELP LINKS -->
      <div class="help-links">
        <template v-if="authStore.user">
          <router-link to="/explore" class="help-link">Explore</router-link>
          <span class="help-divider">·</span>
          <router-link to="/connections" class="help-link">Connections</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="help-link">Sign In</router-link>
          <span class="help-divider">·</span>
          <router-link to="/register" class="help-link">Create Account</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== PAGE LAYOUT ===== */
.not-found-page {
  height: 100vh;
  height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: linear-gradient(180deg, var(--color-white) 0%, var(--color-gray-50) 100%);
  font-family: "Montserrat Regular", sans-serif;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.not-found-page.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== NETWORK BACKGROUND ===== */
.network-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.node {
  position: absolute;
  border-radius: 50%;
  background-color: var(--color-primary);
  opacity: 0.12;
  animation: float 6s ease-in-out infinite;
}

.node-1 {
  width: 14px;
  height: 14px;
  top: 22%;
  left: 14%;
  animation-delay: 0s;
}

.node-2 {
  width: 10px;
  height: 10px;
  top: 18%;
  right: 14%;
  animation-delay: 1.2s;
}

.node-3 {
  width: 18px;
  height: 18px;
  bottom: 18%;
  left: 18%;
  animation-delay: 2.4s;
}

.node-4 {
  width: 12px;
  height: 12px;
  bottom: 16%;
  right: 18%;
  animation-delay: 3.6s;
}

.node-5 {
  width: 8px;
  height: 8px;
  top: 50%;
  right: 8%;
  animation-delay: 4.8s;
}

.network-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.network-lines line {
  stroke: var(--color-primary);
  stroke-width: 1;
  opacity: 0.09;
  animation: dash 8s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes dash {
  to { stroke-dashoffset: -48; }
}

/* ===== CONTENT ===== */
.not-found-content {
  position: relative;
  z-index: 1;
  max-width: 480px;
  width: 100%;
  text-align: center;
}

/* ===== DISCONNECTED ICON ===== */
.disconnect-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.disconnect-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: rgba(0, 97, 69, 0.06);
  border: 1px solid rgba(0, 97, 69, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

/* ===== ERROR CODE ===== */
.error-code-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
}

.error-digit {
  font-family: "Montserrat Bold", sans-serif;
  font-size: 5rem;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-gray-900);
  user-select: none;
}

.error-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
}

.dot-ring {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3.5px solid var(--color-primary);
  box-shadow: 0 0 12px rgba(0, 97, 69, 0.25);
  opacity: 0.85;
  animation: pulse-ring 2.5s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.45;
  }
}

/* ===== TITLE ===== */
.not-found-title {
  font-family: "Montserrat Bold", sans-serif;
  font-size: 1.75rem;
  color: var(--color-gray-900);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.title-highlight {
  color: var(--color-primary);
}

/* ===== DESCRIPTION ===== */
.not-found-description {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--color-gray-700);
  margin-bottom: 1.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* ===== MISSING PATH BADGE ===== */
.missing-path-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--color-gray-100);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-full, 50px);
  padding: 0.35rem 0.85rem;
  margin-bottom: 1.75rem;
  color: var(--color-gray-600);
}

.missing-path-badge code {
  font-size: 0.78rem;
  font-family: monospace;
  color: var(--color-gray-800);
}

/* ===== ACTIONS ===== */
.actions-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  box-sizing: border-box;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.85rem;
  border-radius: var(--radius-full, 50px);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: 2px solid var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 97, 69, 0.2);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-gray-800);
  border: 2px solid var(--color-gray-300);
}

.btn-secondary:hover {
  background-color: var(--color-gray-100);
  border-color: var(--color-gray-500);
  color: var(--color-gray-900);
  transform: translateY(-1px);
}

/* ===== HELP LINKS ===== */
.help-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.help-link {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.82rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.help-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.help-divider {
  color: var(--color-gray-400);
  font-size: 0.82rem;
  user-select: none;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 480px) {
  .not-found-page {
    padding: var(--spacing-sm);
  }

  .disconnect-icon {
    margin-bottom: 1rem;
  }

  .disconnect-circle {
    width: 58px;
    height: 58px;
  }

  .error-code-wrapper {
    margin-bottom: 0.75rem;
  }

  .error-digit {
    font-size: 3.5rem;
  }

  .error-dot {
    width: 2.75rem;
    height: 2.75rem;
  }

  .dot-ring {
    width: 16px;
    height: 16px;
  }

  .not-found-title {
    font-size: 1.35rem;
    margin-bottom: 0.5rem;
  }

  .not-found-description {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .missing-path-badge {
    margin-bottom: 1.25rem;
  }

  .actions-group {
    flex-direction: column;
    width: 100%;
    margin-bottom: 1.25rem;
    gap: 0.5rem;
  }

  .btn {
    width: 100%;
    padding: 0.6rem 1.2rem;
  }

  .network-bg {
    display: none;
  }
}
</style>
