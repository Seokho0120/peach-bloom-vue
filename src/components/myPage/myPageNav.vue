<script setup lang="ts">
import { useGetLikeItemsList } from '@/composables/useLikeItem';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const { data: likeItemList, isError, isLoading } = useGetLikeItemsList(userId);

const myLikeNavList = [
  { name: '주문배송조회', id: 1 },
  { name: '취소/교환/반품 내역', id: 2 },
  { name: '상품 리뷰', id: 3 },
  { name: '회원정보수정', id: 4 },
  { name: '쿠폰/마일리지', id: 5 },
];
</script>

<template>
  <div class="flex flex-col gap-4 min-w-[10rem] max-w-[16rem]">
    <h2 class="text-3xl font-bold pb-4">이름</h2>
    <p class="font-bold mb-6">좋아요 {{ likeItemList.length }}개</p>

    <div class="flex flex-col gap-5 text-sm text-gray-600 font-light">
      <ul v-for="item in myLikeNavList" :key="item.id">
        <li>{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>
