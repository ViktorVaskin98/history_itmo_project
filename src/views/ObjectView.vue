<template>
  <div v-if="project" class="min-h-screen bg-[#f4f1ea] text-stone-900 pb-20 relative">
    
    <!-- Навигация -->
    <nav class="p-6">
      <button @click="router.push({ path: '/', hash: '#map-section' })" class="flex items-center text-stone-500 hover:text-amber-700 transition font-sans text-sm tracking-widest uppercase font-semibold">
        <span>← Назад к карте</span>
      </button>
    </nav>

    <div class="max-w-5xl mx-auto px-6 mt-4">
      <!-- Заголовок -->
      <header data-aos="fade-down" class="mb-12 text-center border-b border-stone-300 pb-10">
        <h1 class="text-5xl md:text-7xl font-serif font-bold text-stone-800 mb-4">{{ project.title }}</h1>
        <p class="text-xl text-stone-600 font-serif italic">Архитектор: {{ project.architect }} | {{ project.year }}</p>
      </header>

      <!-- Главная ИИ-картинка -->
      <section data-aos="fade-up" class="mb-16">
        <div class="relative w-full h-[60vh] rounded-sm overflow-hidden shadow-2xl border-4 border-white group cursor-zoom-in" @click="openLightbox(project.images.modern)">
          <img :src="project.images.modern" :alt="project.title" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
          <div class="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 text-xs tracking-wider backdrop-blur-sm pointer-events-none">
            Нейросетевая реконструкция (Современность)
          </div>
        </div>
      </section>

      <!-- Текстовое описание -->
      <section data-aos="fade-up" data-aos-delay="100" class="mb-16 max-w-3xl mx-auto font-sans text-stone-700 text-lg leading-relaxed space-y-6">
        <p class="text-xl font-medium text-stone-900">{{ project.shortDesc }}</p>
        <p>{{ project.fullDesc }}</p>
        
        <div class="border-t border-stone-300 pt-6 mt-8">
          <h3 class="font-serif text-2xl font-bold text-stone-800 mb-2">Контекст и замысел</h3>
          <p>{{ project.context }}</p>
        </div>
        <div class="border-t border-stone-300 pt-6">
          <h3 class="font-serif text-2xl font-bold text-stone-800 mb-2">Масштаб и местоположение</h3>
          <p>{{ project.scale }} {{ project.locationDetails }}</p>
        </div>
        <div class="border-t border-stone-300 pt-6">
          <h3 class="font-serif text-2xl font-bold text-stone-800 mb-2">Причина отмены и наследие</h3>
          <p>{{ project.cancellationReason }} {{ project.legacy }}</p>
        </div>
        <div class="border-t border-stone-300 pt-6 bg-stone-200/50 p-6 rounded-sm">
          <h3 class="font-serif text-2xl font-bold text-stone-800 mb-2">Что, если бы?..</h3>
          <p class="italic text-stone-600">{{ project.whatIf }}</p>
        </div>
      </section>

      <!-- Блок сравнения: Чертеж и Историческая ИИ-фотка -->
      <section data-aos="fade-up" data-aos-delay="200" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Чертеж -->
        <div class="flex flex-col">
          <div class="h-80 bg-[#ebe7df] border border-stone-300 p-2 shadow-inner cursor-zoom-in hover:shadow-md transition" @click="openLightbox(project.images.blueprint)">
            <img :src="project.images.blueprint" class="w-full h-full object-contain" alt="Чертеж" />
          </div>
          <p class="text-center text-sm mt-3 text-stone-500 font-serif italic">Оригинальный проектный чертеж</p>
        </div>
        
        <!-- Историческая визуализация -->
        <div class="flex flex-col">
          <div class="h-80 bg-stone-200 border border-stone-300 p-2 shadow-inner cursor-zoom-in hover:shadow-md transition" @click="openLightbox(project.images.historical)">
            <img :src="project.images.historical" class="w-full h-full object-cover sepia-[.3]" alt="Историческая визуализация" />
          </div>
          <p class="text-center text-sm mt-3 text-stone-500 font-serif italic">Историческая визуализация</p>
        </div>
      </section>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО LIGHTBOX (на весь экран) -->
    <transition name="fade">
      <div v-if="isLightboxOpen" class="fixed inset-0 z-[6000] bg-stone-900/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm cursor-zoom-out" @click="closeLightbox">
        <button class="absolute top-6 right-8 text-white/50 hover:text-white text-5xl transition">&times;</button>
        <img :src="currentImage" class="max-w-full max-h-full rounded-sm shadow-2xl border-4 border-stone-300" @click.stop />
      </div>
    </transition>

  </div>
  <div v-else class="min-h-screen bg-[#f4f1ea] flex items-center justify-center">
    <h1 class="text-2xl font-serif text-stone-800">Проект не найден...</h1>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

const projectId = route.params.id
const project = computed(() => store.getProjectById(projectId))

// Логика Lightbox
const isLightboxOpen = ref(false)
const currentImage = ref('')

const openLightbox = (imgSrc) => {
  currentImage.value = imgSrc
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden' // Убираем скролл страницы
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.style.overflow = 'auto' // Возвращаем скролл
}
</script>

<style scoped>
/* Анимация для лайтбокса */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>