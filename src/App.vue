<template>
  <MonacoEditor />
</template>

<script setup lang="ts">
  import MonacoEditor from '@/components/features/MonacoEditor.vue';
</script>

<style scoped lang="scss">
  .logos {
    @apply flex flex-row gap-5;

    .logo {
      @apply size-32;

      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;

      &.vite:hover {
        filter: drop-shadow(0 0 2em #bd34feaa);
      }

      &.vue:hover {
        filter: drop-shadow(0 0 2em #41b883aa);
      }

      &.ts:hover {
        filter: drop-shadow(0 0 2em #3178c6aa);
      }

      &.sass:hover {
        filter: drop-shadow(0 0 2em #cd6799aa);
      }

      &.tw:hover {
        filter: drop-shadow(0 0 2em #44a8b3aa);
      }
    }
  }
</style>
