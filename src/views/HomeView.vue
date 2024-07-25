<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useGetMainList } from '@/composables/useItems';
import type { ImageType, ItemsListType } from '@/types/items.types';

// TODO: user로 분기처리 예정
// const user = ref<User | null>(null);
// onAuthStateChanged(getAuth(), (currentUser) => {
//   user.value = currentUser;
// });

const images = ref<ImageType[]>([]);

const { data } = useGetMainList();

watchEffect(() => {
  if (data.value) {
    images.value = data.value.flatMap((item: ItemsListType) => item.imageUrl.map((url) => ({ imageUrl: [url] })));
  }
});
</script>

<template>
  <MainSnb />
  <MainItemsList :images="images" />
</template>
