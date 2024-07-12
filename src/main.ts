import App from './App.vue';
import router from './router';
import './index.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Icon } from '@iconify/vue';
import firebaseApp from '@/api/firebasedb';
import { VueQueryPlugin } from '@tanstack/vue-query';

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import ConfirmDialog from 'primevue/confirmdialog';

import 'primevue/resources/themes/lara-light-green/theme.css';
import 'primevue/resources/primevue.min.css'; // PrimeVue의 기본 CSS 파일 추가
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);
app.component('Icon', Icon);

app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app');
