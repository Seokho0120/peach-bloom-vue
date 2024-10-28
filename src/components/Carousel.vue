<script setup lang="ts">
import { ref, toRefs } from 'vue';

export interface ImageItemsType {
  link: string;
  id: number;
  name: string;
}

const props = defineProps<{
  imageItems: ImageItemsType[];
  type?: string;
}>();

const { imageItems } = toRefs(props);

const carousel = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startTranslateX = ref(0);

function nextHandler() {
  if (currentIndex.value < imageItems.value.length - 1) {
    currentIndex.value += 1;
  } else {
    currentIndex.value = 0;
  }
}

function prevHandler() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  } else {
    currentIndex.value = imageItems.value.length - 1;
  }
}

// 드래그 시작
function dragStart(event: MouseEvent) {
  if (carousel.value) {
    isDragging.value = true;
    startX.value = event.pageX;
    startTranslateX.value = currentIndex.value * -100; // 현재 위치 저장
  }
}

// 드래그 중
function dragging(event: MouseEvent) {
  if (!isDragging.value || !carousel.value) return;

  const dragX = event.pageX;
  const walk = ((dragX - startX.value) / window.innerWidth) * 100; // 드래그 거리 계산

  carousel.value.style.transition = 'none'; // 드래그 중에는 애니메이션 비활성화
  carousel.value.style.transform = `translateX(${startTranslateX.value + walk}%)`; // 이동
}

// 드래그 종료
function dragStop(event: MouseEvent) {
  if (!isDragging.value) return;

  const dragStandardDistance = 4; // 드래그 기준 거리
  const dragX = event.pageX;
  const walk = ((dragX - startX.value) / window.innerWidth) * 100; // 드래그 거리 계산

  // 드래그 거리 기준으로 이전/다음 이미지로 이동
  if (
    walk < -dragStandardDistance &&
    currentIndex.value < imageItems.value.length - 1
  ) {
    nextHandler(); // 다음 이미지로 이동
  } else if (walk > dragStandardDistance && currentIndex.value > 0) {
    prevHandler(); // 이전 이미지로 이동
  }

  if (carousel.value) {
    carousel.value.style.transition = 'transform 0.4s ease';
    carousel.value.style.transform = `translateX(${currentIndex.value * -100}%)`; // 최종 위치 설정
    isDragging.value = false;
  }
}

function goToImage(index: number) {
  currentIndex.value = index;
}
</script>

<template>
  <div class="overflow-hidden relative flex-shrink-0 h-full">
    <ul
      ref="carousel"
      :class="`flex transition-transform duration-400 ${type !== 'main' ? 'w-[564px]' : ''} `"
      :style="{ transform: `translateX(${currentIndex * -100}%)` }"
      @mousedown="dragStart"
      @mouseup="dragStop"
      @mouseleave="dragStop"
      @mousemove="dragging"
    >
      <li
        v-for="(image, index) in imageItems"
        :key="index"
        class="flex-shrink-0 w-full h-full"
      >
        <img
          :src="image.link"
          :alt="image.name"
          draggable="false"
          class="w-full h-full object-cover"
        />
      </li>
    </ul>

    <button
      @click="prevHandler"
      :class="`absolute left-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60 ${currentIndex === 0 ? 'cursor-not-allowed' : ''}`"
      :disabled="currentIndex === 0"
    >
      <i class="pi pi-angle-left text-gray-800" />
    </button>
    <button
      @click="nextHandler"
      :class="`absolute right-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60 ${currentIndex === imageItems.length - 1 ? 'cursor-not-allowed' : ''}`"
      :disabled="currentIndex === imageItems.length - 1"
    >
      <i class="pi pi-angle-right text-gray-800" />
    </button>

    <ul
      v-if="imageItems.length > 1"
      class="absolute bottom-4 flex w-full justify-center gap-2"
    >
      <li
        v-for="(_, idx) in imageItems"
        :key="idx"
        :class="`h-[0.5rem] w-[0.5rem] rounded-full bg-white ${idx === currentIndex ? 'opacity-100' : 'opacity-40 cursor-pointer'}`"
        @click="goToImage(idx)"
      />
    </ul>
  </div>
</template>
