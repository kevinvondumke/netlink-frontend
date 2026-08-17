<script setup lang="ts">
import HomeNav from "./HomeNav.vue";
import HomeHero from "./HomeHero.vue";
import HomeShowcase from "./HomeShowcase.vue";
import HomeBentoGrid from "./HomeBentoGrid.vue";
import HomePrinciples from "./HomePrinciples.vue";
import HomeCTA from "./HomeCTA.vue";
import HomeFooter from "./HomeFooter.vue";
</script>

<template>
  <div class="home-page-layout">
    <HomeNav />
    <main id="main-content">
      <HomeHero />
      <HomeShowcase />
      <HomeBentoGrid />
      <HomePrinciples />
      <HomeCTA />
    </main>
    <HomeFooter />
  </div>
</template>

<style scoped>
.home-page-layout {
  min-height: 100vh;
  background-color: var(--color-white);
  color: var(--color-gray-900);
  display: flex;
  flex-direction: column;
}

#main-content {
  flex: 1;
}
</style>
