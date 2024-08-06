<script setup lang="ts">
import { useRoute } from 'vue-router';

const router = useRoute();
const productId = router.query;
</script>

<template>
  <div>product id : {{ productId.id }}</div>
</template>

<style lang="scss" scoped></style>
