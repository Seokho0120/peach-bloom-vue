import App from './App.vue';
import router from './router';
import './index.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Icon } from '@iconify/vue';
import firebaseApp from '@/api/firebasedb';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css'; // PrimeVue의 기본 CSS 파일 추가
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('Icon', Icon);

app.use(PrimeVue);

app.mount('#app');
