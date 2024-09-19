<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>
<template>
  <tr class="p-6 border-b-[1px]">
    <!-- TODO: 상품 체크해서 금액 계산도 해야됨 -->
    <!-- 상품 체크 -->
    <td class="p-0">
      <div class="flex items-center justify-center">
        <Skeleton height="1.5rem" width="1.5rem" />
      </div>
    </td>

    <!-- 상품정보 -->
    <td class="flex gap-6 border-r-[1px] p-6 w-42">
      <div style="width: 8rem">
        <Skeleton height="8rem" width="8rem" />
      </div>

      <div>
        <div class="text-sm underline cursor-pointer">
          <Skeleton height="1rem" width="8rem" />
        </div>
        <div class="text-lg font-bold mt-2">
          <Skeleton height="1.5rem" width="12rem" />
        </div>
        <div class="flex flex-col gap-2 text-sm mt-2">
          <div>
            <Skeleton height="1rem" width="5rem" />
          </div>
          <div>
            <Skeleton height="1rem" width="5rem" />
          </div>
        </div>
      </div>
      <div class="ml-auto">
        <Skeleton height="1.5rem" width="1.5rem" />
      </div>
    </td>

    <!-- 수량 -->
    <td class="border-r-[1px] w-10 p-6">
      <Skeleton height="2.4rem" />
    </td>

    <!-- 주문금액 -->
    <td class="border-r-[1px] font-bold">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-baseline">
          <Skeleton height="2rem" width="5.5rem" />
        </div>

        <Skeleton height="2.5rem" width="7rem" />
      </div>
    </td>

    <!-- 배송비: cartItemPrice으로 측정 -->
    <td class="border-b p-4 font-bold">
      <div class="flex flex-col items-center">
        <Skeleton height="1.5rem" width="4rem" />
      </div>
    </td>
  </tr>
</template>
