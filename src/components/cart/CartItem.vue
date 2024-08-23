<script setup lang="ts">
import { ref } from 'vue';
import type { CartItemType } from '@/types/items.types';
import { computed } from 'vue';
import { watch } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteCartItem } from '@/api/firestore';

const props = defineProps<{
  product: CartItemType;
  userId: string;
}>();

const emit = defineEmits<{
  (e: 'update:totalPrice', price: number): void;
}>();

const quantity = ref<number>(props.product.quantity);

const cartItemPrice = computed(() => {
  const calculatedPrice =
    props.product.saleRate > 0
      ? props.product.salePrice * quantity.value
      : props.product.consumerPrice * quantity.value;

  return calculatedPrice;
});

/**이전값과 현재값을 구해서, 현재값 - 이전값을 부모에 전달해서 더해주기(-값도 더해줌)
 * TODO: 더 간단한 로직 있으면 생각해보기
 */
watch(
  quantity,
  (_, oldQuantity) => {
    if (oldQuantity !== undefined) {
      const previousPrice =
        (props.product.saleRate > 0 ? props.product.salePrice : props.product.consumerPrice) * oldQuantity;
      const currentPrice = cartItemPrice.value;

      const priceDifference = currentPrice - previousPrice;
      emit('update:totalPrice', priceDifference);
    }
  },
  { immediate: true },
);

function deleteItem(productId: string) {
  console.log('삭제', productId);
  deleteCartItemMutation(productId);
}

const queryClient = useQueryClient();
const { mutate: deleteCartItemMutation } = useMutation({
  mutationFn: async (productId: string) => {
    await deleteCartItem({ userId: props.userId, productId });
  },
  onMutate: (productId) => {},
  onSuccess: (_, variables) => {
    const productId = variables;

    queryClient.invalidateQueries({
      queryKey: ['cartItemsList'],
    });
  },
  onError: (error, productId) => {
    console.error('상품 삭제를 실패한 이유:', error);
  },
});

function buyItem() {
  console.log('buyItem');
}

const checked = ref(false);
</script>

<template>
  <tr class="p-6 border-b-[1px]">
    <!-- TODO: 상품 체크해서 금액 계산도 해야됨 -->
    <!-- 상품 체크 -->
    <td class="p-0">
      <div class="flex items-center justify-center">
        <Checkbox v-model="checked" :binary="true" />
      </div>
    </td>

    <!-- 상품정보 -->
    <td class="flex gap-6 border-r-[1px] p-6">
      <div style="width: 8rem">
        <img :src="product.imageUrl[0]" :alt="product.imageUrl[0]" style="object-fit: cover" />
      </div>
      <div>
        <div class="text-sm underline cursor-pointer">{{ product.brandName }}</div>
        <div class="text-lg font-bold mt-2">{{ product.productName }}</div>
        <div class="flex flex-col gap-2 text-sm">
          <div class="">{{ product.consumerPrice }}원</div>
          <div v-if="product.saleRate !== 0" class="text-[#ff4800]">
            <p>[{{ product.saleRate }}%] {{ product.salePrice }}원</p>
          </div>
        </div>
      </div>
      <div class="ml-auto">
        <Button
          @click="() => deleteItem(product.productId)"
          icon="pi pi-times"
          severity="contrast"
          text
          aria-label="Delete"
          :pt="{
            root: {
              class: 'rounded-none',
            },
          }"
        />
      </div>

      <!-- <div v-if="pendingItems[data.productId]">삭제 중...</div> -->
    </td>

    <!-- 수량 -->
    <td class="border-r-[1px] w-10 p-6">
      <InputNumber
        type="number"
        v-model="quantity"
        showButtons
        buttonLayout="horizontal"
        :min="1"
        :max="99"
        :pt="{
          input: {
            root: {
              class: 'w-12 text-center',
            },
          },
        }"
      >
        <template #incrementbuttonicon>
          <span class="pi pi-plus" />
        </template>
        <template #decrementbuttonicon>
          <span class="pi pi-minus" />
        </template>
      </InputNumber>
    </td>

    <!-- 주문금액 -->
    <td class="border-r-[1px] font-bold">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-baseline">
          <p class="text-xl">{{ cartItemPrice.toLocaleString() }}</p>
          <span>원</span>
        </div>

        <Button
          @click="() => buyItem()"
          label="BUY NOW"
          severity="contrast"
          :pt="{
            root: {
              class: 'rounded-none font-bold text-sm',
            },
          }"
        />
      </div>
    </td>

    <!-- 배송비 -->
    <td class="border-b p-4 font-bold">
      <div class="flex flex-col items-center">
        <div v-if="product.consumerPrice < 30000" class="flex items-baseline">
          <p>3,000</p>
          <span class="text-xs">원</span>
        </div>
        <div v-else>무료배송</div>
      </div>
    </td>
  </tr>
</template>
