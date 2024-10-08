<script setup lang="ts">
import { ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import { uploadImage } from '@/api/uploader';

const [DefineFormField, ReuseFormField] = createReusableTemplate();

const props = defineProps<{ selectButtonValue: { name: string; value: number } }>();

const toast = useToast();
const imageUrls = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const loading = ref<boolean>(false);

const onFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }


  loading.value = true;

  // 이미지 크기 체크
  const file = input.files[0];
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;

  img.onload = async () => {
    if (props.selectButtonValue.value === 1) {
      if (img.width !== 2000 || img.height !== 850) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: '이미지 크기는 2000*850 픽셀이어야 합니다.',
          life: 3000,
        });

        URL.revokeObjectURL(objectUrl);
        loading.value = false;
        return;
      }
    } else {
      if (img.width !== img.height) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: '정사각형 이미지만 업로드 가능합니다.',
          life: 3000,
        });

        URL.revokeObjectURL(objectUrl);
        loading.value = false;
        return;
      }
    }

    try {
      // CLOUDINANRY에 이미지 업로드
      const url = await uploadImage(file);

      imageUrls.value = [...imageUrls.value, url];
      toast.add({ severity: 'info', summary: 'Success', detail: '이미지가 업로드 되었습니다.', life: 3000 });
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: '이미지 업로드에 실패했습니다.', life: 3000 });
    } finally {
      URL.revokeObjectURL(objectUrl);
      loading.value = false;
    }
  };

  img.onerror = () => {
    toast.add({ severity: 'error', summary: 'Error', detail: '이미지 업로드에 실패했습니다.', life: 3000 });
    loading.value = false;
    URL.revokeObjectURL(objectUrl);
  };
};

const removeImage = (index: number) => {
  imageUrls.value = imageUrls.value.filter((_, idx) => idx !== index);
};

function getFormData() {
  return {
    imageUrls: imageUrls.value,
  };
}

defineExpose({ getFormData });

watch(
  () => props.selectButtonValue,
  () => {
    imageUrls.value = [];
  },
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
      <div>
        <input type="file" accept="image/*" name="file" @change="onFileSelect" class="hidden" ref="fileInput" />
        <div>
          <Button
            type="button"
            icon="pi pi-upload"
            label="파일 선택"
            class="mr-2 mb-1"
            size="small"
            :loading="loading"
            @click="fileInput?.click()"
          />

          <p v-if="props.selectButtonValue.value === 1" class="flex items-center gap-1 text-xs mt-1">
            <Message severity="warn" class="my-0">피드의 이미지는 2000x850 크기만 업로드 가능합니다.</Message>
          </p>
        </div>
      </div>
    </ReuseFormField>

    <template v-if="imageUrls.length > 0">
      <div class="relative">
        <Image
          preview
          :pt="{
            root: {
              class: 'w-full',
            },
          }"
        >
          <template #indicatoricon>
            <i class="pi pi-search" />
          </template>
          <template #image>
            <img :src="imageUrls[0]" alt="Upload Image" class="w-full rounded shadow" />
          </template>
          <template #preview="slotProps">
            <img :src="imageUrls[0]" alt="preview" :style="slotProps.style" @click="slotProps.previewCallback" />
          </template>
        </Image>
        <Button
          icon="pi pi-times"
          class="absolute top-2 right-2"
          severity="secondary"
          text
          rounded
          aria-label="Cancel"
          @click="removeImage(0)"
          :pt="{
            root: {
              class: 'h-[2rem] w-[2rem]',
            },
          }"
        />
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(url, idx) in imageUrls.slice(1)" :key="url" class="relative">
          <Image preview>
            <template #indicatoricon>
              <i class="pi pi-search" />
            </template>
            <template #image>
              <img :src="url" alt="upload image" class="rounded shadow w-full" />
            </template>
            <template #preview="slotProps">
              <img :src="url" alt="preview" :style="slotProps.style" @click="slotProps.previewCallback" />
            </template>
          </Image>
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
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
    </template>
  </div>
</template>
