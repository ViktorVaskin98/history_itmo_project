<template>
  <div>
    <!-- СЕКЦИЯ 1: ОБЛОЖКА -->
    <section class="h-screen w-full relative flex items-center justify-center text-center bg-stone-800">
      <!-- Фоновое изображение (самое эпичное) -->
      <div class="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-40" style="background-image: url('/img/dvorec_hist.jpg');"></div>
      
      <div class="relative z-10 p-6 text-white" data-aos="fade-up">
        <h1 class="text-5xl md:text-8xl font-serif font-bold mb-4">Архитектурные утопии России</h1>
        <p class="text-lg md:text-xl font-sans max-w-3xl mx-auto mb-8">
          Интерактивная нейросетевая реконструкция нереализованных проектов советского авангарда 1920–1930-х годов.
        </p>
        <a href="#map-section" class="bg-amber-700 text-white px-8 py-3 rounded-sm hover:bg-amber-800 transition font-bold uppercase tracking-wider text-sm shadow-lg">
          Перейти к исследованию
        </a>
      </div>
    </section>

    <!-- СЕКЦИЯ 2: КАРТА -->
    <section id="map-section" class="py-20 bg-[#f4f1ea]">
      <div class="max-w-7xl mx-auto px-6 text-center mb-12">
        <h2 class="text-4xl font-serif font-bold text-stone-800">Интерактивная карта проектов</h2>
        <p class="text-lg text-stone-600 mt-2">Выберите объект на карте, чтобы ознакомиться с его историей и нейросетевой реконструкцией.</p>
      </div>
      <!-- Карта теперь занимает не весь экран, а 70% высоты окна -->
      <div class="h-[70vh] w-full border-y-2 border-stone-300 shadow-inner">
        <MapLeaflet />
      </div>
    </section>
  </div>
</template>

<script setup>
import MapLeaflet from '../components/MapLeaflet.vue'
</script>