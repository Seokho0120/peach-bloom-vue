<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth.store';
import { useGetCartItemsList } from '@/composables/useCartItems';
import { useCartListStore } from '@/stores/cart.store';
import peachbloom from '../assets/images/peachbloom-logo.png';
import { computed } from 'vue';

const router = useRouter();

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
// TODO: 삭제는 잘되는데, 업데이트가 안되고 있음
const { data } = useGetCartItemsList(userId);
const cartItemList = computed(() => data.value.items);

// const cartListStore = useCartListStore();
const cartItemCount = ref(0);

// watch(
//   () => cartListStore.cartItemsCount,
//   (newCount) => {
//     cartItemCount.value = newCount || 0;
//   },
// );

// cartItemList의 변화 감지
watch(
  () => cartItemList.value,
  (newVal) => {
    // // cartItemList의 길이가 0일 경우 cartItemCount 0으로 설정
    // if (cartItemList.value.length === 0) {
    //   cartItemCount.value = 0; // 카트 전부 삭제되면 cartItemCount를 0으로
    // } else {
    //   cartItemCount.value = cartItemList.value.length;
    // }

    cartItemCount.value = newVal.length;
    // cartListStore.cartItemsCount = cartItemList.value.length;
  },
);

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
  cartItemCount.value = 0;

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
  <nav class="p-12">
    <div class="flex justify-between">
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

        <li>
          <RouterLink :to="{ name: 'cart' }" class="relative">
            <div class="flex items-center gap-1">
              <Icon icon="heroicons:shopping-cart-solid" />
              <span>SHOPPING BAG</span>
              <Badge
                v-if="userId && cartItemCount > 0"
                :value="cartItemCount"
                severity="danger"
                :pt="{
                  root: {
                    class: 'absolute bg-[#ff4800] right-[-10px] top-[-12px]',
                  },
                }"
              />
            </div>
          </RouterLink>
        </li>

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
    </div>

    <!-- mega menu -->
    <MegaMenu />
  </nav>
</template>
