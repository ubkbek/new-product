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
        <a href="#" class="new-product-images__link" @click.prevent="showGuidelineDrawer = true">
          Yo'riqnomada batafsil <span class="new-product-images__link-arrow">&rarr;</span>
        </a>

        <!-- Upload Grid -->
        <div class="new-product-images__upload-grid">
          <!-- Added Images -->
          <div v-for="(img, index) in sharedProduct.images" :key="'img-' + index" 
            class="new-product-images__upload-box new-product-images__upload-box--image"
            :class="{ 
              'new-product-images__upload-box--processing': processingIndices.includes(index),
              'is-dragging': draggedIndex === index,
              'is-over': dragOverIndex === index
            }"
            draggable="true"
            @dragstart="onDragStart(index, $event)"
            @dragover.prevent="onDragOver(index, $event)"
            @dragenter.prevent="onDragEnter(index)"
            @dragleave="onDragLeave(index)"
            @drop="onDrop(index)"
            @dragend="onDragEnd"
          >
            <img :src="getImageUrl(img)" alt="Product image" class="new-product-images__preview-img" @click="openViewer(index)">
            
            <!-- AI Processing Overlay -->
            <div v-if="processingIndices.includes(index)" class="new-product-images__ai-overlay">
              <div class="new-product-images__spinner"></div>
              <span class="new-product-images__ai-status">AI ishlov berilmoqda...</span>
            </div>

            <!-- Action Buttons -->
            <div v-else class="new-product-images__actions">
              <button class="new-product-images__ai-btn-small" @click="processWithAI(index)" title="Fonni o'chirish (AI)">
                ✨
              </button>
              <button class="new-product-images__remove-btn" @click="removeImage(index)" title="O'chirish">
                <svg xmlns="http://www.w3.org/2000/svg" class="new-product-images__remove-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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

        <!-- Image Viewer -->
      </div>
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
            <div v-for="(img, index) in sharedProduct.images" :key="'link-img-' + index" 
              class="new-product-images__upload-box new-product-images__upload-box--image"
              :class="{ 
                'new-product-images__upload-box--processing': processingIndices.includes(index),
                'is-dragging': draggedIndex === index,
                'is-over': dragOverIndex === index
              }"
              draggable="true"
              @dragstart="onDragStart(index, $event)"
              @dragover.prevent="onDragOver(index, $event)"
              @dragenter.prevent="onDragEnter(index)"
              @dragleave="onDragLeave(index)"
              @drop="onDrop(index)"
              @dragend="onDragEnd"
            >
              <img :src="getImageUrl(img)" alt="Preview" class="new-product-images__preview-img" @click="openViewer(index)">
              
              <!-- AI Processing Overlay -->
              <div v-if="processingIndices.includes(index)" class="new-product-images__ai-overlay">
                <div class="new-product-images__spinner"></div>
                <span class="new-product-images__ai-status">AI ishlov...</span>
              </div>

              <!-- Action Buttons -->
              <div v-else class="new-product-images__actions">
                <button class="new-product-images__ai-btn-small" @click="processWithAI(index)" title="Fonni o'chirish (AI)">
                  ✨
                </button>
                <button class="new-product-images__remove-btn" @click="removeImage(index)" title="O'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" class="new-product-images__remove-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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

    <!-- Image Viewer (Moved to root level) -->
    <BaseImageViewer 
      :show="viewerShow" 
      :images="viewerImages" 
      :initial-index="viewerIndex" 
      @close="viewerShow = false" 
    />

    <!-- GUIDELINE SIDE PANEL (DRAWER) - PORTAL STYLE -->
    <transition name="drawer-slide">
      <div v-if="showGuidelineDrawer" class="pn-guideline-overlay" @click.self="showGuidelineDrawer = false">
        <div class="pn-guideline-drawer">
          <!-- Header (Matching Cabinet Design) -->
          <div class="pn-guideline-header">
            <div class="pn-guideline-header-left">
              <h3 class="pn-guideline-header-title">Rasm yuklash yordamchisi</h3>
              <span class="pn-guideline-header-badge">TUTORIAL</span>
            </div>
            <button class="pn-guideline-close-btn" @click="showGuidelineDrawer = false">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="pn-guideline-content">
            <section class="pn-guideline-intro">
              <p class="pn-guideline-subtitle">Suratlar mahsulotingizning "yuzi" hisoblanadi. Sifatli rasm xaridor qarorini 80% holatlarda ijobiy hal qiladi.</p>
            </section>

            <!-- 3 Step Path -->
            <div class="pn-guideline-path">
              <h4 class="pn-guideline-section-title">Professional suratlar 3 qadamda</h4>
              
              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">01</div>
                <div class="pn-guideline-step-info">
                  <h5>Tabiiy yorug‘likdan foydalaning</h5>
                  <p>Mahsulotni kunduzi, darcha yonida tushiring. Bu ranglarning aniqligini va sifatini ta'minlaydi.</p>
                </div>
              </div>

              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">02</div>
                <div class="pn-guideline-step-info">
                  <h5>AI Magic ✨ (Fonni tozalash)</h5>
                  <p>Agar orqa fon chalg‘ituvchi bo‘lsa, rasmdagi ✨ tugmasini bosing. AI avtomatik fonni tozalab beradi.</p>
                </div>
              </div>

              <div class="pn-guideline-step">
                <div class="pn-guideline-step-num">03</div>
                <div class="pn-guideline-step-info">
                  <h5>Barcha burchaklarni ko‘rsating</h5>
                  <p>Mahsulotning oldi, yon, orqa va albatta "close-up" (yaqinlashtirilgan) suratlarini yuklang.</p>
                </div>
              </div>
            </div>

            <!-- Formula Reference Card -->
            <div class="pn-guideline-formula-card">
              <span class="pn-guideline-formula-label">Ideal surat formulasi</span>
              <div class="pn-guideline-formula-row">
                <span class="pn-guideline-formula-item">Tiniq surat</span>
                <span class="pn-guideline-plus">+</span>
                <span class="pn-guideline-formula-item">Oq fon</span>
                <span class="pn-guideline-plus">+</span>
                <span class="pn-guideline-formula-item">Matnsiz</span>
                <span class="pn-guideline-plus">=</span>
                <span class="pn-guideline-formula-item">Sotuvlar</span>
              </div>
              <div class="pn-guideline-formula-example">
                Studio-sifati: Eng kamida 1080x1440 o‘lcham
              </div>
            </div>

            <!-- Comparisons -->
            <div class="pn-comparison">
              <h4 class="pn-guideline-section-title">Solishtirish</h4>
              <div class="pn-comparison-grid">
                <div class="pn-comp-box pn-comp-box--good">
                  <div class="pn-comp-header">Professional ✅</div>
                  <p>Neytral fonda, tiniq yoritilgan, faqat mahsulot o‘zi.</p>
                  <ul>
                    <li>Diqqat mahsulotda</li>
                    <li>Ishonchni oshiradi</li>
                  </ul>
                </div>
                <div class="pn-comp-box pn-comp-box--bad">
                  <div class="pn-comp-header">Taqiqlangan ✕</div>
                  <p>Uy sharoitida, yomon chiroq, suv belgilari (watermark) bor.</p>
                  <ul>
                    <li>Watermark taqiqlanadi</li>
                    <li>Moderatsiyadan o‘tmaydi</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Pro Tip -->
            <div class="pn-pro-tip">
              <span class="pn-pro-tip-icon">💡</span>
              <div class="pn-pro-tip-body">
                <strong>Pro Tip:</strong> Birinchi rasm (Main image) har doim oq fonda va eng jozibali bo‘lishi shart.
              </div>
            </div>

            <!-- Warnings -->
            <div class="pn-warnings">
              <h4 class="pn-guideline-section-title">Taqiqlanadi</h4>
              <ul class="pn-warning-list">
                <li>Suv belgilari (Watermarks) qo‘yish</li>
                <li>Rasm ustiga matnlar yozish</li>
                <li>Xira yoki past sifatli (low-res) suratlar</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="pn-guideline-footer">
            <button class="pn-guideline-close-footer" @click="showGuidelineDrawer = false">Tushundim</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NewProductImageInfoCard from './NewProductImageInfoCard.vue';
