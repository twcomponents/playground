<template>
  <div
    ref="editorContainer"
    class="editor-container"
    :style="{ height: height }"
  ></div>
</template>

<script setup lang="ts">
  // native
  import { onMounted, ref, watch } from 'vue';

  // monaco
  import * as monaco from 'monaco-editor';
  import {
    configureMonacoTailwindcss,
    tailwindcssData,
  } from 'monaco-tailwindcss';

  const editorContainer = ref(null);

  const emitters = defineEmits(['change']);

  const props = defineProps({
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'html',
    },
    theme: {
      type: String,
      default: 'vs-dark',
    },
    height: {
      type: String,
      default: '500px',
    },
    layout: {
      type: Object,
      default: '500px',
    },
    tailwindConfig: {
      type: String,
      default: '',
    },
  });

  let editor: monaco.editor.IStandaloneCodeEditor | null = null;

  watch(
    () => props.layout,
    () => {
      editor?.layout();
    }
  );

  watch(
    () => props.tailwindConfig,
    () => {
      handleTailwindConfigChange();
    }
  );

  const handleTailwindConfigChange = () => {
    let config = {};

    try {
      config = JSON.parse(props.tailwindConfig.replace('export default', ''));
    } catch (error) {
      console.error(error);
    }

    configureMonacoTailwindcss(monaco, config);
  };

  onMounted(() => {
    if (editorContainer.value) {
      monaco.languages.css.cssDefaults.setOptions({
        data: {
          dataProviders: {
            tailwindcssData,
          },
        },
      });

      handleTailwindConfigChange();

      editor = monaco.editor.create(editorContainer.value, {
        value: props.code,
        language: props.language ?? 'html',
        theme: props.theme ?? 'vs-dark',
        automaticLayout: true,
        stickyScroll: {
          enabled: false,
        },
      });

      editor.onDidChangeModelContent(() => {
        emitters('change', editor?.getValue());
      });
    }
  });
</script>

<style scoped lang="scss">
  .editor-container {
    @apply h-full w-full;
  }
</style>
