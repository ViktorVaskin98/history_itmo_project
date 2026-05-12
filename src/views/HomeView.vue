<template>
  <div class="relative w-full h-screen overflow-hidden">
    
    <!-- Информационная плашка: светлая, с легкой тенью и шрифтом с засечками для заголовка -->
    <div class="absolute top-8 left-8 z-[1000] bg-[#faf8f5]/95 p-6 rounded-sm shadow-xl border border-stone-300 max-w-sm backdrop-blur-sm">
      <h1 class="text-2xl font-bold text-stone-800 mb-2 leading-tight font-serif">
        Архитектурные утопии России
      </h1>
      <p class="text-stone-600 text-sm mb-4">
        Интерактивная нейросетевая реконструкция нереализованных проектов 1920–1930-х годов.
      </p>
      <div class="text-xs text-amber-700 font-bold uppercase tracking-wider">
        Выберите объект на карте ↘
      </div>
    </div>
    
    <!-- Сама карта -->
    <MapLeaflet />

  </div>
</template>

<script setup>
import MapLeaflet from '../components/MapLeaflet.vue'
</script>