<script setup lang="ts">
import { useGetItemDetail } from '@/composables/useItems';
import { useItemsListStore } from '@/stores/itemsList.store';
import type { ItemDetailType } from '@/types/items.types';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const router = useRoute();
const productId = computed(() => router.params.id.toString());
const itemStore = useItemsListStore();

const { data } = useGetItemDetail(productId);
const sortingItemList = computed(() => itemStore.sortingItemList);

const itemDetail = ref<ItemDetailType | undefined>(undefined);

watch(
  data,
  () => {
    const foundItems = sortingItemList.value.filter((item) => item.productId === data.value?.productId);

    if (foundItems.length > 0) {
      const mergedItem = {
        ...foundItems[0],
        howToUse: data.value?.howToUse || '',
        ingredients: data.value?.ingredients || '',
      };
      itemDetail.value = mergedItem;
    }

    console.log('itemDetail.value???', itemDetail.value);
  },
  { immediate: true },
);

const isHeart = ref(false);
const toggleHeart = () => {
  isHeart.value = !isHeart.value;
};

const ratingValue = computed(() => {
  const max = 500;

  return itemDetail.value?.reviewCount ? (itemDetail.value.reviewCount / max) * 5 : 0;
});

const number = ref(0);

const quantity = ref(1); // 초기 수량

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
</script>

<template>
  <div class="w-full max-w-[1300px] min-w-[900px] mx-auto flex px-12 gap-10">
    <div class="flex-shrink-0">
      <Image :src="itemDetail?.imageUrl[0]" alt="Detail Image" width="564" class="w-full h-auto object-cover" />
    </div>

    <div class="w-full border-t-4 border-black">
      <div class="flex items-center justify-between py-6 text-2xl font-bold">
        <div>{{ itemDetail?.productName }}</div>
        <Button
          type="button"
          text
          :pt="{
            root: {
              class: ['w-fit p-0 border-0 hover:bg-white', isHeart ? 'text-orange-500' : 'text-black'],
            },
          }"
          @click.stop="toggleHeart"
        >
          <template #default>
            <Icon :icon="isHeart ? 'heroicons:heart-solid' : 'heroicons:heart'" class="w-8 h-8" />
          </template>
        </Button>
      </div>

      <div class="flex items-center gap-4">
        <Rating v-model="ratingValue" readonly :cancel="false" />
        <p class="underline cursor-pointer">{{ itemDetail?.reviewCount }}</p>
      </div>

      <div class="flex items-center font-bold gap-1">
        <p class="text-2xl text-[#ff4801]">{{ itemDetail?.saleRate }}%</p>
        <p class="text-2xl">{{ itemDetail?.consumerPrice }}</p>
        <p class="text-lg">원</p>
      </div>

      <!-- TODO: 세일 아닐떄 보여주기 -->
      <!-- <div class="flex items-center font-bold">
        <p class="text-2xl">{{ itemDetail?.consumerPrice }}</p>
        <p class="text-lg">원</p>
      </div> -->

      <div class="flex items-center gap-2">
        <p>구매 적립금</p>
        <!-- TODO: 구매급액의 3% ~ 5%로 측정하기 -->
        <p class="text-red-400">최대 380 마일리지 적립 예정</p>
      </div>

      <div class="flex items-center gap-2">
        <p>무이자 할부</p>
        <p class="text-red-400">카드사별 할부 혜택 안내</p>
      </div>

      <div class="flex items-center gap-2">
        <p>배송정보</p>
        <p class="text-red-400">1일 이내 출고</p>
      </div>

      <div class="flex items-center gap-2">
        <p>배송비</p>
        <p>50,000원 이상 구매시 무료배송 제주/도서산간 1,000원 추가</p>
      </div>

      <div className="w-36 font-bold flex items-center justify-between border border-gray-200 gap-3 lg:gap-4">
        <!-- <button
          class="border-r flex items-center justify-center px-4 py-4"
          @click="decreaseQuantity"
          :disabled="quantity <= 1"
        >
          -
        </button> -->
        <button
          class="border-r flex items-center justify-center px-4 py-4"
          @click="decreaseQuantity"
          :disabled="quantity <= 1"
        >
          <i class="pi pi-minus"></i>
        </button>
        <div>{{ quantity }}</div>
        <!-- <button class="border-l flex items-center justify-center px-4 py-4" @click="increaseQuantity">+</button> -->

        <button class="border-l flex items-center justify-center px-4 py-4" @click="increaseQuantity">
          <i class="pi pi-plus"></i>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <Button
          label="장바구니 담기"
          text
          :pt="{
            root: {
              class: 'border-[1px] border-black text-black rounded-none text-sm w-full py-3 text-sm',
            },
          }"
        />
        <Button
          label="바로 구매하기"
          severity="contrast"
          :pt="{
            root: {
              class: 'border-[1px] border-black rounded-none w-full py-3 text-sm',
            },
          }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.quantity-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.quantity-display {
  margin: 0 15px;
  font-size: 1.5em;
  font-weight: bold;
}
</style>
