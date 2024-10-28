<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGetItemDetail } from '@/composables/useItems';
import ItemsDetailInfo from '@/components/items/itemsDetailInfo.vue';
import type { ImageItemsType } from '@/components/Carousel.vue';

const route = useRoute();
const productId = computed(() => route.params.id.toString());

const filteredImageUrls = ref<ImageItemsType[]>([]);
const { data: itemDetail, isLoading } = useGetItemDetail(productId);

watch(
  itemDetail,
  (newVal) => {
    if (newVal) {
      filteredImageUrls.value = newVal.imageUrl.map((url, index) => {
        const name = url.split('/').pop()?.split('.')[0] || '';

        return {
          link: url,
          id: index,
          name: name,
        };
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="isLoading">Loading..</div>
  <template v-else>
    <div
      v-if="itemDetail"
      class="w-full max-w-[81.25rem] min-w-[56.25rem] mx-auto flex px-12 py-5 gap-10"
    >
      <Carousel :imageItems="filteredImageUrls" />
      <ItemsDetailInfo :itemDetail="itemDetail" />
    </div>

    <div v-else>
      <p>찾으시는 제품이 없습니다.</p>
    </div>
  </template>
</template>
