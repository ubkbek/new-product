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
      <a href="#" class="new-product-specs__link">
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
              </h4>
              <textarea 
                class="new-product-specs__textarea" 
                v-model="sharedProduct.specs.manualUz"
                :disabled="sharedProduct.specs.selectedVariant !== 'manual' || !sharedProduct.title"
              ></textarea>
            </div>
            <div class="new-product-specs__variant-col">
              <h4 class="new-product-specs__label">
                Qo'lda kiritish (Rus tilida)<span class="new-product-specs__required">*</span>
              </h4>
              <textarea 
                class="new-product-specs__textarea" 
                v-model="sharedProduct.specs.manualRu"
                :disabled="sharedProduct.specs.selectedVariant !== 'manual' || !sharedProduct.title"
              ></textarea>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { generateProductSpecs } from '../utils/ai-generator';

export default {
  name: 'NewProductSpecs',
  inject: ['sharedProduct'],
  data() {
    return {
      // Local variants removed, using sharedProduct.specs.variants
    };
  },
  methods: {
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
    }
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

/* Responsive Handling */
@media (max-width: 768px) {
  .new-product-specs__variants {
    grid-template-columns: 1fr;
  }
  .new-product-specs__option {
    align-items: flex-start;
  }
  .new-product-specs__radio-label {
    padding-top: 30px; 
  }
}
</style>
