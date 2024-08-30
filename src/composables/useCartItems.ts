import { useQuery } from '@tanstack/vue-query';
import { getCartItemList } from '@/api/firestore';
import type { CartItemListType } from '@/types/items.types';
import { computed, watch, type Ref } from 'vue';

export function useGetCartItemsList(userId: Ref<string>) {
  const enabled = computed(() => userId.value === '');
  console.log('userId.value ----->', userId.value);

  const cartItemListData = useQuery<CartItemListType>({
    enabled: enabled,
    queryKey: ['cartItemsList', userId.value],
    queryFn: async () => {
      const data = await getCartItemList(userId.value);
      return data;
    },
    // staleTime: 5 * 60 * 1000,
  });

  const data = computed(() => cartItemListData.data.value?.items || []);

  // error 처리
  watch(cartItemListData.error, (error) => {
    console.error('cartItemList error:', error?.message); // FIXME: 간헐적으로 undefined 뜨는데 왜?
  });

  return {
    data: data,
    isLoading: cartItemListData.isLoading,
    isError: cartItemListData.isError,
  };
}
