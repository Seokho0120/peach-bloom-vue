<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGetCartItemsList } from '@/composables/useCartItems';
import type { CartItemListType } from '@/types/items.types';
import type { DataTableRowSelectEvent } from 'primevue/datatable';

interface ResultInfoType {
  totalOrder: number;
  totalShipping: number;
  totalPayment: number;
}

const { data: cartItemList, isLoading, isError } = useGetCartItemsList();

const selectedProduct = ref<CartItemListType[]>([]);
const quantityValues = ref<Record<string, number>>({}); // Record<Key, Value>
const selectAll = ref(true);

function buyItem(index: number) {
  console.log('buyItem', index);
}

watch(
  cartItemList,
  (newData) => {
    if (newData) {
      newData.forEach((item) => {
        quantityValues.value[item.productId] = item.quantity;
      });

      selectedProduct.value = [...newData];
    }
  },
  { immediate: true },
);

function onSelectAll() {
  selectAll.value = !selectAll.value;

  if (selectAll.value && cartItemList.value) {
    selectedProduct.value = [...cartItemList.value];
  } else {
    selectedProduct.value = [];
  }
}

const resultInfo = ref<ResultInfoType>({
  totalOrder: 0,
  totalShipping: 0,
  totalPayment: 0,
});

const totalOrder = ref(0);
const totalShipping = ref(0);
const totalPayment = ref(0);

function updateResultInfo() {
  resultInfo.value.totalOrder = totalOrder.value;
  resultInfo.value.totalShipping = totalShipping.value;
  resultInfo.value.totalPayment = totalPayment.value;
}

watch(selectedProduct, (newVal) => {
  if (newVal.length !== cartItemList.value?.length) {
    selectAll.value = false;
  } else {
    selectAll.value = true;
  }

  const hasLowPriceItem = newVal.some((item) => {
    const price = item.isSale ? item.salePrice : item.consumerPrice;
    return price <= 30000;
  });
  totalShipping.value = hasLowPriceItem ? 3000 : 0;
  totalOrder.value = 0;

  newVal.forEach((item) => {
    const quantity = quantityValues.value[item.productId] || 0;
    const price = item.isSale ? item.salePrice : item.consumerPrice;

    totalOrder.value += price * quantity;
  });
  totalPayment.value = totalOrder.value + totalShipping.value;

  updateResultInfo();
});

// 수량 감지
watch(
  quantityValues,
  (newQuantities) => {
    totalOrder.value = 0;
    selectedProduct.value.forEach((item) => {
      const quantity = newQuantities[item.productId] || 0;
      const price = item.isSale ? item.salePrice : item.consumerPrice;

      totalOrder.value += price * quantity;
    });
    totalPayment.value = totalOrder.value + totalShipping.value;

    updateResultInfo();
  },
  { deep: true },
);
</script>

<template>
  <div class="flex flex-col w-full max-w-[100rem] min-w-[50rem] mx-auto pb-40 px-12">
    <DataTable
      class="border-t-4 border-black"
      v-model:selection="selectedProduct"
      :value="cartItemList"
      data-key="productId"
      :loading="isLoading"
      @select-all-change="() => onSelectAll()"
      :select-all="selectAll"
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

    <DataTable
      class="border-t-4 border-black"
      :loading="isLoading"
      :value="[resultInfo]"
      :pt="{
        root: {
          class: 'mt-24',
        },
        header: {
          class: 'bg-red-400',
        },
        thead: {
          class: 'bg-red-400',
        },
      }"
    >
      <Column
        header="총 주문금액"
        :pt="{
          headerCell: {
            class: 'py-4 px-6 text-lg font-bold',
            // class: 'flex flex-col items-center py-4 px-6 text-lg font-bold',
          },
          bodyCell: {
            class: 'py-8',
          },
        }"
      >
        <template #body="{ data }">
          <div class="flex flex-col">
            <div class="flex items-baseline">
              <p class="text-3xl font-bold">{{ data.totalOrder }}</p>
              <span class="font-semibold">원</span>
            </div>
          </div>
        </template>
      </Column>

      <Column
        header="총 배송비"
        :pt="{
          headerCell: {
            class: 'py-4 px-6 text-lg font-bold',
          },
        }"
      >
        <template #body="{ data }">
          <div class="flex items-baseline">
            <p class="text-3xl font-bold">{{ data.totalShipping }}</p>
            <span class="font-semibold">원</span>
          </div>
        </template>
      </Column>

      <Column
        header="총 결제금액"
        :pt="{
          headerCell: {
            class: 'py-4 px-6 text-lg font-bold',
          },
        }"
      >
        <template #body="{ data }">
          <div class="flex items-baseline">
            <p class="text-3xl font-bold">{{ data.totalPayment }}</p>
            <span class="font-semibold">원</span>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
