import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/auth/LoginPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/register',
    component: () => import('../views/auth/RegisterPage.vue')
  },
  {
    path: '/tabs/',
    component: () => import('../views/client/TabsLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('../views/client/DashboardPage.vue')
      },
      {
        path: 'cars',
        component: () => import('../views/client/HomePage.vue')
      },
      {
        path: 'profile',
        component: () => import('../views/client/ProfilePage.vue')
      }
    ]
  },
  {
    path: '/add-car',
    component: () => import('../views/client/AddBreakdownPage.vue')
  },
  {
    path: '/mechanic/list',
    component: () => import('../views/mechanic/MechanicListPage.vue')
  },
  {
    path: '/mechanic/edit/:id',
    component: () => import('../views/mechanic/MechanicInterventionPage.vue')
  },
  {
    path: '/repair/:id',
    component: () => import('../views/client/RepairDetailPage.vue')
  },
  {
    path: '/payment/:id',
    component: () => import('../views/client/PaymentPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
