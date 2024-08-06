<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  imageUrl: string[];
  brandName: string;
  productName: string;
  saleRate: number;
  salePrice: number;
  reviewCount: number;
  heartCount: number;
  productId: string;
}>();

const router = useRouter();

const isHeart = ref(false);
const isReview = ref(false);

const toggleHeart = () => {
  isHeart.value = !isHeart.value;
};

const toggleReview = () => {
  isReview.value = !isReview.value;
};

function goToDetail() {
  router.push({ name: 'itemDetail', query: { id: props.productId } });
}
</script>

<template>
  <div @click="goToDetail" class="cursor-pointer">
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
            <Icon :icon="isHeart ? 'heroicons:heart-solid' : 'heroicons:heart'" class="w-5 h-5" />
            <span class="text-xs pl-1">{{ heartCount }}</span>
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
            <span class="text-xs pl-1">{{ reviewCount }}</span>
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
