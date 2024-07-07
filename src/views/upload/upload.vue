<script setup lang="ts">
import { watch, ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import BrandForm from '@/components/BrandForm.vue';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ label: string }>();

const brandFormRef = ref<InstanceType<typeof BrandForm> | undefined>(undefined);

watch(
  () => brandFormRef.value?.text,
  (newVal) => {
    console.log('테스트', newVal);
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <DefineTemplate v-slot="{ label, $slots }">
    <div class="w-full mb-10 border py-6 px-8 rounded-xl overflow-x-auto whitespace-nowrap">
      <div class="mb-6">
        <h2 class="text-xl font-semibold">{{ label }}</h2>
      </div>
      <component :is="$slots.default"></component>
    </div>
  </DefineTemplate>

  <!-- <div class="flex flex-col items-center max-w-[400px] m-auto pt-11"> -->
  <!-- <div class="flex flex-col items-center p-12"> -->

  <div class="w-4/5 max-w-[65rem] min-w-[57rem] mx-auto py-6 px-6">
    <h2 class="text-3xl font-bold mb-10">상품 등록</h2>

    <ReuseTemplate label="브랜드명">
      <BrandForm ref="brandFormRef" />
    </ReuseTemplate>
  </div>
</template>
