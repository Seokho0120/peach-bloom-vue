<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

interface SaleType {
  name: string;
  key: string;
}

const [DefineFormField, ReuseFormField] = createReusableTemplate();

const selectedType = ref<Array<string>>([]);
const saleTypes = ref<SaleType[]>([
  { name: '온라인 전용', key: 'online' },
  { name: '오프라인 전용', key: 'off' },
  { name: '팝업스토어 전용', key: 'popup' },
  { name: '아울렛 전용', key: 'outlet' },
]);

const isAllSelected = computed({
  get: () => {
    return selectedType.value.length === saleTypes.value.length;
  },
  set: (value) => {
    if (value) {
      selectedType.value = saleTypes.value.map((saleType) => saleType.name);
    } else {
      selectedType.value = [];
    }
  },
});

function getFormData() {
  // TODO: 에러검사 로직 추가 필요

  return {
    sellingType: selectedType.value,
  };
}

defineExpose({ getFormData });
</script>

<template>
  <DefineFormField v-slot="{ $slots }">
    <div class="flex flex-col">
      <component :is="$slots.default" />
    </div>
  </DefineFormField>

  <div class="flex flex-col gap-6">
    <ReuseFormField class="flex-1 gap-4">
      <div class="flex align-items-center gap-2">
        <Checkbox v-model="isAllSelected" inputId="all" binary />
        <label for="all">ALL</label>
      </div>
      <div v-for="type of saleTypes" :key="type.key" class="flex align-items-center gap-2">
        <Checkbox v-model="selectedType" :inputId="type.key" :value="type.name" />
        <label :for="type.key">{{ type.name }}</label>
      </div>
    </ReuseFormField>
  </div>
</template>
