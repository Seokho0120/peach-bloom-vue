<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, type User } from 'firebase/auth';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const router = useRouter();

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1),
      password: z.string().min(1),
    }),
  ),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const user = ref<User | null>(null);

const signup = handleSubmit(
  async (values) => {
    values.email;
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password,
    );

    user.value = userCredential.user;
    router.push({ name: 'home' });
  },
  ({ errors }) => {
    alert(errors);
  },
);
</script>

<template>
  <div class="flex flex-col items-center mt-24">
    <div class="flex w-96">
      <h2 class="mb-16 text-3xl font-bold">
        이메일로 <br />
        로그인/회원가입 하기
      </h2>
    </div>

    <form @submit.prevent="() => signup()">
      <div class="mb-4 w-96">
        <label for="email" class="block mb-1 text-sm font-medium">이메일(아이디)</label>
        <input
          v-model="email"
          v-bind="emailAttrs"
          id="email"
          type="email"
          placeholder="abc@email.com"
          class="w-full p-2 border border-gray-200 rounded-md placeholder:text-sm focus:border-gray-900 focus:outline-none"
          required
        />
        <div v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email }}
        </div>
      </div>

      <div class="mb-4 w-96">
        <label for="password" class="block mb-1 text-sm font-medium">비밀번호</label>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          id="password"
          type="password"
          placeholder="6자 이상의 비밀번호"
          class="w-full p-2 border border-gray-200 rounded-md placeholder:text-sm focus:border-gray-900 focus:outline-none"
          required
        />
        <div v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password }}
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-4 py-2 mt-10 text-white bg-blue-500 rounded-md w-96"
      >
        <span v-if="isSubmitting">Loading...</span>
        <span v-else>회원가입</span>
      </button>
    </form>

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
