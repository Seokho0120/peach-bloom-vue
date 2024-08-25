<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useGetCartItemsList } from '@/composables/useCartItems';
import type CartItem from './CartItem.vue';
import { computed } from 'vue';
import type { CartItemType } from '@/types/items.types';

const router = useRouter();

const user = ref<User | null>(null);
const userId = ref<string>('');
onAuthStateChanged(getAuth(), (currentUser) => {
  user.value = currentUser;
  userId.value = user.value?.uid || '';
});

const selectedProduct = ref<CartItemType[]>([]);
const totalCartPrice = ref<number>(0);
const totalShippingPrice = ref<number>(0);
const totalPayment = ref<number>(0);

const { data: cartItemList, isLoading, isError } = useGetCartItemsList();

// 초기 총 금액 계산
function calculateInitialPrice() {
  totalCartPrice.value =
    cartItemList.value?.items.reduce((total, item) => {
      const itemPrice = item.saleRate > 0 ? item.salePrice * item.quantity : item.consumerPrice * item.quantity;

      if (itemPrice < 30000) {
        // 하나라도 30000원 이하면 배송비 3000
        totalShippingPrice.value = 3000;
      }

      return total + itemPrice;
    }, 0) || 0;
}

watch(cartItemList, calculateInitialPrice, { immediate: true });

function updateCartTotalPrice(price: number) {
  // console.log('부모에서 받은 price', price);
  totalCartPrice.value += price;
}

function updateShippingPrice(shippingPrice: number) {
  console.log('부모에서 shippingPrice', shippingPrice);
  // totalShippingPrice.value = shippingPrice;
  // console.log('totalShippingPrice.value', totalShippingPrice.value);
}

const allChecked = ref(true);

function onSelectAll(value: boolean) {
  allChecked.value = value;

  if (allChecked.value && cartItemList.value) {
    selectedProduct.value = [...cartItemList.value.items];
  } else {
    selectedProduct.value = [];
  }
}

function handleAllCheckedUpdate(index: number, isChecked: boolean) {
  console.log('index', index);
  console.log('isChecked', isChecked);
}
</script>

<template>
  <table>
    <thead class="border-t-4 border-black">
      <tr class="border-b text-lg font-bold">
        <!-- 상품 체크 -->
        <th class="py-4 px-1">
          <div class="flex items-center justify-center">
            <Checkbox v-model="allChecked" :binary="true" @update:model-value="(val) => onSelectAll(val)" />
          </div>
        </th>
        <th class="py-4 px-6">상품정보</th>
        <th class="py-4 px-6">수량</th>
        <th class="py-4 px-6">주문금액</th>
        <th class="py-4 px-6">배송비</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="cartItemList?.items.length === 0">
        <td colspan="5" class="text-2xl font-bold flex justify-center items-center p-12">
          장바구니에 담은 상품이 없습니다.
        </td>
      </tr>

      <CartItem
        v-for="(item, index) in cartItemList?.items"
        :key="item.productId"
        :product="item"
        :user-id="userId"
        :total-shipping-price="totalShippingPrice"
        :all-checked="allChecked"
        :index="index"
        @update:total-price="updateCartTotalPrice"
        @update:shipping-price="updateShippingPrice"
        @update:all-checked="handleAllCheckedUpdate"
      />

      <!-- FIXME: 이렇게 하면 각 th에 넣을수가 없음 -->
      <!-- <div v-for="item in cartItemList?.items" :key="item.productId">
        <CartItem :product="item" />
      </div> -->
    </tbody>
  </table>

  <table class="border-t-4 border-black mt-24">
    <thead>
      <tr class="border-b text-lg font-bold">
        <th class="py-4 px-6 text-center">총 주문금액</th>
        <th class="py-4 px-6 text-center"></th>
        <th class="py-4 px-6 text-center">총 배송비</th>
        <th class="py-4 px-6 text-center"></th>
        <th class="py-4 px-6 text-center">총 결제금액</th>
      </tr>
    </thead>

    <tbody class="border-b-[1px]">
      <tr>
        <td class="py-8">
          <div class="flex flex-col items-center">
            <div class="flex items-baseline">
              <p class="text-3xl font-bold">{{ totalCartPrice.toLocaleString() }}</p>
              <span class="font-semibold">원</span>
            </div>
          </div>
        </td>

        <td>
          <div class="flex flex-col items-center">
            <Icon icon="heroicons:plus-16-solid" class="text-3xl" />
          </div>
        </td>

        <td class="py-8">
          <div class="flex flex-col items-center">
            <div class="flex items-baseline">
              <!-- TODO: 배송비 0아니면 3000, 0 이면 무료배송 -->
              <p class="text-3xl font-bold">{{ totalShippingPrice.toLocaleString() }}</p>
              <span class="font-semibold">원</span>
            </div>
          </div>
        </td>

        <td>
          <div class="flex flex-col items-center">
            <Icon icon="heroicons:equals-16-solid" class="text-3xl" />
          </div>
        </td>

        <td class="py-8">
          <div class="flex flex-col items-center">
            <div class="flex items-baseline">
              <!-- <p class="text-3xl font-bold">{{ totalCartPrice.toLocaleString() }}</p> -->
              <!-- TODO: 총 결제금액 해야됨 -->
              <!-- <p class="text-3xl font-bold">{{ totalPayment.toLocaleString() }}</p> -->
              <span class="font-semibold">원</span>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
