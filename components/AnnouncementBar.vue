<template>
  <div
    class="announcement-bar"
    :style="{
      backgroundColor: backgroundColor || '#f7f7f7',
      color: textColor || '#333',
    }"
  >
    <div class="marquee" :style="{ animationDuration: `${animationDuration}s` }">
      <!-- Inhalte werden nahtlos dupliziert -->
      <div class="marquee-content">
        <span v-for="(item, index) in loopedItems" :key="index" class="marquee-item">
          <slot name="item" v-bind:item="item">
            {{ item }}
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Props für die Inhalte und Geschwindigkeit
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  speed: {
    type: Number,
    default: 50, // Geschwindigkeit in Pixel pro Sekunde
  },
  repeatCount: {
    type: Number,
    default: 3, // Standardmäßig werden die Inhalte 3-mal dupliziert
  },
  backgroundColor: {
    type: String,
    default: null, // Optional: Standardfarbe wird gesetzt
  },
  textColor: {
    type: String,
    default: null, // Optional: Standardfarbe wird gesetzt
  },
});

// Inhalte verdoppeln basierend auf repeatCount
const loopedItems = computed(() => {
  const repeatedItems = [];
  for (let i = 0; i < props.repeatCount; i++) {
    repeatedItems.push(...props.items);
  }
  return repeatedItems;
});

// Berechnung der Animationsdauer basierend auf der Breite
const marqueeWidth = ref(0);

const animationDuration = computed(() => {
  return marqueeWidth.value / props.speed; // Gesamtbreite / Geschwindigkeit
});

onMounted(() => {
  const marqueeElement = document.querySelector(".marquee-content");
  if (marqueeElement) {
    marqueeWidth.value = marqueeElement.offsetWidth;
  }
});
</script>

<style scoped>
.announcement-bar {
  position: relative;
  overflow: hidden; /* Versteckt alles außerhalb des sichtbaren Bereichs */
  width: 100%;
  height: 30px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
}

.marquee {
  display: flex;
  white-space: nowrap;
  animation: scroll linear infinite;
}

.marquee-content {
  display: flex;
}

.marquee-item {
  display: inline-block;
  margin-right: 20px; /* Abstand zwischen den Elementen */
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* Animation */
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee {
  animation-name: scroll;
}
</style>
