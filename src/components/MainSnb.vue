<script setup lang="ts">
import { useGetCategoryList } from '@/composables/useProductCategory';
import { RouterLink } from 'vue-router';

const {
  categoryList,
  isError: categoryListError,
  isLoading: categoryListLoading,
} = useGetCategoryList({ includeAsterisk: true });
</script>

<template>
  <ul class="absolute w-60 z-40 mt-6 p-6 left-6 bg-white flex flex-col gap-5">
    <h2 class="text-2xl font-bold border-b-4 border-black pb-4">뷰티</h2>

    <li v-for="category in categoryList" :key="category.id" class="hover:font-bold">
      <RouterLink
        :to="{
          name: 'itemsList',
          params: { id: category.id },
        }"
      >
        <div>{{ category.name }}</div>
      </RouterLink>
    </li>
  </ul>
</template>
