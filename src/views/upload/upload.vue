<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { createReusableTemplate } from '@vueuse/core';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { uploadItem, uploadMainItem } from '@/api/firestore';
import UploadProductInfo from '@/components/upload/UploadProductInfo.vue';
import UploadProductCategory from '@/components/upload/UploadProductCategory.vue';
import UploadProductSellingType from '@/components/upload/UploadProductSellingType.vue';
import UploadProductDeliveryOption from '@/components/upload/UploadProductDeliveryOption.vue';
import type UploadProductPrice from '@/components/upload/UploadProductPrice.vue';
import type { uploadItemType } from '@/types/items.types';
import type UploadProductImage from '@/components/upload/UploadProductImage.vue';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
  label: string;
}>();

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const uploadProductInfoFormRef = ref<InstanceType<typeof UploadProductInfo> | undefined>(undefined);
const uploadProductCategoryRef = ref<InstanceType<typeof UploadProductCategory> | undefined>(undefined);
const uploadProductSellingTypeRef = ref<InstanceType<typeof UploadProductSellingType> | undefined>(undefined);
const uploadProductDeliveryOptionRef = ref<InstanceType<typeof UploadProductDeliveryOption> | undefined>(undefined);
const uploadProductPriceRef = ref<InstanceType<typeof UploadProductPrice> | undefined>(undefined);
const uploadProductImageRef = ref<InstanceType<typeof UploadProductImage> | undefined>(undefined);

function showTemplate() {
  const productInfo = uploadProductInfoFormRef.value?.getFormData();
  const productCategory = uploadProductCategoryRef.value?.getFormData();
  const productSellingType = uploadProductSellingTypeRef.value?.getFormData();
  const productDeliveryOption = uploadProductDeliveryOptionRef.value?.getFormData();
  const productProductPrice = uploadProductPriceRef.value?.getFormData();
  const productProductImage = uploadProductImageRef.value?.getFormData();

  if (
    !productInfo ||
    !productCategory ||
    !productSellingType ||
    !productDeliveryOption ||
    !productProductPrice ||
    !productProductImage
  ) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: '상품의 모든 내용을 작성해주세요.', life: 3000 });
    return;
  }

  confirm.require({
    group: 'confirm',
    message: '새로운 상품을 등록하시겠습니까?',
    acceptLabel: '네, 새로운 상품을 등록합니다.',
    rejectLabel: '취소',
    accept: () => {
      if (isPending.value) {
        return;
      }

      const uuidProductId = uuidv4().split('-')[0];

      submit({
        item: {
          productId: uuidProductId,
          productName: productInfo.productName,
          productDescription: productInfo.productDescription,
          categoryName: productCategory.categoryName || '',
          brandName: productCategory.brandName || '',
          sellingType: productSellingType.sellingType,
          breadth: productDeliveryOption.breadth,
          length: productDeliveryOption.length,
          weight: productDeliveryOption.weight,
          width: productDeliveryOption.width,
          consumerPrice: productProductPrice.consumerPrice,
          isSale: productProductPrice.isSale,
          salePrice: productProductPrice.salePrice,
          saleRate: productProductPrice.saleRate,
        },
        imageUrl: productProductImage?.imageUrl || [],
      });
    },
  });
}

function cancel() {
  router.push({
    name: 'home',
  });
}

const selectButtonValue = ref({ name: '상품 리스트', value: 2 });
const selectButtonOptions = ref([
  { name: '상품 리스트', value: 2 },
  { name: '피드 리스트', value: 1 },
]);

const queryClient = useQueryClient();
const { mutate: submit, isPending } = useMutation({
  mutationFn: async (payload: uploadItemType) => {
    if (selectButtonValue.value.value === 1) {
      await uploadMainItem(payload);
    } else if (selectButtonValue.value.value === 2) {
      await uploadItem(payload);
    } else return;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['items'],
    });

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: '새로운 상품이 등록되었습니다.',
      life: 3000,
    });

    router.push({
      name: 'home',
    });
  },
  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error Message',
      detail: '새로운 상품의 등록을 실패했습니다.',
      life: 3000,
    });
  },
});

// NXDASH 업로드 테스트 코드
export interface Template {
  ID: number;
  Name: string;
}

export interface Employee {
  DeptName: string;
  EmpKey: string;
  EmpName: string;
  Templates: Template[];
}

const test1 = ref<Employee[]>([
  {
    DeptName: '테크이노베이션실',
    EmpKey: 'NX21115',
    EmpName: '이호2',
    Templates: [
      { ID: 0, Name: '' },
      { Name: 'Ping', ID: 4 },
      { Name: 'URL', ID: 2 },
    ],
  },
  {
    DeptName: '테크데브팀 프론트엔드파트',
    EmpKey: 'NX25316',
    EmpName: '조식2',
    Templates: [
      { ID: 0, Name: '' },
      { Name: 'HTTP_Content', ID: 10 },
    ],
  },
  {
    DeptName: '테크데브팀 프론트엔드파트',
    EmpKey: 'NX2123',
    EmpName: '김승2',
    Templates: [{ Name: 'DB', ID: 5 }],
  },
]);

const selectedIds = ref(test1.value.map((emp) => emp.Templates.map((t) => t.ID)));

const monitoringItems = ref([
  { Name: '전체 모니터링 요소', ID: 0 },
  { Name: 'Ping', ID: 4 },
  { Name: 'Port', ID: 1 },
  { Name: 'URL', ID: 2 },
  { Name: 'DB', ID: 5 },
  { Name: 'CustomProtocol', ID: 6 },
  { Name: 'SOAP', ID: 7 },
  { Name: 'HTTP_Content', ID: 10 },
]);

const applyUpdates = () => {
  selectedIds.value.forEach((ids, index) => {
    const selectedTemplates = ids.map((selectedId) => {
      const matchedItem = monitoringItems.value.find((item) => item.ID === selectedId);
      return matchedItem ? { ID: matchedItem.ID, Name: matchedItem.Name } : { ID: selectedId, Name: '' };
    });
    test1.value[index].Templates = selectedTemplates;
  });
};
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

    <form class="flex gap-8" @submit.prevent="() => showTemplate()">
      <div class="w-full">
        <div class="flex flex-col mb-10">
          <h2 class="text-xl font-semibold mb-3">상품 분류</h2>
          <div class="card flex justify-content-center">
            <SelectButton
              v-model="selectButtonValue"
              :options="selectButtonOptions"
              optionLabel="name"
              aria-labelledby="basic"
            />
          </div>
        </div>

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
          <UploadProductImage ref="uploadProductImageRef" :select-button-value="selectButtonValue" />
        </ReuseTemplate>

        <ReuseTemplate label="배송 정보">
          <UploadProductDeliveryOption ref="uploadProductDeliveryOptionRef" />
        </ReuseTemplate>

        <ReuseTemplate label="상품 가격">
          <UploadProductPrice ref="uploadProductPriceRef" />
        </ReuseTemplate>

        <!-- TODO: NXDASH 담당자 셀렉 -->
        <!-- <ReuseTemplate label="업로드 테스트">
          <UploadTest
            :test1="test1"
            :selectedIds="selectedIds"
            :monitoringItems="monitoringItems"
            :applyUpdates="applyUpdates"
          />
        </ReuseTemplate> -->

        <div class="flex justify-end">
          <Button type="button" label="취소" class="mr-2" size="small" severity="secondary" />
          <Button type="submit" label="상품 등록" size="small" />
        </div>
      </div>
    </form>
  </div>
</template>
