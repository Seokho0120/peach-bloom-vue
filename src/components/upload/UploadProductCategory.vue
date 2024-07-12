<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useGetBrandList, useGetCategoryList } from '@/composables/useProductCategory';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label: string }>();

const {
  categoryList,
  isError: categoryListError,
  isLoading: categoryListLoading,
} = useGetCategoryList({ includeAsterisk: true });

const { brandList, isError: brandListError, isLoading: brandListLoading } = useGetBrandList({ includeAsterisk: true });

watch([categoryList, brandList], () => {
  console.log('categoryList.value', categoryList.value);
  console.log('brandList.value', brandList.value);
});

const selectedCategory = ref();

const selectedBrand = ref();

function getFormData() {
  // TODO: 에러검사 로직 추가 필요
  if (!selectedCategory.value && !selectedBrand.value) return;

  return {
    brandName: selectedBrand.value,
    categoryName: selectedCategory.value,
  };
}

defineExpose({ getFormData });
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
        filter
        showClear
        v-model="selectedCategory"
        :options="categoryList"
        optionLabel="name"
        optionValue="id"
        placeholder="Select a Category"
        class="w-full md:w-14rem"
      />
    </ReuseFormField>

    <ReuseFormField label="브랜드" class="flex-1">
      <Dropdown
        filter
        showClear
        v-model="selectedBrand"
        :options="brandList"
        optionLabel="name"
        optionValue="id"
        placeholder="Select a Brand"
        class="w-full md:w-14rem"
      />
    </ReuseFormField>
  </div>
</template>

<style lang="scss" scoped></style>
