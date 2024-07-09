<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label: string }>();

const productName = ref('');
const productDescription = ref('');
const errorMessage = ref('');

function getFormData() {
  if (productName.value && productDescription.value) {
    return { productName, productDescription };
  }
  // else {
  //   TODO: '', undefined 유틸함수 만들기
  //   errorMessage.value = '작성해주세요';
  // }
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
    <ReuseFormField label="상품 이름" class="flex-1">
      <InputText type="text" v-model="productName" placeholder="상품명을 작성해주세요." />
    </ReuseFormField>

    <ReuseFormField label="상품 설명" class="flex-1">
      <Textarea
        v-model="productDescription"
        rows="5"
        cols="30"
        class="w-full min-h-80 overflow-y-auto"
        placeholder="상품 설명을 작성해주세요."
      />
    </ReuseFormField>

    <!-- <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p> -->
  </div>
</template>

<style lang="scss" scoped></style>
