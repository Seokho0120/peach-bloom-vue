<script setup lang="ts">
import { ref } from 'vue';

const text = ref('');

defineExpose({
  text,
});
</script>

<template>
  <div>
    <InputText class="border border-black w-full" v-model="text" />
  </div>
</template>

<style lang="scss" scoped></style>
