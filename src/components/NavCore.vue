<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGetCategoryList } from '@/composables/useProductCategory';

const route = useRoute();
const filterId = computed(() => route.query.filter);

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
          query: { filter: filterId },
        }"
      >
        <div>{{ category.name }}</div>
      </RouterLink>
    </li>
  </ul>
</template>
