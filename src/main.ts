import App from './App.vue';
import router from './router';
import './index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Icon } from '@iconify/vue';
import { firebaseApp } from '@/api/initApp';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css'; //icons
import 'primevue/resources/themes/saga-blue/theme.css'; //theme
import 'primevue/resources/primevue.min.css'; //core CSS

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('Icon', Icon);
app.use(PrimeVue);
app.use(ToastService);
app.mount('#app');
