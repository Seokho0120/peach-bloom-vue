<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, type User } from 'firebase/auth';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { watch } from 'vue';
import { computed } from 'vue';

const router = useRouter();

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().min(1).email(),
    password: z
      .string()
      .min(6, '비밀번호는 6-10자 이내로 설정해야 합니다.')
      .regex(/[A-Z]/, '비밀번호에는 최소 1개 이상의 대문자가 포함되어야 합니다.')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        '비밀번호에는 최소 1개 이상의 특수문자가 포함되어야 합니다.',
      ),
  }),
);

const { defineField, errors, handleSubmit, isSubmitting } = useForm({ validationSchema });

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const user = ref<User | null>(null);
const loginError = ref<Record<string, string | null>>({
  email: null,
  password: null,
});

const signup = handleSubmit(
  async (values) => {
    if (values.email && values.password) {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      user.value = userCredential.user;
      router.push({ name: 'home' });
    }
  },
  ({ errors }) => {
    loginError.value = errors;
    console.log('loginError.value', loginError.value);
  },
);
// TODO: 동일한 계정 에러 처리 필요
// 동일한 이메일 주소로 가입된 계정이 있습니다. 기존 계정으로 로그인해주세요.
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
        />

        <div
          v-if="(errors.email && email !== '') || loginError.email === 'Required'"
          class="text-red-500 text-sm mt-1"
        >
          이메일 형식이 올바르지 않습니다.
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
        />
        <div
          v-if="(errors.password && password !== '') || loginError.password === 'Required'"
          class="text-red-500 text-sm mt-1"
        >
          비밀번호 형식이 올바르지 않습니다.
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
