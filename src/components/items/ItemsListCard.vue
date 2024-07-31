<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  imageUrl: string[];
  brandName: string;
  productName: string;
  saleRate: number;
  salePrice: number;
  reviewCount: number;
  heartCount: number;
}>();

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
    <img :src="imageUrl[0]" alt="image" />

    <div class="flex flex-col gap-1 pt-3.5">
      <div class="text-xs font-semibold">{{ brandName }}</div>
      <div class="text-xs">{{ productName }}</div>

      <div class="flex gap-2 mt-2">
        <div class="text-[#ff4800]">{{ saleRate }}%</div>
        <div class="font-bold">{{ salePrice }}</div>
      </div>

      <div class="flex gap-10 mt-2">
        <Button
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
            <p class="text-xs pl-1">{{ heartCount }}</p>
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
            <p class="text-xs pl-1">{{ reviewCount }}</p>
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
