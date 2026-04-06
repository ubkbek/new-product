<template>
  <div id="app">
    <div class="container-large">
      <NewProductSteps
        :currentStep="currentStep"
        :canProceed="currentStep === 1 ? step1Valid : step2Valid"
        :validationMessage="currentStep === 1 ? step1ValidationMessage : step2ValidationMessage"
        @change-step="updateStep"
        @validation-fail="handleValidationFail"
      />
    </div>
    
    <div class="container-small" v-if="currentStep === 1">
      <StepOne @next-step="updateStep(2)" />
    </div>
    
    <div v-else-if="currentStep === 2">
      <NewProductPricing @change-step="updateStep" />
    </div>

    <div class="container-large" v-else-if="currentStep === 3">
      <NewProductPreview @change-step="updateStep" />
    </div>

    <!-- Global Toasts Container -->
    <div class="custom-toast-container">
      <transition-group name="toast-fade">
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="custom-toast" 
          :class="'custom-toast--' + toast.type"
        >
          <div class="custom-toast-icon">
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <p class="custom-toast-message">{{ toast.message }}</p>
          <button class="custom-toast-close" @click="removeToast(toast.id)">&times;</button>
        </div>
      </transition-group>
    </div>

    <!-- Global Custom Alert -->
    <transition name="fade">
      <div v-if="newProduct.alert.show" class="custom-alert-overlay" @click.self="closeAlert">
        <div class="custom-alert-modal" :class="'custom-alert-modal--' + newProduct.alert.type">
          <div class="custom-alert-icon-wrap">
            <svg v-if="newProduct.alert.type === 'success'" class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="newProduct.alert.type === 'error'" class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="custom-alert-title">{{ newProduct.alert.title }}</h3>
          <p class="custom-alert-message">{{ newProduct.alert.message }}</p>
          <button class="custom-alert-btn" @click="closeAlert">Tushunarli</button>
        </div>
      </div>
    </transition>

    <!-- Global Live Preview Drawer -->
    <LivePreviewDrawer 
      :show="showLivePreview" 
      @close="showLivePreview = false" 
    />

    <!-- Floating Toggle Button -->
    <button 
      v-if="currentStep < 3 && !showLivePreview"
      class="live-preview-trigger" 
      :class="{ 'live-preview-trigger--active': showLivePreview }"
      @click="showLivePreview = !showLivePreview"
    >
      <div class="live-preview-trigger-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      </div>
      <span class="live-preview-trigger-text">Xaridorda ko'rinishi</span>
    </button>
  </div>
</template>

<script>
import NewProductSteps from './components/NewProductSteps.vue'
import StepOne from './components/StepOne.vue'
import NewProductPricing from './components/NewProductPricing.vue'
import NewProductPreview from './components/NewProductPreview.vue'
import LivePreviewDrawer from './components/LivePreviewDrawer.vue'

