<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface CarouselItem {
  image: string;
  name: string;
  role: string;
}

const getImage = (imageName: string) => {
  return new URL(`../../assets/testImages/${imageName}`, import.meta.url).href;
};

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
let firstCardWidth = ref(0);

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

<style lang="scss" scoped>
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
