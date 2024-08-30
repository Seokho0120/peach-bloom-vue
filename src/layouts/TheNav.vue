<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { Icon } from '@iconify/vue';
import peachbloom from '../assets/images/peachbloom-logo.png';
import { auth } from '@/api/firebasedb';
import { watch } from 'vue';

const userId = ref<string>('');
const userValue = ref<User | null>(null);
const router = useRouter();
const isLogin = ref<boolean>(false);

onMounted(() => {
  // const auth = getAuth();

  // onAuthStateChanged는 유저 상태의 변화가 있을 때 실행되는 메서드
  onAuthStateChanged(auth, (user) => {
    // 로그인, 로그아웃 상태를 boolean으로 관리해보기
    if (user) {
      // 로그인 된 상태일 경우
      userId.value = user.uid;
      // userValue.value = user;
      console.log('로그인 상태:', userId.value); // 로그인 시 userId 출력
      isLogin.value = true;
    } else {
      // 로그아웃 된 상태일 경우
      userId.value = '';
      // userValue.value = null;
      console.log('로그아웃 상태:', userId.value); // 로그아웃 시 userId 출력
      isLogin.value = false;
    }
  });
});

watch(userId, (newVal) => {
  console.log('nav에서 userId', newVal);
});

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
  // {
  //   label: 'SHOPPING BAG',
  //   name: 'newCart',
  //   // name: 'cart',
  //   icon: 'heroicons:shopping-cart-solid',
  // },
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
    userValue.value = null;

    router.push({ name: 'home' });
  } catch (err) {
    alert(err);
  }
};

// onMounted(() => {
//   const auth = getAuth();
//   onAuthStateChanged(auth, (currentUser) => {
//     user.value = currentUser;
//   });
// });
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
      <li v-if="userId">
        <RouterLink :to="{ name: 'newCart', params: { id: userId } }">
          <div class="flex items-center gap-1">
            <Icon icon="heroicons:shopping-cart-solid" />
            <span>SHOPPING BAG</span>
          </div>
        </RouterLink>
      </li>
      <li v-else>
        <RouterLink :to="{ name: 'login' }">
          <div class="flex items-center gap-1">
            <Icon icon="heroicons:shopping-cart-solid" />
            <span>SHOPPING BAG</span>
          </div>
        </RouterLink>
      </li>

      <li v-if="!isLogin">
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

    <!-- 예전꺼 -->
    <!-- <ul class="flex items-center gap-4 text-sm">
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
      <li v-if="!userValue">
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
    </ul> -->
  </nav>
</template>
