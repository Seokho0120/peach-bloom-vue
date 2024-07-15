<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useGetBrandList, useGetCategoryList } from '@/composables/useProductCategory';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label: string }>();

const selectedCategory = ref<string>();
const selectedBrand = ref<string>();

const {
  categoryList,
  isError: categoryListError,
  isLoading: categoryListLoading,
} = useGetCategoryList({ includeAsterisk: true });

const { brandList, isError: brandListError, isLoading: brandListLoading } = useGetBrandList({ includeAsterisk: true });

const categoryError = computed(() => categoryListError.value || categoryList.value === null || undefined);
const brandError = computed(() => brandListError.value || brandList.value === null || undefined);

function getFormData() {
  // TODO: 에러검사 로직 추가 필요
  if (!selectedCategory.value && !selectedBrand.value) return;

  return {
    brandName: selectedBrand.value,
    categoryName: selectedCategory.value,
  };
}

defineExpose({ getFormData });

// add 할때 id값이 아닌, name값으로 등록해야하기 때문에 optionValue="name"로 설정
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
        :loading="categoryListLoading"
        :disabled="!categoryList"
        optionLabel="name"
        optionValue="name"
        placeholder="카테고리를 선택하세요."
        class="w-full md:w-14rem"
      >
        <template #value="{ value, placeholder }">
          <template v-if="value">
            {{ value }}
          </template>
          <template v-else>
            {{ placeholder }}
          </template>
        </template>
      </Dropdown>
      <span v-if="categoryError" class="text-red-500">카테고리 목록을 불러오는 중 오류가 발생했습니다.</span>
    </ReuseFormField>

    <ReuseFormField label="브랜드" class="flex-1">
      <Dropdown
        filter
        showClear
        v-model="selectedBrand"
        :options="brandList"
        :loading="brandListLoading"
        :disabled="!brandList"
        optionLabel="name"
        optionValue="name"
        placeholder="브랜드를 선택하세요."
        class="w-full md:w-14rem"
      >
        <template #value="{ value, placeholder }">
          <template v-if="value">
            {{ value }}
          </template>
          <template v-else>
            {{ placeholder }}
          </template>
        </template>
      </Dropdown>
      <span v-if="brandError" class="text-red-500">브랜드 목록을 불러오는 중 오류가 발생했습니다.</span>
    </ReuseFormField>
  </div>
</template>
