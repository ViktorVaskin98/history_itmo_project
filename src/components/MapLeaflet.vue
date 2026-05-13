<template>
  <div class="relative h-full w-full">
    <!-- Кнопки быстрого перемещения -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex gap-2 bg-[#faf8f5]/90 p-2 rounded-sm border border-stone-300 shadow-lg backdrop-blur-sm">
      <button @click="flyTo(55.75, 37.61, 12)" class="px-4 py-1 text-sm font-sans font-bold text-stone-700 hover:bg-amber-700 hover:text-white transition rounded-sm">МОСКВА</button>
      <button @click="flyTo(59.93, 30.31, 12)" class="px-4 py-1 text-sm font-sans font-bold text-stone-700 hover:bg-amber-700 hover:text-white transition rounded-sm">ПЕТЕРБУРГ</button>
      <button @click="flyTo(56.83, 60.60, 12)" class="px-4 py-1 text-sm font-sans font-bold text-stone-700 hover:bg-amber-700 hover:text-white transition rounded-sm">ЕКАТЕРИНБУРГ</button>
      <button @click="flyTo(55.03, 82.92, 12)" class="px-4 py-1 text-sm font-sans font-bold text-stone-700 hover:bg-amber-700 hover:text-white transition rounded-sm">НОВОСИБИРСК</button>
      <button @click="flyTo(57.5, 35.0, 4)" class="px-4 py-1 text-sm font-sans font-bold text-stone-500 hover:bg-stone-200 transition rounded-sm">ВЕСЬ МАСШТАБ</button>
    </div>
    
    <div id="map" class="h-full w-full z-0"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ИМПОРТЫ ДЛЯ КЛАСТЕРОВ
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Фикс стандартных иконок для сборки Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const router = useRouter()
const store = useProjectsStore()

// Глобальная переменная для карты
let leafletMap = null;

// Функция полета (должна быть на верхнем уровне, чтобы шаблон ее видел)
const flyTo = (lat, lng, zoom) => {
  if (leafletMap) {
    leafletMap.flyTo([lat, lng], zoom, {
      animate: true,
      duration: 1.5 // Плавный полет 1.5 секунды
    });
  }
}

onMounted(() => {
  // Даем DOM дереву долю секунды на отрисовку div#map
  setTimeout(() => {
    
    // 1. Инициализация карты (изменил начальный зум на 4 для лучшего вида)
    leafletMap = L.map('map', { zoomControl: false, attributionControl: false }).setView([57.5, 35.0], 4);
    
    // 2. Добавляем красивый зум в правый нижний угол
    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

    // 3. Подключаем светлую карту (под бумагу)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 18
    }).addTo(leafletMap);

    // 4. ИСТОРИЧЕСКИЕ ФУНДАМЕНТЫ (Отпечатки зданий на карте)
    const footprints = {
      'dvorec-sovetov': L.circle([55.7443, 37.6054], { radius: 140, color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'bashnya-tatlina': L.circle([59.9479, 30.2905], { radius: 55, color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'narkomtyazhprom': L.polygon([
        [55.7548, 37.6215], [55.7530, 37.6235],
        [55.7515, 37.6210], [55.7535, 37.6185]
      ], { color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'letayushij-gorod': L.circle([55.7558, 37.6173], { radius: 450, color: '#c2410c', weight: 2, dashArray: '10, 10', fillColor: '#c2410c', fillOpacity: 0.05 }), // Пунктирная тень
      'dvorec-truda': L.polygon([
        [55.7585, 37.6160], [55.7580, 37.6175],
        [55.7565, 37.6160], [55.7570, 37.6145]
      ], { color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'teatr-sverdlovsk': L.circle([56.8389, 60.6057], { radius: 60, color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 }),
      'dom-nauki-sibir': L.circle([55.0302, 82.9204], { radius: 40, color: '#c2410c', weight: 2, fillColor: '#c2410c', fillOpacity: 0.15 })
    };

    // 5. СОЗДАЕМ ГРУППУ КЛАСТЕРОВ
    const markersGroup = L.markerClusterGroup({
      maxClusterRadius: 30,
      showCoverageOnHover: false, // Убираем синий многоугольник при наведении
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      // Кастомный дизайн для сгруппированных точек
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="cluster-inner"><span>${count}</span></div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40),
        });
      }
    });

    // 6. Проходимся по БД и ставим маркеры
    store.getAllProjects.forEach((project, index) => {
      
      // Отрисовываем фундамент прямо на карту (их кластеризовать не нужно)
      if (footprints[project.id]) {
        footprints[project.id].addTo(leafletMap);
      }

      // Создаем кастомную иконку (красная капля с номером)
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin"></div><div class="marker-text">${index + 1}</div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -35] // Чтобы окошко открывалось над маркером
      });

      // Ставим маркер, НО НЕ ДОБАВЛЯЕМ СРАЗУ НА КАРТУ
      const marker = L.marker(project.coords, { icon: customIcon });
      
      // Верстаем поп-ап
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

      // Логика перехода при клике
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-${project.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            router.push(`/object/${project.id}`);
          });
        }
      });

      // ДОБАВЛЯЕМ МАРКЕР В КЛАСТЕРНУЮ ГРУППУ
      markersGroup.addLayer(marker);
    });
    
    // 7. ДОБАВЛЯЕМ ВСЮ ГРУППУ КЛАСТЕРОВ НА КАРТУ
    leafletMap.addLayer(markersGroup);

    // Пересчет размеров при загрузке
    leafletMap.invalidateSize();
    
  }, 100); // Закрываем setTimeout
}); // Закрываем onMounted
</script>

<style>
/* Эффект старой карты (сепия + контраст) */
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
  background: #b45309;
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
  top: 9px;
  left: 0;
  width: 30px;
  color: #faf8f5;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}

/* =========================================
   СТИЛИ ДЛЯ НОВЫХ КЛАСТЕРОВ (СГРУППИРОВАННЫХ ТОЧЕК)
   ========================================= */
.custom-cluster-icon {
  background: none;
  border: none;
}

.cluster-inner {
  width: 44px;
  height: 44px;
  background-color: #b45309; /* Янтарный цвет, как у маркеров */
  border: 3px solid #faf8f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #faf8f5;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: all 0.2s ease;
}

.cluster-inner:hover {
  transform: scale(1.1);
  background-color: #92400e; /* Чуть темнее при наведении */
}

/* Линии "паутинки", когда маркеры разлетаются на максимальном зуме */
.leaflet-cluster-spider-leg {
  stroke: #b45309 !important;
  stroke-opacity: 0.6;
  stroke-width: 2px !important;
}
</style>