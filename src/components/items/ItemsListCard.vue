<script setup lang="ts">
import { ref } from 'vue';
import type { ItemsListType } from '@/types/items.types';

defineProps<{
  product: ItemsListType
}>()

const isHeart = ref(false);
const isReview = ref(false);

const toggleHeart = () => {
  isHeart.value = !isHeart.value;
};

const toggleReview = () => {
  isReview.value = !isReview.value;
};
</script>

<template>
  <div>
    <router-link
      :to="{ name: 'itemDetail', params: { id: product.productId } }"
    >
      <img :src="product.imageUrl[0]" alt="image" />
    </router-link>  

    <div class="flex flex-col gap-1 pt-3.5">
      <div class="text-xs font-semibold">{{ product.brandName }}</div>
      <div class="text-xs">
        <router-link
          :to="{ name: 'itemDetail', params: { id: product.productId } }"
        >
          {{ product.productName }}
        </router-link>
      </div>

      <div class="flex gap-2 mt-2">
        <div class="text-[#ff4800]">{{ product.saleRate }}%</div>
        <div class="font-bold">{{ product.salePrice }}</div>
      </div>

      <div class="flex gap-10 mt-2">
        <Button
          type="button"
          text
          :pt="{
            root: {
              class: ['w-fit p-0 border-0 hover:bg-white', isHeart ? 'text-orange-500' : 'text-black'],
            },
          }"
          @click="toggleHeart"
        >
          <template #default>
            <Icon :icon="isHeart ? 'heroicons:heart-solid' : 'heroicons:heart'" class="w-5 h-5" />
            <span class="text-xs pl-1">{{ product.heartCount }}</span>
          </template>
        </Button>

        <Button
          text
          :pt="{
            root: {
              class: 'w-fit p-0 border-0 hover:bg-white text-black',
            },
          }"
          @click="toggleReview"
        >
          <template #default>
            <Icon icon="heroicons:chat-bubble-left" class="w-5 h-5" />
            <span class="text-xs pl-1">{{ product.reviewCount }}</span>
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
