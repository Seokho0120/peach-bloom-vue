<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

const [DefineFormField, ReuseFormField] = createReusableTemplate();

const categories = ref([
  { name: '오프라인 전용', key: 'Off' },
  { name: '온라인 전용', key: 'Online' },
  { name: '온라인, 오프라인', key: 'All' },
]);
const selectedCategories = ref(['Marketing']);
</script>

<template>
  <DefineFormField v-slot="{ $slots }">
    <div class="flex flex-col">
      <component :is="$slots.default" />
    </div>
  </DefineFormField>

  <div class="flex flex-col gap-6">
    <ReuseFormField class="flex-1 gap-4">
      <div v-for="category of categories" :key="category.key" class="flex align-items-center gap-2">
        <Checkbox
          v-model="selectedCategories"
          :inputId="category.key"
          name="category"
          :value="category.name"
        />
        <label :for="category.key">{{ category.name }}</label>
      </div>
    </ReuseFormField>
  </div>
</template>

<style lang="scss" scoped></style>
