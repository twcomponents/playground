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
        <Tabs :tabs="tabs" defaultTab="tab2">
          <template #tab1>
            <MonacoEditor
              :code="tailwindConfig"
              :height="
                selectedLayout.key === 'horizontal'
                  ? 'calc(100vh - 60px)'
                  : '440px'
              "
              language="javascript"
              :layout="selectedLayout"
              @change="updateConfigBlock($event)"
            />
          </template>
          <template #tab2>
            <div>
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
            </div>
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

  const tailwindConfig = ref(`tailwind.config = {
    theme: {
    extend: {
      colors: {
        theme1: {
          50: "#f1f6fd",
          100: "#dfebfa",
          200: "#c7dbf6",
          300: "#a0c5f0",
          400: "#87b2ea",
          500: "#5386de",
          600: "#3e6ad2",
          700: "#3557c0",
          800: "#30499d",
          900: "#2c407c",
          950: "#1f284c",
        },
        theme2: {
          50: "#fef9ee",
          100: "#fcf2d8",
          200: "#f8e2b0",
          300: "#f4cf88",
          400: "#edab4a",
          500: "#e99326",
          600: "#da791c",
          700: "#b55e19",
          800: "#904a1c",
          900: "#743e1a",
          950: "#3f1e0b",
        },
      },
    },
  },
}`);

  const previewBaseCodeTemplate = ref(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"><\/script>
    <script>#CONFIG#<\/script>
  </head>
  <body>
    #HTML#
  </body>
  </html>`);

  const tabs = [
    { name: 'tab1', label: 'Config' },
    { name: 'tab2', label: 'Editor' },
  ];

  const codeBlock = ref(`<!-- component -->
<div class="w-full">
    <nav class="bg-white shadow-lg">
        <div class="md:flex items-center justify-between py-2 px-8 md:px-12">
            <div class="flex justify-between items-center">
               <div class="text-2xl font-bold text-gray-800 md:text-3xl">
                    <a href="#">Brand</a>
               </div>
                <div class="md:hidden">
                    <button type="button" class="block text-gray-800 hover:text-gray-700 focus:text-gray-700 focus:outline-none">
                        <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path class="hidden" d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"/>
                            <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="flex flex-col md:flex-row hidden md:block -mx-2">
                <a href="#" class="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Home</a>
                <a href="#" class="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">About</a>
                <a href="#" class="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Contact</a>
            </div>
        </div>
    </nav>
    <div class="flex bg-white" style="height:600px;">
        <div class="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
            <div>
                <h2 class="text-3xl font-semibold text-gray-800 md:text-4xl">Build Your New <span class="text-indigo-600">Idea</span></h2>
                <p class="mt-2 text-sm text-gray-500 md:text-base">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis commodi cum cupiditate ducimus, fugit harum id necessitatibus odio quam quasi, quibusdam rem tempora voluptates. Cumque debitis dignissimos id quam vel!</p>
                <div class="flex justify-center lg:justify-start mt-6">
                    <a class="px-4 py-3 bg-gray-900 text-gray-200 text-xs font-semibold rounded hover:bg-gray-800" href="#">Get Started</a>
                    <a class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" href="#">Learn More</a>
                </div>
            </div>
        </div>
        <div class="hidden lg:block lg:w-1/2" style="clip-path:polygon(10% 0, 100% 0%, 100% 100%, 0 100%)">
            <div class="h-full object-cover" style="background-image: url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80)">
                <div class="h-full bg-black opacity-25"></div>
            </div>
        </div>
    </div>
</div>`);

  const previewBaseCode = ref(
    previewBaseCodeTemplate.value
      .replace('#HTML#', codeBlock.value)
      .replace('#CONFIG#', tailwindConfig.value)
  );

  const updateCodeBlock = (code: string) => {
    codeBlock.value = code;

    updatePreviewCode();
  };

  const updateConfigBlock = (code: string) => {
    tailwindConfig.value = code;

    updatePreviewCode();
  };

  const updatePreviewCode = () => {
    previewBaseCode.value = previewBaseCodeTemplate.value
      .replace('#REPLACE#', codeBlock.value)
      .replace('#CONFIG#', tailwindConfig.value);
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

  const selectedLayout = ref(editorLayouts[1]);

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
