<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label?: string }>();

const isSale = ref(false);
const saleRate = ref<number>(0);
const salePrice = ref<number>(0);
const consumerPrice = ref<number>(0);
// TODO: 정상가 적용 후 할인율 적용하면 자동으로 할인 가격 보여지게 만들기

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
    <ReuseFormField label="할인 적용">
      <InputSwitch v-model="isSale" />
    </ReuseFormField>

    <ReuseFormField label="정상 가격">
      <InputGroup>
        <InputNumber v-model="consumerPrice" type="number" />
        <InputGroupAddon>원</InputGroupAddon>
      </InputGroup>
    </ReuseFormField>

    <div v-if="isSale">
      <div class="flex gap-4">
        <ReuseFormField label="할인율" class="w-1/3">
          <InputGroup>
            <InputNumber v-model="saleRate" type="number" />
            <InputGroupAddon>%</InputGroupAddon>
          </InputGroup>
        </ReuseFormField>

        <ReuseFormField label="할인 가격" class="w-full text-red-500">
          <InputGroup>
            <InputNumber v-model="salePrice" type="number" />
            <InputGroupAddon>원</InputGroupAddon>
          </InputGroup>
        </ReuseFormField>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
