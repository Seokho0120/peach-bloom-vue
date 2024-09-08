import { computed, watch, type Ref } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { getCartItemList, subscribeToCartItems } from '@/api/firestore';
import type { CartItemListType } from '@/types/items.types';

export function useGetCartItemsList(userId: Ref<string>) {
  const queryClient = useQueryClient();
  const enabled = computed(() => userId.value !== '');

  const cartItemListData = useQuery<CartItemListType>({
    enabled: enabled,
    queryKey: ['cartItemsList', userId.value],
    queryFn: async () => {
      const data = await getCartItemList(userId.value);
      return data;
    },
  });

  const data = computed(() => cartItemListData.data.value?.items || []);

  // error 처리
  watch(cartItemListData.error, (error) => {
    // FIXME: 간헐적으로 undefined 뜨는데 왜?
    console.error('cartItemList error:', error?.message);
  });

  // watch(userId, () => {
  //   const unsubscribe = subscribeToCartItems(userId.value, () => {
  //     queryClient.invalidateQueries({ queryKey: ['cartItemsList', userId.value] });
  //   });

  //   return () => unsubscribe();
  // });

  return {
    data: data,
    isLoading: cartItemListData.isLoading,
    isError: cartItemListData.isError,
  };
}
