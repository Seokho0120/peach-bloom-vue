<script setup lang="ts">
import { ref } from 'vue';
import {
  getAuth,
  createUserWithEmailAndPassword,
  type User,
} from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref<User | null>(null);
const emailValue = ref<string>('');
const passwordValue = ref<string>('');
const isLoading = ref<boolean>(false);

const signup = async () => {
  try {
    isLoading.value = true;
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailValue.value,
      passwordValue.value,
    );
    user.value = userCredential.user;
    console.log('user.value', user.value);

    router.push({ name: 'home' });
  } catch (err) {
    alert(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="mt-24 flex flex-col items-center">
    <div class="flex w-96">
      <h2 class="font-bold text-3xl mb-16">
        이메일로 <br />
        로그인/회원가입 하기
      </h2>
    </div>

    <div class="mb-4 w-96">
      <label for="email" class="block mb-1 text-sm font-medium"
        >이메일(아이디)</label
      >
      <input
        v-model="emailValue"
        id="email"
        type="text"
        placeholder="abc@email.com"
        class="w-full border border-gray-200 rounded-md p-2 placeholder:text-sm focus:border-gray-900 focus:outline-none"
        required
      />
    </div>
    <div class="mb-4 w-96">
      <label for="password" class="block mb-1 text-sm font-medium"
        >비밀번호</label
      >
      <input
        v-model="passwordValue"
        id="password"
        type="password"
        placeholder="6자 이상의 비밀번호"
        class="w-full border border-gray-200 rounded-md p-2 placeholder:text-sm focus:border-gray-900 focus:outline-none"
        required
      />
    </div>

    <button
      @click.prevent="signup"
      :disabled="isLoading"
      class="bg-blue-500 text-white px-4 py-2 rounded-md w-96 mt-10"
    >
      <div v-if="isLoading">Loading...</div>
      <div v-else>회원가입</div>
    </button>

    <p class="mt-4 text-xs">
      <RouterLink
        :to="{
          name: 'login',
        }"
        class="underline"
      >
        로그인 페이지</RouterLink
      >로 돌아가기
    </p>
  </div>
</template>
