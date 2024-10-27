<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface CarouselItem {
  image: string;
  name: string;
  role: string;
}

const getImage = (imageName: string) => {
  return new URL(`../../assets/testImages/${imageName}`, import.meta.url).href;
};

const wrapper = ref<HTMLElement | null>(null);

const items = ref<CarouselItem[]>([
  { image: 'img-1.jpg', name: 'Blanche Pearson', role: 'Sales Manager' },
  { image: 'img-2.jpg', name: 'Joenas Brauers', role: 'Web Developer' },
  { image: 'img-3.jpg', name: 'Lariach French', role: 'Online Teacher' },
  { image: 'img-4.jpg', name: 'James Khosravi', role: 'Freelancer' },
  { image: 'img-5.jpg', name: 'Kristina Zasiadko', role: 'Bank Manager' },
  { image: 'img-6.jpg', name: 'Donald Horton', role: 'App Designer' },
]);

const carousel = ref<HTMLElement | null>(null);
let isDragging = ref(false);
let startX = ref(0);
let startScrollLeft = ref(0);
let firstCardWidth = ref(0);

const dragStart = (e: MouseEvent) => {
  if (carousel.value) {
    isDragging.value = true;
    carousel.value.classList.add('dragging');
    startX.value = e.pageX;
    startScrollLeft.value = carousel.value.scrollLeft;

    console.log('isDragging.value', isDragging.value);
    console.log('startX.value', startX.value);
    console.log('startScrollLeft.value', startScrollLeft.value);
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

// const scrollLeft = () => {
//   if (carousel.value) {
//     carousel.value.scrollLeft -= firstCardWidth.value;
//   }
// };

// const scrollRight = () => {
//   if (carousel.value) {
//     carousel.value.scrollLeft += firstCardWidth.value;
//   }
// };

onMounted(() => {
  if (carousel.value) {
    firstCardWidth.value =
      carousel.value.querySelector('.card')?.offsetWidth || 0;

    // Scroll the carousel to hide duplicate cards
    carousel.value.scrollLeft = carousel.value.offsetWidth;
  }
});

// Event listeners
const addEventListeners = () => {
  if (carousel.value) {
    carousel.value.addEventListener('mousedown', dragStart);
    carousel.value.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);
  }
};

onMounted(addEventListeners);
</script>

<template>
  <div class="wrapper" ref="wrapper">
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
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  max-width: 1100px;
  width: 50%;
  position: relative;
}

.wrapper .carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory; // 스크롤 시 애매한 위치에 있을때 자동을 위치 조정됨
  /* scroll-behavior: smooth; */
}

.carousel.no-transition {
  /* scroll-behavior: auto; */
}

.carousel.dragging {
  scroll-snap-type: none;
  /* scroll-behavior: auto; */
}

.carousel .card {
  scroll-snap-align: start;
  width: auto;
  list-style: none;
  background: #fff;
  cursor: pointer;
  padding-bottom: 15px;
  flex-direction: column;
  border-radius: 8px;
}

.carousel .card .img {
  width: max-content;
}
</style>
