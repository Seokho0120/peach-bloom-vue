<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import { getLikedProductsList } from '@/api/firestore';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const likedProducts = ref([]);
const isLoading = ref(true);

// 사용자 좋아요한 제품 리스트 가져오기
const fetchLikedProducts = async () => {
  if (userId.value) {
    likedProducts.value = await getLikedProductsList(userId.value);
  }

  isLoading.value = false;
};

onMounted(() => {
  fetchLikedProducts();
});
</script>

<template>
  <div>mylike</div>
  <div v-for="(product, index) in likedProducts" :key="index">
    <!-- <div>{{ product }}</div> -->
    <span>{{ product.productName }}</span>
  </div>
</template>
