<script setup lang="ts">
import { ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import { uploadImage } from '@/api/uploader';
import Button from 'primevue/button';

const [DefineFormField, ReuseFormField] = createReusableTemplate();

const toast = useToast();
const imageUrl = ref<string[]>([]);
const selectedFileName = ref<string>('파일을 선택하세요');
const fileInput = ref<HTMLInputElement | null>(null);
const loading = ref<boolean>(false);

// 파일 선택
const onFileSelect = async (event: Event) => {
  try {
    loading.value = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      selectedFileName.value = file.name;
      // console.log('file', file);

      const url = await uploadImage(file);
      imageUrl.value.push(url);
      toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });

      // console.log('이미지 URL:', url);
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const removeImage = (index: number) => {
  imageUrl.value.splice(index, 1);
};

watch(
  imageUrl,
  () => {
    console.log('imageUrl:', imageUrl.value);
  },
  { immediate: true, deep: true },
);
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
        <!-- <p>{{ selectedFileName }}</p> -->

        <input
          type="file"
          accept="image/*"
          name="file"
          required
          @change="onFileSelect"
          style="display: none"
          ref="fileInput"
        />
        <Button
          type="button"
          icon="pi pi-upload"
          label="파일 선택"
          class="mr-2"
          size="small"
          :loading="loading"
          @click="fileInput?.click()"
        />
      </div>
    </ReuseFormField>

    <div v-if="imageUrl.length > 0" class="flex flex-wrap gap-4 justify-content-center mt-4">
      <div v-for="(url, idx) in imageUrl" :key="idx" class="w-48 h-48 relative">
        <Button
          icon="pi pi-times"
          severity="danger"
          rounded
          aria-label="Cancel"
          class="absolute top-2 right-2"
          @click="removeImage(idx)"
          :pt="{
            root: {
              class: 'h-[2rem] w-[2rem]',
            },
          }"
        />

        <img :src="url" alt="Uploaded Image" class="w-full h-full object-cover rounded shadow" />
      </div>
    </div>
  </div>
</template>
