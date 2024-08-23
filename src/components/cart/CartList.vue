<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useGetCartItemsList } from '@/composables/useCartItems';
import type CartItem from './CartItem.vue';

const router = useRouter();

const user = ref<User | null>(null);
const userId = ref<string>('');
onAuthStateChanged(getAuth(), (currentUser) => {
  user.value = currentUser;
  userId.value = user.value?.uid || '';
});

const totalCartPrice = ref<number>(0);
const { data: cartItemList, isLoading, isError } = useGetCartItemsList();

// 초기 총 금액 계산
const calculateTotalCartPrice = () => {
  totalCartPrice.value =
    cartItemList.value?.items.reduce((total, item) => {
      const itemPrice = item.saleRate > 0 ? item.salePrice * item.quantity : item.consumerPrice * item.quantity;
      return total + itemPrice;
    }, 0) || 0;
};

watch(cartItemList, calculateTotalCartPrice, { immediate: true });

const updateCartTotalPrice = (price: number) => {
  console.log('부모에서 받은 price', price);
  totalCartPrice.value += price;
};
</script>

<template>
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

      <CartItem
        v-for="item in cartItemList?.items"
        :key="item.productId"
        :product="item"
        @update:total-price="updateCartTotalPrice"
      />

      <!-- TODO: 이렇게 하면 각 th에 넣을수가 없음 -->
      <!-- <div v-for="item in cartItemList?.items" :key="item.productId">
        <CartItem :product="item" />
      </div> -->
    </tbody>
  </table>

  <div>
    <div>총 금액: {{ totalCartPrice.toLocaleString() }} 원</div>
  </div>
</template>
