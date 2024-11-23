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
    MonacoTailwindcss,
    tailwindcssData,
  } from 'monaco-tailwindcss';

  // workers
  import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
  import TailwindcssWorker from '../lib/tailwindcss.worker.js?worker';
  import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
  import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
  import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
  import TypescriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';

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
  let monacoTailwindcss: MonacoTailwindcss | null = null;

  watch(
    () => props.layout,
    () => {
      editor?.layout();
    }
  );

  watch(
    () => props.tailwindConfig,
    () => {
      monacoTailwindcss?.setTailwindConfig(handleTailwindConfigChange());
    }
  );

  const handleTailwindConfigChange = () => {
    let config: any = {
        darkMode: 'class',
      },
      configString = props.tailwindConfig.replace('export default', '');

    try {
      config = JSON.parse(configString.replace(/(\w+):/g, '"$1":'));
    } catch (error) {
      console.error(error, configString.replace(/(\w+):/g, '"$1":'));
    }

    return config;
  };

  const initEditor = () => {
    if (editorContainer.value) {
      handleTailwindConfigChange();

      monaco.languages.css.cssDefaults.setOptions({
        data: {
          dataProviders: {
            tailwindcssData,
          },
        },
      });

      if (window.MonacoEnvironment === undefined) {
        window.MonacoEnvironment = {
          getWorker(_moduleId, label) {
            switch (label) {
              case 'editorWorkerService':
                return new EditorWorker();
              case 'css':
              case 'less':
              case 'scss':
                return new CssWorker();
              case 'handlebars':
              case 'html':
              case 'razor':
                return new HtmlWorker();
              case 'json':
                return new JsonWorker();
              case 'javascript':
              case 'typescript':
                return new TypescriptWorker();
              case 'tailwindcss':
                return new TailwindcssWorker();
              default:
                throw new Error(`Unknown label ${label}`);
            }
          },
        };
      }

      editor = monaco.editor.create(editorContainer.value, {
        value: props.code,
        language: props.language ?? 'html',
        theme: props.theme ?? 'vs-dark',
        automaticLayout: true,
        stickyScroll: {
          enabled: false,
        },
        autoIndent: 'keep',
        formatOnPaste: true,
        formatOnType: true,
      });

      editor.onDidChangeModelContent(() => {
        emitters('change', editor?.getValue());
      });

      monacoTailwindcss = configureMonacoTailwindcss(
        monaco,
        handleTailwindConfigChange()
      );
    }
  };

  const resetEditor = () => {
    if (editor) {
      editor.dispose();
      editor = null;
    }
  };

  onMounted(() => {
    resetEditor();
    initEditor();
  });
</script>

<style scoped lang="scss">
  .editor-container {
    @apply h-full w-full;
  }
</style>
