<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGetItemDetail } from '@/composables/useItems';
import { useConfirm } from 'primevue/useconfirm';
import { postCartItem, setUserHeartStatus } from '@/api/firestore';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import { useQueryClient } from '@tanstack/vue-query';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

const queryClient = useQueryClient();

const confirm = useConfirm();

const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id.toString());

const { data: itemDetail, isLoading } = useGetItemDetail(productId);

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

const ratingValue = computed(() => {
  const max = 500;

  return itemDetail.value?.reviewCount ? (itemDetail.value.reviewCount / max) * 5 : 0;
});

const quantity = ref(1);
function increaseQuantity() {
  quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

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

const currentIndex = ref(0);

const nextHandler = () => {
  currentIndex.value = (currentIndex.value + 1) % itemDetail.value!.imageUrl.length;
};

const prevHandler = () => {
  currentIndex.value = (currentIndex.value - 1 + itemDetail.value!.imageUrl.length) % itemDetail.value!.imageUrl.length;
};

const isDragging = ref(false);
const startX = ref(0);
const dragDistance = ref(0);
const carousel = ref<HTMLElement | null>(null);

const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  startX.value = event.clientX;
  dragDistance.value = 0;

  if (carousel.value) {
    carousel.value.style.transition = 'none'; // 애니메이션 중지
  }
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return;

  dragDistance.value = event.clientX - startX.value;
  const newTranslateX = currentIndex.value * -100 + (dragDistance.value / window.innerWidth) * 100;

  if (carousel.value) {
    carousel.value.style.transform = `translateX(${newTranslateX}%)`;
  }
};

const endDrag = () => {
  isDragging.value = false;
  const distance = dragDistance.value;

  if (distance > 100 && currentIndex.value > 0) {
    prevHandler(); // 왼쪽으로 드래그 시 이전 이미지로
  } else if (distance < -100 && currentIndex.value < itemDetail.value!.imageUrl.length - 1) {
    nextHandler(); // 오른쪽으로 드래그 시 다음 이미지로
  }

  if (carousel.value) {
    carousel.value.style.transition = ''; // 애니메이션 재개
  }
};

const lastSalePrice = computed(() => itemDetail.value?.salePrice);
const lastSaleInfo = ref([
  {
    lastSaleQ: '나의 구매 가능가격',
    lastSalePrice: lastSalePrice,
  },
]);
const openIndex = ref<number | null>(null); // 현재 열려 있는 아코디언 인덱스

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index; // 클릭한 인덱스가 열려 있으면 닫고, 닫혀 있으면 엽니다.
};

const isOpen = (index: number) => {
  return openIndex.value === index; // 현재 인덱스가 열려 있는지 확인합니다.
};
</script>

<template>
  <div v-if="isLoading">Loading..</div>
  <template v-else>
    <div v-if="itemDetail" class="w-full max-w-[81.25rem] min-w-[56.25rem] mx-auto flex px-12 py-5 gap-10">
      <!-- 기존꺼
      <div class="flex-shrink-0">
        <Image :src="itemDetail?.imageUrl[0]" alt="Detail Image" width="564" class="w-full h-auto object-cover" />
      </div> -->

      <!-- 새로 만든거 1 -->
      <!-- <div class="w-full relative">
        <img :src="itemDetail.imageUrl[currentIndex]" alt="Detail Image" class="w-full" />
        <button
          v-if="itemDetail.imageUrl.length > 1"
          @click="prevHandler"
          :class="`absolute shadow-md left-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60`"
        >
          <i class="pi pi-angle-left text-gray-800" />
        </button>

        <button
          v-if="itemDetail.imageUrl.length > 1"
          @click="nextHandler"
          class="absolute shadow-md right-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60"
        >
          <i class="pi pi-angle-right text-gray-800" />
        </button>

        <ul v-if="itemDetail.imageUrl.length > 1" class="absolute bottom-4 flex w-full justify-center gap-1">
          <li
            v-for="(_, idx) in itemDetail?.imageUrl"
            :key="idx"
            :class="`h-[0.5rem] w-[0.5rem] rounded-full bg-white ${idx === currentIndex ? 'opacity-100' : 'opacity-40'}`"
          />
        </ul>
      </div> -->

      <!-- 캐러셀 -->
      <div
        class="overflow-hidden relative flex-shrink-0 h-full"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
      >
        <div
          ref="carousel"
          class="flex transition-transform duration-500 w-[564px]"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div v-for="(image, index) in itemDetail.imageUrl" :key="index" class="flex-shrink-0 w-full">
            <img :src="image" class="w-full object-contain" draggable="false" :alt="image" />
          </div>
        </div>

        <button
          v-if="itemDetail.imageUrl.length > 1"
          @click="prevHandler"
          :class="`absolute shadow-md left-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60`"
        >
          <i class="pi pi-angle-left text-gray-800" />
        </button>

        <button
          v-if="itemDetail.imageUrl.length > 1"
          @click="nextHandler"
          class="absolute shadow-md right-4 top-1/2 h-[1.8rem] w-[1.8rem] flex items-center justify-center rounded-full bg-white opacity-40 hover:opacity-60"
        >
          <i class="pi pi-angle-right text-gray-800" />
        </button>

        <ul v-if="itemDetail.imageUrl.length > 1" class="absolute bottom-4 flex w-full justify-center gap-1">
          <li
            v-for="(_, idx) in itemDetail?.imageUrl"
            :key="idx"
            :class="`h-[0.5rem] w-[0.5rem] rounded-full bg-white ${idx === currentIndex ? 'opacity-100' : 'opacity-40'}`"
          />
        </ul>
      </div>

      <!-- 상세내용, 아코디언 -->
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
            <button @click="toggle(index)" class="flex justify-between items-center w-full py-4">
              <span class="font-semibold text-sm">{{ info.lastSaleQ }}</span>
              <Icon
                icon="heroicons:chevron-down"
                :class="isOpen(index) ? 'rotate-180' : ''"
                class="transition-transform"
              />
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
    </div>

    <div v-else>
      <p>찾으시는 제품이 없습니다.</p>
    </div>
  </template>
</template>
