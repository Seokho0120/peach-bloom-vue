<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGetItemsList } from '@/composables/useItems';

const route = useRoute();
const router = useRouter();

const categoryQuery = computed(() => route.params.id.toString());
const sortByQuery = computed(() => route.query.sortBy?.toString() ?? 'recommend');

const sortByList = [
  { name: '추천순', id: 'recommend' },
  { name: '신상품순', id: 'new' },
  { name: '리뷰많은순', id: 'review' },
  { name: '낮은가격순', id: 'lowPrice' },
  { name: '높은가격순', id: 'highPrice' },
  { name: '높은할인순', id: 'discount' },
  { name: '좋아요많은순', id: 'like' },
];

const selectedSortBy = ref(sortByList[0].id);
watch(selectedSortBy, () => {
  router.replace({
    query: {
      ...route.query,
      sortBy: selectedSortBy.value,
    },
  });
});

watch(sortByQuery, () => {
  selectedSortBy.value = sortByQuery.value;
}, { immediate: true });

const { data: itemList } = useGetItemsList(categoryQuery, selectedSortBy);
</script>

<template>
  <div class="container-2">
    <div>
      <Dropdown v-model="selectedSortBy" :options="sortByList" optionLabel="name" option-value="id" />
    </div>

    <div class="grid grid-cols-6 gap-y-16 gap-x-5 mt-10 w-full">
      <ItemsListCard
        v-for="item in itemList"
        :key="item.productId"
        :brandName="item.brandName"
        :imageUrl="item.imageUrl"
        :productName="item.productName"
        :salePrice="item.salePrice"
        :saleRate="item.saleRate"
        :review-count="item.reviewCount"
        :heart-count="item.heartCount"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container-2 {
  width: 100%;
  container-type: inline-size;
}

@container (min-width: 100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 500px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@container (min-width: 1020px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@container (min-width: 1260px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@container (min-width: 1535px) {
  .grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
