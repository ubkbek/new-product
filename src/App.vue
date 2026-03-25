<template>
  <div id="app">
    <div class="container">
      <NewProductSteps :currentStep="currentStep" @change-step="updateStep" />
      
      <div v-if="currentStep === 1">
        <StepOne />
      </div>
      
      <div v-else-if="currentStep === 2">
        <NewProductPricing />
      </div>

      <div v-else-if="currentStep === 3">
        <NewProductPreview />
      </div>

    </div>
  </div>
</template>

<script>
import NewProductSteps from './components/NewProductSteps.vue'
import StepOne from './components/StepOne.vue'
import NewProductPricing from './components/NewProductPricing.vue'
import NewProductPreview from './components/NewProductPreview.vue'

export default {
  name: 'App',
  components: {
    NewProductSteps,
    StepOne,
    NewProductPricing,
    NewProductPreview
  },
  data() {
    return {
      currentStep: 1
    }
  },
  methods: {
    updateStep(stepId) {
      this.currentStep = stepId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>

<style>
body {
  background-color: #f6f8fb;
  margin: 0;
  padding: 0;
}

#app {
  padding: 2rem;
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
</style>
