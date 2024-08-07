<script setup lang="ts">
import { useGetItemDetail } from '@/composables/useItems';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const router = useRoute();
const productId = computed(() => router.params.id.toString());

const { data } = useGetItemDetail(productId);

watch(
  data,
  () => {
    console.log('data.value', data.value);
  },
  { immediate: true },
);

// watch(
//   productId,
//   () => {
//     console.log('productId.value', productId.value);
//     console.log('productId.value', typeof productId.value);
//   },
//   { immediate: true },
// );
</script>

<template>
  <div class="flex flex-col px-12">
    <h2 class="text-2xl font-bold pb-4">뷰티</h2>
    <div>product id : {{ productId }}</div>
  </div>

  <!-- <div class="min-w-[14rem] max-w-[16rem] border-t-4 border-black"></div> -->
</template>

<style lang="scss" scoped></style>
