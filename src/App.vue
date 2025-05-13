<template>
  <Navbar />

  <Playground :isLoading="isLoading" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  import Navbar from '@/layouts/partials/Navbar.vue';
  import Playground from '@/components/Playground.vue';

  const isLoading = ref(true);

  onMounted(() => {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  });
</script>
