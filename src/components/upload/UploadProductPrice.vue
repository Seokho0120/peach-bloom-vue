<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label: string }>();

const price = ref<number>(0);
</script>

<template>
  <DefineFormField v-slot="{ label, $slots }">
    <div class="flex flex-col gap-3">
      <h2>{{ label }}</h2>
      <component :is="$slots.default" />
    </div>
  </DefineFormField>

  <!-- TODO: 컨텐츠 더 생각해보기 (세일여부, 세일 퍼센트) -->
  <div class="flex flex-col gap-6">
    <ReuseFormField label="상품 가격">
      <InputGroup>
        <InputNumber v-model="price" type="number" />
        <InputGroupAddon>원</InputGroupAddon>
      </InputGroup>
    </ReuseFormField>
  </div>
</template>

<style lang="scss" scoped></style>
