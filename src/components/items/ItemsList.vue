<script setup lang="ts">
import { useGetMainList } from '@/composables/useItems';
import type { ImageType, ItemsListType } from '@/types/items.types';
import { ref, watch, watchEffect } from 'vue';

const filters = ref([
  { name: '추천순', id: 'recommend' },
  { name: '신상품순', id: 'new' },
  { name: '리뷰많은순', id: 'review' },
  { name: '낮은가격순', id: 'lowPrice' },
  { name: '높은가격순', id: 'highPrice' },
  { name: '높은할인순', id: 'discount' },
  { name: '좋아요많은순', id: 'like' },
]);

const selectedFilter = ref(filters.value[0]);

watch(selectedFilter, () => {
  console.log('selectedFilter.value', selectedFilter.value);
});

const { data, isError, isLoading } = useGetMainList();

const images = ref<ImageType[]>([]);

watchEffect(() => {
  if (data.value) {
    images.value = data.value.flatMap(
      (item: ItemsListType) => item.imageUrl.map((url) => ({ imageUrl: [url] })), // 각 URL을 배열로 감싸기
    );
  }
});
</script>

<template>
  <div>
    <div class="card flex justify-content-center">
      <Dropdown v-model="selectedFilter" :options="filters" optionLabel="name" />
    </div>

    <div class="grid grid-cols-6 gap-4 mt-10">
      <ItemsListCard
        v-for="item in data"
        :key="item.productId"
        :brandName="item.brandName"
        :imageUrl="item.imageUrl"
        :productName="item.productName"
        :salePrice="item.salePrice"
        :saleRate="item.saleRate"
      />

      <!-- <div v-for="item in data" :key="item.productId" class="flex flex-col">
        <img :src="item.imageUrl[0]" alt="image[0]" />

        <div class="pt-3.5">
          <div class="text-xs pb-1">{{ item.brandName }}</div>
          <div class="text-xs pb-2">{{ item.productName }}</div>

          <div class="flex gap-2">
            <div class="text-[#ff4800]">{{ item.saleRate }}%</div>
            <div class="font-bold">{{ item.salePrice }}</div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
