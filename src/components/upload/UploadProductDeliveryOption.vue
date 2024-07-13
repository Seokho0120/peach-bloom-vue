<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import InputNumber from 'primevue/inputnumber';

const [DefineFormField, ReuseFormField] = createReusableTemplate();

const weight = ref<number>(0);
const length = ref<number>(0);
const breadth = ref<number>(0);
const width = ref<number>(0);

function getFormData() {
  if (!weight.value && !length.value && !breadth.value && !width.value) return;

  // TODO: 배열로 return 할지 고민하기
  return {
    weight: weight.value,
    length: length.value,
    breadth: breadth.value,
    width: width.value,
  };
}

defineExpose({ getFormData });
</script>

<template>
  <DefineFormField v-slot="{ label, $slots }">
    <div class="flex flex-col gap-3 w-full">
      <h2>{{ label }}</h2>
      <component :is="$slots.default" />
    </div>
  </DefineFormField>

  <div class="flex flex-col gap-6">
    <ReuseFormField label="상품 무게">
      <InputGroup>
        <InputNumber v-model="weight" type="number" inputmode="numeric" />
        <InputGroupAddon>kg</InputGroupAddon>
      </InputGroup>
    </ReuseFormField>

    <span>패키지 크기(제품 배송에 사용하는 패키지)</span>
    <div class="flex items-center justify-between gap-4">
      <ReuseFormField label="길이">
        <InputGroup>
          <InputNumber v-model="length" type="number" />
          <InputGroupAddon>cm</InputGroupAddon>
        </InputGroup>
      </ReuseFormField>

      <ReuseFormField label="폭">
        <InputGroup>
          <InputNumber v-model="breadth" type="number" />
          <InputGroupAddon>cm</InputGroupAddon>
        </InputGroup>
      </ReuseFormField>

      <ReuseFormField label="너비">
        <InputGroup>
          <InputNumber v-model="width" type="number" />
          <InputGroupAddon>cm</InputGroupAddon>
        </InputGroup>
      </ReuseFormField>
    </div>
  </div>
</template>
