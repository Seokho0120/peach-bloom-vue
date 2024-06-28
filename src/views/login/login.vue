<script setup lang="ts"></script>

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

    <button class="bg-blue-500 text-white px-4 py-2 rounded-md">로그인</button>
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
</template>
