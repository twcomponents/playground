<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div
      class="flex flex-row h-[60px] items-center px-4 border-b border-gray-300"
    >
      <h1 class="text-2xl font-bold">TailwindCSS Playground</h1>
    </div>

    <!-- Body -->
    <div class="flex flex-row">
      <!-- Left -->
      <div class="flex flex-col w-1/4">
        <MonacoEditor
          :code="codeBlock"
          :height="'100vh'"
          @change="updateCodeBlock($event)"
        />
      </div>

      <!-- Right -->
      <div class="flex flex-col w-3/4">
        <!-- Header -->
        <div class="flex flex-row border-b border-gray-300 p-2">
          <!-- Device Breakpoints -->
          <div class="flex flex-row gap-2">
            <button
              v-for="screenBreakPoint in screenBreakPoints"
              :key="screenBreakPoint.label"
              class="flex items-center justify-center w-10 h-10 border border-theme1-300 text-theme1-500 hover:text-theme1-600 rounded-md"
              :class="{
                'bg-theme2-200': screenBreakPoint === selectedBreakpoint,
              }"
              @click="selectedBreakpoint = screenBreakPoint"
            >
              <component
                :is="screenBreakPoint.icon"
                :style="{
                  'stroke-width': '1px',
                }"
                class="size-5"
              />
            </button>
          </div>

          <div class="flex flex-row"></div>
        </div>

        <!-- Body -->
        <iframe class="w-full h-full" :srcdoc="previewBaseCode"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // native
  import { ref } from 'vue';

  // components
  import MonacoEditor from '@/shared/components/MonacoEditor.vue';

  // icons
  import {
    Smartphone,
    TabletSmartphone,
    Tablet,
    Laptop,
    ScreenShare,
  } from 'lucide-vue-next';

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

  const screenBreakPoints = [
    {
      key: 'sm',
      icon: Smartphone,
      width: 640,
      label: 'Phone',
    },
    {
      key: 'md',
      icon: TabletSmartphone,
      width: 768,
      label: 'Phablet',
    },
    {
      key: 'lg',
      icon: Tablet,
      width: 1024,
      label: 'Tablet',
    },
    {
      key: 'xl',
      icon: Laptop,
      width: 1280,
      label: 'Laptop',
    },
    {
      key: '2xl',
      icon: ScreenShare,
      width: 1536,
      label: 'Desktop',
    },
  ];

  const selectedBreakpoint = ref(screenBreakPoints[3]);
</script>
