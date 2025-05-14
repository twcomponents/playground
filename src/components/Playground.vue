<template>
  <NxTailSpinLoader
    :isLoading="props.isLoading"
    :size="70"
    :isCentered="true"
    class="text-twc-theme-500 h-screen"
    v-if="props.isLoading"
  />

  <template v-else>
    <!-- Body -->
    <div
      class="flex flex-row"
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
        <ButtonGroup
          :buttons="tabButtons"
          :selectedButton="selectedGroupButton"
          @change="selectedGroupButton = $event"
          class="py-1"
        ></ButtonGroup>

        <!-- Config Editor -->
        <div
          :class="{
            hidden: selectedGroupButton.key !== 'config-tab',
          }"
        >
          <MonacoEditor
            :code="tailwindConfig"
            :height="
              selectedLayout.key === 'horizontal'
                ? 'calc(100vh - 60px)'
                : '440px'
            "
            language="javascript"
            :layout="selectedLayout"
            :theme="editorTheme"
            @change="updateConfigBlock($event)"
          />
        </div>

        <!-- Template Editor -->
        <div
          :class="{
            hidden: selectedGroupButton.key !== 'editor-tab',
          }"
        >
          <MonacoEditor
            :code="codeBlock"
            :height="
              selectedLayout.key === 'horizontal'
                ? 'calc(100vh - 60px)'
                : '440px'
            "
            :layout="selectedLayout"
            :tailwindConfig="tailwindConfig"
            :theme="editorTheme"
            :loadTailwindIntellisense="true"
            @change="updateCodeBlock($event)"
          />
        </div>

        <!-- CSS Editor -->
        <div
          :class="{
            hidden: selectedGroupButton.key !== 'css-tab',
          }"
        >
          <MonacoEditor
            :code="extraCss"
            :height="
              selectedLayout.key === 'horizontal'
                ? 'calc(100vh - 60px)'
                : '440px'
            "
            :layout="selectedLayout"
            language="css"
            :theme="editorTheme"
            @change="updateCssBlock($event)"
          />
        </div>
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
        <div
          class="flex flex-row justify-between p-2 border-b border-gray-300 dark:border-zinc-700"
        >
          <!-- Device Breakpoints -->
          <div class="flex flex-row gap-2">
            <button
              v-for="screenBreakPoint in screenBreakPoints"
              :key="screenBreakPoint.label"
              class="flex items-center justify-center size-8 border border-gray-300 dark:border-zinc-700 text-gray-500 hover:text-twc-theme-600 rounded-md"
              :class="{
                'bg-twc-theme-100 text-twc-theme-600 border-twc-theme-400 dark:border-twc-theme-800':
                  screenBreakPoint.key === selectedBreakpoint?.key,
              }"
              @click="onSelectBreakpoint(screenBreakPoint)"
              :data-tippy-content="
                screenBreakPoint.label + ' (<=' + screenBreakPoint.ref + 'px)'
              "
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

          <!-- Layout -->
          <div class="flex flex-row">
            <div class="flex flex-row gap-3">
              <button
                v-for="layout in editorLayouts"
                :key="layout.key"
                @click="onEditorLayoutChange(layout)"
                class="flex items-center justify-center size-8 border text-gray-500 dark:border-zinc-700 hover:text-twc-theme-600 rounded-md"
                :class="{
                  'bg-twc-theme-100 text-twc-theme-600 border-twc-theme-400 dark:border-twc-theme-800':
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
  </template>
</template>

