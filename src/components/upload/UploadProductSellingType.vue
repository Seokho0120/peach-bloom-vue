<script setup lang="ts">
import { ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

interface SaleType {
  name: string;
  key: string;
}

const [DefineFormField, ReuseFormField] = createReusableTemplate();

const saleTypes = ref<SaleType[]>([
  { name: 'ALL', key: 'all' },
  { name: '온라인 전용', key: 'online' },
  { name: '오프라인 전용', key: 'off' },
  { name: '팝업스토어 전용', key: 'popup' },
  { name: '아울렛 전용', key: 'outlet' },
]);

const selectedType = ref<Array<string>>([]);

function handleCheckboxChange(type: SaleType) {
  // ALL 체크박스 선택 시 모든 체크박스 선택/해제
  if (type.key === 'all') {
    if (selectedType.value.includes('ALL')) {
      selectedType.value = saleTypes.value.map((saleType) => saleType.name);
    } else {
      selectedType.value = [];
    }
  } else {
    // 다른 체크박스 선택 시 ALL 체크박스 업데이트, 선택한 체크박스가 모든 항목을 포함하면 ALL 추가
    if (selectedType.value.length === saleTypes.value.length - 1 && !selectedType.value.includes('ALL')) {
      selectedType.value.push('ALL');
    } else if (selectedType.value.includes('ALL')) {
      selectedType.value = selectedType.value.filter((t) => t !== 'ALL');
    }
  }
}
watch(selectedType, () => {
  console.log('selectedType.value', selectedType.value);
});

function getFormData() {
  // TODO: 에러검사 로직 추가 필요
  const filteredSellingType = ref();

  if (selectedType.value.includes('ALL')) {
    filteredSellingType.value = selectedType.value.filter((t) => t === 'ALL');
  } else {
    filteredSellingType.value = selectedType.value;
  }

  return {
    sellingType: filteredSellingType.value,
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
      <div v-for="type of saleTypes" :key="type.key" class="flex align-items-center gap-2">
        <Checkbox
          v-model="selectedType"
          :inputId="type.key"
          :value="type.name"
          name="type"
          @change="handleCheckboxChange(type)"
        />
        <label :for="type.key">{{ type.name }}</label>
      </div>
    </ReuseFormField>
  </div>
</template>
