<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGetCartItemsList } from '@/composables/useCartItems';
import { useAuthStore } from '@/stores/auth.store';
import { useCartListStore } from '@/stores/cart.store';
import type CartItem from './CartItem.vue';
import CartItemSkeleton from '@/components/cart/CartItemSkeleton.vue';

// const cartListStore = useCartListStore();

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

const totalCartPrice = ref<number>(0);
const isFreeShipping = ref<boolean>(false);
const totalPayment = computed(() => totalCartPrice.value + (isFreeShipping.value ? 0 : 3000));

const { data, isError, isLoading, } = useGetCartItemsList(userId);
const cartItemList = computed(() => data.value.items);

// watch(
//   () => cartItemList.value,
//   (newItems) => {
//     console.log('newItems', newItems);
//     // cartListStore.cartItems = newItems;
//     cartListStore.cartItemsCount = newItems.length;
//   },
// );

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

/**
 * FIXME: isLoading을 이용해서 CartItem의 요소마다 스켈레톤을 적용해보고 싶은데
 * 1. isLoading이 끝난 후 CartItemList가 들어옴
 * 2. CartItem의 요소의 크기마다 전부 스켈레톤 사이즈를 적용해야하나..?
 */
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

    <!-- <tbody v-if="isLoading">
      <tr>
        <td colspan="5" class="text-center h-52 text-3xl">
          <ProgressSpinner style="width: 70px; height: 70px" strokeWidth="5" animationDuration=".5s" />
        </td>
      </tr>
    </tbody> -->

    <tbody v-if="isError">
      <tr>
        <td colspan="5" class="text-center h-52 text-3xl">오류가 발생했습니다.</td>
      </tr>
    </tbody>

    <tbody v-if="cartItemList?.length === 0 && isLoading === false" class="border-b-[1px]">
      <tr>
        <td colspan="5" class="text-center h-52 text-3xl">장바구니에 담은 상품이 없습니다.</td>
      </tr>
    </tbody>

    <tbody v-else>
      <template v-if="isLoading">
        <CartItemSkeleton />
      </template>
      <template v-else>
        <CartItem
          v-for="item in cartItemList"
          ref="cartItemRefs"
          :key="item.productId"
          :product="item"
          :user-id="userId"
          @updated="() => handleCartItemUpdated()"
        />
      </template>
    </tbody>
  </table>

  <table v-if="cartItemList?.length !== 0" class="border-t-4 border-black mt-24">
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
