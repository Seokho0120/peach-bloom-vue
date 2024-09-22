<script setup lang="ts"></script>

<template>
  <div class="flex flex-col mx-auto min-w-[900px] max-w-[1500px] mt-10 px-[50px] pb-[100px]">
    <h2 class="text-2xl font-bold pb-4">이름</h2>
    <div class="flex gap-14">
      <!-- TODO: nav 바꾸기 -->
      <ItemsSnb />
      <MyLikeItemsList />
    </div>
  </div>
</template>