import BaseImageViewer from './BaseImageViewer.vue';
import { removeBackground } from '../utils/ai-bg-remover';

export default {
  name: 'NewProductImages',
  components: {
    NewProductImageInfoCard,
    BaseImageViewer
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
          title: 'AI Magic ✨', 
          text: 'Rasmni yuklang va ✨ tugmasini bosing — AI avtomatik tarzda fonni tozalab beradi.' 
        },
        { 
          title: 'Sifatli rasmlar', 
          text: 'Sifatli va yaqin olingan rasmlar mahsulotni aniq ko\'rsatadi va xaridor ishonchini oshiradi.' 
        },
        { 
          title: 'Moderatsiya', 
          text: 'Rasmlar aniq, sifatli va boshqa brendlarga tegishli bo\'lmagan bo\'lishi kerak.<br>Talablarga mos kelmagan rasmlar tasdiqlanmaydi.' 
        }
      ],
      isLinking: false,
      processingIndices: [],
      viewerShow: false,
      viewerIndex: 0,
      showGuidelineDrawer: false,
      draggedIndex: null,
      dragOverIndex: null
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
    },
    viewerImages() {
      return this.sharedProduct.images.map(img => this.getImageUrl(img));
    }
  },
  watch: {
    showGuidelineDrawer(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', this.handleKeydown);
      } else {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', this.handleKeydown);
      }
    }
  },
  methods: {
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.showGuidelineDrawer = false;
      }
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
    },
    async processWithAI(index) {
      if (this.processingIndices.includes(index)) return;
      
      this.processingIndices.push(index);
      
      try {
        const fullUrl = this.getImageUrl(this.sharedProduct.images[index]);
        const result = await removeBackground(fullUrl);
        if (result.success) {
          // Update the image in the state
          this.$set(this.sharedProduct.images, index, result.url);
          this.showToast('Fon muvaffaqiyatli o\'chirildi!', 'success');
        }
      } catch (e) {
        this.showToast('AI jarayonida xatolik yuz berdi.', 'error');
      } finally {
        this.processingIndices = this.processingIndices.filter(i => i !== index);
      }
    },
    openViewer(index) {
      if (this.processingIndices.includes(index)) return;
      this.viewerIndex = index;
      this.viewerShow = true;
    },
    // Drag & Drop Handlers
    onDragStart(index, event) {
      this.draggedIndex = index;
      event.dataTransfer.effectAllowed = 'move';
      // Optional: set a transparent ghost image if browser default isn't good enough
    },
    onDragOver(index, event) {
      // Required for drop to work
      event.dataTransfer.dropEffect = 'move';
    },
    onDragEnter(index) {
      if (this.draggedIndex === index) return;
      this.dragOverIndex = index;
    },
    onDragLeave(index) {
      if (this.dragOverIndex === index) {
        this.dragOverIndex = null;
      }
    },
    onDrop(targetIndex) {
      if (this.draggedIndex === null || this.draggedIndex === targetIndex) return;

      const images = [...this.sharedProduct.images];
      const hashes = [...(this.sharedProduct.imageHashes || [])];

      // Move Image
      const [draggedImage] = images.splice(this.draggedIndex, 1);
      images.splice(targetIndex, 0, draggedImage);

      // Move Hash (Stay in sync for duplicate detection)
      if (hashes.length > 0) {
        const [draggedHash] = hashes.splice(this.draggedIndex, 1);
        hashes.splice(targetIndex, 0, draggedHash);
      }

      // Update Shared State
      this.sharedProduct.images = images;
      if (this.sharedProduct.imageHashes) {
        this.sharedProduct.imageHashes = hashes;
      }
      
      this.onDragEnd();
    },
    onDragEnd() {
      this.draggedIndex = null;
      this.dragOverIndex = null;
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
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
  z-index: 50;
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
  cursor: zoom-in;
}

