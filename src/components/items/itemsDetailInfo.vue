<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useConfirm } from 'primevue/useconfirm';
import { useQueryClient } from '@tanstack/vue-query';
import { postCartItem, setUserHeartStatus, type ItemDetailType } from '@/api/firestore';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

const router = useRouter();

const confirm = useConfirm();

const queryClient = useQueryClient();

const props = defineProps<{
  itemDetail: ItemDetailType;
}>();

const { itemDetail } = toRefs(props);

const quantity = ref(1);
const ratingValue = computed(() => {
  const max = 500;

  return itemDetail.value?.reviewCount ? (itemDetail.value.reviewCount / max) * 5 : 0;
});

async function openConfirmModal() {
  confirm.require({
    group: 'goToPage',
    message: '장바구니에 상품이 담겼습니다.',
    acceptLabel: '장바구니 바로가기',
    accept: () => {
      router.push({ name: 'cart', params: { id: userId.value } });
    },
  });
}

async function addToCart() {
  if (!itemDetail.value) return;
  // TODO: 로그인 후 가능하다는거 Dialog로 보여주기

  const date = new Date();

  const cartItem = {
    ...itemDetail.value,
    quantity: quantity.value,
    createdAt: date,
  };

  await postCartItem(cartItem, userId.value, date);
  await queryClient.refetchQueries({
    queryKey: ['cartItemsList'],
    exact: false,
  });

  openConfirmModal();
}

const isHeart = ref(false);
async function toggleHeart(productId: string) {
  // TODO: itemDetail페이지에서 유저가 좋아요한 제품 상태 보여주기
  if (!userId.value) {
    // TODO: 모달 보여주기
    console.error('로그인 먼저 해주세요 🚨');
    router.push({ name: 'login' });
    return;
  }

  isHeart.value = !isHeart.value;

  await setUserHeartStatus({ userId: userId.value, productId: productId, isHeart: isHeart.value });
}

function increaseQuantity() {
  quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

const lastSalePrice = computed(() => itemDetail.value?.salePrice);
const lastSaleInfo = ref([
  {
    lastSaleQ: '나의 구매 가능가격',
    lastSalePrice: lastSalePrice,
  },
]);
const openIndex = ref<number | null>(null); // 현재 열려 있는 아코디언 인덱스

const toggleAccordion = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index; // 클릭한 인덱스가 열려 있으면 닫고, 닫혀 있으면 엽니다.
};

const isOpen = (index: number) => {
  return openIndex.value === index; // 현재 인덱스가 열려 있는지 확인합니다.
};
</script>

<template>
  <div class="w-full border-t-4 border-black flex-shrink-1">
    <div class="flex flex-col gap-4 border-b-[1px] border-gray-200 mb-6">
      <div class="flex items-center justify-between py-6 text-2xl font-bold">
        <div>{{ itemDetail?.productName }}</div>
        <Button
          type="button"
          text
          :pt="{
            root: {
              class: ['p-0 border-0 hover:bg-white', isHeart ? 'text-orange-500' : 'text-black'],
            },
          }"
          @click.stop="toggleHeart(itemDetail.productId)"
        >
          <template #default>
            <Icon :icon="isHeart ? 'heroicons:heart-solid' : 'heroicons:heart'" class="w-8 h-8" />
          </template>
        </Button>
      </div>

      <div class="flex items-center gap-4 text-sm">
        <Rating
          v-model="ratingValue"
          readonly
          :cancel="false"
          :pt="{
            onIcon: {
              class: 'text-black w-3',
            },
            offIcon: {
              class: 'w-3',
            },
          }"
        />
        <p class="underline cursor-pointer">{{ itemDetail?.reviewCount }}개 리뷰보기</p>
      </div>

      <div>
        <div v-if="itemDetail?.saleRate !== 0">
          <div class="flex items-center font-bold gap-1">
            <span class="text-2xl text-[#ff4801]">{{ itemDetail?.saleRate }}%</span>
            <span class="text-2xl">{{ itemDetail?.salePrice }}</span>
            <span class="text-lg">원</span>
          </div>

          <div class="flex items-center line-through text-gray-400">
            <span class="text-sm">{{ itemDetail?.consumerPrice }} 원</span>
          </div>
        </div>
        <div v-else-if="itemDetail?.saleRate === 0" class="flex items-center font-bold">
          <span class="text-2xl">{{ itemDetail?.consumerPrice }}</span>
          <span class="text-lg">원</span>
        </div>
      </div>

      <div v-for="(info, index) in lastSaleInfo" :key="index" class="border-t">
        <button @click="toggleAccordion(index)" class="flex justify-between items-center w-full py-4">
          <span class="font-semibold text-sm">{{ info.lastSaleQ }}</span>
          <Icon icon="heroicons:chevron-down" :class="isOpen(index) ? 'rotate-180' : ''" />
        </button>

        <div v-if="isOpen(index)" class="p-4 text-gray-700">
          {{ info.lastSalePrice }}
        </div>
      </div>
    </div>

    <div class="text-sm flex flex-col gap-4 border-b-[1px] border-gray-200 mb-9">
      <div class="flex">
        <div class="flex-1">구매 적립금</div>
        <!-- TODO: 최종 결제 금액의 5%로 계산하기 -->
        <div class="flex-1">최대 380 마일리지 적립 예정</div>
      </div>

      <div class="flex">
        <div class="flex-1">무이자 할부</div>
        <div class="flex-1">카드사별 할부 혜택 안내</div>
      </div>

      <div class="flex">
        <div class="flex-1">배송정보</div>
        <div class="flex-1">1일 이내 출고</div>
      </div>

      <div class="flex mb-6">
        <div class="flex-1">배송비</div>
        <div class="flex-1">50,000원 이상 구매시 무료배송 제주/도서산간 1,000원 추가</div>
      </div>
    </div>

    <div className="w-32 font-bold flex items-center justify-between border border-gray-200 mb-7">
      <button
        class="border-r flex items-center justify-center px-3 py-3"
        @click="decreaseQuantity"
        :disabled="quantity <= 1"
      >
        <i class="pi pi-minus" />
      </button>
      <p>{{ quantity }}</p>
      <button class="border-l flex items-center justify-center px-3 py-3" @click="increaseQuantity">
        <i class="pi pi-plus" />
      </button>
    </div>

    <div class="flex items-center gap-2">
      <Button
        @click="() => addToCart()"
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
</template>
