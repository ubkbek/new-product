<template>
  <div class="info-card">
    <h4 class="info-title">{{ title }}</h4>
    <p class="info-text" v-html="text"></p>
  </div>
</template>

<script>
export default {
  name: 'NewProductImageInfoCard',
  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.info-card {
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.info-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}
</style>
