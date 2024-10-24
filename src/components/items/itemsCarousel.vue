<!-- <script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { ItemDetailType } from '@/api/firestore';

const props = defineProps<{
  itemDetail: ItemDetailType;
}>();
const { itemDetail } = toRefs(props);

const currentIndex = ref(0);

const nextHandler = () => {
  currentIndex.value = (currentIndex.value + 1) % itemDetail.value!.imageUrl.length;
};

const prevHandler = () => {
  currentIndex.value = (currentIndex.value - 1 + itemDetail.value!.imageUrl.length) % itemDetail.value!.imageUrl.length;
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
  console.log('dragDistance.value', dragDistance.value);

  // 현재 인덱스로 마지막 이미지인지 확인
  if (currentIndex.value === 0 && dragDistance.value > 0) {
    // 첫 번째 이미지에서 왼쪽으로 드래그할 때
    dragDistance.value = Math.min(dragDistance.value, 0); // 오른쪽으로 드래그를 못하게
  } else if (currentIndex.value === itemDetail.value!.imageUrl.length - 1 && dragDistance.value < 0) {
    // 마지막 이미지에서 오른쪽으로 드래그할 때
    dragDistance.value = Math.max(dragDistance.value, 0); // 왼쪽으로 드래그를 못하게
  }

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
      TODO: image id 추가 예정 -주석처리
      <div v-for="image in itemDetail.imageUrl" :key="image" class="flex-shrink-0 w-full">
        TODO: image name 추가 예정 -주석처리
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
</template> -->

<template>
  <div class="wrapper" ref="wrapper">
    <i id="left" class="fa-solid fa-angle-left" @click="scrollLeft">왼</i>
    <ul
      class="carousel"
      ref="carousel"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragStop"
      @mouseleave="dragStop"
    >
      <li class="card" v-for="(item, index) in items" :key="index">
        <div class="img">
          <img :src="getImage(item.image)" :alt="item.name" draggable="false" />
        </div>
        <h2>{{ item.name }}</h2>
        <span>{{ item.role }}</span>
      </li>
    </ul>
    <i id="right" class="fa-solid fa-angle-right" @click="scrollRight">오른</i>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

interface CarouselItem {
  image: string;
  name: string;
  role: string;
}

const getImage = (imageName: string) => {
  return new URL(`../../assets/testImages/${imageName}`, import.meta.url).href;
};

export default {
  setup() {
    const wrapper = ref<HTMLElement | null>(null);
    const carousel = ref<HTMLElement | null>(null);
    const items = ref<CarouselItem[]>([
      { image: 'img-1.jpg', name: 'Blanche Pearson', role: 'Sales Manager' },
      { image: 'img-2.jpg', name: 'Joenas Brauers', role: 'Web Developer' },
      { image: 'img-3.jpg', name: 'Lariach French', role: 'Online Teacher' },
      { image: 'img-4.jpg', name: 'James Khosravi', role: 'Freelancer' },
      { image: 'img-5.jpg', name: 'Kristina Zasiadko', role: 'Bank Manager' },
      { image: 'img-6.jpg', name: 'Donald Horton', role: 'App Designer' },
    ]);

    let isDragging = ref(false);
    let startX = ref(0);
    let startScrollLeft = ref(0);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const firstCardWidth = ref(0);
    const cardPerView = ref(0);

    const dragStart = (e: MouseEvent) => {
      if (carousel.value) {
        isDragging.value = true;
        carousel.value.classList.add('dragging');
        startX.value = e.pageX;
        startScrollLeft.value = carousel.value.scrollLeft;
      }
    };

    const dragging = (e: MouseEvent) => {
      if (!isDragging.value || !carousel.value) return;
      const x = e.pageX;
      const walk = (x - startX.value) * 2;
      carousel.value.scrollLeft = startScrollLeft.value - walk;
    };

    const dragStop = () => {
      isDragging.value = false;
      if (carousel.value) {
        carousel.value.classList.remove('dragging');
      }
    };

    const scrollLeft = () => {
      if (carousel.value) {
        carousel.value.scrollLeft -= firstCardWidth.value;
      }
    };

    const scrollRight = () => {
      if (carousel.value) {
        carousel.value.scrollLeft += firstCardWidth.value;
      }
    };

    onMounted(() => {
      if (carousel.value) {
        firstCardWidth.value = carousel.value.querySelector('.card')?.offsetWidth || 0;
        cardPerView.value = Math.round(carousel.value.offsetWidth / firstCardWidth.value);

        const carouselChildren = [...carousel.value.children];
        carouselChildren
          .slice(-cardPerView.value)
          .reverse()
          .forEach((card) => {
            carousel.value.insertAdjacentHTML('afterbegin', card.outerHTML);
          });

        carouselChildren.slice(0, cardPerView.value).forEach((card) => {
          carousel.value.insertAdjacentHTML('beforeend', card.outerHTML);
        });

        carousel.value.classList.add('no-transition');
        carousel.value.scrollLeft = carousel.value.offsetWidth;
        carousel.value.classList.remove('no-transition');
      }
    });

    const addEventListeners = () => {
      if (carousel.value) {
        carousel.value.addEventListener('mousedown', dragStart);
        carousel.value.addEventListener('mousemove', dragging);
        document.addEventListener('mouseup', dragStop);
      }
      if (wrapper.value) {
        wrapper.value.addEventListener('mouseenter', () => clearTimeout(timeoutId!));
      }
    };

    onMounted(addEventListeners);

    return {
      wrapper,
      carousel,
      items,
      getImage,
      dragStart,
      dragging,
      dragStop,
      scrollLeft,
      scrollRight,
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  display: flex;
  padding: 0 35px;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.wrapper {
  max-width: 1100px;
  width: 60%;
  position: relative;
}

.wrapper i {
  top: 50%;
  height: 50px;
  width: 50px;
  cursor: pointer;
  font-size: 1.25rem;
  position: absolute;
  text-align: center;
  line-height: 50px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.23);
  transform: translateY(-50%);
  transition: transform 0.1s linear;
}

.wrapper i:active {
  transform: translateY(-50%) scale(0.85);
}

.wrapper i:first-child {
  left: -22px;
}

.wrapper i:last-child {
  right: -22px;
}

.wrapper .carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% / 3) - 12px);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 16px;
  border-radius: 8px;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
}

.carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.carousel.no-transition {
  scroll-behavior: auto;
}

.carousel.dragging {
  scroll-snap-type: none;
  scroll-behavior: auto;
}

.carousel.dragging .card {
  cursor: grab;
  user-select: none;
}

.carousel :where(.card, .img) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel .card {
  scroll-snap-align: start;
  height: 342px;
  list-style: none;
  background: #fff;
  cursor: pointer;
  padding-bottom: 15px;
  flex-direction: column;
  border-radius: 8px;
}

.carousel .card .img {
  background: #8b53ff;
  height: 148px;
  width: 148px;
  border-radius: 50%;
}

.card .img img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
}

.carousel .card h2 {
  font-weight: 500;
  font-size: 1.56rem;
  margin: 30px 0 5px;
}

.carousel .card span {
  color: #6a6d78;
  font-size: 1.31rem;
}

@media screen and (max-width: 900px) {
  .wrapper .carousel {
    grid-auto-columns: calc((100% / 2) - 9px);
  }
}

@media screen and (max-width: 600px) {
  .wrapper .carousel {
    grid-auto-columns: 100%;
  }
}
</style>
