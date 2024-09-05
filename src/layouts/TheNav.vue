<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth.store';
import { useGetCartItemsList } from '@/composables/useCartItems';
import peachbloom from '../assets/images/peachbloom-logo.png';

const router = useRouter();

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const { data: cartItemList } = useGetCartItemsList(userId);

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
    label: 'UPLOAD',
    name: 'upload',
    icon: 'heroicons:arrow-up-tray-16-solid',
  },
];

const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);

    router.push({ name: 'home' });
  } catch (err) {
    alert(err);
  }
};
</script>

<template>
  <nav class="flex justify-between p-12">
    <h1>
      <RouterLink
        :to="{
          name: 'home',
        }"
      >
        <img :src="peachbloom" class="mb-4 w-36" alt="peachbloom logo" />
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

      <RouterLink :to="{ name: 'cart' }" class="relative">
        <div class="flex items-center gap-1">
          <Icon icon="heroicons:shopping-cart-solid" />
          <span>SHOPPING BAG</span>
          <Badge
            v-if="cartItemList.length > 0"
            :value="cartItemList.length"
            severity="danger"
            :pt="{
              root: {
                class: 'absolute bg-[#ff4800] right-[-10px] top-[-12px]',
              },
            }"
          />
        </div>
      </RouterLink>

      <li v-if="!userId">
        <RouterLink
          :to="{
            name: 'login',
          }"
          class="flex items-center gap-1"
        >
          <Icon icon="heroicons:arrow-right-end-on-rectangle-16-solid" />
          LOGIN
        </RouterLink>
      </li>
      <li v-else>
        <button type="button" @click="() => logout()" class="flex items-center gap-1">
          <Icon icon="heroicons:arrow-right-end-on-rectangle-16-solid" />
          LOGOUT
        </button>
      </li>
    </ul>
  </nav>
</template>
