<template>
  <div class="new-product-specs">
    <h2 class="new-product-specs__title">Mahsulotning texnik parametrlar</h2>
    <div class="new-product-specs__card">

      <!-- AI Alert -->
      <div class="new-product-specs__alert">
        <div class="new-product-specs__alert-icon-box">
          <svg v-if="!sharedProduct.specs.isGeneratingAI" class="new-product-specs__alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l1.65 5.56L19 9l-5.35 1.44L12 16l-1.65-5.56L5 9l5.35-1.44L12 2zM19 15l.82 2.78L22.5 18.5l-2.68.72L19 22l-.82-2.78L15.5 18.5l2.68-.72L19 15zM5 15l.82 2.78L8.5 18.5l-2.68.72L5 22l-.82-2.78L1.5 18.5l2.68-.72L5 15z" />
          </svg>
          <div v-else class="new-product-specs__loader"></div>
        </div>
        <div class="new-product-specs__alert-content">
          <p class="new-product-specs__alert-text">
            Biz sizning mahsulotingizning texnik parametrlari haqida Suniy Intellekt yordamida ma'lumotlar yig'dik. Quyida ulardan bir nechtasini ko'rishingiz mumkin. Agar biz bergan ma'lumotlar mos kelmasa quyida qo'lda kiritish imkoniyati mavjud.
          </p>
          <button 
            class="new-product-specs__ai-btn" 
            @click="generateSpecsWithAI"
            :disabled="sharedProduct.specs.isGeneratingAI || (!sharedProduct.title && !sharedProduct.title_ru)"
          >
            {{ sharedProduct.specs.isGeneratingAI ? 'Yaratilmoqda...' : 'AI orqali variantlarni yaratish' }}
          </button>
          <p v-if="sharedProduct.specs.aiError" class="new-product-specs__ai-error">{{ sharedProduct.specs.aiError }}</p>
        </div>
      </div>

      <!-- Link -->
      <a href="#" class="new-product-specs__link" @click.prevent="showGuidelineDrawer = true">
        Yo'riqnomada batafsil <span class="new-product-specs__link-arrow">&rarr;</span>
      </a>

      <!-- Options container -->
      <div class="new-product-specs__options">

        <!-- Pre-defined Variants -->
        <div 
          v-for="variant in sharedProduct.specs.variants" 
          :key="'variant-' + variant.id" 
          class="new-product-specs__option"
          :class="{ 'new-product-specs__option--active': sharedProduct.specs.selectedVariant === variant.id, 'new-product-specs__option--inactive': sharedProduct.specs.selectedVariant !== variant.id }"
          @click="sharedProduct.specs.selectedVariant = variant.id"
        >
          <div class="new-product-specs__radio-label" :class="{ 'new-product-specs__radio-label--disabled': !sharedProduct.title }">
            <input type="radio" :value="variant.id" v-model="sharedProduct.specs.selectedVariant" class="new-product-specs__radio-input" :disabled="!sharedProduct.title">
            <span class="new-product-specs__radio-custom"></span>
          </div>
          <div class="new-product-specs__variants">
            
            <!-- Uz Column -->
            <div class="new-product-specs__variant-col">
              <h4 class="new-product-specs__label">
                {{ variant.id }}-variant (O'zbek tilida)<span class="new-product-specs__required">*</span>
              </h4>
              <div class="new-product-specs__variant-card">
                <div v-for="(group, gIdx) in variant.uz.groups" :key="'uz-' + gIdx" class="new-product-specs__spec-group">
                  <h5 class="new-product-specs__spec-title">
                    <span class="new-product-specs__spec-icon">{{ group.icon }}</span> {{ group.title }}
                  </h5>
                  <ul class="new-product-specs__spec-list">
                    <li v-for="(item, iIdx) in group.items" :key="'uz-item-' + iIdx">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Ru Column -->
            <div class="new-product-specs__variant-col">
              <h4 class="new-product-specs__label">
                {{ variant.id }}-variant (Rus tilida)<span class="new-product-specs__required">*</span>
              </h4>
              <div class="new-product-specs__variant-card">
                <div v-for="(group, gIdx) in variant.ru.groups" :key="'ru-' + gIdx" class="new-product-specs__spec-group">
                  <h5 class="new-product-specs__spec-title">
                    <span class="new-product-specs__spec-icon">{{ group.icon }}</span> {{ group.title }}
                  </h5>
                  <ul class="new-product-specs__spec-list">
                    <li v-for="(item, iIdx) in group.items" :key="'ru-item-' + iIdx">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Manual Entry Option -->
        <div 
          class="new-product-specs__option new-product-specs__option--manual"
          :class="{ 'new-product-specs__option--active': sharedProduct.specs.selectedVariant === 'manual', 'new-product-specs__option--inactive': sharedProduct.specs.selectedVariant !== 'manual' }"
          @click="sharedProduct.specs.selectedVariant = 'manual'"
        >
          <div class="new-product-specs__radio-label" :class="{ 'new-product-specs__radio-label--disabled': !sharedProduct.title }">
            <input type="radio" value="manual" v-model="sharedProduct.specs.selectedVariant" class="new-product-specs__radio-input" :disabled="!sharedProduct.title">
            <span class="new-product-specs__radio-custom"></span>
          </div>
          <div class="new-product-specs__variants">
            <div class="new-product-specs__variant-col">
              <h4 class="new-product-specs__label">
                Qo'lda kiritish (O'zbek tilida)<span class="new-product-specs__required">*</span>
                <button 
                  v-if="sharedProduct.specs.manualRu"
                  class="new-product-specs__translate-btn" 
                  @click.stop="runTranslation('ru-uz')"
                  :disabled="isTranslating || sharedProduct.specs.selectedVariant !== 'manual'"
                >
                  <span v-if="translatingDir === 'ru-uz'" class="new-product-specs__loader-small"></span>
                  <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 8 6 6 6-6"/></svg>
                  Rus tilidan tarjima qilish
                </button>
              </h4>
              <BaseRichEditor 
                v-model="sharedProduct.specs.manualUz"
                placeholder="Tovaringiz, uning xususiyatlari va afzalliklari haqida aytib bering"
                :disabled="sharedProduct.specs.selectedVariant !== 'manual' || !sharedProduct.title"
              />
            </div>
            <div class="new-product-specs__variant-col">
              <h4 class="new-product-specs__label">
                Qo'lda kiritish (Rus tilida)<span class="new-product-specs__required">*</span>
                <button 
                  v-if="sharedProduct.specs.manualUz"
                  class="new-product-specs__translate-btn" 
                  @click.stop="runTranslation('uz-ru')"
                  :disabled="isTranslating || sharedProduct.specs.selectedVariant !== 'manual'"
                >
                  <span v-if="translatingDir === 'uz-ru'" class="new-product-specs__loader-small"></span>
                  <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 16-6-6-6 6"/></svg>
                  O'zbek tilidan tarjima qilish
                </button>
              </h4>
              <BaseRichEditor 
                v-model="sharedProduct.specs.manualRu"
                placeholder="Расскажите о своем товаре, его особенностях и преимуществах"
                :disabled="sharedProduct.specs.selectedVariant !== 'manual' || !sharedProduct.title"
              />
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- GUIDELINE SIDE PANEL (DRAWER) - PORTAL STYLE -->
    <transition name="drawer-slide">
      <div v-if="showGuidelineDrawer" class="pn-guideline-overlay" @click.self="showGuidelineDrawer = false">
        <div class="pn-guideline-drawer">
          <!-- Header (Matching Cabinet Design) -->
          <div class="pn-guideline-header">
            <div class="pn-guideline-header-left">
              <h3 class="pn-guideline-header-title">Texnik parametrlar yordamchisi</h3>
              <span class="pn-guideline-header-badge">TUTORIAL</span>
            </div>
            <button class="pn-guideline-close-btn" @click="showGuidelineDrawer = false">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="pn-guideline-content">
            <section class="pn-guideline-intro">
              <p class="pn-guideline-subtitle">Texnik parametrlar mahsulotning "yuragi" hisoblanadi. Ularni to‘g‘ri to‘ldirish xaridorni ishontirishning eng tez yo‘li.</p>
            </section>

            <!-- 3 Step Path -->
            <div class="pn-guideline-path">
              <h4 class="pn-guideline-section-title">Parametrlarni yig‘ish 3 qadamda</h4>
              
              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">01</div>
                <div class="pn-guideline-step-info">
                  <h5>Sun’iy Intellektdan foydalaning</h5>
                  <p>AI mahsulotingiz nomiga qarab avtomatik ravishda barcha muhim parametrlarni guruhlarga bo‘lib beradi.</p>
                </div>
              </div>

              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">02</div>
                <div class="pn-guideline-step-info">
                  <h5>Qo‘lda kiritish (Manual Override)</h5>
                  <p>Agar o‘ziga xos xususiyatlar bo‘lsa, "Qo‘lda kiritish" orqali o‘zingiz xohlagancha tahrirlang.</p>
                </div>
              </div>

              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">03</div>
                <div class="pn-guideline-step-info">
                  <h5>O’lchov birliklariga e’tibor bering</h5>
                  <p>Har bir raqamdan keyin birlikni (kg, sm, mAh, Vt) qo‘shishni unutmang. Bu SEO-ni yaxshilaydi.</p>
                </div>
              </div>
            </div>

            <!-- Formula/Reference Card -->
            <div class="pn-guideline-formula-card">
              <span class="pn-guideline-formula-label">Ideal format namunasi</span>
              <div class="pn-guideline-formula-row">
                <span class="pn-guideline-formula-item">Parametr</span>
                <span class="pn-guideline-plus">:</span>
                <span class="pn-guideline-formula-item">Qiymat</span>
                <span class="pn-guideline-plus">+</span>
                <span class="pn-guideline-formula-item">Birlik</span>
              </div>
              <div class="pn-guideline-formula-example">
                Quvvati: 1200 Vt | Vazni: 2.5 kg
              </div>
            </div>

            <!-- Comparisons -->
            <div class="pn-comparison">
              <h4 class="pn-guideline-section-title">Solishtirish</h4>
              <div class="pn-comparison-grid">
                <div class="pn-comp-box pn-comp-box--good">
                  <div class="pn-comp-header">Strukturalangan ✅</div>
                  <p>Batareya: 5000 mAh, Ekran: 6.7", Protsessor: A16 Bionic.</p>
                  <ul>
                    <li>Guruhlangan</li>
                    <li>Solishtirish oson</li>
                  </ul>
                </div>
                <div class="pn-comp-box pn-comp-box--bad">
                  <div class="pn-comp-header">Noaniq ro‘yxat ✕</div>
                  <p>Yaxshi batareykasi bor, ekrani ham katta, tez ishlaydi.</p>
                  <ul>
                    <li>Raqamli ma’lumot yo‘q</li>
                    <li>O‘qish qiyin</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Pro Tip -->
            <div class="pn-pro-tip">
              <span class="pn-pro-tip-icon">💡</span>
              <div class="pn-pro-tip-body">
                <strong>Pro Tip:</strong> Ikkala tilni (UZ/RU) ham to‘ldirish shart. AI yordamida bir tildan ikkinchi tilga tarjima qilish oson.
              </div>
            </div>

            <!-- Warnings -->
            <div class="pn-warnings">
              <h4 class="pn-guideline-section-title">Tavsiya etilmaydi</h4>
              <ul class="pn-warning-list">
                <li>Parametrlarni bitta qatorda "uymalab" yozish</li>
                <li>Faqat bitta tilda ma'lumot qoldirish</li>
                <li>Noto'g'ri o'lchov birliklarini ishlatish</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="pn-guideline-footer">
            <button class="pn-guideline-close-footer" @click="showGuidelineDrawer = false">Tushundim</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { generateProductSpecs, translateProductContent } from '../utils/ai-generator';