export default {
  name: 'App',
  components: {
    NewProductSteps,
    StepOne,
    NewProductPricing,
    NewProductPreview,
    LivePreviewDrawer
  },
  data() {
    const savedStep = localStorage.getItem('currentStep');
    const savedProductRaw = localStorage.getItem('newProduct');
    const savedProduct = savedProductRaw ? JSON.parse(savedProductRaw) : {};
    
    return {
      currentStep: savedStep ? parseInt(savedStep) : 1,
      newProduct: {
        title: savedProduct.title || '',
        title_ru: savedProduct.title_ru || '',
        category_id: savedProduct.category_id || null,
        inner_category_id: savedProduct.inner_category_id || null,
        child_category_id: savedProduct.child_category_id || null,
        images: savedProduct.images || [],
        imageHashes: savedProduct.imageHashes || [],
        imageLink: savedProduct.imageLink || '',
        searchQuery: savedProduct.searchQuery || '',
        productSku: savedProduct.productSku || '',
        specs: {
          selectedVariant: (savedProduct.specs && savedProduct.specs.selectedVariant) || 'manual',
          manualUz: (savedProduct.specs && savedProduct.specs.manualUz) || '',
          manualRu: (savedProduct.specs && savedProduct.specs.manualRu) || '',
          isGeneratingAI: (savedProduct.specs && savedProduct.specs.isGeneratingAI) || false,
          aiError: (savedProduct.specs && savedProduct.specs.aiError) || '',
          variants: (savedProduct.specs && savedProduct.specs.variants) || []
        },
        video: {
          activeTab: (savedProduct.video && savedProduct.video.activeTab) || 'upload',
          videoFile: null,
          videoLink: (savedProduct.video && savedProduct.video.videoLink) || '',
          videoId: (savedProduct.video && savedProduct.video.videoId) || null
        },
        features: savedProduct.features || [],
        delivery: {
          selectedDelivery: (savedProduct.delivery && savedProduct.delivery.selectedDelivery) || 1,
          selectedPayments: (savedProduct.delivery && savedProduct.delivery.selectedPayments) || [1, 2, 3, 4, 5]
        },
        skuRows: savedProduct.skuRows || [],
        colorMedia: savedProduct.colorMedia || {},
        colorMediaHashes: savedProduct.colorMediaHashes || {},
        alert: {
          show: false,
          title: '',
          message: '',
          type: 'success'
        }
      },
      showLivePreview: false,
      toasts: []
    };
  },
  created() {
    window.addEventListener('keydown', this.handleGlobalKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleGlobalKeydown);
  },
  provide() {
    return {
      sharedProduct: this.newProduct,
      showAlert: this.showAlert,
      showToast: this.showToast,
      uploadFile: this.uploadFile
    };
  },
  computed: {
    step1Valid() {
      const p = this.newProduct;
      const hasCategory = !!p.category_id && !!p.inner_category_id && !!p.child_category_id;
      const hasTitle = !!(p.title && p.title.trim());
      const hasTitleRu = !!(p.title_ru && p.title_ru.trim());
      const hasImages = p.images && p.images.length > 0;
      const isEmptyHtml = (html) => {
        if (!html) return true;
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || '';
        return text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() === '';
      };
      const hasSpecs = (() => {
        const s = p.specs;
        if (!s) return false;
        if (s.selectedVariant === 'manual') return !isEmptyHtml(s.manualUz) && !isEmptyHtml(s.manualRu);
        return s.variants && s.variants.length > 0 && !!s.selectedVariant;
      })();
      const hasColorMediaValid = Object.values(p.colorMedia || {}).every(mediaArray => {
        const count = (mediaArray || []).filter(img => img).length;
        return count === 0 || count >= 2;
      });

      return hasCategory && hasTitle && hasTitleRu && hasImages && hasSpecs && hasColorMediaValid;
    },
    step1ValidationMessage() {
      const p = this.newProduct;
      if (!p.category_id) return 'Asosiy kategoriyani tanlang.';
      if (!p.inner_category_id) return 'Ichki kategoriyani tanlang.';
      if (!p.child_category_id) return 'Kichik kategoriyani tanlang.';
      if (!p.title || !p.title.trim()) return 'Mahsulot nomini (O\'zbek tilida) kiriting.';
      if (!p.title_ru || !p.title_ru.trim()) return 'Mahsulot nomini (Rus tilida) kiriting.';
      // Specs validation (must match UI order: comes before Images)
      const isEmptyHtml = (html) => {
        if (!html) return true;
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || '';
        return text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() === '';
      };
      
      const s = p.specs;
      if (!s || (s.selectedVariant !== 'manual' && (!s.variants || s.variants.length === 0 || !s.selectedVariant))) {
        return 'Texnik parametrlarni to\'ldiring.';
      }
      if (s.selectedVariant === 'manual') {
        if (isEmptyHtml(s.manualUz)) return 'Texnik parametrni o\'zbek tilida kiritish majburiy.';
        if (isEmptyHtml(s.manualRu)) return 'Texnik parametrni rus tilida kiritish majburiy.';
      }

      // Images validation
      if (!p.images || p.images.length === 0) return 'Kamida 1 ta rasm yuklang.';

      // Check color media counts (min 2 or 0)
      for (const [colorName, mediaArray] of Object.entries(p.colorMedia || {})) {
        const count = (mediaArray || []).filter(img => img).length;
        if (count === 1) {
          return `${colorName} uchun kamida 2 ta rasm yuklash kerak.`;
        }
      }

      return 'Iltimos, barcha majburiy maydonlarni to\'ldiring.';
    },
    step2Valid() {
      const p = this.newProduct;
      if (!p.skuRows || p.skuRows.length === 0) return false;
      return p.skuRows.every(row => {
        const skus = p.skuRows.map(r => (r.sku || '').trim().toLowerCase());
        const isUnique = skus.filter(s => s === (row.sku || '').trim().toLowerCase()).length === 1;
        return (
          row.sku && 
          row.sku.trim() && 
          isUnique &&
          Number(row.totalQuantity) >= 0 &&
          Number(row.minSaleQuantity) >= 1 &&
          Number(row.price) >= 0 &&
          Number(row.discount) <= Number(row.price)
        );
      });
    },
    step2ValidationMessage() {
      const p = this.newProduct;
      if (!p.skuRows || p.skuRows.length === 0) return 'Variantlar generatsiya qilinmagan.';
      
      const skus = p.skuRows.map(r => (r.sku || '').trim().toLowerCase());
      const hasEmptySku = skus.some(s => !s);
      if (hasEmptySku) return 'Barcha variantlar uchun SKU kiritilishi shart.';
      
      const hasDuplicates = skus.some((s, i) => skus.indexOf(s) !== i);
      if (hasDuplicates) return 'SKU kodlari takrorlanmasligi kerak.';

      for (const row of p.skuRows) {
        if (Number(row.totalQuantity) < 0) return 'Miqdor manfiy bo\'lmasin.';
        if (Number(row.minSaleQuantity) < 1) return 'Eng kam sotish miqdori 1 ta bo\'lishi kerak.';
        if (Number(row.price) < 0) return 'Narx manfiy bo\'lmasin.';
        if (Number(row.discount) > Number(row.price)) return 'Chegirma narxdan katta bo\'lmasin.';
      }
      
      return 'Iltimos, jadvaldagi barcha ma’lumotlarni to‘g‘ri to‘ldiring.';
    }
  },
  watch: {
    newProduct: {
      deep: true,
      handler(newVal) {
        localStorage.setItem('newProduct', JSON.stringify(newVal));
        console.log('New Product Updated:', JSON.parse(JSON.stringify(newVal)));
      }
    }
  },
  methods: {
    updateStep(stepId) {
      if (stepId > this.currentStep) {
        const error = (this.currentStep === 1) ? this.step1ValidationMessage : this.step2ValidationMessage;
        if ((this.currentStep === 1 && !this.step1Valid) || (this.currentStep === 2 && !this.step2Valid)) {
          this.handleValidationFail(error);
          return;
        }
      }
      this.currentStep = stepId;
      localStorage.setItem('currentStep', stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleGlobalKeydown(e) {
      if (e.key === 'Escape' && this.showLivePreview) {
        this.showLivePreview = false;
      }
    },
    handleValidationFail(message) {
      this.showToast(message, 'error');
      
      let selector = null;
      if (message === 'Asosiy kategoriyani tanlang.') selector = '.new-product-category__group:nth-child(1) .base-dropdown__header';
      else if (message === 'Ichki kategoriyani tanlang.') selector = '.new-product-category__group:nth-child(2) .base-dropdown__header';
      else if (message === 'Kichik kategoriyani tanlang.') selector = '.new-product-category__group:nth-child(3) .base-dropdown__header';
      else if (message.includes("O'zbek tilida) kiriting.")) selector = '.new-product-name__group:nth-child(1) .new-product-name__input';
      else if (message.includes("Rus tilida) kiriting.")) selector = '.new-product-name__group:nth-child(2) .new-product-name__input';
      else if (message.includes('rasm yuklang')) selector = '.new-product-images__card, .new-product-images';
      else if (message === 'Texnik parametrni o\'zbek tilida kiritish majburiy.') selector = '.new-product-specs__option--manual .new-product-specs__variant-col:nth-child(1) .base-rich-editor';
      else if (message === 'Texnik parametrni rus tilida kiritish majburiy.') selector = '.new-product-specs__option--manual .new-product-specs__variant-col:nth-child(2) .base-rich-editor';
      else if (message.includes('parametr')) selector = '.new-product-specs__card, .new-product-specs';
      else if (message.includes('rasm yuklash kerak')) selector = '.new-product-color-media__card, .new-product-color-media';
      else if (message.includes('SKU') || message.includes('miqdor') || message.includes('Narx') || message.includes('Chegirma') || message.includes('to‘g‘ri to‘ldiring')) {
        selector = '.new-product-pricing__table-wrapper, .new-product-pricing__card';
      } else {
        selector = '.step-one';
      }

      if (selector) {
        this.$nextTick(() => {
          const el = document.querySelector(selector);
          if (el) {
            const windowHeight = window.innerHeight;
            const elementHeight = el.getBoundingClientRect().height;
            const elementPosition = el.getBoundingClientRect().top;
            
            // Formula to precisely center the bounding box in the viewport
            const offsetPosition = elementPosition + window.pageYOffset - (windowHeight / 2) + (elementHeight / 2);
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // Wait for smooth scroll to finish before shaking (approx 500-600ms)
            setTimeout(() => {
              el.classList.add('shake-error-animation');
              setTimeout(() => {
                el.classList.remove('shake-error-animation');
              }, 600);
            }, 600);
          }
        });
      }
    },
    showAlert(message, type = 'success', title = '') {
      this.newProduct.alert.title = title || (type === 'success' ? 'Muvaffaqiyat' : type === 'error' ? 'Xatolik' : 'Ogohlantirish');
      this.newProduct.alert.message = message;
      this.newProduct.alert.type = type;
      this.newProduct.alert.show = true;
    },
    closeAlert() {
      this.newProduct.alert.show = false;
    },
    showToast(message, type = 'success', duration = 3000) {
      const id = Date.now();
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },
    async uploadFile(file, projectId = 12) {
      const token = localStorage.getItem('token') || '737ff01b-47d1-45df-bdfa-0ec0953091eb';
      const data = new FormData();
      data.append('file', file);
      data.append('form_element_project_id', projectId);

      const response = await fetch('https://api.cabinet.smart-market.uz/files/upload/category/ads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Serverga yuklashda xatolik');
      }

      const resData = await response.json();
      if (!resData.id) throw new Error("ID not found in response");
      return resData.id;
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@keyframes shakeError {
  0%, 100% { transform: translateX(0); }
  15%, 45%, 75% { transform: translateX(-6px); }
  30%, 60%, 90% { transform: translateX(6px); }
}

.shake-error-animation {
  animation: shakeError 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both !important;
  outline: 2px solid #EF4444 !important;
  outline-offset: 4px !important;
  border-radius: 12px !important;
  position: relative;
  z-index: 10;
}

body {
  background-color: #f6f8fb;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

#app {
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.container-large {
  max-width: 1296px;
  margin: 0 auto;
  width: 100%;
}

.container-small {
  max-width: 966px;
  margin: 0 auto;
  width: 100%;
}

.container-wide {
  width: 90%;
  margin: 0 auto;
}

.step-two-placeholder, .step-three-placeholder {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  margin-top: 20px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.step-two-title, .step-three-title {
  color: #1f2937;
  margin-bottom: 12px;
}

/* Custom Alert Styles */
.custom-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.custom-alert-modal {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  transform: scale(1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.custom-alert-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.custom-alert-icon {
  width: 36px;
  height: 36px;
}

.custom-alert-modal--success .custom-alert-icon-wrap { background: #DCFCE7; color: #22C55E; }
.custom-alert-modal--error .custom-alert-icon-wrap { background: #FEE2E2; color: #EF4444; }
.custom-alert-modal--warning .custom-alert-icon-wrap { background: #FEF3C7; color: #F59E0B; }

.custom-alert-title {
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 12px 0;
}

.custom-alert-message {
  font-size: 16px;
  color: #4B5563;
  line-height: 1.6;
  margin: 0 0 28px 0;
}

.custom-alert-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.custom-alert-btn:hover {
  background: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

/* Toast System Styles */
.custom-toast-container {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10000;
  pointer-events: none;
}

.custom-toast {
  pointer-events: auto;
  min-width: 320px;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: toast-slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.custom-toast--success { border-left: 4px solid #22C55E; }
.custom-toast--error { border-left: 4px solid #EF4444; }
.custom-toast--warning { border-left: 4px solid #F59E0B; }

.custom-toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.custom-toast--success .custom-toast-icon { color: #22C55E; }
.custom-toast--error .custom-toast-icon { color: #EF4444; }
.custom-toast--warning .custom-toast-icon { color: #F59E0B; }

.custom-toast-message {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
  flex-grow: 1;
}

.custom-toast-close {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #9CA3AF;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s ease;
}

.custom-toast-close:hover {
  color: #4B5563;
}

/* Animations */
@keyframes toast-slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.4s ease;
}
.toast-fade-enter {
  opacity: 0;
  transform: translateY(20px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter .custom-alert-modal {
  transform: scale(0.9) translateY(20px);
}

/* Floating Live Preview Trigger */
.live-preview-trigger {
  position: fixed;
  right: 50px;
  bottom: 50px;
  background-color: #ffffff;
  border: 1px solid #E2E8F0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  height: 52px;
  width: 52px;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  z-index: 2001; /* Above almost everything */
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  font-family: inherit;
  color: #1E293B;
  overflow: hidden;
  white-space: nowrap;
  position: fixed; /* Explicitly fixed again */
}

.live-preview-trigger:hover {
  width: 180px;
  padding: 0 18px;
  flex-direction: row; /* Icon on the left */
  justify-content: center;
  gap: 10px;
  border-color: #22C55E;
  color: #22C55E;
  box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.1);
}

.live-preview-trigger-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.live-preview-trigger-text {
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  width: 0;
  transform: translateX(10px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.live-preview-trigger:hover .live-preview-trigger-text {
  opacity: 1;
  width: auto;
  transform: translateX(0);
}

.live-preview-trigger--active {
  background-color: #22C55E;
  color: #ffffff;
  border-color: #22C55E;
}

@media (max-width: 600px) {
  .live-preview-trigger:hover {
    width: 48px;
    padding: 0;
  }
  .live-preview-trigger-text {
    display: none;
  }
  .live-preview-trigger {
    right: 16px;
    bottom: 80px;
  }
}
</style>
