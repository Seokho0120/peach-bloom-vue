<script setup lang="ts">
import { ref } from 'vue';

const text = ref('');

const selectedCity = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);

defineExpose({
  text,
});
</script>

<template>
  <div>
    <InputText class="border border-black w-full" v-model="text" />
  </div>

  <Button
    type="button"
    label="취소"
    icon="pi pi-times"
    size="small"
    class="mr-2"
    text
    severity="secondary"
  />
  <Button type="button" label="룰 등록" icon="pi pi-check" />

  <div class="card flex justify-content-center">
    <Dropdown
      v-model="selectedCity"
      :options="cities"
      optionLabel="name"
      placeholder="Select a City"
      class="w-full md:w-14rem"
    />
  </div>
</template>

<style lang="scss" scoped></style>
