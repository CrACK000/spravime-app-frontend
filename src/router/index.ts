import { createRouter, createWebHistory } from 'vue-router'
import auth from '@/auth'

import IndexView from "@/views/Home.vue";
import AllOffers from "@/views/AllOffers.vue";
import OfferDetails from "@/views/OfferDetails.vue";
import AddOffer from "@/views/AddOffer.vue";
import AllWorkers from "@/views/AllWorkers.vue";

import ProfileView from "@/views/ProfileUser.vue";

import Account from "@/views/auth/Account.vue";
import DashboardPanel from "@/views/auth/DashboardPanel.vue";
import MessagesPanel from "@/views/auth/MessagesPanel.vue";
import OffersPanel from "@/views/auth/OffersPanel.vue";
import ProfilePanel from "@/views/auth/ProfilePanel.vue";
import DesignPanel from "@/views/auth/DesignPanel.vue";
import GalleryPanel from "@/views/auth/GalleryPanel.vue";
import SecurityPanel from "@/views/auth/SecurityPanel.vue";
import StatsPanel from "@/views/auth/StatsPanel.vue";
import PlusPanel from "@/views/auth/PlusPanel.vue";
import LoginView from "@/views/auth/Login.vue";
import RegisterView from "@/views/auth/Register.vue";
import Logout from "@/plugins/logout"

let isAuthChecked = false;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/search',
      name: 'workers',
      component: AllWorkers
    },
    {
      path: '/offers',
      name: 'offers',
      component: AllOffers
    },
    {
      path: '/offers/add',
      name: 'offerAdd',
      component: AddOffer
    },
    {
      path: '/offers/:id',
      name: 'offerDetail',
      component: OfferDetails
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/account',
      component: Account,
      children: [
        { path: 'dashboard', name: 'dashboard', components: { userPanel: DashboardPanel }},

        { path: 'messages', name: 'messages', components: { userPanel: MessagesPanel }},

        { path: 'offers', name: 'my-offers', components: { userPanel: OffersPanel }},
        { path: 'offers/all', name: 'offers-all', components: { userPanel: OffersPanel }},
        { path: 'offers/waiting', name: 'offers-waiting', components: { userPanel: OffersPanel }},

        { path: 'profile', name: 'my-account', components: { userPanel: ProfilePanel }},
        { path: 'design', name: 'edit-design', components: { userPanel: DesignPanel }},
        { path: 'gallery', name: 'user-gallery', components: { userPanel: GalleryPanel }},
        { path: 'security', name: 'user-security', components: { userPanel: SecurityPanel }},
        { path: 'stats', name: 'user-stats', components: { userPanel: StatsPanel }},
        { path: 'plus', name: 'user-plus', components: { userPanel: PlusPanel }},
        { path: 'logout', name: 'logout', components: { userPanel: Logout }},
      ]
    },
    {
      path: '/account/create',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/account/login',
      name: 'login',
      component: LoginView
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!isAuthChecked) {
    await auth.checkAuth()
    isAuthChecked = true
  }
  next()
})

export default router
