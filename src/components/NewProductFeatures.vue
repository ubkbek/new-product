<template>
  <div class="new-product-features">
    <h2 class="new-product-features__title">
      Mahsulotning xususiyatlarni tanlash
      <span class="new-product-features__subtitle">(Majburiy emas)</span>
    </h2>
    
    <div class="new-product-features__container">
      
      <!-- Info Cards -->
      <div class="new-product-features__info-grid">
        <div class="new-product-features__info-card">
          <h4 class="new-product-features__info-title">Mahsulotlar qanday guruhlanadi</h4>
          <p class="new-product-features__info-text">
            Masalan, Model tavsifi tiruv mashinasi — C5c, W4-01, A2C, C4
          </p>
        </div>
        <div class="new-product-features__info-card">
          <h4 class="new-product-features__info-title">Har xil turdagi mahsulotlar bo'lsa</h4>
          <p class="new-product-features__info-text">
            Masalan, telefon uchun g'ilof va telefonni guruhlash mumkin emas
          </p>
        </div>
        <div class="new-product-features__info-card">
          <h4 class="new-product-features__info-title">Kerakli tavsif mavjud bo'lmasa</h4>
          <p class="new-product-features__info-text">
            O'zingizning noyob tavsifini yaratish mumkin
          </p>
        </div>
      </div>

      <!-- Link -->
      <a href="#" class="new-product-features__link">
        Yo'riqnomada batafsil <span class="new-product-features__link-arrow">&rarr;</span>
      </a>

      <!-- Add Field Wrapper -->
      <div class="new-product-features__dropdown-wrapper">
        <div class="new-product-features__add-field" @click="isDropdownOpen = !isDropdownOpen">
          <span class="new-product-features__add-text">Xususiyat qo'shish</span>
          <svg 
            class="new-product-features__add-icon" 
            :class="{ 'new-product-features__add-icon--open': isDropdownOpen }"
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Dropdown Menu -->
        <div v-show="isDropdownOpen" class="new-product-features__dropdown-menu">
          <div 
            class="new-product-features__dropdown-item" 
            v-for="option in availableFeatures" 
            :key="option.id"
            @click="addFeature(option)"
          >
            {{ option.title }}
          </div>
        </div>
      </div>

      <!-- Features List -->
      <div class="new-product-features__list">
        <div class="new-product-features__card" v-for="(feature, fIndex) in features" :key="feature.id">
          
          <!-- Card Header -->
          <div class="new-product-features__card-header">
            <h3 class="new-product-features__card-title">{{ feature.title }}</h3>
            <button class="new-product-features__card-remove" @click="removeFeature(fIndex)">O'chirish</button>
          </div>
          
          <!-- Chip Group -->
          <div class="new-product-features__chip-group">
            <div class="new-product-features__chip" v-for="(item, iIndex) in feature.items" :key="'item-' + iIndex">
              <span class="new-product-features__chip-text">{{ item }}</span>
              <button class="new-product-features__chip-close" @click="removeFeatureItem(fIndex, iIndex)">
                <svg class="new-product-features__chip-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Add Button -->
          <button class="new-product-features__btn-add">
            <span class="new-product-features__btn-icon">+</span> Qo'shish
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductFeatures',
  data() {
    return {
      isDropdownOpen: false,
      availableFeatures: [
        { id: 101, title: "Rang / Цвет" },
        { id: 102, title: "Boshqa xususiyat qo'shish" }
      ],
      features: [
        {
          id: 1,
          title: 'Rang / Цвет',
          items: ['Oq / Белый', 'Qora / Чёрный']
        },
        {
          id: 2,
          title: 'Model / Модель',
          items: ['W4-01 / W4-01', 'A2C / A2C']
        }
      ]
    };
  },
  methods: {
    addFeature(option) {
      let featureTitle = option.title;
      
      // If "Boshqa xususiyat qo'shish" is selected, give it a placeholder name
      if (option.id === 102) {
        featureTitle = "Yangi xususiyat";
      }

      this.features.push({
        id: Date.now(),
        title: featureTitle,
        items: []
      });
      this.isDropdownOpen = false;
    },
    removeFeature(fIndex) {
      this.features.splice(fIndex, 1);
    },
    removeFeatureItem(fIndex, iIndex) {
      if (this.features[fIndex]) {
        this.features[fIndex].items.splice(iIndex, 1);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-features {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding: 0 0 2rem 0;
  box-sizing: border-box;
}

.new-product-features__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.new-product-features__subtitle {
  font-size: 16px;
  font-weight: 500;
  color: #9ca3af;
}

.new-product-features__container {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 24px;
}

.new-product-features__info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.new-product-features__info-card {
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.new-product-features__info-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.new-product-features__info-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.new-product-features__link {
  display: inline-flex;
  align-items: center;
  color: #22c55e;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.2s ease;
}

.new-product-features__link:hover {
  color: #16a34a;
}

.new-product-features__link-arrow {
  margin-left: 4px;
  font-size: 16px;
}

.new-product-features__dropdown-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.new-product-features__add-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px dashed #C9D1E1;
  border-radius: 12px;
  height: 64px;
  padding: 0 20px;
  cursor: pointer;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}

.new-product-features__add-field:hover {
  border-color: #9ca3af;
}

.new-product-features__add-text {
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}

.new-product-features__add-icon {
  width: 18px;
  height: 18px;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.new-product-features__add-icon--open {
  transform: rotate(180deg);
}

.new-product-features__dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 8px;
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
}

.new-product-features__dropdown-item {
  padding: 12px 20px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.new-product-features__dropdown-item:hover {
  background-color: #F9FAFB;
}

.new-product-features__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.new-product-features__card {
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 20px;
  background-color: #ffffff;
}

.new-product-features__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.new-product-features__card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.new-product-features__card-remove {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s ease;
}

.new-product-features__card-remove:hover {
  opacity: 0.8;
}

.new-product-features__chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.new-product-features__chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F9FAFB;
  border: 1px solid #DFE2E9;
  border-radius: 8px; /* Sleek rectangular rounds */
  padding: 0 16px;
  height: 40px;
  min-width: 180px; 
  box-sizing: border-box;
}

.new-product-features__chip-text {
  font-size: 14px;
  color: #374151;
}

.new-product-features__chip-close {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.new-product-features__chip-close:hover {
  color: #ef4444;
}

.new-product-features__chip-icon {
  width: 14px;
  height: 14px;
}

.new-product-features__btn-add {
  display: inline-flex;
  align-items: center;
  background-color: #ECFDF5; /* Light green tint */
  color: #10b981;
  border: none;
  border-radius: 8px;
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.new-product-features__btn-add:hover {
  background-color: #D1FAE5;
}

.new-product-features__btn-icon {
  margin-right: 6px;
  font-size: 16px;
}

/* Responsive Handling */
@media (max-width: 900px) {
  .new-product-features__info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .new-product-features__info-grid {
    grid-template-columns: 1fr;
  }
  .new-product-features__chip {
    min-width: 100%;
    width: 100%;
  }
}
</style>
