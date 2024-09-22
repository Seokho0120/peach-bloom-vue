import { computed, watch, type Ref } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { getCartItemList } from '@/api/firestore';
import type { CartItemListType } from '@/types/items.types';

export function useGetCartItemsList(userId: Ref<string>) {
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

  watch(cartItemListData.error, (error) => {
    console.error('cartItemList error:', error?.message);
  });

  return {
    data,
    isLoading: cartItemListData.isLoading,
    isError: cartItemListData.isError,
  };
}
