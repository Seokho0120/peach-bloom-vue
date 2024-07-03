<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { Icon } from '@iconify/vue';
import peachbloom from '../assets/images/peachbloom-logo.png';

const user = ref<User | null>(null);
const router = useRouter();

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
];

const logout = async () => {
  console.log('로그아웃');
  try {
    const auth = getAuth();
    await signOut(auth);
    user.value = null;

    router.push({ name: 'home' });
  } catch (err) {
    alert(err);
  }
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});
</script>

<template>
  <nav class="flex justify-between">
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
      <li v-if="!user">
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
