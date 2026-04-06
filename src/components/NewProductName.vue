<template>
  <div class="new-product-name">
    <h2 class="new-product-name__title">Mahsulot nomini kiriting</h2>
    
    <div class="new-product-name__card">
      
      <!-- Info Boxes -->
      <div class="new-product-name__info-grid">
        <div class="new-product-name__info-box new-product-name__info-box--yellow">
          <h3 class="new-product-name__info-title">Nomlash tartibi</h3>
          <p class="new-product-name__info-desc">Mahsulotning aniq nomini zarur tasnif</p>
        </div>
        <div class="new-product-name__info-box new-product-name__info-box--green">
          <h3 class="new-product-name__info-title">Matn uzunligi 100 ta belgi</h3>
          <p class="new-product-name__info-desc">Juda qisqa nomlar boshqa mahsulotlar bilan o‘xshash bo‘lib, qidiruvda topilishini kamaytirishi mumkin</p>
        </div>
      </div>
      
      <!-- Link -->
      <a href="#" class="new-product-name__link" @click.prevent="showGuidelineDrawer = true">
        Yo‘riqnomada batafsil <span class="new-product-name__link-arrow">&rarr;</span>
      </a>
      
      <!-- Inputs -->
      <div class="new-product-name__input-grid">
        <div class="new-product-name__group">
          <label class="new-product-name__label">
            Mahsulot nomi (O’zbek tilida)<span class="new-product-name__required">*</span>
            <button 
              v-if="sharedProduct.title_ru"
              class="new-product-name__translate-btn" 
              @click.stop="runTranslation('ru-uz')"
              :disabled="isTranslating || !sharedProduct.category_id"
            >
              <span v-if="translatingDir === 'ru-uz'" class="new-product-name__loader-small"></span>
              <svg v-else viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 8 6 6 6-6"/></svg>
              Ruschadan tarjima
            </button>
          </label>
          <div class="new-product-name__input-wrapper">
            <input 
              type="text" 
              class="new-product-name__input" 
              :placeholder="sharedProduct.category_id ? 'Mahsulotning aniq nomi' : 'Kategoriyani tanlang...'" 
              v-model="sharedProduct.title"
              maxlength="100"
              :disabled="!sharedProduct.category_id"
            />
            <span class="new-product-name__counter">{{ (sharedProduct.title || '').length }} / 100</span>
          </div>
        </div>
        
        <div class="new-product-name__group">
          <label class="new-product-name__label">
            Mahsulot nomi (Rus tilida)<span class="new-product-name__required">*</span>
            <button 
              v-if="sharedProduct.title"
              class="new-product-name__translate-btn" 
              @click.stop="runTranslation('uz-ru')"
              :disabled="isTranslating || !sharedProduct.category_id"
            >
              <span v-if="translatingDir === 'uz-ru'" class="new-product-name__loader-small"></span>
              <svg v-else viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m19 16-6-6-6 6"/></svg>
              O'zbekchadan tarjima
            </button>
          </label>
          <div class="new-product-name__input-wrapper">
            <input 
              type="text" 
              class="new-product-name__input" 
              :placeholder="sharedProduct.category_id ? 'Mahsulotning aniq nomi' : 'Kategoriyani tanlang...'" 
              v-model="sharedProduct.title_ru"
              maxlength="100"
              :disabled="!sharedProduct.category_id"
            />
            <span class="new-product-name__counter">{{ (sharedProduct.title_ru || '').length }} / 100</span>
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
              <h3 class="pn-guideline-header-title">Mahsulot nomlash yo‘riqnomasi</h3>
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
              <p class="pn-guideline-subtitle">Xaridorlar mahsulotingizni nomi orqali qidirishadi. Professional nom xaridor ishonchini va SEO natijasini oshiradi.</p>
            </section>

            <!-- 5 Steps Path -->
            <div class="pn-guideline-path">
              <h4 class="pn-guideline-section-title">Muvaffaqiyatga eltuvchi 3 qadam</h4>
              
              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">01</div>
                <div class="pn-guideline-step-info">
                  <h5>Asosiy kalit so‘z</h5>
                  <p>Mahsulot turini birinchi yozing (masalan: Smartfon, Tost-pishirgich).</p>
                </div>
              </div>

              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">02</div>
                <div class="pn-guideline-step-info">
                  <h5>Brend va Model</h5>
                  <p>Taniqli brend va model ishonch belgisi hisoblanadi (masalan: Apple, Samsung).</p>
                </div>
              </div>

              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">03</div>
                <div class="pn-guideline-step-info">
                  <h5>Texnik xususiyatlar</h5>
                  <p>Hajmi, rangi yoki quvvatini qo‘shing (masalan: 256GB, Yashil, 1200W).</p>
                </div>
              </div>
            </div>

            <!-- Formula Card -->
            <div class="pn-guideline-formula-card">
              <span class="pn-guideline-formula-label">Ideal nom formulasi</span>
              <div class="pn-guideline-formula-row">
                <span class="pn-guideline-formula-item">Brend</span>
                <span class="pn-guideline-plus">+</span>
                <span class="pn-guideline-formula-item">Model</span>
                <span class="pn-guideline-plus">+</span>
                <span class="pn-guideline-formula-item">Turi</span>
                <span class="pn-guideline-plus">+</span>
                <span class="pn-guideline-formula-item">Xususiyati</span>
              </div>
              <div class="pn-guideline-formula-example">
                Apple iPhone 14 Pro Max 256GB Deep Purple
              </div>
            </div>

            <!-- Comparisons -->
            <div class="pn-comparison">
              <h4 class="pn-guideline-section-title">Solishtirish</h4>
              <div class="pn-comparison-grid">
                <div class="pn-comp-box pn-comp-box--good">
                  <div class="pn-comp-header">Samarali nom ✅</div>
                  <p>Dyson Airwrap Multi-styler Complete, Ko‘k</p>
                  <ul>
                    <li>Brend va model bor</li>
                    <li>SEO uchun qulay</li>
                  </ul>
                </div>
                <div class="pn-comp-box pn-comp-box--bad">
                  <div class="pn-comp-header">Noeffektiv nom ✕</div>
                  <p>Arzon fen, yangi model, shoshiling!</p>
                  <ul>
                    <li>Aniq ma’lumot yo‘q</li>
                    <li>Reklama so‘zlari ko‘p</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Pro Tip -->
            <div class="pn-pro-tip">
              <span class="pn-pro-tip-icon">💡</span>
              <div class="pn-pro-tip-body">
                <strong>Pro Tip:</strong> Nomning birinchi 50 belgisi qidiruvda eng muhim. Muhim specslarni boshiga qo‘ying.
              </div>
            </div>

            <!-- Prohibitions -->
            <div class="pn-warnings">
              <h4 class="pn-guideline-section-title">Taqiqlanadi</h4>
              <ul class="pn-warning-list">
                <li>FAQAT KATTA HARFLAR bilan yozish</li>
                <li>Kontakt ma'lumotlari yoki havolalar</li>
                <li>"Aksiya", "Arzon", "Zo'r" kabi reklama so'zlari</li>
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
import { translateProductContent } from '../utils/ai-generator';

