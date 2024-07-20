<script setup lang="ts">
import { ref, watch } from 'vue';

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
</script>

<template>
  <div>
    <div class="card flex justify-content-center">
      <Dropdown v-model="selectedFilter" :options="filters" optionLabel="name" class="w-full md:w-14rem" />
    </div>

    <div class="flex flex-col">
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
    </div>
  </div>
</template>