import BaseRichEditor from './BaseRichEditor.vue';

export default {
  name: 'NewProductSpecs',
  components: {
    BaseRichEditor
  },
  inject: ['sharedProduct', 'showToast'],
  data() {
    return {
      showGuidelineDrawer: false,
      isTranslating: false,
      translatingDir: '' // 'uz-ru' or 'ru-uz'
    };
  },
  watch: {
    showGuidelineDrawer(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', this.handleKeydown);
      } else {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', this.handleKeydown);
      }
    }
  },
  methods: {
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.showGuidelineDrawer = false;
      }
    },
    async generateSpecsWithAI() {
      if (this.sharedProduct.specs.isGeneratingAI) return;
      
      this.sharedProduct.specs.isGeneratingAI = true;
      this.sharedProduct.specs.aiError = '';
      
      try {
        const result = await generateProductSpecs(
          this.sharedProduct.title, 
          this.sharedProduct.title_ru,
          false // Live mode
        );
        
        // Update the global variants with AI suggestions
        if (Array.isArray(result) && result.length >= 2) {
          this.sharedProduct.specs.variants = result;
          this.sharedProduct.specs.selectedVariant = 1; // Default to first AI variant
        }
        
      } catch (error) {
        this.sharedProduct.specs.aiError = error.message;
      } finally {
        this.sharedProduct.specs.isGeneratingAI = false;
      }
    },
    async runTranslation(direction) {
      if (this.isTranslating) return;
      
      const sourceHtml = direction === 'uz-ru' ? this.sharedProduct.specs.manualUz : this.sharedProduct.specs.manualRu;
      if (!sourceHtml || sourceHtml.trim() === '') {
        if (this.showToast) this.showToast('Tarjima qilish uchun matn yo\'q.', 'error');
        return;
      }

      this.isTranslating = true;
      this.translatingDir = direction;
      
      try {
        const targetLang = direction === 'uz-ru' ? 'ru' : 'uz';
        const result = await translateProductContent(sourceHtml, targetLang);
        
        if (direction === 'uz-ru') {
          this.sharedProduct.specs.manualRu = result;
        } else {
          this.sharedProduct.specs.manualUz = result;
        }
        
        if (this.showToast) this.showToast('Tarjima muvaffaqiyatli yakunlandi!', 'success');
      } catch (error) {
        if (this.showToast) this.showToast('Tarjima jarayonida xatolik yuz berdi.', 'error');
        console.error(error);
      } finally {
        this.isTranslating = false;
        this.translatingDir = '';
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-specs {
  font-family: 'Inter', sans-serif;
  width: 100%;
  margin: 0 auto;
  padding: 0 0 2rem 0;
  box-sizing: border-box;
}

.new-product-specs__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.new-product-specs__card {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 24px;
}

.new-product-specs__alert {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #DFE2E9;
  margin-bottom: 20px;
  background: linear-gradient(
  90deg,
  rgba(24, 28, 255, 0.15) 0%,
  rgba(253, 253, 253) 50%
);
}

.new-product-specs__alert-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.new-product-specs__alert-icon {
  width: 16px;
  height: 16px;
  color: #A855F7;
}

.new-product-specs__alert-text {
  font-size: 13px;
  color: #111827;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.new-product-specs__alert-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.new-product-specs__ai-btn {
  background: linear-gradient(90deg, #A855F7 0%, #7C3AED 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.2);
}

.new-product-specs__ai-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(168, 85, 247, 0.3);
}

.new-product-specs__ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #9ca3af;
}

.new-product-specs__ai-error {
  font-size: 12px;
  color: #ef4444;
  margin: 8px 0 0 0;
}

.new-product-specs__loader {
  width: 16px;
  height: 16px;
  border: 2px solid #A855F7;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.new-product-specs__link {
  display: inline-flex;
  align-items: center;
  color: #22c55e;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.2s ease;
}

.new-product-specs__link:hover {
  color: #16a34a;
}

.new-product-specs__link-arrow {
  margin-left: 4px;
  font-size: 16px;
}

.new-product-specs__options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.new-product-specs__option {
  display: flex;
  align-items: center; 
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.new-product-specs__option--inactive .new-product-specs__variants {
  opacity: 0.5;
  pointer-events: none;
}

.new-product-specs__radio-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 24px;
  cursor: pointer;
  position: relative;
  width: 50px; 
  flex-shrink: 0;
}

.new-product-specs__radio-input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}

