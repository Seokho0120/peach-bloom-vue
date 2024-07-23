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
import Tooltip from 'primevue/tooltip';

import 'primevue/resources/themes/aura-light-indigo/theme.css';
// import 'primevue/resources/themes/aura-light-noir/theme.css';
// import 'primevue/resources/themes/aura-light-green/theme.css';
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
app.directive('tooltip', Tooltip);
app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app');