.new-product-images__actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.new-product-images__upload-box--image:hover .new-product-images__actions {
  opacity: 1;
}

.new-product-images__remove-btn,
.new-product-images__ai-btn-small {
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
  transition: all 0.2s;
  padding: 0;
}

.new-product-images__ai-btn-small {
  font-size: 12px;
}

.new-product-images__ai-btn-small:hover {
  background-color: #A855F7;
  transform: scale(1.1);
}

.new-product-images__remove-btn:hover {
  background-color: #ef4444;
}

.new-product-images__remove-icon {
  width: 14px;
  height: 14px;
}

.new-product-images__ai-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.new-product-images__ai-status {
  font-size: 10px;
  font-weight: 600;
  color: #A855F7;
  margin-top: 8px;
  text-align: center;
}

.new-product-images__spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid #f3f3f3;
  border-top: 2.5px solid #A855F7;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

.new-product-images__upload-box--processing {
  border-color: #A855F7 !important;
}

/* Drag & Drop Feedback Styles */
.new-product-images__upload-box--image {
  cursor: grab !important;
}

.new-product-images__upload-box--image:active {
  cursor: grabbing !important;
}

.new-product-images__upload-box--image.is-dragging {
  opacity: 0.4;
  transform: scale(0.95);
  border: 2px dashed #22c55e;
  background-color: #f0fdf4;
}

.new-product-images__upload-box--image.is-over {
  border: 2px solid #22c55e;
  transform: scale(1.05);
  box-shadow: 0 10px 20px -5px rgba(34, 197, 94, 0.2);
  z-index: 30;
}

.new-product-images__upload-box--image.is-over::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(34, 197, 94, 0.05);
  pointer-events: none;
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
/* GUIDELINE SIDE PANEL STYLES (PORTAL-STYLE) */
.pn-guideline-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
}