.new-product-specs__radio-custom {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.new-product-specs__radio-input:checked ~ .new-product-specs__radio-custom {
  border: 7px solid #22c55e;
}

.new-product-specs__variants {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  flex-grow: 1;
}

.new-product-specs__variant-col {
  display: flex;
  flex-direction: column;
}

.new-product-specs__label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #48545D;
  margin: 0 0 12px 0;
}

.new-product-specs__required {
  color: #ef4444;
}

.new-product-specs__variant-card {
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 16px 20px;
  background-color: #ffffff;
  height: 100%;
  box-sizing: border-box;
}

.new-product-specs__spec-group {
  margin-bottom: 20px;
}

.new-product-specs__spec-group:last-child {
  margin-bottom: 0;
}

.new-product-specs__spec-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.new-product-specs__spec-icon {
  margin-right: 6px;
  font-size: 14px;
}

.new-product-specs__spec-list {
  margin: 0;
  padding-left: 18px;
  list-style-type: disc;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
}

.new-product-specs__spec-list li {
  margin-bottom: 4px;
}

.new-product-specs__spec-list li:last-child {
  margin-bottom: 0;
}

.new-product-specs__textarea {
  width: 100%;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.new-product-specs__textarea:focus {
  border-color: #22c55e;
}

.new-product-specs__textarea:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.new-product-specs__translate-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #F0FDF4;
  color: #166534;
  border: 1px solid #DCFCE7;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 12px;
  transition: all 0.2s;
}

