import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ObjectView from '../views/ObjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // Динамический путь: вместо :id будет подставляться bashnya-tatlina и т.д.
      path: '/object/:id',
      name: 'object',
      component: ObjectView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // 1. Если в адресе есть хэш (как наш #map-section)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', // Добавит плавную прокрутку, будет красиво
      }
    }
    
    // 2. Если мы просто переходим на новую страницу без хэша
    return { top: 0 }
  }
})

export default router