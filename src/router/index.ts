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
      path: '/login',
      name: 'login',
      // import로 화면 보여주면 필요할때 다운받아서 보여주기 때문에 성능최적화 방법 중 하나
      component: () => import('@/views/login/login.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/signup/signup.vue'),
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('@/views/upload/upload.vue'),
    },
    {
      path: '/items/:id',
      name: 'itemsList',
      component: () => import('@/views/items/items.vue'),
    },
    {
      path: '/detail/:id',
      name: 'itemDetail',
      component: () => import('@/views/itemDetail/itemDetail.vue'),
    },
    {
      path: '/cart/:id',
      name: 'cart',
      // beforeEnter: (to, from, next) => {
      //   // 로그인이 되었는지 확인

      //   // 로그인이 되어있지 않다면 로그인 페이지로 이동
      //   // next('/login')

      //   // 로그인이 되어있다면
      //   next();
      // },
      component: () => import('@/views/cart/cart.vue'),
    },
  ],
});

export default router;
