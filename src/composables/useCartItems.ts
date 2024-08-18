import { useQuery } from '@tanstack/vue-query';
import { getCartItemList } from '@/api/firestore';
import type { CartItemListType } from '@/types/items.types';
import { watch } from 'vue';

export function useGetCartItemsList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cartItemsList'],
    queryFn: async () => {
      const test = await getCartItemList();
      console.log('test', test);
      return test;

      // return await getCartItemList();
    },
  });

  watch(data, () => {
    console.log('카트 리스트 데이터', data.value);
  });

  return {
    data,
    isLoading,
    isError,
  };
}
