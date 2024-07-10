<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label: string }>();

const selectedCategory = ref();
const categories = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);

const selectedBrand = ref();
const brands = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);
</script>

<template>
  <DefineFormField v-slot="{ label, $slots }">
    <div class="flex flex-col gap-3">
      <h2>{{ label }}</h2>
      <component :is="$slots.default" />
    </div>
  </DefineFormField>

  <div class="flex flex-col gap-6">
    <ReuseFormField label="상품 카테고리" class="flex-1">
      <Dropdown
        v-model="selectedCategory"
        :options="categories"
        optionLabel="name"
        placeholder="Select a Category"
        class="w-full md:w-14rem"
      />
    </ReuseFormField>

    <ReuseFormField label="브랜드" class="flex-1">
      <Dropdown
        v-model="selectedBrand"
        :options="brands"
        optionLabel="name"
        placeholder="Select a Brand"
        class="w-full md:w-14rem"
      />
    </ReuseFormField>
  </div>
</template>

<style lang="scss" scoped></style>
