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
  <div class="absolute w-60 z-40 mt-6 p-6 left-6 bg-white">
    <h2 class="text-2xl font-bold border-b-4 border-black pb-4">뷰티</h2>
    <ul>
      <li v-for="category in categoryList" :key="category.id" class="hover:font-bold my-5">
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
  </div>
</template>
