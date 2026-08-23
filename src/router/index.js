import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: () => import('@/views/WeatherHomeView.vue'),
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('@/views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('@/views/WeatherDetailView.vue'),
  },
  {
    path: '/pinia',
    name: 'PiniaPractice',
    component: () => import('@/views/PiniaPracticeView.vue'),
  },
  {
    path: '/axios',
    name: 'AxiosPractice',
    component: () => import('@/views/AxiosPracticeView.vue'),
  },
  {
    path: '/library',
    name: 'LibraryPractice',
    component: () => import('@/views/LibraryPracticeView.vue'),
  },
  {
    path: '/practice',
    name: 'PracticeArchive',
    component: () => import('@/views/PracticeArchiveView.vue'),
  },
  {
    path: '/practice/:practiceId',
    name: 'PracticeDetail',
    component: () => import('@/views/PracticeDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
