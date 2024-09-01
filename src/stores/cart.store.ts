// stores/cartListStore.js
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { CartItemListType, CartItemType } from '@/types/items.types';

export const useCartListStore = defineStore('cartList', () => {
  const cartItems = ref<CartItemType[]>([]);
  // const cartItems = ref<CartItemListType[]>([]);
  const cartItemsCount = computed(() => cartItems.value.length);

  return { cartItems, cartItemsCount };
});
