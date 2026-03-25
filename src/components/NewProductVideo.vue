<template>
  <div class="new-product-video">
    <h2 class="new-product-video__title">Mahsulot yoki xizmat videosi</h2>
    
    <!-- Tabs Header -->
    <div class="new-product-video__tabs">
      <button 
        class="new-product-video__tab" 
        :class="{ 'new-product-video__tab--active': activeTab === 'upload' }"
        @click="activeTab = 'upload'"
      >
        Videoni yuklash
      </button>
      <button 
        class="new-product-video__tab" 
        :class="{ 'new-product-video__tab--active': activeTab === 'link' }"
        @click="activeTab = 'link'"
      >
        Video linkini joylash
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="new-product-video__content">
      
      <!-- Info boxes -->
      <div class="new-product-video__info-grid">
        <!-- Left Box (Green) -->
        <div class="new-product-video__info-box new-product-video__info-box--green">
          <div class="new-product-video__icon-wrap">
            <svg class="new-product-video__info-icon new-product-video__info-icon--green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <p class="new-product-video__info-text">
            Sifatli video tovar yoki xizmatni xaridorlarga yaxshiroq ko&#8216;rsatishga imkon beradi
          </p>
        </div>

        <!-- Right Box (Yellow/Orange) -->
        <div class="new-product-video__info-box new-product-video__info-box--yellow">
          <div class="new-product-video__icon-wrap">
            <svg class="new-product-video__info-icon new-product-video__info-icon--orange" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="new-product-video__info-text">
            Yuklanayotgan video 3 Mb dan oshmasligi hamda 1080*1440 o&#8216;lchamda bo&#8216;lishi kerak
          </p>
        </div>
      </div>
      
      <!-- Upload Tab Content -->
      <div v-show="activeTab === 'upload'" class="new-product-video__upload-section">
        <label class="new-product-video__upload-box">
          <input type="file" accept="video/*" class="new-product-video__file-input" @change="handleVideoUpload">
          <span class="new-product-video__upload-text">Video yuklash</span>
        </label>
      </div>

      <!-- Link Tab Content -->
      <div v-show="activeTab === 'link'" class="new-product-video__link-section">
        <label class="new-product-video__label">Video linkini joylashtiring</label>
        <input 
          type="text" 
          class="new-product-video__input" 
          placeholder="-" 
          v-model="videoLink"
        >
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductVideo',
  data() {
    return {
      activeTab: 'upload', // 'upload' | 'link'
      videoFile: null,
      videoLink: ''
    };
  },
  methods: {
    handleVideoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.videoFile = file;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-video {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding: 0 0 2rem 0;
  box-sizing: border-box;
}

.new-product-video__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.new-product-video__tabs {
  display: flex;
}

.new-product-video__tab {
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

.new-product-video__tab--active {
  background-color: #ffffff;
  color: #22c55e;
  border-bottom-color: #ffffff;
  z-index: 3;
}

.new-product-video__content {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 0 12px 12px 12px;
  padding: 24px;
  margin-top: -1px;
  position: relative;
  z-index: 2;
}

.new-product-video__info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.new-product-video__info-box {
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
}

.new-product-video__info-box--green {
  background: linear-gradient(90deg, #ecfdf5 0%, #ffffff 100%);
}

.new-product-video__info-box--yellow {
  background: linear-gradient(90deg, #fffbeb 0%, #ffffff 100%);
}

.new-product-video__icon-wrap {
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.new-product-video__info-icon {
  width: 16px;
  height: 16px;
}

.new-product-video__info-icon--green {
  color: #10b981;
}

.new-product-video__info-icon--orange {
  color: #f59e0b;
}

.new-product-video__info-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  margin: 0;
}

.new-product-video__upload-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #DFE2E9;
  border-radius: 12px;
  width: 240px;
  height: 130px;
  cursor: pointer;
  background-color: #ffffff;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.new-product-video__upload-box:hover {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.new-product-video__file-input {
  display: none;
}

.new-product-video__upload-text {
  color: #22c55e;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.new-product-video__label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 12px;
}

.new-product-video__input {
  width: 100%;
  height: 44px;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.new-product-video__input:focus {
  border-color: #22c55e;
}

.new-product-video__input::placeholder {
  color: #9ca3af;
}

/* Responsive Handling */
@media (max-width: 768px) {
  .new-product-video__info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .new-product-video__content {
    border-radius: 0 0 12px 12px;
  }
  .new-product-video__tabs {
    flex-direction: column;
  }
  .new-product-video__tab {
    border-radius: 8px;
    margin-right: 0;
    margin-bottom: 4px;
    border-bottom: 1px solid #DFE2E9;
  }
  .new-product-video__tab--active {
    border-bottom: 1px solid #DFE2E9;
    border-color: #22c55e;
  }
  .new-product-video__upload-box {
    width: 100%;
  }
}
</style>
