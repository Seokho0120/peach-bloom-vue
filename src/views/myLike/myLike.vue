<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store'; // 사용자 인증 스토어
import { storeToRefs } from 'pinia';
import { getLikedProductsDetails } from '@/api/firestore';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const likedProducts = ref([]); // 좋아요한 제품 리스트 상태
const isLoading = ref(true); // 로딩 상태

// 사용자 좋아요한 제품 리스트 가져오기
const fetchLikedProducts = async () => {
  if (userId.value) {
    likedProducts.value = await getLikedProductsDetails(userId.value);
  }

  console.log('likedProducts.value', likedProducts.value);
  isLoading.value = false; // 로딩 완료
};

// 컴포넌트가 마운트될 때 좋아요한 제품 리스트를 가져옴
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
