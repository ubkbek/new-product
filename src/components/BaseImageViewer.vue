<template>
  <transition name="viewer-fade">
    <div v-if="show" class="base-image-viewer" @click.self="$emit('close')" tabindex="0" @keydown.esc="$emit('close')" @keydown.left="prev" @keydown.right="next">
      
      <!-- Close Button -->
      <button class="base-image-viewer__close" @click="$emit('close')" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Main Image Container -->
      <div class="base-image-viewer__container">
        <transition name="image-swap" mode="out-in">
          <img :key="activeIndex" :src="images[activeIndex]" class="base-image-viewer__img" alt="Fullscreen preview">
        </transition>
      </div>

      <!-- Navigation Arrows (Moved to bottom of source for stacking) -->
      <button v-if="images.length > 1" class="base-image-viewer__nav base-image-viewer__nav--prev" @click="prev" aria-label="Previous">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button v-if="images.length > 1" class="base-image-viewer__nav base-image-viewer__nav--next" @click="next" aria-label="Next">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Counter -->
      <div v-if="images.length > 1" class="base-image-viewer__counter">
        {{ activeIndex + 1 }} / {{ images.length }}
      </div>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseImageViewer',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      required: true
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeIndex: this.initialIndex
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.activeIndex = this.initialIndex;
        document.body.style.overflow = 'hidden';
        this.$nextTick(() => {
          this.$el.focus();
        });
      } else {
        document.body.style.overflow = '';
      }
    },
    initialIndex(newVal) {
      this.activeIndex = newVal;
    }
  },
  methods: {
    next() {
      if (this.activeIndex < this.images.length - 1) {
        this.activeIndex++;
      } else {
        this.activeIndex = 0; // Loop to start
      }
    },
    prev() {
      if (this.activeIndex > 0) {
        this.activeIndex--;
      } else {
        this.activeIndex = this.images.length - 1; // Loop to end
      }
    }
  },
  beforeDestroy() {
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
.base-image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(28, 28, 30, 0.75);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  z-index: 999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.base-image-viewer__close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10010;
}

.base-image-viewer__close:hover {
  background-color: rgba(239, 68, 68, 0.8);
  transform: scale(1.1);
}

.base-image-viewer__close svg {
  width: 24px;
  height: 24px;
}

.base-image-viewer__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10050; /* Higher than image */
}

.base-image-viewer__nav:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.base-image-viewer__nav svg {
  width: 32px;
  height: 32px;
}

.base-image-viewer__nav--prev { left: 40px; }
.base-image-viewer__nav--next { right: 40px; }

.base-image-viewer__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  box-sizing: border-box;
}

.base-image-viewer__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.base-image-viewer__counter {
  position: absolute;
  bottom: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Transitions */
.viewer-fade-enter-active, .viewer-fade-leave-active {
  transition: opacity 0.3s ease;
}
.viewer-fade-enter, .viewer-fade-leave-to {
  opacity: 0;
}

.image-swap-enter-active, .image-swap-leave-active {
  transition: all 0.2s ease;
}
.image-swap-enter {
  opacity: 0;
  transform: scale(0.95);
}
.image-swap-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .base-image-viewer__nav {
    width: 44px;
    height: 44px;
  }
  .base-image-viewer__nav--prev { left: 16px; }
  .base-image-viewer__nav--next { right: 16px; }
  .base-image-viewer__container { padding: 40px; }
  .base-image-viewer__close { top: 16px; right: 16px; }
}
</style>
