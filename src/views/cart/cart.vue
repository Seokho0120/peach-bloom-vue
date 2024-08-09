<script setup lang="ts">
import { useGetCartItemsList } from '@/composables/useCartItems';

const { data, isError, isLoading } = useGetCartItemsList();
</script>

<template>
  <div class="w-full max-w-[1300px] min-w-[900px] mx-auto flex px-12 gap-10">
    <h2 class="text-2xl font-bold pb-4">장바구니</h2>

    <div>
      <ItemsListCard
        v-for="item in data"
        :key="item.productId"
        :product-id="item.productId"
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
