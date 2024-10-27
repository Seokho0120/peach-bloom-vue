<!-- <script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import type { ItemDetailType } from '@/api/firestore';

const props = defineProps<{
  itemDetail: ItemDetailType;
}>();
const { itemDetail } = toRefs(props);

const currentIndex = ref(0);
const carousel = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startX = ref(0);
const startScrollLeft = ref(0);

function nextHandler() {
  if (currentIndex.value === itemDetail.value.imageUrl.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value += 1;
    // currentIndex.value = currentIndex.value + 1;
  }
}

function prevHandler() {
  if (currentIndex.value === 0) {
    currentIndex.value = itemDetail.value.imageUrl.length - 1;
  } else {
    currentIndex.value -= 1;
    // currentIndex.value = currentIndex.value - 1;
  }
}

// TODO: 드래그
const dragStart = (event: MouseEvent) => {
  if (carousel.value) {
    isDragging.value = true;
    startX.value = event.pageX;
    startScrollLeft.value = carousel.value?.scrollLeft ?? 0;
  }
};

const dragging = (event: MouseEvent) => {
  if (!isDragging.value || !carousel.value) return;

  const x = event.pageX;
  const walk = (x - startX.value) * 2; // 드래그 감속
  carousel.value.scrollLeft = startScrollLeft.value - walk;
};

const dragStop = () => {
  isDragging.value = false;
};
</script>

<template>
  <div class="overflow-hidden relative flex-shrink-0 h-full">
    <ul
      ref="carousel"
      class="flex transition-transform duration-400 w-[564px]"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragStop"
      @mouseleave="dragStop"
    >
      <li
        v-for="image in itemDetail.imageUrl"
        :key="image"
        class="flex-shrink-0 w-full"
      >
        <img :src="image" class="w-full" :alt="image" draggable="false" />
      </li>
    </ul>

    <button
      @click="prevHandler"
      :class="`absolute left-4 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60 ${currentIndex === 0 ? 'cursor-not-allowed' : ''}`"
      :disabled="currentIndex === 0"
    >
      <i class="pi pi-angle-left text-gray-800" />
    </button>
    <button
      @click="nextHandler"
      :class="`absolute right-4 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60 ${currentIndex === itemDetail.imageUrl.length - 1 ? 'cursor-not-allowed' : ''}`"
      :disabled="currentIndex === itemDetail.imageUrl.length - 1"
    >
      <i class="pi pi-angle-right text-gray-800" />
    </button>
  </div>
</template> -->

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import type { ItemDetailType } from '@/api/firestore';

const props = defineProps<{
  itemDetail: ItemDetailType;
}>();
const { itemDetail } = toRefs(props);
const filteredImageUrls = ref<{ link: string; id: number; name: string }[]>([]);

// TODO: for문 돌기 위한 임시방편
watch(
  itemDetail,
  () => {
    filteredImageUrls.value = itemDetail.value.imageUrl.map((url, index) => {
      const name = url.split('/').pop()?.split('.')[0] || ''; // jpg 부분 추출

      return {
        link: url,
        id: index,
        name: name,
      };
    });
  },
  { immediate: true },
);

const currentIndex = ref(0);
const carousel = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startX = ref(0);
const startTranslateX = ref(0);
// const dragDistance = 3; // 드래그 거리 기준 (픽셀)

// 이미지 너비 및 마진 설정
// const itemWidth = 564; // 각 이미지의 너비 (px)
// const dragDistance = itemWidth * 0.001; // 드래그 거리 기준 (5%)
const dragDistance = 4;

const nextHandler = () => {
  if (currentIndex.value < itemDetail.value.imageUrl.length - 1) {
    currentIndex.value += 1;
  } else {
    currentIndex.value = 0;
  }
};

const prevHandler = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  } else {
    currentIndex.value = itemDetail.value.imageUrl.length - 1;
  }
};

// 드래그 시작
const dragStart = (event: MouseEvent) => {
  if (carousel.value) {
    isDragging.value = true;
    startX.value = event.pageX;
    startTranslateX.value = currentIndex.value * -100; // 현재 위치 저장
  }
};

// 드래그 중
const dragging = (event: MouseEvent) => {
  if (!isDragging.value || !carousel.value) return;

  const x = event.pageX;
  const walk = ((x - startX.value) / window.innerWidth) * 100; // 드래그 거리 계산
  carousel.value.style.transition = 'none'; // 드래그 중에는 애니메이션 비활성화
  carousel.value.style.transform = `translateX(${startTranslateX.value + walk}%)`; // 이동 적용
};

