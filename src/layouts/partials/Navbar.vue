<template>
  <div
    class="container px-10 top-0 left-0 py-4 w-full bg-white/80 dark:bg-zinc-900/80 border-b dark:border-zinc-800 z-50 backdrop-blur-md"
  >
    <nav class="flex items-center justify-between default-container">
      <RouterLink to="/" class="font-extrabold text-3xl">
        <span class="text-twc-theme-400">TWC</span>
        /
        <span class="text-twc-twc-theme-400">Playground</span>
      </RouterLink>

      <div class="flex items-center gap-2.5">
        <!-- <ThemeSwitcher /> -->
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
  //   import ThemeSwitcher from '@playground-app/components/features/ThemeSwitcher.vue';
</script>
