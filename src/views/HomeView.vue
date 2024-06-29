<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

const user = ref<User | null>(null);

onAuthStateChanged(getAuth(), (currentUser) => {
  user.value = currentUser;
});
</script>
<template>
  <div>
    <h1 class="text-xl">Welcome to Peachbloom!</h1>
    <div v-if="user">
      <h2 class="font-bold text-2xl text-blue-500">
        Welcome, {{ user.email }}!
      </h2>
    </div>
  </div>
</template>
