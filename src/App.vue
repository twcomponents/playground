<template>
  <div class="flex flex-row">
    <!-- Left -->
    <div class="flex flex-col w-1/2">
      <MonacoEditor
        :code="codeBlock"
        :height="'100vh'"
        @change="updateCodeBlock($event)"
      />
    </div>

    <!-- Right -->
    <div class="flex flex-col w-1/2">
      <iframe class="w-full h-full" :srcdoc="previewBaseCode"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import MonacoEditor from '@/shared/components/MonacoEditor.vue';

  const previewBaseCodeTemplate = ref(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body>
  #REPLACE#
</body>
</html>`);

  const codeBlock = ref(`<h1>hello world</h1>`);

  const previewBaseCode = ref(
    previewBaseCodeTemplate.value.replace('#REPLACE#', codeBlock.value)
  );

  const updateCodeBlock = (code: string) => {
    codeBlock.value = code;
    previewBaseCode.value = previewBaseCodeTemplate.value.replace(
      '#REPLACE#',
      code
    );
  };
</script>
