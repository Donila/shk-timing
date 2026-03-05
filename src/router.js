import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import { useAuthStore } from './stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/attack/:atk',
      name: 'attack',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./views/Admin.vue')
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!auth.isAuth && to.name !== 'login') return { name: 'login' }
  if (auth.isAuth && to.name === 'login') return { name: 'home' }
  if (to.name === 'admin' && !auth.isMaster) return { name: 'home' }
})

export default router
