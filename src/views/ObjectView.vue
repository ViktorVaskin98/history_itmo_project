<template>
  <!-- Если проект найден, показываем его -->
  <div v-if="project" class="min-h-screen bg-[#f4f1ea] text-stone-900 pb-20">
    
    <!-- Навигация (Кнопка назад) -->
    <nav class="p-6">
      <button @click="router.push('/')" class="flex items-center text-stone-500 hover:text-amber-700 transition font-sans text-sm tracking-widest uppercase font-semibold">
        <span>← Назад к карте</span>
      </button>
    </nav>

    <div class="max-w-5xl mx-auto px-6 mt-8">
      <!-- Заголовок -->
      <header data-aos="fade-down" class="mb-12 text-center border-b border-stone-300 pb-10">
        <h1 class="text-5xl md:text-7xl font-serif font-bold text-stone-800 mb-4">{{ project.title }}</h1>
        <p class="text-xl text-stone-600 font-serif italic">Архитектор: {{ project.architect }} | {{ project.year }} год</p>
      </header>

      <!-- Главная ИИ-картинка (Современность) -->
      <section data-aos="fade-down" class="mb-16">
        <div class="relative w-full h-[60vh] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
          <!-- Заглушка, пока нет реальных фоток. Удали bg-stone-300, когда вставишь src -->
          <img :src="project.images.modern" :alt="project.title" class="w-full h-full object-cover bg-stone-300" />
          <div class="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 text-xs tracking-wider backdrop-blur-sm">
            Нейросетевая реконструкция (Современность)
          </div>
        </div>
      </section>

        <!-- Внутри <div class="max-w-5xl mx-auto ...">, после блока с главной картинкой -->

<!-- Текстовое описание -->
    <section class="mb-16 max-w-3xl mx-auto font-sans text-stone-700 text-lg leading-relaxed space-y-6">
        <p>{{ project.fullDesc }}</p>
  
  <!-- НОВЫЕ БЛОКИ -->
    <div class="border-t border-stone-300 pt-6">
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
    <div class="border-t border-stone-300 pt-6 bg-stone-100 p-6 rounded-sm">
        <h3 class="font-serif text-2xl font-bold text-stone-800 mb-2">Что, если бы?..</h3>
        <p class="italic">{{ project.whatIf }}</p>
    </div>
    </section>

<!-- Дальше идет блок с картинками сравнения -->

      <!-- Блок сравнения: Чертеж и Историческая ИИ-фотка -->
      <section data-aos="fade-down" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Чертеж -->
        <div class="flex flex-col">
          <div class="h-80 bg-stone-200 border border-stone-300 p-2 shadow-inner">
            <img :src="project.images.blueprint" class="w-full h-full object-contain" alt="Оригинальный чертеж" />
          </div>
          <p class="text-center text-sm mt-3 text-stone-500 font-serif italic">Оригинальный проектный чертеж</p>
        </div>
        
        <!-- Историческая визуализация -->
        <div class="flex flex-col">
          <div class="h-80 bg-stone-200 border border-stone-300 p-2 shadow-inner">
            <img :src="project.images.historical" class="w-full h-full object-cover sepia-[.3]" alt="Историческая визуализация" />
          </div>
          <p class="text-center text-sm mt-3 text-stone-500 font-serif italic">Историческая визуализация (1930-е)</p>
        </div>
      </section>
      
    </div>
  </div>

  <!-- Если юзер ввел кривой URL -->
  <div v-else class="min-h-screen bg-[#f4f1ea] flex items-center justify-center">
    <h1 class="text-2xl font-serif">Проект не найден...</h1>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

// Получаем ID из URL (например, /object/dvorec-sovetov)
const projectId = route.params.id

// Достаем конкретный проект из нашей БД
const project = computed(() => store.getProjectById(projectId))
</script>