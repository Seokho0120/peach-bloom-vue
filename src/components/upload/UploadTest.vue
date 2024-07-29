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

console.log('modelValue.value', modelValue.value);
</script>

<template>
  <ElSelect
    v-model="selectedIds"
    class="w-300px"
    multiple
    clearable
    placeholder="전체"
    popper-class="custom-header"
    collapse-tags
    :max-collapse-tags="3"
  >
    <template #header>
      <p class="rounded flex bg-$dnx-light-500 mb-2 py-2 px-3 text-11px w-280px gap-2">
        <NxIcon :size="1" class="mt-1">las la-info-circle</NxIcon>
        선택된 모니터링 요소의 알림 발생 시 24시간<br />
        관제센터에서 연락드립니다.
      </p>
      <!-- <ElCheckbox v-model="checkAll" class="w-full" @click="toggleAll"> 전체 모니터링 요소 </ElCheckbox> -->
    </template>

    <ElOption v-for="item in monitoringItems" :key="item.ID" :label="item.Name" :value="item.ID" />
  </ElSelect>
</template>
