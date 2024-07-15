<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createReusableTemplate } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { v4 as uuidv4 } from 'uuid';
import UploadProductInfo from '@/components/upload/UploadProductInfo.vue';
import UploadProductCategory from '@/components/upload/UploadProductCategory.vue';
import UploadProductSellingType from '@/components/upload/UploadProductSellingType.vue';
import UploadProductDeliveryOption from '@/components/upload/UploadProductDeliveryOption.vue';
import type UploadProductPrice from '@/components/upload/UploadProductPrice.vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { addItem } from '@/api/firestore';
import type { addItemType } from '@/types/items.types';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  label: string;
}>();

// TODO: 업로드할때 uuid 사용해서 고유 id만들어서 등록하기
// const test = ref('');
// watch(
//   test,
//   () => {
//     test.value = uuidv4();
//     console.log('test', test.value);
//   },
//   { immediate: true, deep: true },
// );

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const uploadProductInfoFormRef = ref<InstanceType<typeof UploadProductInfo> | undefined>(undefined);
const uploadProductCategoryRef = ref<InstanceType<typeof UploadProductCategory> | undefined>(undefined);
const uploadProductSellingTypeRef = ref<InstanceType<typeof UploadProductSellingType> | undefined>(undefined);
const uploadProductDeliveryOptionRef = ref<InstanceType<typeof UploadProductDeliveryOption> | undefined>(undefined);
const uploadProductPriceRef = ref<InstanceType<typeof UploadProductPrice> | undefined>(undefined);

function showTemplate() {
  const productInfo = uploadProductInfoFormRef.value?.getFormData();
  const productCategory = uploadProductCategoryRef.value?.getFormData();
  const productSellingType = uploadProductSellingTypeRef.value?.getFormData();
  const productDeliveryOption = uploadProductDeliveryOptionRef.value?.getFormData();
  const productProductPrice = uploadProductPriceRef.value?.getFormData();

  console.log('productInfo', productInfo);
  console.log('productCategory', productCategory);
  console.log('productSellingType', productSellingType);
  console.log('productDeliveryOption', productDeliveryOption);
  console.log('productProductPrice', productProductPrice);

  if (!productInfo || !productCategory || !productSellingType || !productDeliveryOption || !productProductPrice) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Form Validation Error', life: 3000 });
    return;
  }

  confirm.require({
    group: 'confirm',
    message: '테스트',
    acceptLabel: '네',
    accept: () => {
      console.log('zz');
    },
  });
}

function cancel() {
  console.log('뒤로가기');
}

const queryClient = useQueryClient();
const { mutate: submit, isPending } = useMutation({
  mutationFn: async (payload: addItemType) => {
    await addItem(payload);
  },
});

// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   if (!file) return;

//   const url = await uploadImage(file);
//   const firebaseProductId = await addNewProduct({ product, imageUrl: url });

//   const data = await getProductById(firebaseProductId);

//   await router.push(`/upload/${data}`); //제품 디테일 업로드로 이동
// };
</script>

<template>
  <DefineTemplate v-slot="{ label, $slots }">
    <div class="mb-3">
      <h2 class="text-xl font-semibold">{{ label }}</h2>
    </div>
    <div class="mb-10 border py-6 px-8 rounded-xl overflow-x-auto whitespace-nowrap">
      <component :is="$slots.default"></component>
    </div>
  </DefineTemplate>

  <div class="flex flex-col w-4/5 max-w-[80rem] min-w-[60rem] mx-auto pb-8">
    <div class="flex items-center mb-10 gap-4">
      <button @click="() => cancel()" type="button" class="border-[1px] p-3 rounded-md hover:bg-gray-100">
        <Icon icon="heroicons:arrow-long-left-16-solid" class="w-5 h-5 text-gray-500" />
      </button>

      <div class="flex flex-col gap-1">
        <span class="leading-none ml-1">메인 화면으로 돌아가기</span>
        <h2 class="text-3xl font-bold">새로운 상품 등록</h2>
      </div>
    </div>

    <form class="flex gap-8" :on-submit="() => showTemplate()">
      <div class="w-full">
        <ReuseTemplate label="상품 설명">
          <UploadProductInfo ref="uploadProductInfoFormRef" />
        </ReuseTemplate>

        <ReuseTemplate label="카테고리">
          <UploadProductCategory ref="uploadProductCategoryRef" />
        </ReuseTemplate>

        <ReuseTemplate label="판매 유형">
          <UploadProductSellingType ref="uploadProductSellingTypeRef" />
        </ReuseTemplate>
      </div>
      <div class="w-full">
        <ReuseTemplate label="상품 이미지">
          <UploadProductImage />
        </ReuseTemplate>

        <ReuseTemplate label="배송 정보">
          <UploadProductDeliveryOption ref="uploadProductDeliveryOptionRef" />
        </ReuseTemplate>

        <ReuseTemplate label="상품 가격">
          <UploadProductPrice ref="uploadProductPriceRef" />
        </ReuseTemplate>

        <div class="flex justify-end">
          <Button type="button" label="취소" class="mr-2" size="small" severity="secondary" />
          <Button type="button" label="상품 등록" size="small" @click="() => showTemplate()" />
        </div>
      </div>
    </form>
  </div>
</template>
