import { createApp } from 'vue';
import type { App as VueApp } from 'vue';

import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './index.css';
import { Icon } from '@iconify/vue';

import { auth } from './api/initApp';

const app = createApp(App);

// auth를 Plugin 인터페이스를 구현하는 객체로 감싸기
const authPlugin = {
  install(app: VueApp<Element>) {
    // install(app: any) {
    console.log('app', app);
    console.log('app >>>>', typeof app);

    app.config.globalProperties.$auth = auth;
  },
};

// app.use(auth);
app.use(authPlugin);

app.use(createPinia());
app.use(router);
app.component('Icon', Icon);

app.mount('#app');
