<template>
  <div class="new-product-images">
    <h2 class="new-product-images__title">Mahsulotning umumiy rasmlari</h2>
    
    <!-- Tabs Header -->
    <div class="new-product-images__tabs">
      <button 
        class="new-product-images__tab" 
        :class="{ 'new-product-images__tab--active': activeTab === 'upload', 'new-product-images__tab--disabled': isSpecsIncomplete }"
        @click="isSpecsIncomplete ? null : activeTab = 'upload'"
        :disabled="isSpecsIncomplete"
      >
        Rasmni yuklash
      </button>
      <button 
        class="new-product-images__tab" 
        :class="{ 'new-product-images__tab--active': activeTab === 'link', 'new-product-images__tab--disabled': isSpecsIncomplete }"
        @click="isSpecsIncomplete ? null : activeTab = 'link'"
        :disabled="isSpecsIncomplete"
      >
        Rasm linkini joylash
      </button>
      <button 
        class="new-product-images__tab" 
        :class="{ 'new-product-images__tab--active': activeTab === 'ai', 'new-product-images__tab--disabled': isSpecsIncomplete }"
        @click="isSpecsIncomplete ? null : activeTab = 'ai'"
        :disabled="isSpecsIncomplete"
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
          <NewProductImageInfoCard 
            v-for="info in imageInfoCards" 
            :key="info.title"
            :title="info.title"
            :text="info.text"
          />
        </div>

        <!-- Link -->
        <a href="#" class="new-product-images__link">
          Yo'riqnomada batafsil <span class="new-product-images__link-arrow">&rarr;</span>
        </a>

        <!-- Upload Grid -->
        <div class="new-product-images__upload-grid">
          <!-- Added Images -->
          <div v-for="(img, index) in sharedProduct.images" :key="'img-' + index" class="new-product-images__upload-box new-product-images__upload-box--image">
            <img :src="getImageUrl(img)" alt="Product image" class="new-product-images__preview-img">
            <button class="new-product-images__remove-btn" @click="removeImage(index)">
              <svg xmlns="http://www.w3.org/2000/svg" class="new-product-images__remove-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Active Upload Action -->
          <label v-if="sharedProduct.images.length < 6" class="new-product-images__upload-box new-product-images__upload-box--action" :class="{ 'new-product-images__upload-box--disabled': isSpecsIncomplete }">
            <input type="file" multiple accept=".jpg,.jpeg,.png,.svg,.webp" class="new-product-images__file-input" @change="handleFileUpload" :disabled="isSpecsIncomplete">
            <span class="new-product-images__upload-text">Rasm yuklash</span>
          </label>
          <p v-if="isSpecsIncomplete" class="new-product-images__locked-hint">
            <svg class="new-product-images__lock-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            Oldin texnik parametrlarni to'ldiring
          </p>
          
          <!-- Empty Placeholders -->
          <div v-for="n in Math.max(0, 5 - sharedProduct.images.length)" :key="'placeholder-' + n" class="new-product-images__upload-box">
            <div class="new-product-images__placeholder-wrap">
              <svg class="new-product-images__placeholder-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Link Section -->
      <div v-show="activeTab === 'link'" class="new-product-images__link-section">
        <!-- Requirements Cards -->
        <div class="new-product-images__info-grid">
          <NewProductImageInfoCard 
            v-for="info in imageInfoCards" 
            :key="'link-' + info.title"
            :title="info.title"
            :text="info.text"
          />
        </div>

        <!-- Input Area -->
        <div class="new-product-images__link-input-area">
          <label class="new-product-images__input-label">Rasm linkini joylashtiring</label>
          <div class="new-product-images__input-group">
            <input 
              type="text" 
              class="new-product-images__link-field" 
              :placeholder="isSpecsIncomplete ? 'Oldin texnik parametrlarni to\'ldiring' : '-'" 
              v-model="sharedProduct.imageLink"
              :disabled="isSpecsIncomplete"
            />
            <button class="new-product-images__add-btn" @click="addImageByLink" :disabled="isSpecsIncomplete || isLinking">
              <span v-if="isLinking" class="new-product-images__loader"></span>
              <span v-else class="new-product-images__plus">+</span>
              {{ isLinking ? 'Yuklanmoqda...' : 'Qo\'shish' }}
            </button>
          </div>
        </div>

        <!-- Added Images Preview -->
        <div v-if="sharedProduct.images.length > 0" class="new-product-images__link-preview">
          <h4 class="new-product-images__preview-title">Yuklangan rasmlar ({{ sharedProduct.images.length }}/6)</h4>
          <div class="new-product-images__upload-grid">
            <div v-for="(img, index) in sharedProduct.images" :key="'link-img-' + index" class="new-product-images__upload-box new-product-images__upload-box--image">
              <img :src="getImageUrl(img)" alt="Preview" class="new-product-images__preview-img">
              <button class="new-product-images__remove-btn" @click="removeImage(index)">
                <svg xmlns="http://www.w3.org/2000/svg" class="new-product-images__remove-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
            v-model="sharedProduct.searchQuery"
          >
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import NewProductImageInfoCard from './NewProductImageInfoCard.vue';

