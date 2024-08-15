<script setup lang="ts">
import { useGetCartItemsList } from '@/composables/useCartItems';
import type { CartItemListType } from '@/types/items.types';
import { ref, watch } from 'vue';

const { data, isError, isLoading } = useGetCartItemsList();
const selectedProduct = ref();

watch(data, () => {
  console.log('data.value', data.value);
});

function buyItem(index: any) {
  console.log('buyItem', index);
}

function decreaseQuantity() {}

function increaseQuantity() {}
</script>

<template>
  <div class="flex flex-col w-full max-w-[100rem] min-w-[50rem] mx-auto pb-8 px-12">
    <!-- <div class="flex flex-col px-12"></div> -->

    <!-- <div class="mb-8 border-t-4 border-black">
      <ItemsListCard v-for="item in data" :key="item.productId" :product="item" />
    </div> -->

    <DataTable v-model:selection="selectedProduct" :value="data" data-key="productId" paginator :rows="5">
      <Column selectionMode="multiple" headerStyle="width: 2rem" />
      <Column
        header="상품정보"
        :pt="{
          bodyCell: {
            class: 'border-r-[1px]',
          },
        }"
      >
        <template #body="{ data }: { data: CartItemListType }">
          <div class="flex gap-6">
            <div style="width: 8rem">
              <img :src="data.imageUrl[0]" :alt="data.imageUrl[0]" style="object-fit: cover" />
            </div>
            <div>
              <div class="text-sm underline cursor-pointer">{{ data.brandName }}</div>
              <div class="text-lg font-bold mt-2">{{ data.productName }}</div>
              <div class="flex flex-col gap-2 text-sm">
                <div class="">{{ data.consumerPrice }}원</div>
                <div class="text-[#ff4800]">
                  <p>[{{ data.saleRate }}%] {{ data.salePrice }}원</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Column>
      <!-- field="quantity" -->
      <Column
        header="수량"
        :pt="{
          bodyCell: {
            class: 'border-r-[1px]',
          },
        }"
      >
        <template #body="{ data }: { data: CartItemListType }">
          <!-- TODO: css 만들기 / 갯수 계산하는 로직도 만들어보기 -->

          <!-- <div className="w-32 font-bold flex items-center justify-between border border-gray-200 mb-7">
            <button
              class="border-r flex items-center justify-center px-3 py-3"
              :disabled="data.quantity <= 1"
              @click="decreaseQuantity"
            >
              <i class="pi pi-minus" />
            </button>

            <p>{{ data.quantity }}</p>

            <button class="border-l flex items-center justify-center px-3 py-3" @click="increaseQuantity">
              <i class="pi pi-plus" />
            </button>
          </div> -->

          <!-- <InputNumber
            v-model="data.quantity"
            showButtons
            buttonLayout="vertical"
            style="width: 3rem"
            :min="0"
            :max="99"
          >
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber> -->

          <div class="flex-auto">
            <InputNumber v-model="data.quantity" showButtons buttonLayout="horizontal" :min="0" :max="100">
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
          </div>
        </template>
      </Column>

      <Column
        header="주문금액"
        :pt="{
          bodyCell: {
            class: 'border-r-[1px]',
          },
        }"
      >
        <template #body="{ data, index }: { data: CartItemListType; index: number }">
          <div class="flex flex-col items-center gap-4 font-bold">
            <div v-if="data.isSale" class="flex items-baseline">
              <p class="text-xl">{{ data.salePrice }}</p>
              <span>원</span>
            </div>

            <div v-else class="flex items-baseline">
              <p class="text-xl">{{ data.consumerPrice }}</p>
              <span>원</span>
            </div>

            <Button
              @click="() => buyItem(index)"
              label="BUY NOW"
              severity="contrast"
              :pt="{
                root: {
                  class: 'rounded-none font-bold text-sm',
                },
              }"
            />
          </div>
        </template>
      </Column>

      <Column header="배송비">
        <template #body="{ data }: { data: CartItemListType }">
          <div class="flex flex-col items-center font-bold">
            <div v-if="data.consumerPrice < 30000">3000원</div>
            <div v-else>무료배송</div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
