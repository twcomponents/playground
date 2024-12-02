<template>
  <!-- Buttons -->
  <div class="flex flex-row justify-center items-center border-b h-[55px]">
    <button
      v-for="button in props.buttons"
      :key="button.key"
      :class="[
        'flex flex-row gap-3 justify-center items-center border-b border-gray-300 px-5 py-2',
        { 'border-theme1-500': props.selectedButton.key === button.key },
      ]"
      @click="onButtonClick(button)"
    >
      <component
        :is="button.icon"
        class="size-4 text-gray-600"
        :style="{
          'stroke-width': '2px',
        }"
      ></component>

      <span>
        {{ button.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { PropType, defineProps, defineEmits } from 'vue';

  export interface ButtonGroupItem {
    key: string;
    label: string;
    icon: object;
  }

  const props = defineProps({
    buttons: {
      type: Array as PropType<Array<ButtonGroupItem>>,
      required: true,
    },
    selectedButton: {
      type: Object as PropType<ButtonGroupItem>,
      required: true,
    },
  });

  const emitters = defineEmits(['change']);

  const onButtonClick = (button: ButtonGroupItem) => {
    emitters('change', button);
  };
</script>
