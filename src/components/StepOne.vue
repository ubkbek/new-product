<template>
  <div class="step-one">
    <NewProductCategory />
    <NewProductName />
    <NewProductSpecs />
    <NewProductImages />
    <NewProductVideo />
    <NewProductFeatures />
    <NewProductColorMedia />
    <NewProductDelivery />

    <!-- Premium Sticky Footer -->
    <transition name="slide-up-footer">
      <div class="sticky-footer-wrapper" v-if="showStickyFooter">
        <div class="step-action-bar">
          <div class="sab-left">
            <div class="sab-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="sab-text">
              <h4>Barcha ma'lumotlarni kiritdingizmi?</h4>
              <p>Keyingi qadamda mahsulot narxi va ombor qoldig'i sozlanadi.</p>
            </div>
          </div>
          <div class="sab-right">
            <button class="sab-btn sab-btn--primary" @click="nextStep">
              Keyingi qadam
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NewProductCategory from './NewProductCategory.vue'
import NewProductName from './NewProductName.vue'
import NewProductSpecs from './NewProductSpecs.vue'
import NewProductImages from './NewProductImages.vue'
import NewProductVideo from './NewProductVideo.vue'
import NewProductFeatures from './NewProductFeatures.vue'
import NewProductColorMedia from './NewProductColorMedia.vue'
import NewProductDelivery from './NewProductDelivery.vue'

export default {
  name: 'StepOne',
  components: {
    NewProductCategory,
    NewProductName,
    NewProductSpecs,
    NewProductImages,
    NewProductVideo,
    NewProductFeatures,
    NewProductColorMedia,
    NewProductDelivery
  },
  inject: ['showToast'],
  data() {
    return {
      showStickyFooter: false
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll(); // Initial check on load
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      // Show the footer only when the user scrolls past the top header sections (~200px)
      this.showStickyFooter = window.scrollY > 200;
    },
    nextStep() {
      this.$emit('next-step');
    }
  }
}
</script>

<style scoped>
.step-one {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-bottom: 24px;
}

.sticky-footer-wrapper {
  position: sticky;
  bottom: 24px;
  z-index: 50;
  margin-top: 40px;
}

.slide-up-footer-enter-active, .slide-up-footer-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-footer-enter, .slide-up-footer-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.step-action-bar {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.step-action-bar:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 0.95);
}

.sab-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sab-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #E0F2FE;
  color: #0284C7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sab-icon svg {
  width: 24px;
  height: 24px;
}

.sab-text {
  display: flex;
  flex-direction: column;
}

.sab-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.sab-text p {
  margin: 0;
  font-size: 14px;
  color: #6B7280;
}

.sab-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.sab-btn--primary {
  background: #22C55E;
  color: #ffffff;
}

.sab-btn--primary:hover {
  background: #16A34A;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -2px rgba(34, 197, 94, 0.25), 0 3px 6px -2px rgba(34, 197, 94, 0.15);
}

.sab-btn--primary:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .step-action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
  }
  .sab-right {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .sab-btn {
    width: 100%;
  }
}
</style>
