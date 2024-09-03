import { defineStore } from 'pinia';
import {ref,  computed} from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userId = ref<string>('');

  function setUserId(uid: string) {
    userId.value = uid;
  }

  return { 
    userId: computed(() => userId.value),
    setUserId,
  };
});
