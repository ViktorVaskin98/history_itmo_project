<template>
  <div id="map" style="height: 100%; width: 100%; z-index: 0;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Фикс стандартных иконок для сборки Vite
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
    // Инициализация карты без дефолтного зума слева сверху
    const map = L.map('map', {
      zoomControl: false 
    }).setView([57.5, 35.0], 6);
    
    // Добавляем красивый зум в правый нижний угол
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Подключаем светлую карту (под бумагу)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 18
    }).addTo(map);

    // ИСТОРИЧЕСКИЕ ФУНДАМЕНТЫ (Отпечатки зданий на карте)
    const footprints = {
      'dvorec-sovetov': L.circle([55.7443, 37.6054], { radius: 140, color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'bashnya-tatlina': L.circle([59.9479, 30.2905], { radius: 55, color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'narkomtyazhprom': L.polygon([
        [55.7548, 37.6215], [55.7530, 37.6235],
        [55.7515, 37.6210], [55.7535, 37.6185]
      ], { color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'letayushij-gorod': L.circle([55.7558, 37.6173], { radius: 450, color: '#c2410c', weight: 2, dashArray: '10, 10', fillColor: '#c2410c', fillOpacity: 0.05 }), // Пунктирная огромная тень
      'dvorec-truda': L.polygon([
        [55.7585, 37.6160], [55.7580, 37.6175],
        [55.7565, 37.6160], [55.7570, 37.6145]
      ], { color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 })
    };

    // Проходимся по БД и ставим маркеры
    store.getAllProjects.forEach((project, index) => {
      
      // 1. Отрисовываем фундамент, если он есть
      if (footprints[project.id]) {
        footprints[project.id].addTo(map);
      }

      // 2. Создаем кастомную иконку (красная капля с номером)
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin"></div><div class="marker-text">${index + 1}</div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -35] // Чтобы окошко открывалось над маркером, а не перекрывало его
      });

      // 3. Ставим маркер
      const marker = L.marker(project.coords, { icon: customIcon }).addTo(map);
      
      // 4. Верстаем красивый поп-ап
      const popupContent = `
        <div class="text-center p-1 w-48">
          <h3 class="font-bold text-stone-800 text-lg mb-0 font-serif leading-tight">${project.title}</h3>
          <p class="text-xs text-stone-500 mb-3 italic">${project.architect}</p>
          <button id="btn-${project.id}" class="bg-amber-700 text-white px-4 py-1.5 rounded-sm hover:bg-amber-800 transition font-medium text-sm w-full shadow-sm">
            Исследовать
          </button>
        </div>
      `;
      marker.bindPopup(popupContent);

      // 5. Логика перехода при клике
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-${project.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            router.push(`/object/${project.id}`);
          });
        }
      });
    });
    
    // Пересчет размеров при загрузке (чтобы не было серых зон)
    map.invalidateSize();
  }, 100);
});
</script>

<style>
/* КИЛЛЕР-ФИЧА: Эффект старой карты (сепия + контраст) */
.leaflet-layer {
  filter: sepia(0.4) contrast(0.95) brightness(0.95);
}

/* Стилизуем поп-апы под старую бумагу */
.leaflet-popup-content-wrapper {
  background-color: #faf8f5 !important;
  border: 1px solid #d6d3d1 !important;
  border-radius: 0.25rem !important; 
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}
.leaflet-popup-tip {
  background-color: #faf8f5 !important;
  border: 1px solid #d6d3d1 !important;
}

/* СТИЛИ ДЛЯ КРАСНЫХ КУРСОРО-МАРКЕРОВ */
.custom-div-icon {
  position: relative;
  text-align: center;
}
.marker-pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: #b45309; /* Исторический сургучный цвет */
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
  border: 2px solid #faf8f5;
  box-shadow: 0 3px 6px rgba(0,0,0,0.3);
}
.marker-text {
  position: absolute;
  top: 4px; /* Выравнивание номера внутри капли */
  left: 0;
  width: 30px;
  color: #faf8f5;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}
</style>