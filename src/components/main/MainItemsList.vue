<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useGetMainList } from '@/composables/useItems';
import type { ImageType, ItemsListType } from '@/types/items.types';

defineProps<{
  images: ImageType[];
}>();

const user = ref<User | null>(null);

onAuthStateChanged(getAuth(), (currentUser) => {
  user.value = currentUser;
});
</script>

<template>
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
</template>
