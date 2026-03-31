<template>
  <div class="new-product-color-media">
    <h2 class="new-product-color-media__title">Har bir rang uchun mediafayllar</h2>

    <!-- Tabs Container -->
    <div class="new-product-color-media__tabs">
      <button 
        class="new-product-color-media__tab" 
        :class="{ 'new-product-color-media__tab--active': activeMediaTab === 'upload' }"
        @click="activeMediaTab = 'upload'"
      >
        Rasmni yuklash
      </button>
      <button 
        class="new-product-color-media__tab" 
        :class="{ 'new-product-color-media__tab--active': activeMediaTab === 'link' }"
        @click="activeMediaTab = 'link'"
      >
        Rasm linkini joylash
      </button>
    </div>

    <!-- Main Content Box -->
    <div class="new-product-color-media__container">
      
      <!-- Info Cards (Top Row) -->
      <div class="new-product-color-media__info-grid">
        <!-- Rasm talablari -->
        <div class="new-product-color-media__info-card">
          <h4 class="new-product-color-media__info-card-title">Rasm talablari</h4>
          <ul class="new-product-color-media__info-list">
            <li>JPG, JPEG, PNG yoki WebP format</li>
            <li>Eng kamida 1080×1440 o‘lcham</li>
            <li>5 MB dan katta bo‘lmasin</li>
            <li>Mahsulotni turli burchaklardan tushiring</li>
          </ul>
        </div>
        
        <!-- Rasm sotuvni oshiradi -->
        <div class="new-product-color-media__info-card">
          <h4 class="new-product-color-media__info-card-title">Rasm sotuvni oshiradi</h4>
          <p class="new-product-color-media__info-card-text">
            Sifatli va yaqin olingan rasmlar mahsulotni aniq ko‘rsatadi va xaridor ishonchini oshiradi.
          </p>
        </div>
        
        <!-- Moderatsiya -->
        <div class="new-product-color-media__info-card">
          <h4 class="new-product-color-media__info-card-title">Moderatsiya</h4>
          <p class="new-product-color-media__info-card-text">
            Rasmlar aniq, sifatli va boshqa brendlarga tegishli bo‘lmagan bo‘lishi kerak. Talablarga mos kelmagan rasmlar tasdiqlanmaydi.
          </p>
        </div>
      </div>

      <!-- Color Blocks -->
      <div class="new-product-color-media__rows">
        <div 
          v-for="colorName in selectedColors" 
          :key="colorName" 
          class="new-product-color-media__row"
        >
          <!-- Color Label (Dot + Name) -->
          <div class="new-product-color-media__color-header">
            <div 
              class="new-product-color-media__color-dot" 
              :style="{ backgroundColor: getColorHex(colorName), border: getColorBorder(colorName) }"
            ></div>
            <span class="new-product-color-media__color-name">{{ colorName }}</span>
          </div>

          <!-- Media Slots Grid -->
          <div class="new-product-color-media__grid">
            <div 
              v-for="(slot, index) in 6" 
              :key="index" 
              class="new-product-color-media__slot"
              :class="{ 
                'new-product-color-media__slot--filled': getMediaByIndex(colorName, index),
                'new-product-color-media__slot--loading': isLoading(colorName, index)
              }"
            >
              <!-- Slot Loading State -->
              <div v-if="isLoading(colorName, index)" class="new-product-color-media__spinner"></div>

              <!-- Slot Filled State (Preview) -->
              <template v-else-if="getMediaByIndex(colorName, index)">
                <img :src="getMediaUrl(colorName, index)" class="new-product-color-media__preview-img">
                <button class="new-product-color-media__delete-btn" @click="removeMedia(colorName, index)" title="O'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" class="new-product-color-media__remove-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </template>

              <!-- Slot Empty State (Actions) -->
              <template v-else>
                <template v-if="activeMediaTab === 'upload'">
                  <label class="new-product-color-media__upload-box new-product-color-media__upload-box--action">
                    <input 
                      type="file" 
                      multiple 
                      class="new-product-color-media__file-input" 
                      @change="handleFileUpload($event, colorName)" 
                      accept="image/jpeg,image/png,image/webp"
                    >
                    <div v-if="!isFirstEmptySlot(colorName, index)" class="new-product-color-media__placeholder-wrap">
                      <svg class="new-product-color-media__placeholder-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span v-else class="new-product-color-media__upload-text">Rasm yuklash</span>
                  </label>
                </template>
                <template v-else>
                  <!-- Link Input -->
                  <div class="new-product-color-media__link-box">
                    <input 
                      type="text" 
                      class="new-product-color-media__link-input" 
                      placeholder="Http://" 
                      v-model="mediaByColor[colorName][index]"
                      @blur="handleLinkBlur(colorName, index)"
                    >
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>

        <!-- No data state -->
        <div v-if="selectedColors.length === 0" class="new-product-color-media__no-colors">
          Ranglar tanlanmagan. Iltimos, xususiyatlar bo'limidan rang qo'shing.
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductColorMedia',
  inject: ['sharedProduct', 'uploadFile', 'showToast'],
  data() {
    return {
      activeMediaTab: 'upload', // 'upload' | 'link'
      mediaByColor: {},
      loadingSlots: {}, // { "Oq": { 0: true, 1: true } }
      predefinedColors: [
        { name: "Oq", hex: "#FFFFFF", border: "1px solid #E2E8F0" },
        { name: "Qora", hex: "#000000" },
        { name: "Qizil", hex: "#EF4444" },
        { name: "Ko'k", hex: "#3B82F6" },
        { name: "Sariq", hex: "#F59E0B" },
        { name: "Yashil", hex: "#10B981" },
        { name: "Kulrang", hex: "#9CA3AF" },
        { name: "Pushti", hex: "#EC4899" },
        { name: "Apelsin", hex: "#F97316" }, 
        { name: "Jigarrang", hex: "#8B5A2B" }, 
        { name: "Binafsha", hex: "#8B5CF6" }, 
        { name: "Och ko'k", hex: "#0EA5E9" }
      ]
    };
  },
  computed: {
    selectedColors() {
      const colorFeature = this.sharedProduct.features.find(f => f.title === "Rang / Цвет");
      return (colorFeature && colorFeature.items) || [];
    }
  },
  watch: {
    selectedColors: {
      immediate: true,
      handler(newColors) {
        newColors.forEach(color => {
          if (!this.sharedProduct.colorMedia[color]) {
            this.$set(this.sharedProduct.colorMedia, color, Array(6).fill(null));
          }
          if (!this.mediaByColor[color]) {
            this.$set(this.mediaByColor, color, [...this.sharedProduct.colorMedia[color]]);
          }
        });
      }
    }
  },
  methods: {
    getColorHex(name) {
      const color = this.predefinedColors.find(c => c.name === name);
      return color ? color.hex : '#D1D5DB';
    },
    getColorBorder(name) {
      const color = this.predefinedColors.find(c => c.name === name);
      return color && color.border ? color.border : '1px solid rgba(0,0,0,0.05)';
    },
    getMediaByIndex(colorName, index) {
      return this.sharedProduct.colorMedia[colorName] ? this.sharedProduct.colorMedia[colorName][index] : null;
    },
    getMediaUrl(colorName, index) {
      const media = this.getMediaByIndex(colorName, index);
      if (!media) return '';
      if (typeof media === 'string' && (media.startsWith('http') || media.startsWith('data:image'))) {
        return media;
      }
      return `https://api.cabinet.smart-market.uz/uploads/images/${media}`;
    },
    async getFileHash(file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.error('Hash calculation error:', e);
        return null;
      }
    },
    isLoading(colorName, index) {
      return this.loadingSlots[colorName] && this.loadingSlots[colorName][index];
    },
    isFirstEmptySlot(colorName, index) {
      const list = this.sharedProduct.colorMedia[colorName];
      if (!list) return index === 0;
      const firstEmpty = list.findIndex(item => !item);
      return index === firstEmpty || (firstEmpty === -1 && index === 0);
    },
    async handleFileUpload(event, colorName) {
      console.log(`[ColorMedia] File upload started for ${colorName}`);
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const currentMedia = [...(this.sharedProduct.colorMedia[colorName] || Array(6).fill(null))];
      const availableIndices = [];
      for (let i = 0; i < 6; i++) {
        if (!currentMedia[i]) availableIndices.push(i);
      }

      if (availableIndices.length === 0) {
        this.showToast('Barcha joylar to\'lgan. Yangi rasm yuklash uchun oldingisini o\'chiring.', 'warning');
        return;
      }

      const uploadLimit = Math.min(files.length, availableIndices.length);
      
      for (let i = 0; i < uploadLimit; i++) {
        const file = files[i];
        const slotIndex = availableIndices[i];

        console.log(`[ColorMedia] Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

        if (!file.type.startsWith('image/')) {
          this.showToast(`'${file.name}' rasm emas.`, 'error');
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.showToast(`'${file.name}' juda katta (max 5MB).`, 'error');
          continue;
        }

        // Pre-upload check (best effort)
        // We can't be sure about duplicates by name only, but it's a good hint
        // However, we rely more on the ID check after upload.

        if (!this.loadingSlots[colorName]) this.$set(this.loadingSlots, colorName, {});
        this.$set(this.loadingSlots[colorName], slotIndex, true);

        try {
          // Contents-based Duplicate Validation (SHA-256)
          const fileHash = await this.getFileHash(file);
          if (fileHash && this.sharedProduct.colorMediaHashes[colorName] && this.sharedProduct.colorMediaHashes[colorName].includes(fileHash)) {
            this.showToast(`Ushbu rasm allaqachon yuklangan. Iltimos, boshqa rasm tanlang.`, 'warning');
            continue;
          }

          const id = await this.uploadFile(file);
          console.log(`[ColorMedia] Upload success. Received ID: ${id}`);
          
          const newList = [...this.sharedProduct.colorMedia[colorName]];
          newList[slotIndex] = id;
          this.$set(this.sharedProduct.colorMedia, colorName, newList);

          // Update hashes
          if (!this.sharedProduct.colorMediaHashes[colorName]) {
            this.$set(this.sharedProduct.colorMediaHashes, colorName, Array(6).fill(null));
          }
          const hashList = [...this.sharedProduct.colorMediaHashes[colorName]];
          hashList[slotIndex] = fileHash;
          this.$set(this.sharedProduct.colorMediaHashes, colorName, hashList);

          if (this.mediaByColor[colorName]) {
            this.$set(this.mediaByColor[colorName], slotIndex, id);
          }

          this.showToast(`${file.name} muvaffaqiyatli yuklandi.`, 'success');
        } catch (error) {
          console.error(`[ColorMedia] Upload error for ${file.name}:`, error);
          this.showToast(`${file.name} yuklashda xatolik: ${error.message}`, 'error');
        } finally {
          this.$set(this.loadingSlots[colorName], slotIndex, false);
        }
      }
      
      event.target.value = '';
    },
    removeMedia(colorName, index) {
      const newList = [...this.sharedProduct.colorMedia[colorName]];
      newList[index] = null;
      this.$set(this.sharedProduct.colorMedia, colorName, newList);
      
      if (this.sharedProduct.colorMediaHashes[colorName]) {
        const hashList = [...this.sharedProduct.colorMediaHashes[colorName]];
        hashList[index] = null;
        this.$set(this.sharedProduct.colorMediaHashes, colorName, hashList);
      }

      if (this.mediaByColor[colorName]) {
        this.$set(this.mediaByColor[colorName], index, '');
      }
      
      this.showToast('Rasm ro\'yxatdan olib tashlandi.', 'success');
    },
    async handleLinkBlur(colorName, index) {
      const val = this.mediaByColor[colorName][index];
      if (val && val.trim().startsWith('http')) {
        const url = val.trim();
        
        // Use shared logic for link hashing if we want to be truly professional, 
        // but for now simple link check to keep it light
        const currentList = this.sharedProduct.colorMedia[colorName] || [];
        if (currentList.some((item, idx) => idx !== index && item && String(item) === String(url))) {
          this.showToast('Ushbu rasm allaqachon mavjud. Iltimos, boshqa link qo\'ying.', 'warning');
          this.$set(this.mediaByColor[colorName], index, '');
          return;
        }

        const newList = [...this.sharedProduct.colorMedia[colorName]];
        newList[index] = url;
        this.$set(this.sharedProduct.colorMedia, colorName, newList);
        this.showToast('Rasm linki saqlandi.', 'success');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-color-media {
  font-family: 'Inter', sans-serif;
  width: 100%;
  padding: 0 0 2rem 0;
  box-sizing: border-box;
}

.new-product-color-media__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

/* Tab Design - Matching Video Section */
.new-product-color-media__tabs {
  display: flex;
}

.new-product-color-media__tab {
  padding: 12px 28px;
  background-color: #f9fafb;
  border: 1px solid #dfe2e9;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-product-color-media__tab--active {
  background-color: #ffffff;
  color: #22c55e;
  border-bottom-color: #ffffff;
  z-index: 10;
}

/* Main Wrapper */
.new-product-color-media__container {
  background-color: #ffffff;
  border: 1px solid #dfe2e9;
  border-radius: 0 12px 12px 12px;
  padding: 32px 24px;
  box-sizing: border-box;
  margin-top: -1px;
  position: relative;
  z-index: 1;
}

/* Info Cards (1 Row, 3 Cards) */
.new-product-color-media__info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.new-product-color-media__info-card {
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.new-product-color-media__info-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.new-product-color-media__info-list {
  padding-left: 18px;
  margin: 0;
  font-size: 13px;
  color: #4B5563;
  line-height: 1.6;
}

.new-product-color-media__info-list li {
  margin-bottom: 6px;
}

.new-product-color-media__info-card-text {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
}

/* Color Row Styling */
.new-product-color-media__row {
  margin-bottom: 32px;
}

.new-product-color-media__color-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.new-product-color-media__color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
}

.new-product-color-media__color-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

/* Media Grid Layout (6 columns) */
.new-product-color-media__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.new-product-color-media__slot {
  aspect-ratio: 1 / 1;
  border: 1.5px dashed #DFE2E9;
  border-radius: 16px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
}

.new-product-color-media__slot--filled {
  border-style: solid;
}

.new-product-color-media__preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-product-color-media__delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.2s;
  padding: 0;
  z-index: 10;
  opacity: 0;
}

.new-product-color-media__remove-icon {
  width: 14px;
  height: 14px;
}

.new-product-color-media__slot:hover .new-product-color-media__delete-btn {
  opacity: 1;
}

.new-product-color-media__delete-btn:hover {
  background-color: #ef4444;
}

.new-product-color-media__upload-box--action {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.new-product-color-media__upload-box--action:hover {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.new-product-color-media__slot--filled:hover {
  background-color: transparent; /* Don't change background if image is there */
}

/* Matching Section 1 Styles */
.new-product-color-media__placeholder-wrap {
  width: 36px;
  height: 36px;
  background-color: #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-product-color-media__placeholder-icon {
  width: 18px;
  height: 18px;
  color: #10b981;
}

.new-product-color-media__upload-text {
  color: #22c55e;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.new-product-color-media__file-input {
  display: none;
}

.new-product-color-media__link-box {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.new-product-color-media__link-input {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 12px;
  color: #111827;
  text-align: center;
  outline: none;
  font-family: inherit;
}

.new-product-color-media__no-colors {
  padding: 40px;
  text-align: center;
  color: #9CA3AF;
  font-size: 14px;
  border: 1.5px dashed #E2E8F0;
  border-radius: 16px;
  margin-top: 20px;
}

/* Responsive Grid Adjustments */
@media (max-width: 1200px) {
  .new-product-color-media__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .new-product-color-media__info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .new-product-color-media__info-grid {
    grid-template-columns: 1fr;
  }
  .new-product-color-media__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .new-product-color-media__tab {
    padding: 0 16px;
    font-size: 13px;
  }
}
</style>
