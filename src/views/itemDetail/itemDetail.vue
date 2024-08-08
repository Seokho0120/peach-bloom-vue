<script setup lang="ts">
import { useGetItemDetail } from '@/composables/useItems';
import { useItemsListStore } from '@/stores/itemsList.store';
import type { ItemDetailType } from '@/types/items.types';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const router = useRoute();
const productId = computed(() => router.params.id.toString());
const itemStore = useItemsListStore();

const { data } = useGetItemDetail(productId);
const sortingItemList = computed(() => itemStore.sortingItemList);

const itemDetail = ref<ItemDetailType | undefined>(undefined);

watch(data, () => {
  const foundItems = sortingItemList.value.filter((item) => item.productId === data.value?.productId);

  if (foundItems.length > 0) {
    const mergedItem = {
      ...foundItems[0],
      howToUse: data.value?.howToUse || '',
      ingredients: data.value?.ingredients || '',
    };
    itemDetail.value = mergedItem;
  }

  console.log('itemDetail.value???', itemDetail.value);
});
</script>

<template>
  <div class="flex flex-col px-12">
    <h2 class="text-2xl font-bold pb-4">뷰티</h2>
    <div>image: {{ itemDetail?.imageUrl[0] }}</div>
  </div>

  <!-- <div class="min-w-[14rem] max-w-[16rem] border-t-4 border-black"></div> -->
</template>

<style lang="scss" scoped></style>
