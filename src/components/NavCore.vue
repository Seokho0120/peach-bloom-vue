<script setup lang="ts">
import { useGetCategoryList } from '@/composables/useProductCategory';

const {
  categoryList,
  isError: categoryListError,
  isLoading: categoryListLoading,
} = useGetCategoryList({ includeAsterisk: true });
</script>
<template>
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
</template>