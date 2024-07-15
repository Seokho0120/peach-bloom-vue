<script setup lang="ts">
import { ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label?: string }>();

const consumerPrice = ref<number>(0);
const isSale = ref(false);
const saleRate = ref<number>(0);
const salePrice = ref<number>(0);

watch([consumerPrice, isSale, saleRate], ([newConsumerPrice, newIsSale, newSaleRate]) => {
  if (newConsumerPrice > 0 && newIsSale) {
    if (newSaleRate > 0) {
      salePrice.value = newConsumerPrice - (newConsumerPrice * newSaleRate) / 100;
    } else {
      salePrice.value = 0;
    }
  } else {
    salePrice.value = 0;
  }
});

function getFormData() {
  return {
    isSale: isSale?.value,
    saleRate: saleRate?.value,
    salePrice: salePrice?.value,
    consumerPrice: consumerPrice.value,
  };
}

defineExpose({ getFormData });
</script>

<template>
  <DefineFormField v-slot="{ label, $slots }">
    <div class="flex flex-col gap-3">
      <h2>{{ label }}</h2>
      <component :is="$slots.default" />
    </div>
  </DefineFormField>

  <div class="flex flex-col gap-6">
    <ReuseFormField label="정상 가격">
      <InputGroup>
        <InputNumber v-model="consumerPrice" type="number" />
        <InputGroupAddon>원</InputGroupAddon>
      </InputGroup>
    </ReuseFormField>

    <ReuseFormField label="할인 적용">
      <InputSwitch v-model="isSale" />
    </ReuseFormField>

    <div v-if="isSale">
      <div class="flex gap-4">
        <ReuseFormField label="할인율" class="w-1/3">
          <InputGroup>
            <InputNumber v-model="saleRate" type="number" />
            <InputGroupAddon>%</InputGroupAddon>
          </InputGroup>
        </ReuseFormField>

        <ReuseFormField label="할인 가격" class="w-full">
          <InputGroup class="text-red-500">
            <InputNumber
              v-model="salePrice"
              type="number"
              :pt="{
                input: {
                  root: {
                    class: 'text-red-500 font-semibold',
                  },
                },
              }"
            />
            <InputGroupAddon>원</InputGroupAddon>
          </InputGroup>
        </ReuseFormField>
      </div>
    </div>
  </div>
</template>