.new-product-specs__translate-btn:hover:not(:disabled) {
  background: #DCFCE7;
  transform: translateY(-1px);
}

.new-product-specs__translate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.new-product-specs__loader-small {
  width: 12px;
  height: 12px;
  border: 2px solid #166534;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

.new-product-specs__label {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
}

/* GUIDELINE SIDE PANEL STYLES (PORTAL-STYLE) */
.pn-guideline-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
}

.pn-guideline-drawer {
  width: 70%;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.1);
}

.pn-guideline-header {
  padding: 24px 40px;
  border-bottom: 1px solid #DFE2E9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
}

.pn-guideline-header-left { display: flex; align-items: center; gap: 16px; }
.pn-guideline-header-title { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }
.pn-guideline-header-badge { font-size: 10px; font-weight: 800; background: #EEF2FF; color: #3B82F6; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em; }

.pn-guideline-close-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}
.pn-guideline-close-btn:hover { color: #111827; }
.pn-guideline-close-btn svg { width: 24px; height: 24px; }

.pn-guideline-content { flex: 1; overflow-y: auto; padding: 40px; }

.pn-guideline-intro { margin-bottom: 40px; }
.pn-guideline-subtitle { font-size: 16px; color: #64748B; line-height: 1.6; margin: 0; }

.pn-guideline-section-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 24px; }

/* 3 Step Path */
.pn-guideline-path { margin-bottom: 56px; }
.pn-guideline-step { display: flex; gap: 20px; margin-bottom: 24px; }
.pn-guideline-step-num { width: 40px; height: 40px; border-radius: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #3B82F6; flex-shrink: 0; }
.pn-guideline-step-info h5 { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 4px 0; }
.pn-guideline-step-info p { font-size: 14px; color: #64748B; margin: 0; line-height: 1.5; }

/* Formula Card */
.pn-guideline-formula-card { background: #F9FBFF; border: 1px solid #E0E7FF; border-radius: 16px; padding: 32px; margin-bottom: 56px; text-align: center; }
.pn-guideline-formula-label { font-size: 12px; font-weight: 700; color: #6366F1; text-transform: uppercase; display: block; margin-bottom: 20px; }
.pn-guideline-formula-row { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.pn-guideline-formula-item { background: white; border: 1px solid #DFE2E9; padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; color: #111827; }
.pn-guideline-plus { color: #94A3B8; font-weight: 300; }
.pn-guideline-formula-example { font-size: 15px; color: #111827; font-weight: 700; }

/* Comparison */
.pn-comparison-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 56px; }
.pn-comp-box { padding: 24px; border-radius: 16px; border: 1px solid #E2E8F0; }
.pn-comp-box--good { background: #F0FDF4; border-color: #DCFCE7; }
.pn-comp-box--bad { background: #FEF2F2; border-color: #FEE2E2; }
.pn-comp-header { font-size: 13px; font-weight: 800; margin-bottom: 12px; }
.pn-comp-box--good .pn-comp-header { color: #166534; }
.pn-comp-box--bad .pn-comp-header { color: #991B1B; }
.pn-comp-box p { font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
.pn-comp-box ul { padding-left: 18px; margin: 0; }
.pn-comp-box li { font-size: 13px; color: #475569; margin-bottom: 4px; }

/* Pro Tip */
.pn-pro-tip { background: #EFF6FF; border-radius: 16px; padding: 20px; display: flex; gap: 16px; margin-bottom: 56px; }
.pn-pro-tip-icon { font-size: 20px; }
.pn-pro-tip-body { font-size: 14px; color: #1E40AF; line-height: 1.5; }

/* Warnings */
.pn-warnings { background: #FDF2F2; border: 1px solid #FEE2E2; border-radius: 16px; padding: 24px; }
.pn-warning-list { margin: 0; padding-left: 18px; }
.pn-warning-list li { font-size: 14px; color: #991B1B; font-weight: 500; margin-bottom: 8px; }

/* Footer */
.pn-guideline-footer { padding: 24px 40px; border-top: 1px solid #DFE2E9; background: white; display: flex; justify-content: flex-end; }
.pn-guideline-close-footer { display: inline-block; background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; padding: 12px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.pn-guideline-close-footer:hover { background: #BBF7D0; transform: translateY(-1px); }

/* ANIMATION */
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: opacity 0.6s ease; }
.drawer-slide-enter-active .pn-guideline-drawer, .drawer-slide-leave-active .pn-guideline-drawer { transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
.drawer-slide-enter, .drawer-slide-leave-to { opacity: 0; }
.drawer-slide-enter .pn-guideline-drawer, .drawer-slide-leave-to .pn-guideline-drawer { transform: translateX(100%); }

@media (max-width: 1100px) { .pn-guideline-drawer { width: 85%; } }
@media (max-width: 768px) { .pn-guideline-drawer { width: 100%; } .pn-comparison-grid { grid-template-columns: 1fr; } }
</style>
