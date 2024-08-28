<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useGetCartItemsList } from '@/composables/useCartItems';
import type CartItem from './CartItem.vue';
import { watch } from 'vue';
import { auth } from '@/api/firebasedb';
import { onMounted } from 'vue';

const user = ref<User | null>(null);
const userId = ref<string>('');

// onAuthStateChanged는 유저 상태의 변화가 있을 때 실행되는 메소드
// onAuthStateChanged(getAuth(), (currentUser) => {
//   user.value = currentUser;
//   userId.value = user.value?.uid || '';
// });

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
    } else {
      userId.value = '';
    }

    console.log('userId.value', userId.value);
  });
});

const totalCartPrice = ref<number>(0);
const isFreeShipping = ref<boolean>(false);
const totalPayment = computed(() => totalCartPrice.value + (isFreeShipping.value ? 0 : 3000));

const { data: cartItemList, isLoading, isError } = useGetCartItemsList();

const cartItemRefs = ref<Array<InstanceType<typeof CartItem>>>([]);

async function updateCartTotalPrice() {
  await nextTick();
  let totalPrice = 0;
  cartItemRefs.value.forEach((cartItemRef) => {
    if (cartItemRef.itemChecked) {
      totalPrice += cartItemRef.cartItemPrice;
    }
  });

  totalCartPrice.value = totalPrice;
}

function updateShippingPrice() {
  isFreeShipping.value = cartItemRefs.value.every((cartItemRef) => cartItemRef.isFreeShipping);
}

const allChecked = ref(true);

function onSelectAll(value: boolean) {
  cartItemRefs.value.forEach((cartItemRef) => {
    cartItemRef.itemChecked = value;
  });
}

function updateAllCheckbox() {
  allChecked.value = cartItemRefs.value.every((cartItemRef) => cartItemRef.itemChecked);
}

async function handleCartItemUpdated() {
  updateCartTotalPrice();
  updateShippingPrice();
  updateAllCheckbox();
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
        ref="cartItemRefs"
        :key="item.productId"
        :product="item"
        :user-id="userId"
        :all-checked="allChecked"
        :index="index"
        @updated="() => handleCartItemUpdated()"
      />
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
              <span class="text-3xl font-bold">{{ totalCartPrice.toLocaleString() }}</span>
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
              <span class="text-3xl font-bold">
                <template v-if="!isFreeShipping">3,000</template>
                <template v-else>0</template>
              </span>
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
              <span class="text-3xl font-bold">{{ totalPayment.toLocaleString() }}</span>
              <span class="font-semibold">원</span>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
