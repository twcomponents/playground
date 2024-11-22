<template>
  <div class="flex flex-col">
    <!-- Tabs -->
    <div class="flex flex-row justify-center items-center border-b h-[55px]">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="[
          'flex flex-row gap-3 justify-center items-center border-b border-gray-300 px-5 py-2',
          { 'border-theme1-500': activeTab === tab.name },
        ]"
        @click="setActiveTab(tab.name)"
      >
        <component
          :is="tab.icon"
          class="size-4 text-gray-600"
          :style="{
            'stroke-width': '2px',
          }"
        ></component>

        <span>
          {{ tab.label }}
        </span>
      </button>
    </div>

    <!-- Contents -->
    <div class="tab-content">
      <template v-for="tab in tabs">
        <slot :name="tab.name" v-if="activeTab === tab.name" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';

  export default defineComponent({
    name: 'TabComponent',
    props: {
      tabs: {
        type: Array as PropType<Array<{ name: string; label: string }>>,
        required: true,
      },
      defaultTab: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const activeTab = ref(props.defaultTab || props.tabs[0]?.name || '');

      const setActiveTab = (tabName: string) => {
        activeTab.value = tabName;
      };

      return {
        activeTab,
        setActiveTab,
      };
    },
  });
</script>
