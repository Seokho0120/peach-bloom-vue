<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGetItemDetail } from '@/composables/useItems';
import { useConfirm } from 'primevue/useconfirm';
import { postCartItem } from '@/api/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

const user = ref<User | null>(null);
const userId = ref<string>('');
onAuthStateChanged(getAuth(), (currentUser) => {
  user.value = currentUser;
  userId.value = user.value?.uid || '';
});

const confirm = useConfirm();

const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id.toString());

const { data: itemDetail, isLoading } = useGetItemDetail(productId);

const isHeart = ref(false);
function toggleHeart() {
  // TODO: auth 로직 작업 후 진행 예정
  isHeart.value = !isHeart.value;
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
      router.push({ name: 'newCart' });
      // router.push({ name: 'cart' });
    },
  });
}

async function addToCart() {
  if (!itemDetail.value) return;

  const date = new Date();

  const cartItem = {
    ...itemDetail.value,
    quantity: quantity.value,
    createdAt: date,
  };

  await postCartItem(cartItem, userId.value, date);

  openConfirmModal();
}
</script>

<template>
  <div v-if="isLoading">Loading..</div>
  <template v-else>
    <div v-if="itemDetail" class="w-full max-w-[81.25rem] min-w-[56.25rem] mx-auto flex px-12 py-5 gap-10">
      <div class="flex-shrink-0">
        <Image :src="itemDetail?.imageUrl[0]" alt="Detail Image" width="564" class="w-full h-auto object-cover" />
      </div>

      <div class="w-full border-t-4 border-black">
        <div class="flex flex-col gap-4 border-b-[1px] border-gray-200 mb-6">
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

          <div class="mb-6">
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
