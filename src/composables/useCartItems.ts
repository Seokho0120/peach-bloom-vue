import { computed, watch, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getCartItemList } from '@/api/firestore';
import type { CartItemListType } from '@/types/items.types';

export function useGetCartItemsList(userId: Ref<string>) {
  const enabled = computed(() => userId.value !== '');

  const cartItemListData = useQuery<CartItemListType>({
    enabled: enabled,
    queryKey: ['cartItemsList', userId],
    queryFn: async () => {
      const data = await getCartItemList(userId.value);
      return data;
    },
    initialData: {
      items: [],
    },
  });

  watch(cartItemListData.error, (error) => {
    console.error('cartItemList error:', error?.message);
  });

  return cartItemListData;
}
