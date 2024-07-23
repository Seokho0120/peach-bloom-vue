<script setup lang="ts">
defineProps<{
  imageUrl: string[];
  brandName: string;
  productName: string;
  saleRate: number;
  salePrice: number;
}>();
</script>

<template>
  <div>
    <img :src="imageUrl[0]" alt="image" />

    <div class="pt-3.5">
      <div class="text-xs pb-1">{{ brandName }}</div>
      <div class="text-xs pb-2">{{ productName }}</div>

      <div class="flex gap-2">
        <div class="text-[#ff4800]">{{ saleRate }}%</div>
        <div class="font-bold">{{ salePrice }}</div>
      </div>
    </div>
  </div>
</template>
