// stores/cartListStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { CartItemListType } from '@/types/items.types';

export const useCartListStore = defineStore('cartList', () => {
  const cartItems = ref<CartItemListType[]>([]);

  console.log('pinia cartItems.value --->', cartItems.value);

  return { cartItems };
});

// export const useCartListStore = defineStore('cartList', () => {
//   const cartItems = ref<ItemDetailType[]>([]);

//   const addItem = (item: ItemDetailType) => {
//     console.log('item???', item);

//     const existingItem = cartItems.value.find((cartItem) => cartItem.productId === item.productId);
//     if (existingItem) {
//       existingItem.quantity += item.quantity; // 수량 증가
//     } else {
//       cartItems.value.push(item); // 새 아이템 추가
//     }
//   };

//   const clearCart = () => {
//     cartItems.value = []; // 장바구니 초기화
//   };

//   const itemCount = computed(() => {
//     return cartItems.value.reduce((total, item) => total + item.quantity, 0);
//   });

//   const totalPrice = computed(() => {
//     return cartItems.value.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
//   });

//   console.log('cartItems.value', cartItems.value);

//   return { cartItems, addItem, clearCart, itemCount, totalPrice };
// });
