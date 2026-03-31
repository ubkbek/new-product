<template>
  <div class="new-product-category">
    <!-- Required Note -->
    <div class="new-product-category__hint">
      <span class="new-product-category__hint-asterisk">*</span>
      <span class="new-product-category__hint-text">- To'ldirilishi shart bo'lgan maydonlar</span>
    </div>

    <!-- Section Title -->
    <h2 class="new-product-category__title">Mahsulot kategoriyasini ko'rsatish</h2>

    <!-- Card -->
    <div class="new-product-category__card">
      <div class="new-product-category__grid">
        <div 
          v-for="(config, index) in dropdownConfigs" 
          :key="index" 
          class="new-product-category__group"
        >
          <label class="new-product-category__label">
            {{ config.label }}<span class="new-product-category__required">*</span>
          </label>
          <div class="new-product-category__select-wrapper">
            <BaseDropdown
              v-model="sharedProduct[config.model]"
              :options="config.options"
              :placeholder="config.placeholder"
              label-key="name"
              value-key="id"
              :searchable="config.searchable"
              :disabled="config.disabled"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseDropdown from './BaseDropdown.vue';

export default {
  name: 'NewProductCategory',
  components: {
    BaseDropdown
  },
  inject: ['sharedProduct'],
  data() {
    return {
      categories: [
        { id: 1, name: 'Elektronika' },
        { id: 2, name: 'Kiyim-kechak' },
        { id: 3, name: 'Maishiy texnika' },
        { id: 4, name: 'Oziq-ovqat' },
        { id: 5, name: 'Qurilish mollari' },
        { id: 6, name: 'Santexnika' },
        { id: 7, name: 'Avto tovarlar' }
      ],
      innerCategories: [
        { id: 1, name: 'Smartfonlar' },
        { id: 2, name: 'Noutbuklar' }
      ],
      childCategories: [
        { id: 1, name: 'Aksessuarlar' },
        { id: 2, name: 'Ehtiyot qismlari' }
      ]
    };
  },
  computed: {
    dropdownConfigs() {
      return [
        { 
          label: 'Kategoriyani belgilang', 
          model: 'category_id', 
          options: this.categories, 
          placeholder: 'Kategoriyani tanlang', 
          searchable: true,
          disabled: false
        },
        { 
          label: 'Ichki kategoriyani belgilang', 
          model: 'inner_category_id', 
          options: this.innerCategories, 
          placeholder: 'Kategoriyani tanlang', 
          searchable: false,
          disabled: !this.sharedProduct.category_id
        },
        { 
          label: 'Kichik kategoriyani belgilang', 
          model: 'child_category_id', 
          options: this.childCategories, 
          placeholder: 'Kategoriyani tanlang', 
          searchable: false,
          disabled: !this.sharedProduct.inner_category_id
        }
      ];
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-category {
  font-family: 'Inter', sans-serif;
  width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 0 2rem 0;
  box-sizing: border-box;
}

.new-product-category__hint {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.new-product-category__hint-asterisk {
  color: #ef4444;
  font-weight: 700;
  font-size: 13px;
  margin-right: 4px;
}

.new-product-category__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.new-product-category__card {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.new-product-category__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.new-product-category__group {
  display: flex;
  flex-direction: column;
}

.new-product-category__label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #48545D;
  margin-bottom: 12px;
}

.new-product-category__required {
  color: #ef4444;
}

.new-product-category__select-wrapper {
  position: relative;
  width: 100%;
}

.new-product-category__select {
  width: 100%;
  height: 44px;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

/* For empty placeholder or invalid looking state */
.new-product-category__select:invalid,
.new-product-category__select option[value=""] {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #7A889B;
}

.new-product-category__select:focus {
  border-color: #22c55e;
}

.new-product-category__select-icon {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

/* Responsive Handling */
@media (max-width: 768px) {
  .new-product-category__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
