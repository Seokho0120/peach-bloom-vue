<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import BrandForm from '@/components/BrandForm.vue';
import UploadProductInfo from '@/components/upload/UploadProductInfo.vue';
import { createReusableTemplate } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ label: string }>();

const router = useRouter();

const confirm = useConfirm();
const toast = useToast();

// const brandFormRef = ref<InstanceType<typeof BrandForm> | undefined>(undefined);
const uploadProductInfoFormRef = ref<InstanceType<typeof UploadProductInfo> | undefined>(undefined);

function showTemplate() {
  const productInfoData = uploadProductInfoFormRef.value?.getFormData();

  confirm.require({
    group: 'confirm',
    message: '테스트',
    acceptLabel: '네',
    accept: () => {
      if (productInfoData?.productName.value && productInfoData?.productDescription.value) {
        console.log('accept accept accept accept');

        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'You have accepted' });
        return;
      }
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected' });
    },
  });
}
</script>

<template>
  <DefineTemplate v-slot="{ label, $slots }">
    <div class="mb-10 border py-6 px-8 rounded-xl overflow-x-auto whitespace-nowrap">
      <div class="mb-6">
        <h2 class="text-xl font-semibold">{{ label }}</h2>
      </div>
      <component :is="$slots.default"></component>
    </div>
  </DefineTemplate>

  <div class="w-4/5 max-w-[65rem] min-w-[57rem] mx-auto py-6 px-6">
    <h2 class="text-3xl font-bold mb-10">상품 등록</h2>

    <ReuseTemplate label="상품 기본정보">
      <UploadProductInfo ref="uploadProductInfoFormRef" />
    </ReuseTemplate>

    <!-- <ReuseTemplate label="브랜드명">
      <BrandForm ref="brandFormRef" />
    </ReuseTemplate> -->
  </div>

  <div>
    <Button
      type="button"
      label="취소"
      icon="pi pi-times"
      class="mr-2"
      size="small"
      severity="secondary"
    />
    <Button
      type="button"
      label="상품 업로드"
      icon="pi pi-check"
      size="small"
      @click="() => showTemplate()"
    />
  </div>

  <Toast />

  <ConfirmDialog group="confirm">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="p-6">
        <div class="flex flex-col items-center w-full gap-6 border-b p-6">
          <i class="pi pi-exclamation-circle text-5xl text-[--primary-color]"></i>
          <p class="text-lg" v-html="message.message"></p>
        </div>
        <div class="flex items-center justify-center gap-3 p-3">
          <Button
            type="button"
            :label="message.rejectLabel ?? '취소'"
            icon="pi pi-times"
            class="flex-grow-[0.4]"
            severity="secondary"
            @click="() => rejectCallback()"
            :pt="{
              root: {
                class: 'justify-center',
              },
              label: {
                class: 'flex-grow-[initial]',
              },
            }"
          />
          <Button
            type="button"
            :label="message.acceptLabel"
            icon="pi pi-check"
            class="flex-grow"
            @click="() => acceptCallback()"
            :pt="{
              root: {
                class: 'justify-center',
              },
              label: {
                class: 'flex-grow-[initial]',
              },
            }"
          />
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>
