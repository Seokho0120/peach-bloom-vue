<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGetCategoryList } from '@/composables/useProductCategory';

const route = useRoute();
const sortBy = computed(() => route.query.sortBy);

const {
  categoryList,
  isError: categoryListError,
  isLoading: categoryListLoading,
} = useGetCategoryList({ includeAsterisk: true });
</script>
<template>
  <ul>
    <li v-for="category in categoryList" :key="category.id" class="my-5">
      <RouterLink
        :to="{
          name: 'itemsList',
          params: { id: category.id },
          query: { sortBy: sortBy },
        }"
      >
        <div class="">{{ category.name }}</div>
      </RouterLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.router-link-active {
  font-weight: 600;

  /* FIXME: 컬러 생각해보기 */
  /* color: var(--primary-color); */
}
</style>
