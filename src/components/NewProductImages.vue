<template>
  <div class="new-product-images">
    <h2 class="new-product-images__title">Mahsulotning umumiy rasmlari</h2>
    
    <!-- Tabs Header -->
    <div class="new-product-images__tabs">
      <button 
        class="new-product-images__tab" 
        :class="{ 'new-product-images__tab--active': activeTab === 'upload' }"
        @click="activeTab = 'upload'"
      >
        Rasmni yuklash
      </button>
      <button 
        class="new-product-images__tab" 
        :class="{ 'new-product-images__tab--active': activeTab === 'ai' }"
        @click="activeTab = 'ai'"
      >
        AI orqali qidirish
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="new-product-images__content">
      
      <!-- Upload Section -->
      <div v-show="activeTab === 'upload'" class="new-product-images__upload-section">
        
        <!-- Requirements Cards -->
        <div class="new-product-images__info-grid">
          <div class="new-product-images__info-card">
            <h4 class="new-product-images__info-title">Rasm talablari</h4>
            <p class="new-product-images__info-text">
              JPG, JPEG, PNG yoki WebP format<br>
              Eng kamida 1080x1440 o&#8216;lcham<br>
              5 MB dan katta bo&#8216;lmasin<br>
              Mahsulotni turli burchaklardan tushiring
            </p>
          </div>
          
          <div class="new-product-images__info-card">
            <h4 class="new-product-images__info-title">Ranglari bo&#8216;lsa</h4>
            <p class="new-product-images__info-text">
              Agar mahsulot bir nechta rangda bo&#8216;lsa, har bir rang uchun alohida rasm yuklang.
            </p>
          </div>
          
          <div class="new-product-images__info-card">
            <h4 class="new-product-images__info-title">Rasm sotuvni oshiradi</h4>
            <p class="new-product-images__info-text">
              Sifatli va yaqin olingan rasmlar mahsulotni aniq ko&#8216;rsatadi va xaridor ishonchini oshiradi.
            </p>
          </div>
          
          <div class="new-product-images__info-card">
            <h4 class="new-product-images__info-title">Moderatsiya</h4>
            <p class="new-product-images__info-text">
              Rasmlar aniq, sifatli va boshqa brendlarga tegishli bo&#8216;lmagan bo&#8216;lishi kerak.<br>
              Talablarga mos kelmagan rasmlar tasdiqlanmaydi.
            </p>
          </div>
        </div>

        <!-- Link -->
        <a href="#" class="new-product-images__link">
          Yo&#8216;riqnomada batafsil <span class="new-product-images__link-arrow">&rarr;</span>
        </a>

        <!-- Upload Grid -->
        <div class="new-product-images__upload-grid">
          <!-- Active Upload Action -->
          <label class="new-product-images__upload-box new-product-images__upload-box--action">
            <input type="file" multiple class="new-product-images__file-input" @change="handleFileUpload">
            <span class="new-product-images__upload-text">Rasm yuklash</span>
          </label>
          
          <!-- Empty Placeholders -->
          <div v-for="n in 5" :key="'placeholder-' + n" class="new-product-images__upload-box">
            <div class="new-product-images__placeholder-wrap">
              <svg class="new-product-images__placeholder-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Search Section -->
      <div v-show="activeTab === 'ai'" class="new-product-images__ai-section">
        <div class="new-product-images__search-wrapper">
          <svg class="new-product-images__search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            class="new-product-images__search-input" 
            placeholder="Rasmni izlash" 
            v-model="searchQuery"
          >
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductImages',
  data() {
    return {
      activeTab: 'upload', // 'upload' | 'ai'
      images: [],
      searchQuery: ''
    };
  },
  methods: {
    handleFileUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        // Logic for handling selected frames/files can be developed later.
        console.log(files);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-images {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding: 0 0 2rem 0;
  box-sizing: border-box;
}

.new-product-images__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.new-product-images__tabs {
  display: flex;
}

.new-product-images__tab {
  padding: 14px 24px;
  background-color: #F9FAFB;
  border: 1px solid #DFE2E9;
  border-bottom: 1px solid #DFE2E9;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  position: relative;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
  z-index: 1;
}

.new-product-images__tab--active {
  background-color: #ffffff;
  color: #22c55e;
  border-bottom-color: #ffffff;
  z-index: 3;
}

.new-product-images__content {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 0 12px 12px 12px;
  padding: 24px;
  margin-top: -1px;
  position: relative;
  z-index: 2;
}

.new-product-images__info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.new-product-images__info-card {
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.new-product-images__info-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.new-product-images__info-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.new-product-images__link {
  display: inline-flex;
  align-items: center;
  color: #22c55e;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.2s ease;
}

.new-product-images__link:hover {
  color: #16a34a;
}

.new-product-images__link-arrow {
  margin-left: 4px;
  font-size: 16px;
}

.new-product-images__upload-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.new-product-images__upload-box {
  height: 120px;
  border: 1.5px dashed #DFE2E9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.new-product-images__upload-box--action {
  cursor: pointer;
}

.new-product-images__upload-box--action:hover {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.new-product-images__file-input {
  display: none;
}

.new-product-images__upload-text {
  color: #22c55e;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.new-product-images__placeholder-wrap {
  width: 40px;
  height: 40px;
  background-color: #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-product-images__placeholder-icon {
  width: 20px;
  height: 20px;
  color: #10b981;
}

.new-product-images__search-wrapper {
  position: relative;
  width: 100%;
}

.new-product-images__search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.new-product-images__search-input {
  width: 100%;
  height: 44px;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 14px 0 42px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.new-product-images__search-input:focus {
  border-color: #22c55e;
}

.new-product-images__search-input::placeholder {
  color: #9ca3af;
}

/* Responsive Handling */
@media (max-width: 900px) {
  .new-product-images__info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .new-product-images__upload-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .new-product-images__info-grid {
    grid-template-columns: 1fr;
  }
  .new-product-images__upload-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .new-product-images__content {
    border-radius: 0 0 12px 12px;
  }
  .new-product-images__tabs {
    flex-direction: column;
  }
  .new-product-images__tab {
    border-radius: 8px;
    margin-right: 0;
    margin-bottom: 4px;
    border-bottom: 1px solid #DFE2E9;
  }
  .new-product-images__tab--active {
    border-bottom: 1px solid #DFE2E9;
    border-color: #22c55e;
  }
}
</style>
