<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGetItemDetail } from '@/composables/useItems';
import ItemsDetailInfo from '@/components/items/itemsDetailInfo.vue';
import type { ImageItemsType } from '@/components/MyCarousel.vue';

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
      <div>
        <div class="w-[564px] h-[564px]">
          <MyCarousel
            :imageItems="filteredImageUrls"
            showPrevButton
            showNextButton
            pagination
            keyboardControl
            parallax
            effectFade
            :contents="[
              {
                title: 'Title 1',
                subTitle: 'Subtitle 1',
                content:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla laoreetjusto vitae porttitor porttitor. Suspendisse in sem justo. Integerlaoreet magna nec elit suscipit, ac laoreet nibh euismod. Aliquamhendrerit lorem at elit facilisis rutrum. Ut at ullamcorper velit. Nullaligula nisi, imperdiet ut lacinia nec, tincidunt ut libero. Aeneanfeugiat non eros quis feugiat.',
              },
              {
                title: 'Title 2',
                subTitle: 'Subtitle 2',
                content:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla laoreetjusto vitae porttitor porttitor. Suspendisse in sem justo. Integerlaoreet magna nec elit suscipit, ac laoreet nibh euismod. Aliquamhendrerit lorem at elit facilisis rutrum. Ut at ullamcorper velit. Nullaligula nisi, imperdiet ut lacinia nec, tincidunt ut libero. Aeneanfeugiat non eros quis feugiat.',
              },
              {
                title: 'Title 3',
                subTitle: 'Subtitle 3',
                content: 'Content 3',
              },
            ]"
          />
        </div>
      </div>
      <ItemsDetailInfo :itemDetail="itemDetail" />
    </div>

    <div v-else>
      <p>찾으시는 제품이 없습니다.</p>
    </div>
  </template>
</template>
