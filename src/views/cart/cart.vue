<script setup lang="ts">
import { useGetCartItemsList } from '@/composables/useCartItems';

const { data, isError, isLoading } = useGetCartItemsList();
</script>

<template>
  <div class="flex flex-col px-12">
    <div class="mb-8 border-t-4 border-black">
      <ItemsListCard v-for="item in data" :key="item.productId" :product="item" />
    </div>
  </div>
</template>
