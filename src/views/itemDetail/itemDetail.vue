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

watch(
  data,
  () => {
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
  },
  { immediate: true },
);

const isHeart = ref(false);
const toggleHeart = () => {
  isHeart.value = !isHeart.value;
};

const ratingValue = computed(() => {
  const max = 500;

  return itemDetail.value?.reviewCount ? (itemDetail.value.reviewCount / max) * 5 : 0;
});
</script>

<template>
  <div class="w-full max-w-[1300px] min-w-[900px] mx-auto flex px-12 gap-10">
    <div class="flex-shrink-0">
      <Image :src="itemDetail?.imageUrl[0]" alt="Detail Image" width="564" class="w-full h-auto object-cover" />
    </div>
    <div class="w-full border-t-4 border-black">
      <div class="flex items-center justify-between py-6 text-2xl font-bold">
        <div>{{ itemDetail?.productName }}</div>
        <Button
          type="button"
          text
          :pt="{
            root: {
              class: ['w-fit p-0 border-0 hover:bg-white', isHeart ? 'text-orange-500' : 'text-black'],
            },
          }"
          @click.stop="toggleHeart"
        >
          <template #default>
            <Icon :icon="isHeart ? 'heroicons:heart-solid' : 'heroicons:heart'" class="w-8 h-8" />
          </template>
        </Button>
      </div>

      <div class="flex items-center gap-4">
        <Rating v-model="ratingValue" readonly :cancel="false" />
        <p class="underline cursor-pointer">{{ itemDetail?.reviewCount }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
