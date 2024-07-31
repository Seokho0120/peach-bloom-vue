<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { Template } from '@/views/upload/upload.vue';

interface Employee {
  DeptName: string;
  EmpKey: string;
  EmpName: string;
  Templates: Template[];
}

const props = defineProps<{
  test1: Employee[];
  selectedIds: number[][];
  monitoringItems: { Name: string; ID: number }[];
  applyUpdates: () => void;
}>();

const { test1, selectedIds, monitoringItems, applyUpdates } = toRefs(props);

const visible = ref(false);
</script>

<template>
  <div>
    <InputText type="text" />
    <Button label="Show" @click="visible = true" />
  </div>

  <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '70%' }">
    <DataTable :value="test1">
      <Column field="DeptName" header="DeptName" />
      <Column field="Templates" header="Templates">
        <template #body="{ index }">
          <MultiSelect
            v-model="selectedIds[index]"
            :options="monitoringItems"
            optionLabel="Name"
            option-value="ID"
            display="chip"
            placeholder="Select Columns"
            :maxSelectedLabels="3"
          />
        </template>
      </Column>
    </DataTable>
    <div class="flex justify-end mt-4">
      <Button label="적용" @click="applyUpdates" />
      <Button label="취소" @click="visible = false" class="ml-2" />
    </div>
  </Dialog>
</template>
