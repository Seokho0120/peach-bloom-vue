import { getAllItemsList, getItemDetail, getItemsList, getMainItemsList } from '@/api/firestore';
import type { ItemsListType } from '@/types/items.types';
import { useQuery } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';

export function useSetLike() {
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