export default {
  name: 'NewProductName',
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
    async runTranslation(direction) {
      if (this.isTranslating) return;
      
      const sourceText = direction === 'uz-ru' ? this.sharedProduct.title : this.sharedProduct.title_ru;
      if (!sourceText || sourceText.trim() === '') {
        if (this.showToast) this.showToast('Tarjima qilish uchun matn yo\'q.', 'error');
        return;
      }

      this.isTranslating = true;
      this.translatingDir = direction;
      
      try {
        const targetLang = direction === 'uz-ru' ? 'ru' : 'uz';
        const result = await translateProductContent(sourceText, targetLang);
        
        if (direction === 'uz-ru') {
          this.sharedProduct.title_ru = result;
        } else {
          this.sharedProduct.title = result;
        }
        
        if (this.showToast) this.showToast('Nom muvaffaqiyatli tarjima qilindi!', 'success');
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
/* PRIMARY FORM STYLES (NO CHANGES) */
.new-product-name {
  font-family: 'Inter', sans-serif;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin-bottom: 24px;
}

.new-product-name__title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 20px 0;
}

.new-product-name__card {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 24px;
}

/* ... existing input styles ... */
.new-product-name__info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.new-product-name__info-box { 
  border: 1px solid #dfe2e9; 
  border-radius: 12px; 
  padding: 16px;
  background: #ffffff;
}
.new-product-name__info-box--yellow { background: linear-gradient(90deg, #fffbeb, #fff); }
.new-product-name__info-box--green { background: linear-gradient(90deg, #ecfdf5, #fff); }
.new-product-name__info-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 8px; }
.new-product-name__info-desc { font-size: 13px; color: #374151; line-height: 1.5; }

.new-product-name__link {
  display: inline-flex;
  align-items: center;
  color: #22c55e;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin: 24px 0;
}

.new-product-name__link-arrow { margin-left: 6px; }

.new-product-name__input-grid { 
  display: grid; 
  grid-template-columns: repeat(2, minmax(0, 1fr)); 
  gap: 24px; 
}
.new-product-name__label { 
  font-size: 12px; 
  font-weight: 600; 
  color: #4b5563; 
  margin-bottom: 8px; 
  display: flex !important; 
  align-items: center; 
  justify-content: space-between; 
}
.new-product-name__translate-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #F0FDF4;
  color: #166534;
  border: 1px solid #DCFCE7;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.new-product-name__translate-btn:hover:not(:disabled) {
  background: #DCFCE7;
  transform: translateY(-1px);
}
.new-product-name__translate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.new-product-name__loader-small {
  width: 10px;
  height: 10px;
  border: 2px solid #166534;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.new-product-name__required { color: #ef4444; margin-left: 4px; }
.new-product-name__input-wrapper { position: relative; }

.new-product-name__input {
  width: 100%;
  height: 48px;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 64px 0 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.new-product-name__input:focus { border-color: #22c55e; }
.new-product-name__counter { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #9ca3af; }

/* FIX: PORTAL-STYLE FIXED DRAWER (Matches Cabinet Design) */
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