export default {
  name: 'NewProductImages',
  components: {
    NewProductImageInfoCard
  },
  inject: ['sharedProduct', 'showAlert', 'showToast', 'uploadFile'],
  data() {
    return {
      activeTab: 'upload', // 'upload' | 'link' | 'ai'
      imageInfoCards: [
        { 
          title: 'Rasm talablari', 
          text: 'JPG, JPEG, PNG yoki WebP format<br>Eng kamida 1080x1440 o\'lcham<br>5 MB dan katta bo\'lmasin<br>Mahsulotni turli burchaklardan tushiring' 
        },
        { 
          title: 'Ranglari bo\'lsa', 
          text: 'Agar mahsulot bir nechta rangda bo\'lsa, har bir rang uchun alohida rasm yuklang.' 
        },
        { 
          title: 'Rasm sotuvni oshiradi', 
          text: 'Sifatli va yaqin olingan rasmlar mahsulotni aniq ko\'rsatadi va xaridor ishonchini oshiradi.' 
        },
        { 
          title: 'Moderatsiya', 
          text: 'Rasmlar aniq, sifatli va boshqa brendlarga tegishli bo\'lmagan bo\'lishi kerak.<br>Talablarga mos kelmagan rasmlar tasdiqlanmaydi.' 
        }
      ],
      isLinking: false
    };
  },
  created() {
    // Audit existing images for URLs from old sessions
    if (this.sharedProduct.images && this.sharedProduct.images.length > 0) {
      this.sharedProduct.images.forEach((img, idx) => {
        if (img.startsWith('http')) {
          console.warn(`[DIAGNOSTIC] Index ${idx} contains a URL instead of an ID: ${img}. This is stale data! Please delete it and re-add.`);
        }
      });
    }
  },
  computed: {
    isSpecsIncomplete() {
      const s = this.sharedProduct.specs;
      if (!s) return true;
      if (s.selectedVariant === 'manual') {
        return !s.manualUz || !s.manualRu;
      }
      return s.variants.length === 0;
    }
  },
  methods: {
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
    async handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp'];
      const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const extension = fileName.split('.').pop();

        if (!allowedExtensions.includes(extension)) {
           this.showToast(`"${file.name}" - rasm formati noto'g'ri. Faqat JPG, PNG, SVG, WEBP yuklash mumkin.`, 'error');
           continue;
        }

        if (file.size > maxSizeBytes) {
           this.showToast(`"${file.name}" - hajmi juda katta (maksimal 5 MB).`, 'error');
           continue;
        }

        // Contents-based Duplicate Validation (SHA-256)
        const fileHash = await this.getFileHash(file);
        if (fileHash && this.sharedProduct.imageHashes && this.sharedProduct.imageHashes.includes(fileHash)) {
          console.warn(`[DIAGNOSTIC] Duplicate content detected for ${file.name}. Hash: ${fileHash}`);
          this.showToast(`Ushbu rasm allaqachon yuklangan. Iltimos, boshqa rasm tanlang.`, 'warning');
          continue;
        }

        if (this.sharedProduct.images.length >= 6) {
          this.showToast('Maksimal 6 ta rasm yuklash mumkin', 'warning');
          break;
        }

        try {
          const id = await this.uploadFile(file);
          
          this.sharedProduct.images.push(id);
          if (this.sharedProduct.imageHashes) {
            this.sharedProduct.imageHashes.push(fileHash);
          }
        } catch (e) {
          this.showToast(e.message || 'Yuklashda xatolik', 'error');
        }
      }

      event.target.value = '';
    },
    getImageUrl(img) {
      if (!img) return '';
      if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image')) {
        console.log('[DIAGNOSTIC] Rendering raw URL:', img);
        return img;
      }
      return `https://api.cabinet.smart-market.uz/uploads/images/${img}`;
    },
    async addImageByLink() {
      const url = this.sharedProduct.imageLink.trim();
      if (!url) return;
      
      if (this.sharedProduct.images.length >= 6) {
        this.showToast('Maksimal 6 ta rasm yuklash mumkin', 'warning');
        return;
      }

      this.isLinking = true;
      try {
        // 1. Fetching the image as a blob
        const res = await fetch(url);
        if (!res.ok) throw new Error("Rasmni o'qib bo'lmadi. URL noto'g'ri bo'lishi mumkin.");
        
        const blob = await res.blob();
        
        // Basic format check from content-type if available
        const contentType = blob.type;
        if (!contentType.includes('image')) {
          throw new Error("Link rasmga tegishli emas!");
        }

        // Create a File object
        const extension = url.split('.').pop().split(/[?#]/)[0] || 'jpg';
        const file = new File([blob], `linked_image.${extension}`, { type: contentType });

        // Contents-based Duplicate Validation (SHA-256 for Links)
        const fileHash = await this.getFileHash(file);
        if (fileHash && this.sharedProduct.imageHashes && this.sharedProduct.imageHashes.includes(fileHash)) {
          this.showToast("Ushbu rasm allaqachon mavjud. Iltimos, boshqa rasm linkini qo'ying.", "warning");
          this.sharedProduct.imageLink = '';
          return;
        }

        // 2. Upload to our server
        const id = await this.uploadFile(file);

        console.log('[DIAGNOSTIC] Successfully uploaded link! Pushing ID:', id);
        this.sharedProduct.images.push(id);
        if (this.sharedProduct.imageHashes) {
          this.sharedProduct.imageHashes.push(fileHash);
        }
        this.sharedProduct.imageLink = '';
        this.showToast('Rasm linkdan muvaffaqiyatli yuklandi', 'success');
      } catch (e) {
        console.error('Link upload error:', e);
        this.showToast("Rasmni yuklab bo'lmadi. CORS cheklovlari yoki URL xatoligi bo'lishi mumkin.", 'error');
      } finally {
        this.isLinking = false;
      }
    },
    removeImage(index) {
      this.sharedProduct.images.splice(index, 1);
      if (this.sharedProduct.imageHashes) {
        this.sharedProduct.imageHashes.splice(index, 1);
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
  width: 100%;
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

.new-product-images__upload-box--image {
  border-style: solid;
  position: relative;
  overflow: hidden;
  padding: 0;
}

.new-product-images__preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-product-images__remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.2s;
  padding: 0;
  z-index: 10;
}

.new-product-images__remove-btn:hover {
  background-color: #ef4444;
}

.new-product-images__remove-icon {
  width: 14px;
  height: 14px;
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

/* Link Preview Section */
.new-product-images__link-preview {
  margin-top: 32px;
  border-top: 1px solid #DFE2E9;
  padding-top: 24px;
}

.new-product-images__preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

/* Link Input Section */
.new-product-images__link-input-area {
  margin-top: 32px;
}

.new-product-images__input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
}

.new-product-images__input-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

.new-product-images__link-field {
  flex: 1;
  height: 48px;
  border: 1px solid #DFE2E9;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 15px;
  color: #1f2937;
  outline: none;
  background-color: #F9FAFB;
  transition: border-color 0.2s ease;
}

.new-product-images__link-field:focus {
  border-color: #22c55e;
  background-color: #ffffff;
}

.new-product-images__add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background-color: #ffffff;
  border: 1.5px solid #22c55e;
  border-radius: 8px;
  color: #22c55e;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-product-images__add-btn:hover {
  background-color: #f0fdf4;
}

.new-product-images__plus {
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
}

.new-product-images__loader {
  width: 16px;
  height: 16px;
  border: 2px solid #22c55e;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.new-product-images__tab--disabled {
  color: #94A3B8;
  cursor: not-allowed;
  opacity: 0.6;
}

.new-product-images__upload-box--disabled {
  background-color: #F8FAFC;
  border-color: #DFE2E9;
  cursor: not-allowed;
  opacity: 0.6;
}

.new-product-images__locked-hint {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #f59e0b;
  margin-top: 8px;
  background-color: #fffbeb;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #fef3c7;
}

.new-product-images__lock-icon {
  width: 14px;
  height: 14px;
}
</style>
