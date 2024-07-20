<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useGetMainList } from '@/composables/useItems';
import type { ImageType, ItemsListType } from '@/types/items.types';

const user = ref<User | null>(null);

onAuthStateChanged(getAuth(), (currentUser) => {
  user.value = currentUser;
});

const { data, isError, isLoading } = useGetMainList();

const images = ref<ImageType[]>([]);

watchEffect(() => {
  if (data.value) {
    images.value = data.value.flatMap(
      (item: ItemsListType) => item.imageUrl.map((url) => ({ imageUrl: [url] })), // 각 URL을 배열로 감싸기
    );
  }
});
</script>
<template>
  <div class="card">
    <Galleria
      :autoPlay="true"
      :value="images"
      :circular="true"
      :showItemNavigators="true"
      :showThumbnails="false"
      :showItemNavigatorsOnHover="false"
      :showIndicators="true"
    >
      <template #item="slotProps">
        <img
          :src="slotProps.item.imageUrl"
          :alt="slotProps.item.imageUrl"
          style="width: 100%; height: 680px; object-fit: cover"
        />
      </template>
    </Galleria>
  </div>

  <!-- 예전꺼 -->
  <!-- <div>
    <h1 class="text-xl">Welcome to Peachbloom!</h1>
    <div v-if="user">
      <h2 class="font-bold text-2xl text-blue-500">Welcome, {{ user.email }}!</h2>
    </div>

    <div v-if="!isError && !isLoading">
      <div v-for="test in data" :key="test.productId" class="flex flex-col gap-4">
        <div>{{ test.productName }} / {{ test.brandName }}</div>
        <div>{{ test.categoryName }}</div>
        <div v-html="test.productDescription" />
        <div>{{ test.consumerPrice }}</div>
        <div>sale: {{ test.isSale }} / {{ test.saleRate }} / {{ test.salePrice }}</div>
        <div>{{ test.imageUrl.map((t) => t) }}</div>
        <div>{{ test.sellingType.map((y) => y) }}</div>
        <div class="mb-20">{{ test.weight }} / {{ test.width }} / {{ test.length }}</div>
      </div>
    </div>
  </div> -->
</template>
