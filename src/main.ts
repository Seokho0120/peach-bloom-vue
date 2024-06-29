import App from './App.vue';
import router from './router';
import './index.css';
import { auth } from './api/initApp';
import { createApp } from 'vue';
import type { App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import { Icon } from '@iconify/vue';

const app = createApp(App);

const authPlugin = {
  install(app: VueApp<Element>) {
    app.config.globalProperties.$auth = auth;
  },
};

app.use(authPlugin);
app.use(createPinia());
app.use(router);
app.component('Icon', Icon);

app.mount('#app');
