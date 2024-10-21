<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { ItemDetailType } from '@/api/firestore';

const props = defineProps<{
  itemDetail: ItemDetailType;
}>();
const { itemDetail } = toRefs(props);

const currentIndex = ref(0);

const nextHandler = () => {
  currentIndex.value = (currentIndex.value + 1) % itemDetail.value!.imageUrl.length;
  console.log('currentIndex.value', currentIndex.value);
};

const prevHandler = () => {
  currentIndex.value = (currentIndex.value - 1 + itemDetail.value!.imageUrl.length) % itemDetail.value!.imageUrl.length;
  console.log('currentIndex.value', currentIndex.value);
};

const isDragging = ref(false);
const startX = ref(0);
const dragDistance = ref(0);
const carousel = ref<HTMLElement | null>(null);

const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  startX.value = event.clientX;
  dragDistance.value = 0;

  if (carousel.value) {
    carousel.value.style.transition = 'none'; // 애니메이션 중지
  }
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return;

  dragDistance.value = event.clientX - startX.value;
  const newTranslateX = currentIndex.value * -100 + (dragDistance.value / window.innerWidth) * 100;

  if (carousel.value) {
    carousel.value.style.transform = `translateX(${newTranslateX}%)`;
  }
};

const endDrag = () => {
  isDragging.value = false;
  const distance = dragDistance.value;

  if (distance > 100 && currentIndex.value > 0) {
    prevHandler(); // 왼쪽으로 드래그 시 이전 이미지로
  } else if (distance < -100 && currentIndex.value < itemDetail.value!.imageUrl.length - 1) {
    nextHandler(); // 오른쪽으로 드래그 시 다음 이미지로
  }

  if (carousel.value) {
    carousel.value.style.transition = ''; // 애니메이션 재개
  }
};
</script>

<template>
  <div
    class="overflow-hidden relative flex-shrink-0 h-full"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
  >
    <div
      ref="carousel"
      class="flex transition-transform duration-500 w-[564px]"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <!-- TODO: image id 추가 예정 -->
      <div v-for="(image, index) in itemDetail.imageUrl" :key="index" class="flex-shrink-0 w-full">
        <!-- TODO: image name 추가 예정 -->
        <img :src="image" class="w-full" draggable="false" :alt="image" />
      </div>
    </div>

    <button
      v-if="itemDetail.imageUrl.length > 1"
      @click="prevHandler"
      :class="`absolute shadow-md left-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60`"
    >
      <i class="pi pi-angle-left text-gray-800" />
    </button>

    <button
      v-if="itemDetail.imageUrl.length > 1"
      @click="nextHandler"
      class="absolute shadow-md right-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60"
    >
      <i class="pi pi-angle-right text-gray-800" />
    </button>

    <ul v-if="itemDetail.imageUrl.length > 1" class="absolute bottom-4 flex w-full justify-center gap-1">
      <li
        v-for="(_, idx) in itemDetail?.imageUrl"
        :key="idx"
        :class="`h-[0.5rem] w-[0.5rem] rounded-full bg-white ${idx === currentIndex ? 'opacity-100' : 'opacity-40'}`"
      />
    </ul>
  </div>
</template>
