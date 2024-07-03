<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { FirebaseError } from 'firebase/app';

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
const errorMessage = ref('');

// TODO: 유효성검사 추가해야됨
//  errors.email === 'Required' 면 필수값이라고 표시 - 빈값일때 로그인 버튼 클릭
//  errors.email === 'Invalid email' 면 유효성검사 실패 - 빈값일때 로그인 버튼 클릭
//  errors.mail === 'Invalid Required' 면 필수값이라고 표시 - 빈값일때 로그인 버튼 클릭

//  errors.email === 'Required' ? 이메일(아이디)를 입력하세요.
//  errors.email === 'Invalid email' ? 이메일 형식이 올바르지 않습니다.
//  errors.mail === 'Invalid Required' ? 비밀번호를 입력하세요.

const login = handleSubmit(
  async (loginData) => {
    try {
      if (loginData.email === '' && loginData.password === '') return;

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
      if (firebaseError.code === 'auth/invalid-credential') {
        errorMessage.value = '존재하지 않는 계정입니다.';
      }

      // TODO: 에러 처리 추가해야됨
      // switch (firebaseError.code) {
      //   case 'auth/user-not-found' || 'auth/wrong-password':
      //     return '이메일 혹은 비밀번호가 일치하지 않습니다.';
      //   case 'auth/email-already-in-use':
      //     return '이미 사용 중인 이메일입니다.';
      //   case 'auth/weak-password':
      //     return '비밀번호는 6글자 이상이어야 합니다.';
      //   case 'auth/network-request-failed':
      //     return '네트워크 연결에 실패 하였습니다.';
      //   case 'auth/invalid-email':
      //     return '잘못된 이메일 형식입니다.';
      //   case 'auth/internal-error':
      //     return '잘못된 요청입니다.';
      //   default:
      //     return '로그인에 실패 하였습니다.';
      // }
    }
  },
  ({ errors }) => {
    console.log('login errors', errors);
  },
);
</script>

<template>
  <div class="flex flex-col items-center max-w-[400px] m-auto pt-11">
    <h2 class="text-3xl font-bold">로그인</h2>

    <form @submit.prevent="() => login()" class="w-full">
      <div class="flex flex-col h-[310px] pt-[60px]">
        <div class="mb-5">
          <label for="email" class="block mb-1 text-sm font-medium">이메일(아이디)</label>
          <input
            id="email"
            type="email"
            placeholder="abc@email.com"
            v-model="email"
            v-bind="emailAttrs"
            class="w-full p-2 border border-gray-200 rounded-sm placeholder:text-sm focus:border-gray-900 focus:outline-none"
          />

          <div v-if="errors.email && email !== ''" class="text-red-500 text-sm mt-1">
            이메일(아이디)를 입력하세요.
          </div>
          <div v-if="errorMessage !== ''" class="text-red-500 text-sm mt-1">
            {{ errorMessage }}
          </div>
        </div>

        <div class="mb-5">
          <label for="password" class="block mb-1 text-sm font-medium">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="6자 이상의 비밀번호"
            v-model="password"
            v-bind="passwordAttrs"
            class="w-full p-2 border border-gray-200 rounded-sm placeholder:text-sm focus:border-gray-900 focus:outline-none"
          />
          <div v-if="errors.password && password !== ''" class="text-red-500 text-sm mt-1">
            비밀번호를 입력하세요.
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
