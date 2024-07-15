<script setup lang="ts">
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
</script>

<template>
  <TheNav />
  <RouterView />

  <Toast />
  <ConfirmDialog group="confirm">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="p-6 bg-white">
        <div class="flex flex-col items-center w-full gap-6 border-b p-6">
          <i class="pi pi-exclamation-circle text-5xl" />
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

<style scoped></style>
