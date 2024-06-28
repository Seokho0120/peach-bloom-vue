<script setup lang="ts">
import { Icon } from '@iconify/vue';
import peachbloom from '../assets/images/peachbloom-logo.png';

const userMenu = [
  {
    label: 'MY PAGE',
    name: 'mypage',
    icon: 'heroicons-solid:annotation',
  },
  {
    label: 'MY LIKE',
    name: 'mylike',
    icon: 'heroicons:heart-solid',
  },
  {
    label: 'SHOPPING BAG',
    name: 'carts',
    icon: 'heroicons:shopping-cart-solid',
  },
  {
    label: 'LOGIN',
    name: 'login',
    icon: 'heroicons:arrow-right-end-on-rectangle-16-solid',
  },
];
</script>

<template>
  <nav class="flex justify-between">
    <h1>
      <RouterLink
        :to="{
          name: 'home',
        }"
      >
        <img
          :src="peachbloom"
          class="w-36 mb-4"
          alt="peachbloom logo"
        />
      </RouterLink>
    </h1>

    <ul class="flex items-center gap-4 text-sm">
      <li v-for="item in userMenu" :key="item.name">
        <RouterLink
          :to="{
            name: item.name,
          }"
        >
          <div class="flex items-center gap-1">
            <Icon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
