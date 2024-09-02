import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { CartItemType } from '@/types/items.types';

export const useCartListStore = defineStore('cartList', () => {
  const cartItems = ref<CartItemType[]>([]);
  const cartItemsCount = computed(() => cartItems.value.length);

  return { cartItems, cartItemsCount };
});
