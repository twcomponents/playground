<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div
      class="flex flex-row h-[60px] justify-between items-center px-4 border-b border-gray-300"
    >
      <!-- Left -->
      <h1 class="text-2xl font-bold">TailwindCSS Playground</h1>

      <!-- Right -->
      <div class="flex flex-row">
        <!-- Layout -->
        <div
          class="flex flex-row gap-3 border border-gray-300 px-2 py-1.5 rounded-md"
        >
          <button
            v-for="layout in editorLayouts"
            :key="layout.key"
            @click="onEditorLayoutChange(layout)"
            class="flex items-center justify-center w-8 h-8 border text-gray-500 hover:text-theme2-600 rounded-md"
            :class="{
              'bg-theme2-100 text-theme2-500':
                selectedLayout.key === layout.key,
            }"
            :data-tippy-content="layout.label"
          >
            <component :is="layout.icon" class="size-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div
      class="flex"
      :class="{
        'flex-col': selectedLayout.key === 'vertical',
        'flex-row': selectedLayout.key === 'horizontal',
      }"
    >
      <!-- Left -->
      <div
        class="flex flex-col"
        :style="{
          width:
            selectedLayout.key === 'horizontal'
              ? 'calc(100vw - ' + selectedBreakpoint?.width + ')'
              : '100vw',
          height:
            selectedLayout.key === 'horizontal'
              ? 'calc(100vh - 60px)'
              : '500px',
        }"
      >
        <Tabs :tabs="tabs" defaultTab="tab1">
          <template #tab1>
            <MonacoEditor
              ref="monacoEditorRef"
              :code="codeBlock"
              :height="
                selectedLayout.key === 'horizontal'
                  ? 'calc(100vh - 60px)'
                  : '440px'
              "
              :layout="selectedLayout"
              @change="updateCodeBlock($event)"
            />
          </template>
          <template #tab2>
            <div>This is content for Tab 2.</div>
          </template>
        </Tabs>
      </div>

      <!-- Right -->
      <div
        class="flex flex-col"
        :style="{
          width: selectedBreakpoint?.width + 'px',
          height: 'calc(100vh - 60px)',
        }"
      >
        <!-- Header -->
        <div class="flex flex-row p-2 border-b border-gray-300 h-[55px]">
          <!-- Device Breakpoints -->
          <div class="flex flex-row gap-2">
            <button
              v-for="screenBreakPoint in screenBreakPoints"
              :key="screenBreakPoint.label"
              class="flex items-center justify-center w-10 h-10 border border-gray-300 text-gray-500 hover:text-theme2-600 rounded-md"
              :class="{
                'bg-theme2-100 border-theme2-400 text-theme2-600 hover:text-theme2-700':
                  screenBreakPoint.key === selectedBreakpoint?.key,
              }"
              @click="onSelectBreakpoint(screenBreakPoint)"
              :data-tippy-content="screenBreakPoint.label"
            >
              <component
                :is="screenBreakPoint.icon"
                :style="{
                  'stroke-width': '2px',
                }"
                class="size-5"
              />
            </button>
          </div>

          <div class="flex flex-row"></div>
        </div>

        <!-- Body -->
        <iframe
          class="w-full h-full border border-gray-300 border-t-0 mx-auto"
          :srcdoc="previewBaseCode"
          :style="{
            width: selectedBreakpoint?.width,
            height: 'calc(100vh - 60px)',
          }"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // native
  import { onMounted, ref } from 'vue';

  // components
  import MonacoEditor from '@/shared/components/MonacoEditor.vue';
  import Tabs from '@/shared/components/Tabs.vue';

  // icons
  import {
    Smartphone,
    TabletSmartphone,
    Tablet,
    Laptop,
    ScreenShare,
    Columns2,
    Rows2,
  } from 'lucide-vue-next';

  // third-party
  import tippy from 'tippy.js';

  const monacoEditorRef = ref<any>(null);

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

  const tabs = [
    { name: 'tab1', label: 'Config' },
    { name: 'tab2', label: 'Editor' },
  ];

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

  // #region Device Breakpoints

  const screenBreakPoints = [
    {
      key: 'sm',
      icon: Smartphone,
      width: '640px',
      label: 'Phone',
    },
    {
      key: 'md',
      icon: TabletSmartphone,
      width: '768px',
      label: 'Phablet',
    },
    {
      key: 'lg',
      icon: Tablet,
      width: '1024px',
      label: 'Tablet',
    },
    {
      key: 'xl',
      icon: Laptop,
      width: '1280px',
      label: 'Laptop',
    },
    {
      key: '2xl',
      icon: ScreenShare,
      width: '100%',
      label: 'Desktop',
    },
  ];

  const selectedBreakpoint = ref(screenBreakPoints[3]);

  const onSelectBreakpoint = (breakpoint: any) => {
    selectedBreakpoint.value = breakpoint;

    if (breakpoint.key === '2xl') {
      selectedLayout.value =
        editorLayouts[
          editorLayouts.findIndex((layout) => layout.key === 'vertical')
        ];
    }
  };

  // #endregion

  // #region Editor Layout

  const editorLayouts = [
    {
      key: 'horizontal',
      icon: Columns2,
      label: 'Horizontal',
    },
    {
      key: 'vertical',
      icon: Rows2,
      label: 'Vertical',
    },
  ];

  const selectedLayout = ref(editorLayouts[0]);

  const onEditorLayoutChange = (layout: any) => {
    selectedLayout.value = layout;

    if (layout.key === 'horizontal' && selectedBreakpoint.value.key === '2xl') {
      selectedBreakpoint.value =
        screenBreakPoints[
          screenBreakPoints.findIndex((breakpoint) => breakpoint.key === 'xl')
        ];
    }
  };

  // #endregion

  onMounted(() => {
    tippy('[data-tippy-content]');
  });
</script>
