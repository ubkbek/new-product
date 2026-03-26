<template>
  <div id="app">
    <div class="container-large">
      <NewProductSteps :currentStep="currentStep" @change-step="updateStep" />
    </div>
    
    <div class="container-small" v-if="currentStep === 1">
      <StepOne />
    </div>
    
    <div v-else-if="currentStep === 2">
      <NewProductPricing />
    </div>

    <div class="container-large" v-else-if="currentStep === 3">
      <NewProductPreview />
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
    const savedStep = localStorage.getItem('currentStep');
    return {
      currentStep: savedStep ? parseInt(savedStep) : 1
    }
  },
  methods: {
    updateStep(stepId) {
      this.currentStep = stepId;
      localStorage.setItem('currentStep', stepId);
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
</style>
