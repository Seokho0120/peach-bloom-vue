import { getBrandList, getCategoryList } from '@/api/firestore';
import { useQuery } from '@tanstack/vue-query';

export function useGetCategoryList(option: { includeAsterisk: boolean }) {
  const {
    data: categoryList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categoryList', option.includeAsterisk],
    queryFn: async () => {
      const data = await getCategoryList();
      return option.includeAsterisk ? [{ id: 'all', name: 'ALL' }, ...data] : data;
    },
    staleTime: 5 * 60 * 100,
    initialDataUpdatedAt: Date.now() / 1000,
  });

  return {
    categoryList,
    isLoading,
    isError,
  };
}

export function useGetBrandList(option: { includeAsterisk: boolean }) {
  const {
    data: brandList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['brandList', option.includeAsterisk],
    queryFn: async () => {
      const data = await getBrandList();
      return option.includeAsterisk ? [{ id: 'all', name: 'ALL' }, ...data] : data;
    },
    staleTime: 5 * 60 * 100,
    initialDataUpdatedAt: Date.now() / 1000,
  });

  return {
    brandList,
    isLoading,
    isError,
  };
}
