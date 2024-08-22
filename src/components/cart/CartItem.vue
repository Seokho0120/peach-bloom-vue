<script setup lang="ts">
import { ref } from 'vue';
import type { CartItemType } from '@/types/items.types';
import { computed } from 'vue';
import { watch } from 'vue';

const props = defineProps<{
  product: CartItemType;
}>();

const emit = defineEmits<{
  (e: 'update:totalPrice', price: number): void;
}>();

// const quantity = ref<number>(1);
const quantity = ref<number>(props.product.quantity);

const totalPrice = computed(() => {
  const calculatedPrice =
    props.product.saleRate > 0
      ? props.product.salePrice * quantity.value
      : props.product.consumerPrice * quantity.value;

  return calculatedPrice;
});

const emitTotalPrice = () => {
  console.log('totalPrice.value', totalPrice.value);
  emit('update:totalPrice', totalPrice.value);
};

watch(quantity, emitTotalPrice, { immediate: true });

const handleDelete = (productId: string) => {
  console.log('삭제');
};
</script>

<template>
  <tr>
    <td class="flex gap-6">
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
        <div class="ml-auto">
          <Button
            @click="() => handleDelete(product.productId)"
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
      </div>
    </td>

    <td>
      <!-- @update:model-value="emitTotalPrice" -->
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

    <td class="border-b p-4 text-xl">{{ totalPrice.toLocaleString() }}원</td>

    <td class="border-b p-4">
      <div v-if="product.consumerPrice < 30000">3,000원</div>
      <div v-else>무료배송</div>
    </td>

    <!-- <td class="border-b p-4">
      <Button @click="() => handleDelete(product.productId)" icon="pi pi-times" severity="contrast" text />
    </td> -->
  </tr>
</template>
