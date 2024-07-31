<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGetItemsList } from '@/composables/useItems';
import type { ImageType, ItemsListType } from '@/types/items.types';

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
  if (itemList.value) {
    images.value = itemList.value.flatMap(
      (item: ItemsListType) => item.imageUrl.map((url) => ({ imageUrl: [url] })), // 각 URL을 배열로 감싸기
    );
  }
});
</script>

<template>
  <div>
    <div class="card flex justify-content-center">
      <Dropdown v-model="selectedFilter" :options="filterList" optionLabel="name" option-value="id" />
    </div>

    <div class="grid grid-cols-6 gap-4 mt-10">
      <ItemsListCard
        v-for="item in itemList"
        :key="item.productId"
        :brandName="item.brandName"
        :imageUrl="item.imageUrl"
        :productName="item.productName"
        :salePrice="item.salePrice"
        :saleRate="item.saleRate"
      />
    </div>
  </div>
</template>
