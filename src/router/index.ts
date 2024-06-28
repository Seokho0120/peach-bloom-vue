import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: HomeView,
    },
    {
      path: '/mylike',
      name: 'mylike',
      component: HomeView,
    },
    {
      path: '/carts',
      name: 'carts',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue'),
    },
  ],
});

export default router;
