<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useGetMainList } from '@/composables/useItems';
import type { ImageType, ItemsListType } from '@/types/items.types';
import Carousel from '@/components/Carousel.vue';

// TODO: user로 분기처리 예정
// const user = ref<User | null>(null);
// onAuthStateChanged(getAuth(), (currentUser) => {
//   user.value = currentUser;
// });

export interface ImageItemsType {
  link: string;
  id: number;
  name: string;
}
const images = ref<ImageItemsType[]>([]);
const { data } = useGetMainList();
watchEffect(() => {
  if (data.value) {
    images.value = data.value.flatMap((item: ItemsListType) =>
      item.imageUrl.map((url, index) => ({
        link: url,
        id: index,
        name: url.split('/').pop()?.split('.')[0] || '', // 이름 추출
      })),
    );
  }
});

// const images = ref<ImageType[]>([]);
// const { data } = useGetMainList();
// watchEffect(() => {
//   if (data.value) {
//     images.value = data.value.flatMap((item: ItemsListType) =>
//       item.imageUrl.map((url) => ({ imageUrl: [url] })),
//     );
//   }
// });
</script>

<template>
  <MainSnb />
  <!-- <MainItemsList :images="images" /> -->

  <div style="width: 100%; height: 680px">
    <Carousel :imageItems="images" type="main" />
  </div>
</template>
