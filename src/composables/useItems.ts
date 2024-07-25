import { getAllItemsList, getMainItemsList } from '@/api/firestore';
import type { ItemsListType } from '@/types/items.types';
import { useQuery } from '@tanstack/vue-query';

export function useGetMainList() {
  const { data, isLoading, isError } = useQuery<ItemsListType[]>({
    queryKey: ['mainItemsList'],
    queryFn: getMainItemsList,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

export function useGetItemsList() {
  const { data, isLoading, isError } = useQuery<ItemsListType[]>({
    queryKey: ['itemsList'],
    queryFn: getAllItemsList,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
