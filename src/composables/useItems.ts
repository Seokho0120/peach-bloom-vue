import { getAllItemsList, getItemDetail, getItemsList, getMainItemsList } from '@/api/firestore';
import type { ItemsListType } from '@/types/items.types';
import { useQuery } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';

export function useGetMainList() {
  return useQuery<ItemsListType[]>({
    queryKey: ['mainItemsList'],
    queryFn: async () => {
      return await getMainItemsList();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetAllItemsList() {
  return useQuery<ItemsListType[]>({
    queryKey: ['allItemsList'],
    queryFn: async () => {
      return await getAllItemsList();
    },
    staleTime: 5 * 60 * 1000,
  });

}

export function useGetItemsList(category: Ref<string>, filter: Ref<string>) {
  const enabled = computed(() => category.value !== '' && filter.value !== '');

  return useQuery({
    enabled,
    queryKey: ['itemsList', { category: category, filter: filter }],
    queryFn: async () => {
      return await getItemsList(category.value);
    },
  });

}

export function useGetItemDetail(productId: Ref<string>) {
  return useQuery({
    queryKey: ['itemsDetail', productId],
    queryFn: async () => {
      const result = await getItemDetail(productId.value);
      return result;
    },
  });
}
