<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useGetLikeItemsList } from '@/composables/useLikeItem';
import ItemsListCard from '@/components/items/ItemsListCard.vue';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const { data: likeItemList, isError, isLoading } = useGetLikeItemsList(userId);
</script>

<template>
  <div>
    <div class="flex gap-4 justify-between bg-[#303033] mb-10 p-5">
      <div class="flex flex-col gap-8 flex-[1.5] border-r-2 border-[#787879] pr-4">
        <p class="text-sm text-[#787879]">멤버십 등급 ></p>
        <div class="flex items-center justify-between">
          <div class="text-gray-50 text-3xl">RED</div>
          <div class="text-xs border-[1px] py-2 px-4 rounded-full border-[#787879] text-[#787879]">할인혜택 보기</div>
        </div>
      </div>

      <div class="flex flex-col gap-8 flex-1 border-r-2 border-[#787879]">
        <p class="text-sm text-[#787879]">사용가능쿠폰 ></p>
        <p class="text-gray-50 text-3xl">36</p>
      </div>

      <div class="flex flex-col gap-8 flex-1">
        <p class="text-sm text-[#787879]">마일리지 ></p>
        <p class="text-gray-50 text-3xl">5,500</p>
      </div>
    </div>

    <div v-if="!isError" class="grid grid-cols-4 gap-y-16 gap-x-5 w-full">
      <ItemsListCard v-for="item in likeItemList" :key="item.productId" :product="item" />
    </div>
  </div>
</template>
