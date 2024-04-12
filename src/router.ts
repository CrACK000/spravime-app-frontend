import { createRouter, createWebHistory } from 'vue-router'
import { inject } from 'vue'
import { logout } from "@/plugins/logout"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',                    name: 'index',        component: () => import('@/views/Home.vue') },
    { path: '/maintenance',         name: 'maintenance',  component: () => import('@/views/Maintenance.vue') },
    { path: '/search',              name: 'workers',      component: () => import('@/views/WorkersList.vue') },
    { path: '/requests',            name: 'requests',     component: () => import('@/views/RequestsList.vue') },
    { path: '/offers',              name: 'offers',       component: () => import('@/views/OffersList.vue') },
    { path: '/request/:requestId',  name: 'request',      component: () => import('@/views/RequestDetails.vue') },
    { path: '/profile/:userId',     name: 'profile',      component: () => import('@/views/UserProfile.vue') },
    {
      path: '/account',
      component: () => import('@/views/authentication/user/Account.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/account/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/authentication/user/DashboardPanel.vue')
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/authentication/user/MessagesPanel.vue')
        },
        {
          path: 'requests',
          children: [
            {
              path: '',
              name: 'user-requests',
              component: () => import('@/views/authentication/user/RequestsPanel.vue')
            },
            {
              path: 'create',
              name: 'create-request',
              component: () => import('@/views/authentication/user/CreateRequestPanel.vue')
            }
          ]
        },
        {
          path: 'offers',
          children: [
            {
              path: '',
              name: 'user-offers',
              component: () => import('@/views/authentication/user/OffersPanel.vue'),
            },
            {
              path: 'create',
              name: 'create-offer',
              component: () => import('@/views/authentication/user/CreateOfferPanel.vue')
            }
          ]
        },
        { path: 'profile',            name: 'user-account',        component: () => import('@/views/authentication/user/ProfilePanel.vue') },
        { path: 'gallery',            name: 'user-gallery',        component: () => import('@/views/authentication/user/GalleryPanel.vue') },
        { path: 'security',           name: 'user-security',       component: () => import('@/views/authentication/user/SecurityPanel.vue') },
        { path: 'stats',              name: 'user-stats',          component: () => import('@/views/authentication/user/StatsPanel.vue') },
        { path: 'plus',               name: 'user-plus',           component: () => import('@/views/authentication/user/PlusPanel.vue') },
        {
          path: 'logout',
          name: 'logout',
          component: { template: '' },
          async beforeEnter(to, from, next) {
            await logout()
            next({ name: 'home' })
          } },
      ]
    },
    { path: '/account/create',  name: 'register', meta: { transition: 'fade', requiresAuth: false },  component: () => import('@/views/authentication/guest/Register.vue') },
    { path: '/account/login',   name: 'login',    meta: { transition: 'fade', requiresAuth: false },  component: () => import('@/views/authentication/guest/Login.vue') },
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

  if (auth) {
    await auth.checkAuth()

    /*if (!auth?.loggedIn.value) {
      if (to.name !== 'maintenance') {
        return next({ name: 'maintenance' })
      }
    }*/
  }

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token')
    return !!token
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isUserLoggedIn()) {
      return next({ name: 'login' })
    }
  }

  return next()

})

router.afterEach((to, from, next) => {
  //
})

export default router
