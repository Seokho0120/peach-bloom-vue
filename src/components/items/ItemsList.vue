<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGetItemsList } from '@/composables/useItems';
import type { ImageType, ItemsListType } from '@/types/items.types';
import { getItemsList } from '@/api/firestore';
import { useQuery } from '@tanstack/vue-query';

const route = useRoute();
const router = useRouter();

const filterList = ref([
  { name: '추천순', id: 'recommend' },
  { name: '신상품순', id: 'new' },
  { name: '리뷰많은순', id: 'review' },
  { name: '낮은가격순', id: 'lowPrice' },
  { name: '높은가격순', id: 'highPrice' },
  { name: '높은할인순', id: 'discount' },
  { name: '좋아요많은순', id: 'like' },
]);

const selectedFilter = ref(filterList.value[0].id);
watch(
  selectedFilter,
  () => {
    router.replace({
      query: {
        ...route.query,
        filter: selectedFilter.value,
      },
    });
  },
  { immediate: true },
);

const { data: itemList, isError, isLoading } = useGetItemsList();

const images = ref<ImageType[]>([]);

watchEffect(() => {
  console.log('itemList.value', itemList.value);

  if (itemList.value) {
    images.value = itemList.value.flatMap(
      (item: ItemsListType) => item.imageUrl.map((url) => ({ imageUrl: [url] })), // 각 URL을 배열로 감싸기
    );
  }
});

const category = ref('all');

watch(
  selectedFilter,
  () => {
    router.replace({
      query: {
        ...route.query,
        filter: selectedFilter.value,
      },
    });
  },
  { immediate: true },
);

const { data: test } = useQuery({
  queryKey: ['items', category.value, selectedFilter.value],
  queryFn: () => getItemsList(category.value, selectedFilter.value),
});

watch(test, () => {
  console.log('test.value', test.value);
});
</script>

<template>
  <div class="container">
    <div class="flex justify-content-center">
      <Dropdown v-model="selectedFilter" :options="filterList" optionLabel="name" option-value="id" />
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
.container {
  container-type: inline-size;
  max-width: 100%;
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
