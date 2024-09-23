import { computed, watch, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getLikedProductsList } from '@/api/firestore';
import type { ItemsListType } from '@/types/items.types';

export function useGetLikeItemsList(userId: Ref<string>) {
  const enabled = computed(() => userId.value !== '');

  const likeItemListData = useQuery<ItemsListType[]>({
    enabled: enabled,
    queryKey: ['likeItemsList', userId],
    queryFn: async () => {
      const data = await getLikedProductsList(userId.value);
      return data;
    },
    initialData: []
  });


  watch(likeItemListData.error, (error) => {
    console.error('likeItemsList error:', error?.message);
  });

  return likeItemListData;
}
