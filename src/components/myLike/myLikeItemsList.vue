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
  <div v-if="!isError" class="grid grid-cols-4 gap-y-16 gap-x-5 w-full">
    <ItemsListCard v-for="item in likeItemList" :key="item.productId" :product="item" />
  </div>
</template>
