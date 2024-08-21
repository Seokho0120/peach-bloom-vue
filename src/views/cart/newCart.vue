<script setup lang="ts">
import { useGetCartItemsList } from '@/composables/useCartItems';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { watch } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref<User | null>(null);
const userId = ref<string>('');
onAuthStateChanged(getAuth(), (currentUser) => {
  user.value = currentUser;
  userId.value = user.value?.uid || '';
});

const { data: cartItemList, isLoading, isError } = useGetCartItemsList();

watch(cartItemList, () => {
  console.log('cartItemList.value', cartItemList.value?.items);
});
</script>

<template>
  <div class="flex flex-col w-full max-w-[100rem] min-w-[50rem] mx-auto pb-40 px-12">
    <table>
      <thead>
        <tr>
          <th class="border-b">상품정보</th>
          <th class="border-b">수량</th>
          <th class="border-b">주문금액</th>
          <th class="border-b">배송비</th>
          <th class="border-b">액션</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="cartItemList?.items.length === 0">
          <td colspan="5" class="text-2xl font-bold flex justify-center items-center p-12">
            장바구니에 담은 상품이 없습니다.
          </td>
        </tr>

        <tr v-for="item in cartItemList?.items" :key="item.productId">
          <td class="border-b p-4">
            <CartList :product="item" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
