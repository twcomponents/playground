<template>
  <Navbar />

  <Playground :codeBlock="codeBlock" :isLoading="isLoading" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  import Navbar from '@/layouts/partials/Navbar.vue';
  import Playground from '@/components/Playground.vue';

  const isLoading = ref(true);
  const codeBlock = ref(`<!--
  Welcome to Tailwind Components Playground!
-->
<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
    <div
        class="relative bg-white px-6 pt-10 pb-8 shadow-md ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div class="mx-auto max-w-md">
            <div class="divide-y divide-gray-300/50">
                <h1 class="text-3xl text-twc-theme-600 mb-2">
                    tailwindcomponents.dev
                </h1>

                <div class="space-y-6 py-8 text-base leading-7 text-gray-600">
                    <p>An advanced online playground for Tailwind CSS, including support for things like:</p>
                    <ul class="space-y-4">
                        <li class="flex items-center">
                            <svg class="h-6 w-6 flex-none fill-twc-theme-100 stroke-twc-theme-500 stroke-2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="11" />
                                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                            </svg>
                            <p class="ml-4">
                                Customizing your
                                <code class="text-sm font-bold text-gray-900">tailwind.config.js</code> file
                            </p>
                        </li>
                        <li class="flex items-center">
                            <svg class="h-6 w-6 flex-none fill-twc-theme-100 stroke-twc-theme-500 stroke-2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="11" />
                                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                            </svg>
                            <p class="ml-4">
                                Custom
                                <code class="text-sm font-bold text-gray-900">CSS</code> support
                            </p>
                        </li>
                        <li class="flex items-center">
                            <svg class="h-6 w-6 flex-none fill-twc-theme-100 stroke-twc-theme-500 stroke-2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="11" />
                                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                            </svg>
                            <p class="ml-4">Code completion with instant preview</p>
                        </li>
                    </ul>
                </div>
                <div class="pt-8 text-base font-semibold leading-7">
                    <p class="text-gray-900">Want to discover Tailwind?</p>
                    <p>
                        <a href="https://tailwindcss.com/docs" class="text-twc-theme-500 hover:text-twc-theme-600">
                        Read our blogs
                            &rarr;</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>`);
  const extraCss = ref(`.custom {
    height: 100px;
    width: 100px;
    background-color: red;
}`);

  onMounted(() => {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  });
</script>
