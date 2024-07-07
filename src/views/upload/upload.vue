<script setup lang="ts">
import { ref } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const selectedCity = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);
</script>

<template>
  <div class="flex flex-col items-center max-w-[400px] m-auto pt-11">
    <h2 class="text-3xl font-bold">상품 등록</h2>
  </div>

  <div class="card flex justify-center">
    <Dropdown
      v-model="selectedCity"
      :options="cities"
      optionLabel="name"
      placeholder="Select a City"
      class="w-full md:w-[14rem]"
    />
  </div>

  <Button label="Submit" />
</template>

<style scoped></style>
