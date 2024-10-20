<script setup lang="ts">
import { ref } from 'vue';

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
];

const hoverIndex = ref<number | null>(null); // 현재 hover된 link의 인덱스
</script>
<template>
  <div class="">
    <div class="flex gap-2 py-7 md:cursor-pointer">
      <div
        v-for="(link, index) in links"
        :key="index"
        class="relative"
        @mouseenter="hoverIndex = index"
        @mouseleave="hoverIndex = null"
      >
        <h1 class="hover:text-blue-500">
          {{ link.name }}
        </h1>
      </div>
    </div>

    <div class="absolute z-50 left-0 right-0 w-full bg-red-400" v-if="hoverIndex !== null">
      <div class="flex gap-10 p-5">
        <div v-for="(test, index1) in links[hoverIndex].subLinks" :key="index1" class="flex flex-col">
          <h1 class="font-bold hover:text-blue-500 cursor-pointer">{{ test.Head }}</h1>
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

  <!-- for문 반복됨 -->
  <!-- <div class="flex gap-2 py-7 md:cursor-pointer">
    <div
      v-for="(link, index) in links"
      :key="index"
      class="relative group"
      @mouseenter="hoverIndex = index"
      @mouseleave="hoverIndex = null"
    >
      <h1 class="hover:text-blue-500">
        {{ link.name }}
      </h1>
    </div>
  </div>

  <div class="absolute left-0 right-0 w-full h-[200px] bg-red-400" v-if="hoverIndex !== null">
    <div v-for="link in links" :key="link.name" class="flex">
      <div v-for="(test, index1) in link.subLinks" :key="index1" class="flex flex-col">
        <h1 class="font-bold hover:text-blue-500 cursor-pointer">{{ test.Head }}</h1>
        <div>
          <div v-for="(test2, index2) in test.subLink" :key="index2">
            <RouterLink :to="test2.link" class="block hover:underline">
              {{ test2.name }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div> -->

  <!-- 기존꺼 -->
  <!-- <div class="flex gap-2 py-7 md:cursor-pointer">
    <div v-for="(link, index) in links" :key="index" class="relative group">
      <h1 class="hover:text-blue-500">
        {{ link.name }}
      </h1>

      <div class="absolute top-full hidden group-hover:block w-full p-5">
        <div class="flex gap-10">
          <div v-for="(test, index1) in link.subLinks" :key="index1" class="flex flex-col">
            <h1 class="font-bold hover:text-blue-500 cursor-pointer">{{ test.Head }}</h1>
            <div class="hidden group-hover:block">
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
  </div> -->
</template>
