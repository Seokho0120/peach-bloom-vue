<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

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

const login = handleSubmit(
  async (loginData) => {
    if (loginData.email === '' && loginData.password === '') return;

    if (hasError.value) {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password,
      );
      user.value = userCredential.user;

      console.log('success');
      router.push({ name: 'home' });
    }
  },
  ({ errors }) => {
    console.log('login errors', errors);
  },
);

const hasError = ref(false);
// const hasError = computed(() => (Object.keys(errors.value).length > 0 ? true : false));
// 이메일&&비번이 '' 이 아니고, 유효성 검사 통과해야함 -> 그냥 유효성 검사 통과하게 만들면됨
// false - 오류 / true - 성공

watch(
  [email, password, hasError],
  ([newEmail, newPassword]) => {
    console.log('hasError.value', hasError.value);

    if (newEmail === '' || newPassword === '') {
      return (hasError.value = true);
    }

    if (Object.keys(errors.value).length > 0) {
      return (hasError.value = true);
    }

    hasError.value = false;
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-col items-center mt-24">
    <div class="flex w-96">
      <h2 class="mb-16 text-3xl font-bold">로그인</h2>
    </div>

    <form @submit.prevent="() => login()">
      <div class="mb-4 w-96">
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
          이메일 형식이 올바르지 않습니다.
        </div>
      </div>

      <div class="mb-4 w-96">
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
          비밀번호 형식이 올바르지 않습니다.
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting || !hasError"
        :class="`px-4 py-2 mt-10 text-white ${!hasError ? 'bg-blue-200' : 'bg-blue-500'} rounded-sm w-96 hover:cursor-pointer`"
      >
        <span v-if="isSubmitting">Loading...</span>
        <span v-else>로그인</span>
      </button>
    </form>
  </div>
</template>
