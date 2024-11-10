<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { ItemsListType } from '@/types/items.types';
import { useGetMainList } from '@/composables/useItems';

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
</script>

<template>
  <MainSnb />
  <div style="width: 100%; height: 680px">
    <MyCarousel :imageItems="images" autoPlay />
  </div>
</template>
