import { useQuery } from '@tanstack/vue-query';
import { getCartItemList } from '@/api/firestore';
import type { CartItemListType } from '@/types/items.types';

export function useGetCartItemsList() {
  const { data, isLoading, isError } = useQuery<CartItemListType[]>({
    queryKey: ['cartItemsList'],
    queryFn: async () => {
      return await getCartItemList();
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
