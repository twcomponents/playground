<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import * as monaco from 'monaco-editor';

  const editorContainer = ref(null);

  onMounted(() => {
    if (editorContainer.value) {
      monaco.editor.create(editorContainer.value, {
        value: '',
        language: 'javascript',
        theme: 'vs-dark',
      });
    }
  });
</script>

<style scoped lang="scss">
  .editor-container {
    @apply w-full h-full;
  }
</style>
