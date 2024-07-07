<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, type User } from 'firebase/auth';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { FirebaseError } from 'firebase/app';
import { firebaseErrorTypeValidation } from '@/composables/useLoginValidation';

const router = useRouter();

const passwordSchema = z
  .string()
  .min(6, '비밀번호는 6-20자 이내로 설정해야 합니다.')
  .max(20)
  .regex(/[A-Z]/, '비밀번호에는 최소 1개 이상의 대문자가 포함되어야 합니다.')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호에는 최소 1개 이상의 특수문자가 포함되어야 합니다.');

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
      password: passwordSchema,
    }),
  ),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const user = ref<User | null>(null);
const signupErrorMessage = ref<string>('');

const passwordRules = computed(() => {
  if (!password.value) return;

  const result = passwordSchema.safeParse(password.value);

  return {
    hasUppercase: /[A-Z]/.test(password.value),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
    hasPasswordLength: password.value.length >= 6 && password.value.length <= 20,
    isValid: result.success,
  };
});

const signup = handleSubmit(async (values) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password,
    );

    user.value = userCredential.user;
    router.push({ name: 'home' });
    // 회원가입 성공 시 local에 사용자 정보 저장됨
  } catch (error) {
    const firebaseError = error as FirebaseError;
    signupErrorMessage.value = firebaseErrorTypeValidation(firebaseError) || '';
  }
});

watch([email, password], ([newEmail, newPassword]) => {
  if (newEmail !== '' || newPassword !== '') {
    // 회원가입 실패 후 에러메세지 삭제
    signupErrorMessage.value = '';
  }
});
</script>

<template>
  <div class="flex flex-col items-center max-w-[400px] m-auto pt-11">
    <h2 class="text-3xl font-bold">간편가입</h2>

    <form @submit.prevent="() => signup()" class="w-full">
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

          <div class="flex items-center gap-2 mt-1 text-gray-400 text-xs">
            <div
              :class="passwordRules?.hasUppercase ? 'text-blue-500' : ''"
              class="flex items-center gap-1"
            >
              <span>대소문자</span>
              <Icon icon="heroicons:check" />
            </div>
            <div
              :class="passwordRules?.hasSpecialChar ? 'text-blue-500' : ''"
              class="flex items-center gap-1"
            >
              <span>특수문자</span>
              <Icon icon="heroicons:check" />
            </div>
            <div
              :class="passwordRules?.hasPasswordLength ? 'text-blue-500' : ''"
              class="flex items-center gap-1"
            >
              <span>6-20자 이내</span>
              <Icon icon="heroicons:check" />
            </div>
          </div>

          <div v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password === 'Required' ? '비밀번호를 입력하세요.' : errors.password }}
          </div>

          <div v-if="signupErrorMessage" class="text-red-500 text-sm mt-1">
            {{ signupErrorMessage }}
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        :class="`px-4 py-2 text-white font-semibold text-sm bg-black rounded w-full min-w-[88px] h-12 hover:cursor-pointer`"
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
