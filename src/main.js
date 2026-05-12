import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

// ПОДКЛЮЧАЕМ AOS
import AOS from 'aos'
import 'aos/dist/aos.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// ЗАПУСКАЕМ AOS ПОСЛЕ ТОГО КАК ПРИЛОЖЕНИЕ СМОНТИРОВАНО
AOS.init({
  duration: 800, // длительность анимации (0.8 сек)
  once: true,    // анимировать только один раз при скролле вниз
  offset: 100    // смещение (начинать анимацию чуть раньше)
})