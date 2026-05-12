<template>
  <!-- Жестко задаем 100vh, чтобы карта не схлопнулась -->
  <div id="map" style="height: 100vh; width: 100%; z-index: 0;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ЖЕЛЕЗОБЕТОННЫЙ ФИКС ИКОНОК
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const router = useRouter()
const store = useProjectsStore()

onMounted(() => {
  setTimeout(() => {
    const map = L.map('map', {
      zoomControl: false // Уберем дефолтный зум (добавим ниже красиво)
    }).setView([57.5, 35.0], 6);
    
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // СВЕТЛАЯ КАРТА (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    store.getAllProjects.forEach(project => {
      const marker = L.marker(project.coords).addTo(map);
      
      // Красивый светлый поп-ап с кнопкой
      const popupContent = `
        <div class="text-center p-1">
          <h3 class="font-bold text-stone-800 text-lg mb-1 font-serif">${project.title}</h3>
          <p class="text-sm text-stone-600 mb-3">${project.architect}, ${project.year}</p>
          <button id="btn-${project.id}" class="bg-amber-700 text-white px-4 py-1.5 rounded-sm hover:bg-amber-800 transition font-medium w-full shadow-sm">
            Изучить проект
          </button>
        </div>
      `;
      marker.bindPopup(popupContent);

      // Логика перехода по клику на кнопку
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-${project.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            router.push(`/object/${project.id}`);
          });
        }
      });
    });
    
    map.invalidateSize();
  }, 100);
});
</script>

<style>
/* КИЛЛЕР-ФИЧА: Делаем карту визуально состаренной (сепия + контраст) */
.leaflet-layer {
  filter: sepia(0.4) contrast(0.95) brightness(0.95);
}

/* Стилизуем поп-апы под бумагу */
.leaflet-popup-content-wrapper {
  background-color: #faf8f5 !important;
  border: 1px solid #d6d3d1 !important;
  border-radius: 0.25rem !important; /* Квадратные ретро-углы */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}
.leaflet-popup-tip {
  background-color: #faf8f5 !important;
  border: 1px solid #d6d3d1 !important;
}
</style>