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
  }
}
</script>

<style scoped>
.step-one {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
