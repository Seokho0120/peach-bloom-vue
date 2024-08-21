<script setup lang="ts">
import type { CartItemType } from '@/types/items.types';
import { watch } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
  product: CartItemType;
  // deleteItem: () => void;
}>();

const quantity = ref(props.product.quantity);

const calculateTotalPrice = () => {
  return props.product.isSale ? props.product.salePrice * quantity.value : props.product.consumerPrice * quantity.value;
};

const updateQuantity = () => {
  // 수량 변경 시 추가 로직이 필요할 경우 여기에 추가
  // props.product.quantity = quantity.value;
};

watch(
  () => props.product.quantity,
  (newQuantity) => {
    quantity.value = newQuantity;
  },
);
</script>

<template>
  <div class="flex gap-6">
    <div style="width: 8rem">
      <img :src="product.imageUrl[0]" :alt="product.imageUrl[0]" style="object-fit: cover" />
    </div>
    <div>
      <div class="text-sm underline cursor-pointer">{{ product.brandName }}</div>
      <div class="text-lg font-bold mt-2">{{ product.productName }}</div>
      <div class="flex flex-col gap-2 text-sm">
        <div class="">{{ product.consumerPrice }}원</div>
        <div class="text-[#ff4800]">
          <p>[{{ product.saleRate }}%] {{ product.salePrice }}원</p>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <InputNumber
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

      <p class="text-xl">{{ calculateTotalPrice().toLocaleString() }} 원</p>
      <div v-if="product.consumerPrice < 30000">3,000 원</div>
      <div v-else>무료배송</div>
      <Button icon="pi pi-times" severity="contrast" text aria-label="Delete" />
      <!-- <Button @click="deleteItem" icon="pi pi-times" severity="contrast" text aria-label="Delete" /> -->
    </div>
  </div>
</template>
