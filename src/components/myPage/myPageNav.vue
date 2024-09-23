<script setup lang="ts">
import { useGetLikeItemsList } from '@/composables/useLikeItem';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const { data: likeItemList, isError, isLoading } = useGetLikeItemsList(userId);

const TEST = [
  { name: 'test1', id: 1 },
  { name: 'test2', id: 2 },
  { name: 'test3', id: 3 },
  { name: 'test4', id: 4 },
];
</script>

<template>
  <div class="flex flex-col min-w-[14rem] max-w-[16rem] gap-2">
    <h2 class="text-2xl font-bold pb-4">이름</h2>
    <p class="font-bold mb-4">좋아요 {{ likeItemList.length }}개</p>

    <ul v-for="item in TEST" :key="item.id">
      <li>{{ item.name }}</li>
    </ul>
  </div>
</template>
