<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const [DefineFormField, ReuseFormField] = createReusableTemplate();

const toast = useToast();

const onUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
  <DefineFormField v-slot="{ $slots }">
    <div class="flex flex-col">
      <component :is="$slots.default" />
    </div>
  </DefineFormField>

  <div class="flex flex-col gap-6">
    <ReuseFormField class="flex-1 gap-4">
      <div class="card flex justify-content-center">
        <FileUpload
          mode="basic"
          name="demo[]"
          url="/api/upload"
          accept="image/*"
          :maxFileSize="1000000"
          @upload="onUpload"
          :auto="true"
          chooseLabel="Browse"
        />
      </div>
    </ReuseFormField>
  </div>
</template>

<style lang="scss" scoped></style>
