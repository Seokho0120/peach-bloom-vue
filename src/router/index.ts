import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { auth } from '@/api/firebasedb';
import { onAuthStateChanged } from 'firebase/auth';

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
      component: () => import('@/views/myPage/myPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/mylike',
      name: 'mylike',
      component: () => import('@/views/myLike/myLike.vue'),
      meta: {
        requiresAuth: true
      }
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
      meta: {
        requiresAuth: true
      }
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
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/cart/cart.vue'),
      meta: {
        requiresAuth: true
      }
    },
  ],
});


function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user)
    }, reject);
  })
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    const user = await getCurrentUser()
    if (!user) {
      return next({
        name: 'login',
        query: {
          originalUrl: to.fullPath
        }
      });
    }
  }

  next();
})

export default router;