.pn-guideline-drawer {
  width: 70%;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.1);
}

.pn-guideline-header {
  padding: 24px 40px;
  border-bottom: 1px solid #DFE2E9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
}

.pn-guideline-header-left { display: flex; align-items: center; gap: 16px; }
.pn-guideline-header-title { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }
.pn-guideline-header-badge { font-size: 10px; font-weight: 800; background: #EEF2FF; color: #3B82F6; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em; }

.pn-guideline-close-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}
.pn-guideline-close-btn:hover { color: #111827; }
.pn-guideline-close-btn svg { width: 24px; height: 24px; }

.pn-guideline-content { flex: 1; overflow-y: auto; padding: 40px; }

.pn-guideline-intro { margin-bottom: 40px; }
.pn-guideline-subtitle { font-size: 16px; color: #64748B; line-height: 1.6; margin: 0; }

.pn-guideline-section-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 24px; }

/* 3 Step Path */
.pn-guideline-path { margin-bottom: 56px; }
.pn-guideline-step { display: flex; gap: 20px; margin-bottom: 24px; }
.pn-guideline-step-num { width: 40px; height: 40px; border-radius: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #3B82F6; flex-shrink: 0; }
.pn-guideline-step-info h5 { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 4px 0; }
.pn-guideline-step-info p { font-size: 14px; color: #64748B; margin: 0; line-height: 1.5; }

/* Formula Card */
.pn-guideline-formula-card { background: #F9FBFF; border: 1px solid #E0E7FF; border-radius: 16px; padding: 32px; margin-bottom: 56px; text-align: center; }
.pn-guideline-formula-label { font-size: 12px; font-weight: 700; color: #6366F1; text-transform: uppercase; display: block; margin-bottom: 20px; }
.pn-guideline-formula-row { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.pn-guideline-formula-item { background: white; border: 1px solid #DFE2E9; padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; color: #111827; }
.pn-guideline-plus { color: #94A3B8; font-weight: 300; }
.pn-guideline-formula-example { font-size: 15px; color: #111827; font-weight: 700; }

/* Comparison */
.pn-comparison-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 56px; }
.pn-comp-box { padding: 24px; border-radius: 16px; border: 1px solid #E2E8F0; }
.pn-comp-box--good { background: #F0FDF4; border-color: #DCFCE7; }
.pn-comp-box--bad { background: #FEF2F2; border-color: #FEE2E2; }
.pn-comp-header { font-size: 13px; font-weight: 800; margin-bottom: 12px; }
.pn-comp-box--good .pn-comp-header { color: #166534; }
.pn-comp-box--bad .pn-comp-header { color: #991B1B; }
.pn-comp-box p { font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
.pn-comp-box ul { padding-left: 18px; margin: 0; }
.pn-comp-box li { font-size: 13px; color: #475569; margin-bottom: 4px; }

/* Pro Tip */
.pn-pro-tip { background: #EFF6FF; border-radius: 16px; padding: 20px; display: flex; gap: 16px; margin-bottom: 56px; }
.pn-pro-tip-icon { font-size: 20px; }
.pn-pro-tip-body { font-size: 14px; color: #1E40AF; line-height: 1.5; }

/* Warnings */
.pn-warnings { background: #FDF2F2; border: 1px solid #FEE2E2; border-radius: 16px; padding: 24px; }
.pn-warning-list { margin: 0; padding-left: 18px; }
.pn-warning-list li { font-size: 14px; color: #991B1B; font-weight: 500; margin-bottom: 8px; }

/* Footer */
.pn-guideline-footer { padding: 24px 40px; border-top: 1px solid #DFE2E9; background: white; display: flex; justify-content: flex-end; }
.pn-guideline-close-footer { display: inline-block; background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; padding: 12px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.pn-guideline-close-footer:hover { background: #BBF7D0; transform: translateY(-1px); }

/* ANIMATION */
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: opacity 0.6s ease; }
.drawer-slide-enter-active .pn-guideline-drawer, .drawer-slide-leave-active .pn-guideline-drawer { transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
.drawer-slide-enter, .drawer-slide-leave-to { opacity: 0; }
.drawer-slide-enter .pn-guideline-drawer, .drawer-slide-leave-to .pn-guideline-drawer { transform: translateX(100%); }

@media (max-width: 1100px) { .pn-guideline-drawer { width: 85%; } }
@media (max-width: 768px) { .pn-guideline-drawer { width: 100%; } .pn-comparison-grid { grid-template-columns: 1fr; } }
</style>
