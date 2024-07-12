<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { db } from '@/api/firestore';
import { collection, getDocs } from 'firebase/firestore';

const [DefineFormField, ReuseFormField] = createReusableTemplate<{ label: string }>();

async function test() {
  // return getDocs(collection(db, 'categoryList')).then((snapshot) => (snapshot.empty ? [] : snapshot.docs));
  const querySnapshot = await getDocs(collection(db, 'categoryList'));
  if (querySnapshot.empty) {
    console.log('empty');
  } else {
    querySnapshot.forEach((doc) => console.log('data ------------->', doc.data()));
  }
}

onMounted(() => test());

// TODO: 카테고리, 브랜드 firebase에 저장해서 api로 받아오기
const selectedCategory = ref();
const categories = ref([
  { name: 'EXCLUSIVE', id: 'exclusive' },
  { name: '스킨케어', id: 'skin' },
  { name: '헤어케어', id: 'hair' },
  { name: '바디케어', id: 'body' },
  { name: '메이크업', id: 'makeup' },
  { name: '남성', id: 'man' },
]);

const selectedBrand = ref();
const brands = ref([
  { name: '아로마티카', id: 'aromatica' },
  { name: '피부피부', id: 'pibupibu' },
  { name: '탄', id: 'tan' },
  { name: '헤라', id: 'hera' },
  { name: '브라운', id: 'brown' },
  { name: '바이피토', id: 'byphyto' },
  { name: '에스트라', id: 'estra' },
  { name: '딥퍼랑스', id: 'deeperence' },
  { name: '아닐로', id: 'anillo' },
  { name: '라곰', id: 'lagom' },
  { name: '아렌시아', id: 'arencia' },
  { name: '한아조', id: 'hanahzo' },
  { name: '넛세린', id: 'nutseline' },
  { name: '지비에이치', id: 'gbh' },
  { name: '심플리오', id: 'simplyo' },
]);

function getFormData() {
  // TODO: 에러검사 로직 추가 필요
  if (!selectedCategory.value && !selectedBrand.value) return;

  return {
    brandName: selectedBrand.value,
    categoryName: selectedCategory.value,
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
    <ReuseFormField label="상품 카테고리" class="flex-1">
      <Dropdown
        filter
        showClear
        v-model="selectedCategory"
        :options="categories"
        optionLabel="name"
        optionValue="id"
        placeholder="Select a Category"
        class="w-full md:w-14rem"
      />
    </ReuseFormField>

    <ReuseFormField label="브랜드" class="flex-1">
      <Dropdown
        filter
        showClear
        v-model="selectedBrand"
        :options="brands"
        optionLabel="name"
        optionValue="id"
        placeholder="Select a Brand"
        class="w-full md:w-14rem"
      />
    </ReuseFormField>
  </div>
</template>

<style lang="scss" scoped></style>
