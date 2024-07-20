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
  <ul class="w-52 z-40 left-6 bg-white flex flex-col gap-5 border-t-4 border-black">
    <li
      v-for="(category, idx) in categoryList"
      :key="category.id"
      :class="idx === 0 ? 'mt-6 hover:font-bold' : 'hover:font-bold'"
    >
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
