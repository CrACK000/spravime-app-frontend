import {createRouter, createWebHistory} from 'vue-router'
import { logout } from "@/plugins/logout"
import {inject} from "vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/maintenance',
      name: 'maintenance',
      component: () => import('@/views/Maintenance.vue'),
    },
    {
      path: '/search',
      name: 'workers',
      component: () => import('@/views/AllWorkers.vue'),
    },
    {
      path: '/offers',
      name: 'offers',
      component: () => import('@/views/AllOffers.vue'),
    },
    {
      path: '/offers/:id',
      name: 'offerDetail',
      component: () => import('@/views/OfferDetails.vue'),
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('@/views/UserProfile.vue'),
    },
    {
      path: '/account',
      component: () => import('@/views/authentication/user/Account.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/account/dashboard' },
        { path: 'create-offer',     name: 'offerAdd',         component: () => import('@/views/authentication/user/CreateOfferPanel.vue') },
        { path: 'dashboard',        name: 'dashboard',        component: () => import('@/views/authentication/user/DashboardPanel.vue') },
        { path: 'messages',         name: 'messages',         component: () => import('@/views/authentication/user/MessagesPanel.vue') },
        { path: 'offers',           name: 'my-offers',        component: () => import('@/views/authentication/user/OffersPanel.vue') },
        { path: 'offers/all',       name: 'offers-all',       component: () => import('@/views/authentication/user/OffersPanel.vue') },
        { path: 'offers/waiting',   name: 'offers-waiting',   component: () => import('@/views/authentication/user/OffersPanel.vue') },
        { path: 'profile',          name: 'my-account',       component: () => import('@/views/authentication/user/ProfilePanel.vue') },
        { path: 'gallery',          name: 'user-gallery',     component: () => import('@/views/authentication/user/GalleryPanel.vue') },
        { path: 'security',         name: 'user-security',    component: () => import('@/views/authentication/user/SecurityPanel.vue') },
        { path: 'stats',            name: 'user-stats',       component: () => import('@/views/authentication/user/StatsPanel.vue') },
        { path: 'plus',             name: 'user-plus',        component: () => import('@/views/authentication/user/PlusPanel.vue') },
        {
          path: 'logout',
          name: 'logout',
          component: { template: '' },
          beforeEnter(to, from, next) {
            logout()
            next({ name: 'home' })
          } },
      ]
    },
    {
      path: '/account/create',
      name: 'register',
      meta: { transition: 'fade', requiresAuth: false },
      component: () => import('@/views/authentication/guest/Register.vue')
    },
    {
      path: '/account/login',
      name: 'login',
      meta: { transition: 'fade', requiresAuth: false },
      component: () => import('@/views/authentication/guest/Login.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

router.beforeEach(async (to, from, next) => {

  const auth = inject<Auth>('auth')
  await auth?.checkAuth()

  if (!auth?.loggedIn.value) {
    if (to.name !== 'maintenance') {
      next({ name: 'maintenance' })
    }
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresUnAuth = to.matched.some(record => record.meta.requiresAuth === false)

  if (requiresAuth && !auth?.loggedIn.value) {
    next({ name: 'login' })
  } else if (requiresUnAuth && auth?.loggedIn.value) {
    next({ name: 'index' })
  } else {
    next()
  }
})

export default router
