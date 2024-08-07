import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ItemsListType } from '@/types/items.types';

export const useItemsListStore = defineStore('itemsList', () => {
  const sortingItemList = ref<ItemsListType[]>([]);

  return { sortingItemList };
});
