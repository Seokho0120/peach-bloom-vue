<script setup lang="ts">
import { ref } from 'vue';
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
    <div class="flex justify-between bg-[#303033] mb-10 p-5">
      <div class="border-r-2 pr-10">
        <p class="text-[#787879]">멤버십 등급 ></p>
        <div class="flex justify-between">
          <div class="text-gray-50">RED</div>
          <div class="border-[1px] rounded-lg border-[#787879] text-[#787879]">할인혜택 보기</div>
        </div>
      </div>

      <div class="border-r-2 pr-10">
        <p class="text-[#787879]">사용가능쿠폰 ></p>
        <p class="text-gray-50">36</p>
      </div>

      <div>
        <p class="text-[#787879]">마일리지 ></p>
        <p class="text-gray-50">5,500</p>
      </div>
    </div>

    <div v-if="!isError" class="grid grid-cols-4 gap-y-16 gap-x-5 w-full">
      <ItemsListCard v-for="item in likeItemList" :key="item.productId" :product="item" />
    </div>
  </div>
</template>
