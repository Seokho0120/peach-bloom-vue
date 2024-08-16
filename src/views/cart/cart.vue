<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGetCartItemsList } from '@/composables/useCartItems';
import type { CartItemListType } from '@/types/items.types';

const { data: cartItemList, isLoading, isError } = useGetCartItemsList();
const selectedProduct = ref();
const quantityValues = ref<Record<string, number>>({}); // Record<Key, Value>

watch(
  cartItemList,
  (newData) => {
    if (newData) {
      newData.forEach((item) => {
        quantityValues.value[item.productId] = item.quantity;
      });
      console.log('quantityValues.value', quantityValues.value);

      selectedProduct.value = [...newData];
      console.log('selectedProduct.value', selectedProduct.value);
    }
  },
  { immediate: true },
);

function buyItem(index: any) {
  console.log('buyItem', index);
}

watch(selectedProduct, () => {
  console.log('selectedProduct.value', selectedProduct.value);
});

const test1 = ref(true);
function test() {
  console.log('전체');
  test1.value = !test1.value;
}
</script>

<template>
  <div class="flex flex-col w-full max-w-[100rem] min-w-[50rem] mx-auto pb-8 px-12">
    <!-- :select-all="test1"
    @select-all-change="test()" -->
    <DataTable
      class="border-t-4 border-black"
      v-model:selection="selectedProduct"
      :value="cartItemList"
      data-key="productId"
      paginator
      :rows="5"
      :loading="isLoading"
    >
      <template #empty>
        <p class="text-2xl font-bold flex justify-center items-center p-12">장바구니에 담은 상품이 없습니다.</p>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 2rem" />
      <Column
        header="상품정보"
        :pt="{
          bodyCell: {
            class: 'border-r-[1px] p-6',
          },
          headerCell: {
            class: 'py-4 px-6 text-lg font-bold',
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
      <Column
        header="수량"
        :pt="{
          bodyCell: {
            class: 'border-r-[1px] w-10 p-6',
          },
          headerCell: {
            class: 'py-4 px-0 text-lg font-bold',
          },
        }"
      >
        <template #body="{ data }: { data: CartItemListType }">
          <div class="flex items-center justify-center">
            <InputNumber
              v-model="quantityValues[data.productId]"
              showButtons
              buttonLayout="horizontal"
              :min="1"
              :max="99"
              :pt="{
                input: {
                  root: {
                    class: 'w-12 text-center',
                  },
                },
              }"
            >
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
          headerCell: {
            class: 'py-4 px-0  text-lg font-bold',
          },
        }"
      >
        <template #body="{ data, index }: { data: CartItemListType; index: number }">
          <div class="flex flex-col items-center gap-4 font-bold">
            <div v-if="data.isSale" class="flex items-baseline">
              <p class="text-xl">{{ (data.salePrice * quantityValues[data.productId]).toLocaleString() }}</p>
              <span>원</span>
            </div>

            <div v-else class="flex items-baseline">
              <p class="text-xl">{{ (data.consumerPrice * quantityValues[data.productId]).toLocaleString() }}</p>
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

      <Column
        header="배송비"
        :pt="{
          headerCell: {
            class: 'py-4 px-0  text-lg font-bold',
          },
        }"
      >
        <template #body="{ data }: { data: CartItemListType }">
          <div class="flex flex-col items-center font-bold">
            <div v-if="data.consumerPrice < 30000" class="flex items-baseline">
              <p>3,000</p>
              <span class="text-xs">원</span>
            </div>
            <div v-else>무료배송</div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
