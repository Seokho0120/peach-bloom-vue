<script setup lang="ts">
import { ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import { uploadImage } from '@/api/uploader';

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

      const url = await uploadImage(file);
      imageUrl.value.push(url);
      toast.add({ severity: 'info', summary: 'Success', detail: '이미지가 업로드 되었습니다.', life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: '이미지 업로드에 실패했습니다.', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const removeImage = (index: number) => {
  imageUrl.value.splice(index, 1);
};

function getFormData() {
  return {
    imageUrl: imageUrl.value,
  };
}

defineExpose({ getFormData });
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

    <div v-if="imageUrl.length > 0" class="grid grid-cols-3 gap-4 mt-4">
      <div class="col-span-3 mb-4 relative">
        <Image preview>
          <template #indicatoricon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img :src="imageUrl[0]" alt="Upload Image" class="rounded shadow w-full" />
          </template>
          <template #preview="slotProps">
            <img :src="imageUrl[0]" alt="preview" :style="slotProps.style" @click="slotProps.previewCallback" />
          </template>
        </Image>
        <Button
          icon="pi pi-times"
          severity="danger"
          rounded
          aria-label="Cancel"
          class="absolute top-2 right-2"
          @click="removeImage(0)"
          :pt="{
            root: {
              class: 'h-[2rem] w-[2rem]',
            },
          }"
        />
      </div>

      <div v-for="(url, idx) in imageUrl.slice(1)" :key="idx" class="relative">
        <Image preview>
          <template #indicatoricon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img :src="url" alt="Upload Image" class="rounded shadow w-full" />
          </template>
          <template #preview="slotProps">
            <img :src="url" alt="preview" :style="slotProps.style" @click="slotProps.previewCallback" />
          </template>
        </Image>
        <Button
          icon="pi pi-times"
          severity="danger"
          rounded
          aria-label="Cancel"
          class="absolute top-2 right-2"
          @click="removeImage(idx + 1)"
          :pt="{
            root: {
              class: 'h-[2rem] w-[2rem]',
            },
          }"
        />
      </div>
    </div>
  </div>
</template>