<script setup lang="ts">
  // native
  import { onMounted, ref } from 'vue';

  // components
  import MonacoEditor from '@playground-app/components/MonacoEditor.vue';
  import ButtonGroup from '@playground-app/components/ButtonGroup.vue';

  // icons
  import {
    Smartphone,
    TabletSmartphone,
    Tablet,
    Laptop,
    ScreenShare,
    Columns2,
    Rows2,
    Bolt,
    LayoutPanelTop,
    Palette,
  } from 'lucide-vue-next';

  // third-party
  import tippy from 'tippy.js';
  import localForage from 'localforage';
  import { NxTailSpinLoader } from '@ngeenx/nx-vue-svg-loaders';
  import Navbar from '@playground-app/layouts/partials/Navbar.vue';

  const props = defineProps({
    isLoading: {
      type: Boolean,
      default: true,
    },
    codeBlock: {
      type: String,
      default: '',
    },
    extraCss: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['onLoading']);

  const tailwindConfig = ref(`export default {
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
    <script>
    function updateUrls() {
        var urls = document.querySelectorAll("a");

        for (var i = 0; i < urls.length; i++) {
            if (urls[i].getAttribute('href') === '#') {
                urls[i].removeAttribute('href');
            } else {
                urls[i].setAttribute('target', '_blank');
            }
        }
    }
    <\/script>
    </head>
  <body onload="updateUrls()">
    <style>#CSS#<\/style>
    #HTML#
  </body>
  </html>`);

  const editorTheme = ref('vs-dark');
  const tabButtons = ref([
    { key: 'config-tab', label: 'Config', icon: Bolt },
    { key: 'editor-tab', label: 'Editor', icon: LayoutPanelTop },
    { key: 'css-tab', label: 'CSS', icon: Palette },
  ]);
  const selectedGroupButton = ref(tabButtons.value[1]);
  const extraCss = ref(props.extraCss);

  // #region Code Editor / Preview

  const codeBlock = ref(props.codeBlock);

  const previewBaseCode = ref(
    previewBaseCodeTemplate.value
      .replace('#HTML#', codeBlock.value)
      .replace('#CSS#', codeBlock.value)
      .replace('#CONFIG#', tailwindConfig.value)
      .replace('export default {', 'tailwind.config = {')
  );

  const updateConfigBlock = async (code: string) => {
    tailwindConfig.value = code;

    await localForage.setItem('tailwind-config', code);

    updatePreviewCode();
  };

  const updateCodeBlock = async (code: string) => {
    codeBlock.value = code;

    updatePreviewCode();
  };

  const updateCssBlock = async (code: string) => {
    tailwindConfig.value = code;

    await localForage.setItem('extra-css', code);

    updatePreviewCode();
  };

  const updatePreviewCode = () => {
    previewBaseCode.value = previewBaseCodeTemplate.value
      .replace('#HTML#', codeBlock.value)
      .replace('#CONFIG#', tailwindConfig.value)
      .replace('#CSS#', extraCss.value)
      .replace('export default {', 'tailwind.config = {');
  };

  const restoreCodes = async () => {
    await localForage.getItem('tailwind-config').then((config) => {
      if (config) {
        tailwindConfig.value = config.toString();
      }
    });

    await localForage.getItem('extra-css').then((css) => {
      if (css) {
        extraCss.value = css.toString();
      }
    });

    updatePreviewCode();
  };

  // #endregion

  // #region Device Breakpoints

  const screenBreakPoints = [
    {
      key: 'sm',
      icon: Smartphone,
      width: '640px',
      label: 'Phone',
      ref: 640,
    },
    {
      key: 'md',
      icon: TabletSmartphone,
      width: '768px',
      label: 'Phablet',
      ref: 768,
    },
    {
      key: 'lg',
      icon: Tablet,
      width: '1024px',
      label: 'Tablet',
      ref: 1024,
    },
    {
      key: 'xl',
      icon: Laptop,
      width: '1280px',
      label: 'Laptop',
      ref: 1280,
    },
    {
      key: '2xl',
      icon: ScreenShare,
      width: '100%',
      label: 'Desktop',
      ref: 1536,
    },
  ];

  const selectedBreakpoint = ref(screenBreakPoints[1]);

  const onSelectBreakpoint = async (breakpoint: any) => {
    selectedBreakpoint.value = breakpoint;

    // if breakpoint is selected as 2xl and layout is horizontal, switch to vertical

    if (breakpoint.key === '2xl') {
      selectedLayout.value =
        editorLayouts[
          editorLayouts.findIndex((layout) => layout.key === 'vertical')
        ];

      await localForage.setItem('editor-layout', selectedLayout.value.key);
    }

    await localForage.setItem('preview-breakpoint', breakpoint.key);
  };

  const restoreBreakpoint = async () => {
    await localForage.getItem('preview-breakpoint').then((breakpoint) => {
      if (breakpoint) {
        selectedBreakpoint.value =
          screenBreakPoints.find((l) => l.key === breakpoint) ||
          screenBreakPoints[1];
      }
    });
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

  const onEditorLayoutChange = async (layout: any) => {
    selectedLayout.value = layout;

    // if layout is selected as horizontal and breakpoint is 2xl, switch to xl
    // in this case, the preview will be displayed in full screen
    if (layout.key === 'horizontal' && selectedBreakpoint.value.key === '2xl') {
      selectedBreakpoint.value =
        screenBreakPoints[
          screenBreakPoints.findIndex((breakpoint) => breakpoint.key === 'xl')
        ];

      await localForage.setItem(
        'preview-breakpoint',
        selectedBreakpoint.value.key
      );
    }

    await localForage.setItem('editor-layout', layout.key);
  };

  const restoreLayout = async () => {
    await localForage.getItem('editor-layout').then((layoutKey) => {
      if (layoutKey) {
        selectedLayout.value =
          editorLayouts.find((_layout) => _layout.key === layoutKey) ||
          editorLayouts[1];
      }
    });
  };

  // #endregion

  // #region Shortcuts

  const handleCtrlS = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();

      updatePreviewCode();
    }
  };

  // #endregion

  onMounted(() => {
    restoreLayout();
    restoreBreakpoint();
    restoreCodes();

    // #region Editor Theme Switcher

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    colorSchemeQuery.addEventListener(
      'change',
      (event: MediaQueryListEvent): void => {
        editorTheme.value = event.matches ? 'vs-dark' : 'vs-light';
      }
    );

    editorTheme.value = colorSchemeQuery.matches ? 'vs-dark' : 'vs-light';

    // #endregion

    setTimeout(() => {
      setTimeout(() => {
        tippy('[data-tippy-content]');
      }, 500);
    }, Math.random() * 1000);

    document.addEventListener('keydown', handleCtrlS);
  });
</script>
