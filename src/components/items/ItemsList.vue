<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGetItemsList } from '@/composables/useItems';

const route = useRoute();
const router = useRouter();

const categoryQuery = computed(() => route.params.id.toString());
const sortByQuery = computed(() => route.query.sortBy?.toString() ?? 'recommend');

const sortByList = [
  { name: '추천순', id: 'recommend' },
  { name: '신상품순', id: 'new' },
  { name: '리뷰많은순', id: 'review' },
  { name: '낮은가격순', id: 'lowPrice' },
  { name: '높은가격순', id: 'highPrice' },
  { name: '높은할인순', id: 'discount' },
  { name: '좋아요많은순', id: 'like' },
];

const selectedSortBy = ref(sortByList[0].id);
watch(selectedSortBy, () => {
  router.replace({
    query: {
      ...route.query,
      sortBy: selectedSortBy.value,
    },
  });
});

watch(
  sortByQuery,
  () => {
    selectedSortBy.value = sortByQuery.value;
  },
  { immediate: true },
);

const { data: itemList, isLoading, isError } = useGetItemsList(categoryQuery, selectedSortBy);

const sortingItemList = computed(() => {
  if (!itemList.value) return [];

  if (selectedSortBy.value === 'new') {
    return [...itemList.value].sort((a, b) => {
      const AIsNew = a.isNew ? 1 : 0;
      const BIsNew = b.isNew ? 1 : 0;

      if (AIsNew !== BIsNew) {
        return BIsNew - AIsNew;
      }

      return b.reviewCount - a.reviewCount;
    });
  } else if (selectedSortBy.value === 'recommend') {
    // isNew && isSale === true 아이템을 우선순위로 하면서 항상 reviewCount가 많은 순서
    return [...itemList.value].sort((a, b) => {
      const APriority = a.isNew && a.isSale ? 1 : 0;
      const BPriority = b.isNew && b.isSale ? 1 : 0;

      if (APriority === BPriority) {
        return b.reviewCount - a.reviewCount;
      }

      return b.reviewCount - a.reviewCount;
    });
  }

  return [...itemList.value].sort((a, b) => {
    const APrice = a.salePrice > 0 ? a.salePrice : a.consumerPrice;
    const BPrice = b.salePrice > 0 ? b.salePrice : b.consumerPrice;

    switch (selectedSortBy.value) {
      case 'review':
        return b.reviewCount - a.reviewCount;
      case 'lowPrice':
        return APrice - BPrice;
      case 'highPrice':
        return BPrice - APrice;
      case 'discount':
        return b.saleRate - a.saleRate;
      case 'like':
        return b.heartCount - a.heartCount;
      default:
        return 0;
    }
  });
});

watch(sortingItemList, () => {
  console.log('sortingItemList.value', sortingItemList.value);
});
</script>

<template>
  <div class="container-query">
    <div>
      <Dropdown
        v-model="selectedSortBy"
        :options="sortByList"
        optionLabel="name"
        option-value="id"
        :loading="isLoading"
      />
      <!-- @change="(e) => test(e)" -->
    </div>

    <div v-if="!isError" class="grid grid-cols-6 gap-y-16 gap-x-5 mt-10 w-full">
      <ItemsListCard
        v-for="item in sortingItemList"
        :key="item.productId"
        :brandName="item.brandName"
        :imageUrl="item.imageUrl"
        :productName="item.productName"
        :salePrice="item.salePrice"
        :saleRate="item.saleRate"
        :review-count="item.reviewCount"
        :heart-count="item.heartCount"
      />
    </div>
    <div v-else>데이터를 불러오는 과정에서 오류가 발생했습니다.</div>
  </div>
</template>

<style scoped lang="scss">
.container-query {
  width: 100%;
  container-type: inline-size;
}

@container (min-width: 100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 500px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@container (min-width: 1020px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@container (min-width: 1260px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@container (min-width: 1535px) {
  .grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
