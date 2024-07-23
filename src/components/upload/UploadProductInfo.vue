<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import 'quill/dist/quill.core.css';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label: string }>();

const productName = ref('');
const productDescription = ref('');
// const errorMessage = ref('');

function getFormData() {
  // TODO: 에러검사 로직 추가 필요
  if (!productName.value && !productDescription.value) return;

  return {
    productName: productName.value,
    productDescription: productDescription.value,
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
    <ReuseFormField label="상품 이름" class="flex-1">
      <InputText type="text" v-model="productName" placeholder="상품명을 작성해주세요." />
    </ReuseFormField>

    <ReuseFormField label="상품 설명" class="flex-1">
      <Editor
        v-model="productDescription"
        :pt="{
          content: {
            class: 'min-h-80',
          },
        }"
        placeholder="상품 설명을 작성해주세요."
      >
        <template v-slot:toolbar>
          <span class="ql-formats">
            <button v-tooltip.bottom="'Bold'" class="ql-bold" />
            <button v-tooltip.bottom="'Italic'" class="ql-italic" />
            <button v-tooltip.bottom="'Underline'" class="ql-underline" />
            <button v-tooltip.bottom="'List'" class="ql-list" value="ordered" />
          </span>
        </template>
      </Editor>
    </ReuseFormField>
    <!-- <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p> -->
  </div>
</template>
