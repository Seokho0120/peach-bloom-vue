import { computed, watch, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getLikedProductsList } from '@/api/firestore';
import type { ItemsListType } from '@/types/items.types';

export function useGetLikeItemsList(userId: Ref<string>) {
  const enabled = computed(() => userId.value !== '');

  const likeItemListData = useQuery<ItemsListType[]>({
    enabled: enabled,
    queryKey: ['likeItemsList', userId.value],
    queryFn: async () => {
      const data = await getLikedProductsList(userId.value);
      return data;
    },
  });

  const data = computed(() => likeItemListData.data.value || []);

  watch(likeItemListData.error, (error) => {
    console.error('likeItemsList error:', error?.message);
  });

  return {
    data,
    isLoading: likeItemListData.isLoading,
    isError: likeItemListData.isError,
  };
}
