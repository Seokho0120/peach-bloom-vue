<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { auth } from '@/api/firebasedb';
import { useAuthStore } from '@/stores/auth.store';
import {  onAuthStateChanged, type Unsubscribe } from 'firebase/auth';

const authStore = useAuthStore();

const unsubscribe = ref<Unsubscribe|undefined>(undefined)

onMounted(() => {
  unsubscribe.value = onAuthStateChanged(auth, (user) => {
    if (user) {
      // 로그인 된 상태일 경우
      authStore.setUserId(user.uid);
    } else {
      // 로그아웃 된 상태일 경우
      authStore.setUserId('');
    }
  });
})

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
})
</script>

<template>
  <TheNav />
  <RouterView />

  <Toast />
  <ConfirmDialog group="goToPage">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col p-10 relative">
        <i class="pi pi-times absolute right-3 top-3 cursor-pointer" @click="() => rejectCallback()" />
        <p class="text-lg pb-6" v-html="message.message" />
        <Button type="button" :label="message.acceptLabel" class="flex-grow" @click="() => acceptCallback()" />
      </div>
    </template>
  </ConfirmDialog>

  <ConfirmDialog group="confirm">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="p-6 bg-white rounded-sm">
        <div class="flex flex-col items-center w-full gap-6 border-b p-6">
          <i class="pi pi-exclamation-circle text-5xl text-[#6265ef]" />
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
