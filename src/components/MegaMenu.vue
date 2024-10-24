<script setup lang="ts">
import { ref, watch } from 'vue';

const links = [
  {
    name: 'BEST',
    submenu: true,
  },
  {
    name: 'MEN',
    submenu: true,
    subLinks: [
      {
        Head: '의류',
        subLink: [
          { name: 'ALL', link: '/' },
          { name: 'NEW', link: '/' },
          { name: 'EXCLUSIVE', link: '/' },
          { name: '해외브랜드', link: '/' },
          { name: '아우터', link: '/' },
          { name: '상의', link: '/' },
          { name: '하의', link: '/' },
        ],
      },
      {
        Head: '가방',
        subLink: [
          { name: 'ALL', link: '/' },
          { name: 'NEW', link: '/' },
          { name: 'EXCLUSIVE', link: '/' },
          { name: '해외브랜드', link: '/' },
          { name: '크로스백', link: '/' },
          { name: '토트백', link: '/' },
          { name: '숄더백', link: '/' },
        ],
      },
      {
        Head: '신발',
        subLink: [
          { name: 'ALL', link: '/' },
          { name: 'NEW', link: '/' },
          { name: 'EXCLUSIVE', link: '/' },
          { name: '스니커즈', link: '/' },
          { name: '로퍼', link: '/' },
          { name: '구두', link: '/' },
          { name: '부츠', link: '/' },
        ],
      },
      {
        Head: '악세서리',
        subLink: [
          { name: 'ALL', link: '/' },
          { name: 'NEW', link: '/' },
          { name: 'EXCLUSIVE', link: '/' },
          { name: '모자', link: '/' },
          { name: '시계', link: '/' },
          { name: '아이웨어', link: '/' },
          { name: '넥타이', link: '/' },
        ],
      },
    ],
  },
  {
    name: 'WOMEN',
    submenu: true,
    subLinks: [
      {
        Head: '의류',
        subLink: [
          { name: 'ALL2', link: '/' },
          { name: 'NEW2', link: '/' },
          { name: 'EXCLUSIVE2', link: '/' },
          { name: '해외브랜드2', link: '/' },
          { name: '아우터2', link: '/' },
          { name: '상의2', link: '/' },
          { name: '하의2', link: '/' },
        ],
      },
      {
        Head: '가방',
        subLink: [
          { name: 'ALL2', link: '/' },
          { name: 'NEW2', link: '/' },
          { name: 'EXCLUSIVE2', link: '/' },
          { name: '해외브랜드2', link: '/' },
          { name: '크로스백2', link: '/' },
          { name: '토트백2', link: '/' },
          { name: '숄더백2', link: '/' },
        ],
      },
      {
        Head: '신발',
        subLink: [
          { name: 'ALL2', link: '/' },
          { name: 'NEW2', link: '/' },
          { name: 'EXCLUSIVE2', link: '/' },
          { name: '스니커즈2', link: '/' },
          { name: '로퍼2', link: '/' },
          { name: '구두2', link: '/' },
          { name: '부츠2', link: '/' },
        ],
      },
      {
        Head: '악세서리',
        subLink: [
          { name: 'ALL2', link: '/' },
          { name: 'NEW2', link: '/' },
          { name: 'EXCLUSIVE2', link: '/' },
          { name: '모자2', link: '/' },
          { name: '시계2', link: '/' },
          { name: '아이웨어2', link: '/' },
          { name: '넥타이2', link: '/' },
        ],
      },
    ],
  },
];

const hoverIndex = ref<number | null>(null); // 현재 hover된 link의 인덱스

watch(hoverIndex, () => {
  console.log('hoverIndex.value', hoverIndex.value);
});

const handleMouseLeave = () => {
  hoverIndex.value = null; // link.name에서 마우스가 나가면 hoverIndex를 null
};
</script>

<template>
  <!-- TODO: for문 안에서 -->
  <div>
    <div class="flex gap-6 cursor-pointer">
      <div v-for="(link, index) in links" :key="index" class="relative group" @mouseenter="hoverIndex = index">
        <h1 class="hover:text-blue-500">
          {{ link.name }}
        </h1>

        <div
          v-if="hoverIndex === index"
          @mouseleave="handleMouseLeave"
          class="absolute z-50 left-0 right-0 w-full hidden group-hover:block"
        >
          <div class="flex gap-10 p-5">
            <div v-for="(test, index1) in link.subLinks" :key="index1" class="flex flex-col">
              <h1 class="font-bold hover:text-blue-500">{{ test.Head }}</h1>
              <div>
                <div v-for="(test2, index2) in test.subLink" :key="index2">
                  <RouterLink :to="test2.link" class="block hover:underline">
                    {{ test2.name }}
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
