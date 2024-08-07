import { getAllItemsList, getItemDetail, getItemsList, getMainItemsList } from '@/api/firestore';
import type { ItemsListType } from '@/types/items.types';
import { useQuery } from '@tanstack/vue-query';
import { computed, type ComputedRef, type Ref } from 'vue';

export function useGetMainList() {
  const { data, isLoading, isError } = useQuery<ItemsListType[]>({
    queryKey: ['mainItemsList'],
    queryFn: async () => {
      return await getMainItemsList();
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

export function useGetAllItemsList() {
  const { data, isLoading, isError } = useQuery<ItemsListType[]>({
    queryKey: ['allItemsList'],
    queryFn: async () => {
      return await getAllItemsList();
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

export function useGetItemsList(category: Ref<string>, filter: Ref<string>) {
  const enabled = computed(() => category.value !== '' && filter.value !== '');

  const { data, isLoading, isError } = useQuery({
    enabled,
    queryKey: ['itemsList', { category: category, filter: filter }],
    queryFn: async () => {
      return await getItemsList(category.value);
    },
  });

  return { data, isLoading, isError };
}

export function useGetItemDetail(productId: Ref<string>) {
  const { data } = useQuery({
    queryKey: ['itemsDetail', productId],
    queryFn: () => getItemDetail(productId.value),
  });

  return { data };
}
