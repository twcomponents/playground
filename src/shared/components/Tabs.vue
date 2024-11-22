<template>
  <div class="flex flex-col items-center">
    <div class="border-b h-[55px]">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="[
          'border-b border-gray-300 px-5 py-2',
          { 'border-theme1-500': activeTab === tab.name },
        ]"
        @click="setActiveTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>
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