// 드래그 종료
const dragStop = (event: MouseEvent) => {
  if (!isDragging.value) return;

  const x = event.pageX;
  const walk = ((x - startX.value) / window.innerWidth) * 100; // 드래그 거리 계산

  console.log('dragDistance', dragDistance);

  // 드래그 거리 기준으로 이전/다음 이미지로 이동
  if (
    walk < -dragDistance &&
    currentIndex.value < itemDetail.value.imageUrl.length - 1
  ) {
    nextHandler(); // 다음 이미지로 이동
  } else if (walk > dragDistance && currentIndex.value > 0) {
    prevHandler(); // 이전 이미지로 이동
  }

  if (carousel.value) {
    // 최종 위치 설정
    carousel.value.style.transition = 'transform 0.4s ease';
    carousel.value.style.transform = `translateX(${currentIndex.value * -100}%)`;
    isDragging.value = false;
  }
};
</script>

<template>
  <div class="overflow-hidden relative flex-shrink-0 h-full">
    <ul
      ref="carousel"
      class="flex transition-transform duration-400 w-[564px]"
      :style="{ transform: `translateX(${currentIndex * -100}%)` }"
      @mousedown="dragStart"
      @mouseup="dragStop"
      @mouseleave="dragStop"
      @mousemove="dragging"
    >
      <li
        v-for="(image, index) in filteredImageUrls"
        :key="index"
        class="flex-shrink-0 w-full"
      >
        <img
          :src="image.link"
          class="w-full"
          :alt="image.name"
          draggable="false"
        />
      </li>
    </ul>

    <button
      @click="prevHandler"
      :class="`absolute left-4 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60 ${currentIndex === 0 ? 'cursor-not-allowed' : ''}`"
      :disabled="currentIndex === 0"
    >
      <i class="pi pi-angle-left text-gray-800" />
    </button>
    <button
      @click="nextHandler"
      :class="`absolute right-4 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60 ${currentIndex === itemDetail.imageUrl.length - 1 ? 'cursor-not-allowed' : ''}`"
      :disabled="currentIndex === itemDetail.imageUrl.length - 1"
    >
      <i class="pi pi-angle-right text-gray-800" />
    </button>
  </div>
</template>

<!-- 리액트코드 -->
<!-- <script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import type { ItemDetailType } from '@/api/firestore';

const props = defineProps<{
  itemDetail: ItemDetailType;
}>();
const { itemDetail } = toRefs(props);

const carouselItemsRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startPosition = ref(0);
const endPosition = ref(0);
const currentIndex = ref(0);

const moveTowardX = (movedDistance: number) => {
  const totalCarouselWidth =
    150 * itemDetail.value.imageUrl.length +
    16 * (itemDetail.value.imageUrl.length - 1); // ITEM_MARGIN은 16으로 가정
  const [minPosition, maxPosition] = [-totalCarouselWidth + 150, 0];

  if (movedDistance < minPosition) return minPosition;
  if (movedDistance > maxPosition) return maxPosition;
  return movedDistance;
};

const handleMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  startPosition.value = event.clientX;
  isDragging.value = true;
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return;

  const movedDistance = moveTowardX(
    endPosition.value - startPosition.value + event.clientX,
  );

  if (carouselItemsRef.value) {
    carouselItemsRef.value.style.transform = `translateX(${movedDistance}px)`;
  }
};

const handleMouseUp = (event: MouseEvent) => {
  if (!isDragging.value) return;

  const movedDistance = moveTowardX(
    endPosition.value - startPosition.value + event.clientX,
  );

  endPosition.value = movedDistance;
  isDragging.value = false;
};
</script>

<template>
  <div class="overflow-hidden relative flex-shrink-0 h-full">
    <div
      ref="carouselItemsRef"
      class="flex transition-transform duration-400 w-[564px]"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @mousemove="handleMouseMove"
    >
      <ul
        class="flex transition-transform duration-500"
        :style="{ transform: `translateX(${endPosition}px)` }"
      >
        <li
          v-for="(image, index) in itemDetail.imageUrl"
          :key="index"
          class="flex-shrink-0 w-full"
        >
          <img :src="image" class="w-full" :alt="image" draggable="false" />
        </li>
      </ul>
    </div>
  </div>
</template> -->
