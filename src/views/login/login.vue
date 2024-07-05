<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { FirebaseError } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { firebaseErrorTypeValidation } from '@/composables/useLoginValidation';

const router = useRouter();

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
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
  ),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const user = ref<User | null>(null);
const loginErrorMessage = ref<string>('');

const login = handleSubmit(async (loginData) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password,
    );

    user.value = userCredential.user;
    router.push({ name: 'home' });
    console.log('로그인 성공');
  } catch (error) {
    const firebaseError = error as FirebaseError;
    loginErrorMessage.value = firebaseErrorTypeValidation(firebaseError) || '';
  }
});

watch(
  [email, password],
  ([newEmail, newPassword]) => {
    if (newEmail !== '' || newPassword !== '') {
      loginErrorMessage.value = '';
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="flex flex-col items-center max-w-[400px] m-auto pt-11">
    <h2 class="text-3xl font-bold">로그인</h2>

    <form @submit.prevent="() => login()" class="w-full">
      <div class="flex flex-col h-[310px] pt-[60px]">
        <div class="mb-8">
          <label for="email" class="block mb-1 text-sm font-medium">이메일(아이디)</label>
          <input
            id="email"
            type="email"
            placeholder="abc@email.com"
            v-model="email"
            v-bind="emailAttrs"
            class="w-full p-2 border border-gray-200 rounded-sm placeholder:text-sm focus:border-gray-900 focus:outline-none"
          />

          <div v-if="errors.email" class="text-red-500 text-sm mt-1 absolute">
            {{
              errors.email === 'Required'
                ? '이메일(아이디)를 입력하세요.'
                : 'Invalid email'
                  ? '이메일 형식이 올바르지 않습니다.'
                  : ''
            }}
          </div>
        </div>

        <div class="mb-8">
          <label for="password" class="block mb-1 text-sm font-medium">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="6자 이상의 비밀번호"
            v-model="password"
            v-bind="passwordAttrs"
            class="w-full p-2 border border-gray-200 rounded-sm placeholder:text-sm focus:border-gray-900 focus:outline-none"
          />

          <div v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password === 'Required' ? '비밀번호를 입력하세요.' : errors.password }}
          </div>

          <div v-if="loginErrorMessage" class="text-red-500 text-sm mt-1">
            {{ loginErrorMessage }}
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        :class="`px-4 py-2 text-white font-semibold text-sm bg-black rounded w-full min-w-[88px] h-12 hover:cursor-pointer`"
      >
        <span v-if="isSubmitting">Loading...</span>
        <span v-else>로그인</span>
      </button>
    </form>

    <RouterLink
      :to="{
        name: 'signup',
      }"
      :class="`flex items-center justify-center mt-2 px-4 py-2 font-semibold text-sm bg-white border-[1px] rounded w-full min-w-[88px] h-12 hover:cursor-pointer`"
    >
      <span>간편 회원가입</span>
    </RouterLink>
  </div>
</template>
