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
  ]
})

export default router