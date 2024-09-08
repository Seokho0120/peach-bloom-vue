<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth.store';
import { useGetCartItemsList } from '@/composables/useCartItems';
import peachbloom from '../assets/images/peachbloom-logo.png';
import { watch } from 'vue';
import { useCartListStore } from '@/stores/cart.store';
import { ref } from 'vue';
import { computed } from 'vue';
import { onMounted } from 'vue';

const router = useRouter();

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const { data: cartItemList } = useGetCartItemsList(userId);

const cartListStore = useCartListStore();
const test = ref();

// watch(cartListStore, (newItems) => {
//   console.log('newItems', newItems);
//   console.log('cartListStore.cartItemsCount!!', newItems.cartItemsCount);
//   test.value = newItems.cartItemsCount;

//   console.log('test.value', test.value);
//   // console.log('cartListStore.cartItemsCount!!', cartListStore.cartItemsCount);
// });

// watch(cartItemList, () => {
//   console.log('cartItemList.value.length', cartItemList.value.length);
// });

// const ttt = computed(() => (test.value !== 0 ? test.value : cartItemList.value.length));

// 컴포넌트가 마운트될 때 초기 상태 설정
onMounted(() => {
  test.value = cartListStore.cartItemsCount || 0; // 초기 cartItemsCount 설정
});

// cartListStore의 cartItemsCount 변화 감지
watch(
  () => cartListStore.cartItemsCount,
  (newCount) => {
    test.value = newCount || 0; // cartItemsCount가 null이나 undefined일 경우 0으로 처리
  },
);

// cartItemList의 변화 감지
watch(
  () => cartItemList.value,
  () => {
    // cartItemList의 길이가 0일 경우 test.value를 0으로 설정
    if (cartItemList.value.length === 0) {
      test.value = 0; // 모든 아이템이 삭제된 경우 test를 0으로 설정
    } else {
      test.value = cartItemList.value.length; // cartItemList의 길이를 test에 반영
    }
  },
);

// ttt 계산
const ttt = computed(() => {
  return test.value > 0 ? test.value : cartItemList.value.length;
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
            v-if="userId && ttt > 0"
            :value="ttt"
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
