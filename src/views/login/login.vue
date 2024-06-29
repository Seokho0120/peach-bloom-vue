<!-- <script setup lang="ts">
import { signInWithGoogle } from '@/composables/useAuth';

async function handleSignInGoogle() {
  console.log('????');
  await signInWithGoogle();
}
</script>

<template>
  <div class="mt-4">
    <h2 class="text-3xl mb-8">LOGIN</h2>

    <div class="mb-4">
      <label for="email" class="block mb-1 font-medium">이메일(아이디)</label>
      <input id="email" type="text" placeholder="email" class="w-full border border-gray-300 rounded-md p-2" />
    </div>
    <div class="mb-4">
      <label for="password" class="block mb-1 font-medium">비밀번호</label>
      <input
        id="password"
        type="password"
        placeholder="password"
        class="w-full border border-gray-300 rounded-md p-2"
      />
    </div>

    <button @click="handleSignInGoogle" class="bg-blue-500 text-white px-4 py-2 rounded-md">로그인</button>
    <p class="mt-4">
      만약 계정이 없다면,
      <RouterLink
        :to="{
          name: 'signup',
        }"
        class="font-bold underline"
      >
        회원가입</RouterLink
      >을 먼저 진행해주세요!
    </p>
  </div>
</template> -->

<template>
  <div>
    <h1>Authentication</h1>
    <div v-if="!user">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <label>
          Email:
          <input v-model="email" type="email" required />
        </label>
        <label>
          Password:
          <input v-model="password" type="password" required />
        </label>
        <button type="submit">Login</button>
      </form>

      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
        <label>
          Email:
          <input v-model="signupEmail" type="email" required />
        </label>
        <label>
          Password:
          <input v-model="signupPassword" type="password" required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>

    <div v-else>
      <h2>Welcome, {{ user.email }}!</h2>
      <button @click="logout">Logout</button>
    </div>
    <!-- <p v-if="error" class="error">{{ error }}</p> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';

const user = ref<User | null>(null);
// const error = ref(null);
const email = ref('');
const password = ref('');
const signupEmail = ref('');
const signupPassword = ref('');

const login = async () => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value,
    );
    user.value = userCredential.user;
  } catch (err) {
    alert(err);
  }
};

const signup = async () => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupEmail.value,
      signupPassword.value,
    );
    user.value = userCredential.user;
  } catch (err) {
    alert(err);
  }
};

const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    user.value = null;
  } catch (err) {
    alert(err);
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
