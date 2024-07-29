<script setup lang="ts">
import { ref, toRefs } from 'vue';

interface Template {
  ID: number;
  Name: string;
}

const props = defineProps<{
  modelValue: Template[];
}>();

const { modelValue } = toRefs(props);

const emit = defineEmits<{
  (e: 'update', value: Template[]): void;
}>();

const selectedIds = ref<number[]>(modelValue.value.map((t) => t.ID));

const monitoringItems = ref<Template[]>([
  { Name: '전체 모니터링 요소', ID: 0 },
  { Name: 'Ping', ID: 4 },
  { Name: 'Port', ID: 1 },
  { Name: 'URL', ID: 2 },
  { Name: 'DB', ID: 5 },
  { Name: 'CustomProtocol', ID: 6 },
  { Name: 'SOAP', ID: 7 },
  { Name: 'HTTP_Content', ID: 10 },
]);
</script>

<template>
  <div>test</div>
</template>
