import App from './App.vue';
import router from './router';
import './index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Icon } from '@iconify/vue';
import { firebaseApp } from '@/api/initApp';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('Icon', Icon);

app.mount('#app');
