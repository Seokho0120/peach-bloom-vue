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

const autoPlay = ref(true);
</script>

<template>
  <div v-if="isLoading">Loading..</div>
  <template v-else>
    <button type="button" @click="autoPlay = true">Start</button>
    <button type="button" @click="autoPlay = false">Stop</button>
    <div
      v-if="itemDetail"
      class="w-full max-w-[81.25rem] min-w-[56.25rem] mx-auto flex px-12 py-5 gap-10"
    >
      <div>
        <Button type="button" class="w-96" label="Button" icon-pos="bottom">
          <template #icon="slotProps">
            <svg v-bind="slotProps" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 15h1.5V9H5v1.5h1zm3.5 0H12q.425 0 .713-.288T13 14v-4q0-.425-.288-.712T12 9H9.5q-.425 0-.712.288T8.5 10v4q0 .425.288.713T9.5 15m.5-1.5v-3h1.5v3zm3.925 1.5h1.5v-2.25l1.75 2.25H19l-2.325-3L19 9h-1.825l-1.75 2.25V9h-1.5zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"/></svg>
          </template>
        </Button>
        <div class="w-[564px] h-[564px]">
          <Carousel
            :imageItems="filteredImageUrls"
            showPrevButton
            showNextButton
            pagination
            scrollbar
            :autoPlay="autoPlay"
          >
            <template #prev-btn="{ goToPrev, defaultClass }">
              <button 
                type="button" 
                @click="goToPrev"
                :class="defaultClass"
                class=" bg-red-300 rounded-full"
              >Prev</button>
            </template>
            <template #next-btn="{goToNext, defaultClass}">
              <button 
                type="button" 
                @click="goToNext"
                :class="defaultClass"
                class="bg-red-300"
              >Next</button>
            </template>
          </Carousel>
        </div>
      </div>
      <ItemsDetailInfo :itemDetail="itemDetail" />
    </div>

    <div v-else>
      <p>찾으시는 제품이 없습니다.</p>
    </div>
  </template>
</template>
