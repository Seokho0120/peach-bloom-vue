<script setup lang="ts">
import type { ImageType } from '@/types/items.types';

defineProps<{
  images: ImageType[];
}>();
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
    <template #item="{ item }">
      <img :src="item.imageUrl" :alt="item.imageUrl" style="width: 100%; height: 680px; object-fit: cover" />
    </template>
  </Galleria>
</template>
