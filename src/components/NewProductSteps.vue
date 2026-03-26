<template>
  <div class="new-product__steps">
    <!-- Breadcrumbs -->
    <div class="new-product__steps__breadcrumbs">
      <span class="new-product__steps__breadcrumb-link">Asosiy /</span>
      <span class="new-product__steps__breadcrumb-current">Yangi mahsulot yoki xizmat qo'shish</span>
    </div>

    <!-- Header Section -->
    <div class="new-product__steps__header">
      
      <!-- Left side: Title + Required indicator -->
      <div class="new-product__steps__title-wrapper">
        <h1 class="new-product__steps__title">
          {{ currentStep === 3 ? "E'lonning ko'rinishi" : "Yangi mahsulot qo'shish" }}
        </h1>
      </div>

      <!-- Right side: Stepper + Button -->
      <div class="new-product__steps__actions">
        
        <!-- Stepper -->
        <div class="new-product__steps__stepper">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="new-product__steps__step-group"
          >
            
            <!-- Step Item -->
            <div 
              class="new-product__steps__step"
              :class="{ 'new-product__steps__step--active': currentStep === step.id }"
              @click="goToStep(step.id)"
            >
              <div class="new-product__steps__step-circle">
                {{ step.id }}
              </div>
              <transition name="step-fade">
                <span 
                  v-if="currentStep === step.id" 
                  class="new-product__steps__step-label"
                >
                  {{ step.title }}
                </span>
              </transition>
            </div>
            
            <!-- Separator Line -->
            <div 
              v-if="index !== steps.length - 1" 
              class="new-product__steps__step-line"
            ></div>

          </div>
        </div>

        <!-- Next Button -->
        <button class="new-product__steps__btn" @click="handleNext">
          Davom etish
          <svg class="new-product__steps__btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductSteps',
  props: {
    currentStep: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      steps: [
        { id: 1, title: 'Asosiy ma’lumotlar' },
        { id: 2, title: 'Narxlar va SKU' },
        { id: 3, title: "E'lon ko'rinishi" }
      ]
    };
  },
  methods: {
    goToStep(id) {
      this.$emit('change-step', id);
    },
    handleNext() {
      if (this.currentStep < this.steps.length) {
        this.$emit('change-step', this.currentStep + 1);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Main Block */
.new-product__steps {
  font-family: 'Inter', sans-serif;
  width: 100%;
  padding: 1rem 0;
  box-sizing: border-box;
}

/* Breadcrumbs Elements */
.new-product__steps__breadcrumbs {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 24px;
}

.new-product__steps__breadcrumb-link {
  color: #D1D5DB;
  margin-right: 4px;
}

.new-product__steps__breadcrumb-current {
  color: #6b7280;
}

/* Header Element */
.new-product__steps__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

/* Title Elements */
.new-product__steps__title-wrapper {
  display: flex;
  flex-direction: column;
}

.new-product__steps__title {
  margin: 0 0 8px 0;
  letter-spacing: 0%;
  color: #48545D;
  font-weight: 600;
  font-size: 32px;
}

/* Actions Box (Stepper + Button) */
.new-product__steps__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

/* Stepper Box Element */
.new-product__steps__stepper {
  display: flex;
  align-items: center;
}

/* Step Group Wrapper Element */
.new-product__steps__step-group {
  display: flex;
  align-items: center;
}

/* Step Element */
.new-product__steps__step {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
}

/* Step Label Transition */
.step-fade-enter-active,
.step-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  max-width: 200px;
  white-space: nowrap;
}

.step-fade-enter,
.step-fade-leave-to {
  opacity: 0;
  max-width: 0;
  margin-left: 0 !important;
  transform: translateX(-10px);
}

/* Step Circle Modifier: Active */
.new-product__steps__step--active .new-product__steps__step-circle {
  background-color: #22c55e;
}

/* Step Circle Element */
.new-product__steps__step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #cbd5e1;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

/* Step Label Element */
.new-product__steps__step-label {
  margin-left: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

/* Stepper Line Separator Element */
.new-product__steps__step-line {
  width: 44px;
  height: 2px;
  background-color: #cbd5e1;
  margin: 0 16px;
}

/* Submit/Next Button Element */
.new-product__steps__btn {
  display: flex;
  align-items: center;
  background-color: #22c55e;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.new-product__steps__btn:hover {
  background-color: #16a34a;
}

/* Button Icon Element */
.new-product__steps__btn-icon {
  width: 16px;
  height: 16px;
  margin-left: 6px;
}

/* Responsive Handling */
@media (max-width: 900px) {
  .new-product__steps__header {
    flex-direction: column;
    align-items: flex-start;
  }
  .new-product__steps__actions {
    width: 100%;
    margin-top: 1rem;
    gap: 16px;
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
  .new-product__steps__step-line {
    width: 20px;
    margin: 0 8px;
  }
  .new-product__steps__step-label {
    display: none;
  }
  .new-product__steps__actions {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
