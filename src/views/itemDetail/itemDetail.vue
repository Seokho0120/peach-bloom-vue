<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGetItemDetail } from '@/composables/useItems';
import ItemsDetailInfo from '@/components/items/itemsDetailInfo.vue';

const route = useRoute();
const productId = computed(() => route.params.id.toString());

// TODO: itemDetail.value.imageUrl -> imageUrls 복수형으로 수정 예정
const { data: itemDetail, isLoading } = useGetItemDetail(productId);
</script>

<template>
  <div v-if="isLoading">Loading..</div>
  <template v-else>
    <div
      v-if="itemDetail"
      class="w-full max-w-[81.25rem] min-w-[56.25rem] mx-auto flex px-12 py-5 gap-10"
    >
      <!-- <ItemsCarousel :itemDetail="itemDetail" />
      <ItemsCarousel2 /> -->
      <ItemsCarousel3 :itemDetail="itemDetail" />

      <ItemsDetailInfo :itemDetail="itemDetail" />
    </div>

    <div v-else>
      <p>찾으시는 제품이 없습니다.</p>
    </div>
  </template>
</template>
