// stores/cartListStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { CartItemListType } from '@/types/items.types';

export const useCartListStore = defineStore('cartList', () => {
  const cartItems = ref<CartItemListType[]>([]);

  return { cartItems };
});
