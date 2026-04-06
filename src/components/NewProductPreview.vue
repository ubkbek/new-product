<template>
  <div class="new-product-preview">
    
    <div class="new-product-preview__layout">
      
      <!-- Left Content Area -->
      <div class="new-product-preview__content">
        <h1 class="new-product-preview__product-title">{{ productTitle }}</h1>

        <!-- Gallery Section -->
        <div class="new-product-preview__gallery">
          <div class="new-product-preview__thumbnails">
            <div 
              v-for="(item, index) in allGalleryItems" 
              :key="'thumb-' + index"
              class="new-product-preview__thumb"
              :class="{ 'new-product-preview__thumb--active': selectedImageIndex === index }"
              @click="selectedImageIndex = index"
            >
              <img :src="item.url" alt="Thumbnail" class="new-product-preview__thumb-img">
              <div v-if="item.type === 'video'" class="new-product-preview__thumb-overlay">
                 <svg class="new-product-preview__play-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                 </svg>
              </div>
            </div>
          </div>
          
          <div class="new-product-preview__main-views">
             <div class="new-product-preview__main-img-wrap">
                <button class="new-product-preview__nav-btn new-product-preview__nav-btn--left" @click="prevImg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <img 
                  :src="allGalleryItems[selectedImageIndex] ? allGalleryItems[selectedImageIndex].url : ''" 
                  alt="Product" 
                  class="new-product-preview__main-img"
                  @click="openViewer(selectedImageIndex)"
                >
             </div>
             <div class="new-product-preview__main-img-wrap new-product-preview__main-img-wrap--secondary">
                <template v-if="allGalleryItems.length > 1">
                  <img 
                    :src="allGalleryItems[(selectedImageIndex + 1) % allGalleryItems.length].url" 
                    alt="Product" 
                    class="new-product-preview__main-img"
                    @click="openViewer((selectedImageIndex + 1) % allGalleryItems.length)"
                  >
                </template>
                <button class="new-product-preview__nav-btn new-product-preview__nav-btn--right" @click="nextImg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
             </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="new-product-preview__description">
          <h2 class="new-product-preview__section-title">Описание</h2>
          
          <div v-if="!activeSpecs.isManual" class="new-product-preview__spec-groups">
            <div v-for="(group, gIndex) in activeSpecs.groups" :key="'group-' + gIndex" class="new-product-preview__spec-group">
              <div class="new-product-preview__spec-group-header">
                <span class="new-product-preview__spec-group-icon">{{ group.icon }}</span>
                <h4 class="new-product-preview__spec-group-title">{{ group.title }}</h4>
              </div>
              <ul class="new-product-preview__spec-items">
                <li v-for="(item, iIndex) in group.items" :key="'item-' + iIndex" class="new-product-preview__spec-item">
                  <span class="new-product-preview__spec-bullet">•</span>
                  <span class="new-product-preview__spec-text">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="new-product-preview__desc-html" v-html="displayDescription"></div>

          <!-- Video Preview (Only if video exists) -->
          <div v-if="sharedProduct.video && sharedProduct.video.videoId" class="new-product-preview__extra-img-wrap">
             <div class="new-product-preview__video-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2"/>
                  <path d="M10 8L16 12L10 16V8Z" fill="white"/>
                </svg>
                <span>Video ko'rish</span>
             </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Area -->
      <aside class="new-product-preview__sidebar">
        <!-- Dynamic Options Section -->
        <div class="new-product-preview__options-section">
          <!-- Features Loop -->
          <div v-for="feat in availableFeatures" :key="feat.title" class="new-product-preview__option-group">
            <label class="new-product-preview__option-label">{{ feat.title }}</label>
            
            <!-- Color Special Layout -->
            <div v-if="feat.isColor" class="new-product-preview__color-grid">
              <div 
                v-for="val in feat.values" 
                :key="val"
                class="new-product-preview__color-item"
                :class="{ 
                  'new-product-preview__color-item--active': selectedFeatures[feat.title] === val 
                }"
                @click="selectFeature(feat.title, val)"
              >
                <div 
                  class="new-product-preview__color-circle" 
                  :style="{ backgroundColor: getColorHex(val) }"
                ></div>
                <span class="new-product-preview__color-tooltip">{{ val }}</span>
              </div>
            </div>

            <!-- Chips Layout (Size, Memory, etc.) -->
            <div v-else class="new-product-preview__chip-grid">
              <div 
                v-for="val in feat.values" 
                :key="val"
                class="new-product-preview__chip"
                :class="{ 
                  'new-product-preview__chip--active': selectedFeatures[feat.title] === val
                }"
                @click="selectFeature(feat.title, val)"
              >
                {{ val }}
              </div>
            </div>
          </div>
        </div>
          
        <!-- Pricing & CTA Card -->
        <div class="new-product-preview__card">
          <div class="new-product-preview__price-section">
            <div v-if="displayDiscountPercent > 0" class="new-product-preview__price-comparison">
               <span class="new-product-preview__price-old">{{ formatPrice(displayPrice) }} so'm</span>
               <span class="new-product-preview__price-discount">-{{ displayDiscountPercent }}%</span>
            </div>
            <h2 class="new-product-preview__price-main">{{ formatPrice(displaySellingPrice) }} so'm</h2>
            
            <div class="new-product-preview__price-detail-box">
              <span class="new-product-preview__price-arrow-up">&uarr;</span>
              <span class="new-product-preview__price-detail-text">{{ formatPrice(displaySellingPrice) }} so'm</span>
              <svg class="new-product-preview__price-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div> 
          
          <button class="new-product-preview__cta-btn">Savatga qo'shish</button>
          
          <!-- Badges -->
          <div class="new-product-preview__info-badges">
            <div v-if="displayStock <= 10" class="new-product-preview__info-badge new-product-preview__info-badge--danger">
              <span class="new-product-preview__badge-icon">🔥</span> Faqat {{ displayStock }} dona qoldi
            </div>
            <div class="new-product-preview__info-badge new-product-preview__info-badge--warning">
              <span class="new-product-preview__badge-icon">⭐</span> Bu haftada birinchi bo'lib sotib oling
            </div>
          </div>
        </div>

        <!-- Seller Section -->
        <div class="new-product-preview__card">
          <div class="new-product-preview__seller-header">
            <div class="new-product-preview__verified-pill">
               <svg class="new-product-preview__verified-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
               </svg>
               Ishonchli
            </div>
          </div>
          <h3 class="new-product-preview__seller-name">ZAFAR MOTO TA'MINOT MAS'ULIYATI CHEKLANGAN JAMIYAT</h3>
          
          <div class="new-product-preview__phone-box">
             <div class="new-product-preview__phone-field">
                <svg class="new-product-preview__phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                   <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="new-product-preview__phone-number">
                   {{ isPhoneVisible ? '+998 90 234 45 44' : '+998 ** *** ** **' }}
                </span>
             </div>
             <button class="new-product-preview__phone-link" @click="isPhoneVisible = !isPhoneVisible">
                {{ isPhoneVisible ? 'Raqamni yashirish' : 'Telefon raqamini ko\'rsatish' }}
             </button>
          </div>

          <p class="new-product-preview__address">
            <svg class="new-product-preview__address-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
               <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Xorazm viloyati, Urganch shahar, Korasiz Obidov ko'chasi, 6-uy
          </p>
        </div>

        <!-- Payments Section -->
        <div class="new-product-preview__card">
           <h4 class="new-product-preview__card-subtitle">To'lov usullari</h4>
           <div class="new-product-preview__payment-grid">
              <div v-for="pay in selectedPaymentItems" :key="pay.id" class="new-product-preview__payment-item">
                 <img :src="pay.icon" :alt="pay.name" class="new-product-preview__payment-icon">
                 <span class="new-product-preview__payment-name">{{ pay.name }}</span>
              </div>
           </div>
        </div>

      </aside>

    </div>

    <!-- Image Viewer -->
    <BaseImageViewer 
      :show="viewerShow" 
      :images="viewerImages" 
      :initial-index="viewerIndex" 
      @close="viewerShow = false" 
    />
    
    <!-- Premium Sticky Footer for Step 3 -->
    <transition name="slide-up-footer">
      <div class="sticky-footer-wrapper" v-if="showStickyFooter">
        <div class="step-action-bar">
          <div class="sab-left">
            <div class="sab-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="sab-text">
              <h4>Barchasi to'g'rimi?</h4>
              <p>Agar ma'lumotlar tayyor bo'lsa, mahsulotni yarating.</p>
            </div>
          </div>
          <div class="sab-right">
            <button class="sab-btn sab-btn--secondary" @click="$emit('change-step', 2)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ortga qaytish
            </button>
            <button class="sab-btn sab-btn--primary" @click="handleCreate">
              Mahsulotni yaratish
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { formatPrice } from '../utils/formatters';
import BaseImageViewer from './BaseImageViewer.vue';

export default {
  name: 'NewProductPreview',
  components: {
    BaseImageViewer
  },
  inject: ['sharedProduct'],
  data() {
    return {
      selectedImageIndex: 0,
      isPhoneVisible: false,
      viewerShow: false,
      viewerIndex: 0,
      selectedFeatures: {}, // { "Rang": "Oq", "Size": "M" }
      predefinedColors: [
        { name: "Oq", hex: "#FFFFFF" },
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
      ],
      paymentOptions: [
        { id: 1, name: 'Oila kredit', icon: 'https://img.icons8.com/color/48/000000/leaf.png' },
        { id: 2, name: 'SSUDA', icon: 'https://img.icons8.com/color/48/000000/handshake.png' },
        { id: 3, name: 'Bank krediti', icon: 'https://img.icons8.com/color/48/000000/museum.png' },
        { id: 4, name: 'Naqd pulda', icon: 'https://img.icons8.com/color/48/000000/money-bag.png' },
        { id: 5, name: 'Pul o\'tkazish', icon: 'https://img.icons8.com/color/48/000000/money-transfer.png' }
      ],
      showStickyFooter: false
    };
  },
  created() {
    this.initSelections();
  },
  mounted() {
    setTimeout(() => {
      this.showStickyFooter = true;
    }, 150);
  },
  watch: {
    // Reset gallery to first image when color changes
    'selectedFeatures.Rang / Цвет'() {
      this.selectedImageIndex = 0;
    }
  },
  computed: {
    productTitle() {
      // Prefer Russian because original UI was in Russian for product name
      return this.sharedProduct.title_ru || this.sharedProduct.title || 'Новый товар';
    },

    selectedPaymentItems() {
      const selectedIds = this.sharedProduct.delivery.selectedPayments || [];
      return this.paymentOptions.filter(p => selectedIds.includes(p.id));
    },

    viewerImages() {
      return this.allGalleryItems
        .filter(item => item.type === 'image')
        .map(item => item.url);
    },

    availableFeatures() {
      return (this.sharedProduct.features || []).map(f => ({
        title: f.title,
        values: f.items,
        isColor: f.title === 'Rang / Цвет'
      }));
    },

    currentSkuRow() {
      if (!this.sharedProduct.skuRows || this.sharedProduct.skuRows.length === 0) return null;
      
      return this.sharedProduct.skuRows.find(row => {
        return row.variantValues.every(val => {
          return Object.values(this.selectedFeatures).includes(val);
        });
      }) || this.sharedProduct.skuRows[0];
    },

    displayPrice() {
      return this.currentSkuRow ? this.currentSkuRow.price : 0;
    },
    displaySellingPrice() {
       return this.currentSkuRow ? (this.currentSkuRow.sellingPrice || this.currentSkuRow.price) : 0;
    },
    displayDiscountPercent() {
      if (!this.currentSkuRow || !this.currentSkuRow.price) return 0;
      const disc = this.currentSkuRow.discount || 0;
      return Math.round((disc / this.currentSkuRow.price) * 100);
    },
    displayStock() {
       return this.currentSkuRow ? this.currentSkuRow.totalQuantity : 0;
    },

    allGalleryItems() {
      const items = [];
      const p = this.sharedProduct;
      const seenIds = new Set(); // To prevent duplicate images

      // 1. Color specific images first (if color selected)
      const selectedColor = this.selectedFeatures['Rang / Цвет'];
      if (selectedColor && p.colorMedia && p.colorMedia[selectedColor]) {
        p.colorMedia[selectedColor].forEach(id => {
          if (id) {
            items.push({ type: 'image', id: String(id), url: this.getImageUrl(id) });
            seenIds.add(String(id));
          }
        });
      }

      // 2. Add General Images (ONLY if no color specific images were found)
      if (items.length === 0 && p.images && p.images.length > 0) {
        p.images.forEach(img => {
          const idStr = String(img);
          if (!seenIds.has(idStr)) {
            items.push({ type: 'image', id: idStr, url: this.getImageUrl(img) });
            seenIds.add(idStr);
          }
        });
      }

      // 3. Add Video at the end
      if (p.video && p.video.videoId) {
        // Mock video thumbnail
        items.push({ 
          type: 'video', 
          url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
          videoId: p.video.videoId 
        });
      }

      // Fallback
      if (items.length === 0) {
        items.push({ type: 'image', url: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=600&q=80' });
      }

      return items;
    },

    activeSpecs() {
      const specsState = this.sharedProduct.specs;
      if (!specsState) return { isManual: true, groups: [] };
      
      if (specsState.selectedVariant !== 'manual' && specsState.variants && specsState.variants.length > 0) {
        const variant = specsState.variants.find(v => v.id === specsState.selectedVariant) || specsState.variants[0];
        return {
          isManual: false,
          groups: variant.ru?.groups || variant.uz?.groups || []
        };
      }
      
      return { isManual: true, groups: [] };
    },

    displayDescription() {
      // Show both if available, otherwise fallback
      const ru = this.sharedProduct.specs.manualRu || '';
      const uz = this.sharedProduct.specs.manualUz || '';
      if (ru && uz) return `<div class="lang-block ru-desc">${ru}</div><div class="lang-block uz-desc" style="margin-top: 24px;">${uz}</div>`;
      return ru || uz || '';
    }
  },
  methods: {
    initSelections() {
      (this.sharedProduct.features || []).forEach(f => {
        if (f.items && f.items.length > 0) {
          this.$set(this.selectedFeatures, f.title, f.items[0]);
        }
      });
    },
    selectFeature(featTitle, value) {
      this.$set(this.selectedFeatures, featTitle, value);
      this.selectedImageIndex = 0; // Reset gallery to first matching item
    },
    getColorHex(name) {
      const c = this.predefinedColors.find(pc => pc.name === name);
      return c ? c.hex : '#D1D5DB';
    },
    getImageUrl(id) {
      if (!id) return '';
      if (id.startsWith('http')) return id;
      return `https://api.cabinet.smart-market.uz/uploads/images/${id}`;
    },
    openViewer(index) {
      const item = this.allGalleryItems[index];
      if (!item || item.type !== 'image') return;
      
      // Calculate index relative to images only
      const imagesOnly = this.allGalleryItems.filter(i => i.type === 'image');
      this.viewerIndex = imagesOnly.findIndex(i => i.url === item.url);
      this.viewerShow = true;
    },
    nextImg() {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.allGalleryItems.length;
    },
    prevImg() {
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.allGalleryItems.length) % this.allGalleryItems.length;
    },
    formatPrice,
    handleCreate() {
      if (this.sharedProduct.alert) {
         this.sharedProduct.alert = {
            show: true,
            title: 'Muvaffaqiyatli saqlandi',
            message: 'Yangi mahsulot tizimga muvaffaqiyatli qo\'shildi va moderatsiyaga yuborildi!',
            type: 'success'
         };
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-preview {
  font-family: 'Inter', sans-serif;
  width: 100%;
  margin: 0 auto;
}

.new-product-preview__layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  padding-bottom: 3rem;
  min-width: 0;
}

.new-product-preview__content {
  background-color: transparent;
  min-width: 0;
}

.new-product-preview__product-title {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 24px 0;
}

/* Gallery Styles */
.new-product-preview__gallery {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  min-width: 0;
}

.new-product-preview__thumbnails {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 444px; /* Matches 6 thumbnails (6*64 + 5*12) */
  overflow-y: auto;
  padding-right: 4px;
}

/* Hide scrollbar but keep functionality */
.new-product-preview__thumbnails::-webkit-scrollbar {
  width: 4px;
}
.new-product-preview__thumbnails::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}

.new-product-preview__thumb {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;
}

.new-product-preview__thumb--active {
  border-color: #22c55e;
}

.new-product-preview__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-product-preview__thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-product-preview__play-icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.new-product-preview__main-views {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  min-width: 0;
  height: 444px; /* Strictly match thumbnail stack height */
}

.new-product-preview__main-img-wrap {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.new-product-preview__spec-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.new-product-preview__spec-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.new-product-preview__main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
}

.new-product-preview__nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition: opacity 0.2s, transform 0.2s;
}

.new-product-preview__nav-btn:hover {
  opacity: 0.7;
  transform: translateY(-50%) scale(1.1);
}

.new-product-preview__nav-btn svg {
  width: 28px;
  height: 28px;
}

.new-product-preview__nav-btn--left { left: 8px; }
.new-product-preview__nav-btn--right { right: 8px; }

.new-product-preview__main-img-wrap--secondary {
  opacity: 0.9;
}

/* Description Area */
.new-product-preview__section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 20px 0;
}

.new-product-preview__spec-groups {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
}

.new-product-preview__spec-group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.new-product-preview__spec-group-icon {
  font-size: 20px;
}

.new-product-preview__spec-group-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.new-product-preview__spec-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.new-product-preview__spec-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-left: 4px;
}

.new-product-preview__spec-bullet {
  color: #9ca3af;
  font-size: 18px;
  line-height: 1;
  margin-top: -2px;
}

.new-product-preview__spec-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.new-product-preview__desc-html {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 24px;
  word-break: break-word;
}

.new-product-preview__desc-html ::v-deep img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.new-product-preview__desc-html ::v-deep h1 { font-size: 20px; font-weight: 700; margin: 24px 0 12px 0; color: #111827; }
.new-product-preview__desc-html ::v-deep h2 { font-size: 18px; font-weight: 700; margin: 20px 0 10px 0; color: #111827; }
.new-product-preview__desc-html ::v-deep h3 { font-size: 16px; font-weight: 700; margin: 16px 0 8px 0; color: #111827; }
.new-product-preview__desc-html ::v-deep p { margin-bottom: 12px; }
.new-product-preview__desc-html ::v-deep b, .new-product-preview__desc-html ::v-deep strong { font-weight: 700; }
.new-product-preview__desc-html ::v-deep i, .new-product-preview__desc-html ::v-deep em { font-style: italic; }

.new-product-preview__extra-img-wrap {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 40px;
}

.new-product-preview__extra-img {
  width: 100%;
  display: block;
}

.new-product-preview__desc-blocks {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.new-product-preview__desc-block-title {
  font-size: 15px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 8px 0;
}

.new-product-preview__desc-block-content {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

/* Video Placeholder */
.new-product-preview__video-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #1f2937;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: inherit;
}

.new-product-preview__video-placeholder:hover {
  background-color: #111827;
}

/* Sidebar Area */
.new-product-preview__sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.new-product-preview__options-section {
  padding: 0;
  margin-bottom: 8px;
}

.new-product-preview__card {
  background-color: #fff;
  border: 1px solid #DFE2E9;
  border-radius: 16px;
  padding: 24px;
}

.new-product-preview__option-group:not(:last-child) {
  margin-bottom: 24px;
}

.new-product-preview__option-label {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.new-product-preview__color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.new-product-preview__color-item {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 3px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.new-product-preview__color-item--active {
  border-color: #fbbf24;
}

.new-product-preview__color-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
}

.new-product-preview__color-tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #374151;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.new-product-preview__color-item:hover .new-product-preview__color-tooltip {
  opacity: 1;
}

.new-product-preview__color-item--disabled {
  position: relative;
  opacity: 0.5;
  cursor: not-allowed;
}

.new-product-preview__color-item--disabled::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(45deg, transparent 48%, #fff 48%, #fff 52%, transparent 52%);
  backdrop-filter: grayscale(1);
}

.new-product-preview__color-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-product-preview__chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.new-product-preview__chip {
  padding: 8px 16px;
  border: 1.5px solid #DFE2E9;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.new-product-preview__chip--active {
  border-color: #22c55e;
  color: #22c55e;
}

.new-product-preview__chip--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-style: dashed;
}

.new-product-preview__price-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.new-product-preview__price-main {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -1px;
}

.new-product-preview__price-detail-box {
  display: flex;
  align-items: center;
  background-color: #FFF1F1;
  border: 1px solid #FFDCDC;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-product-preview__price-detail-box:hover {
  background-color: #FFE8E8;
}

.new-product-preview__price-arrow-up {
  color: #F87171;
  font-size: 18px;
  font-weight: 700;
  margin-right: 8px;
}

.new-product-preview__price-detail-text {
  font-size: 15px;
  font-weight: 600;
  color: #F87171;
}

.new-product-preview__price-chevron {
  width: 14px;
  height: 14px;
  color: #F87171;
  margin-left: auto;
}

.new-product-preview__price-comparison {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.new-product-preview__price-old {
  font-size: 16px;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.new-product-preview__price-discount {
  background-color: #fee2e2;
  color: #ef4444;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.new-product-preview__cta-btn {
  width: 100%;
  height: 54px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.new-product-preview__cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.3);
}

.new-product-preview__cta-btn:active {
  transform: translateY(0);
}

.new-product-preview__info-badges {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.new-product-preview__info-badge {
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-product-preview__info-badge--danger {
  background-color: #ecfdf5;
  color: #059669;
}

.new-product-preview__info-badge--warning {
  background-color: #fffbeb;
  color: #d97706;
}

/* Seller Card Styles */
.new-product-preview__seller-header {
  margin-bottom: 12px;
}

.new-product-preview__verified-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #22c55e;
  color: #fff;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
}

.new-product-preview__verified-icon {
  width: 16px;
  height: 16px;
}

.new-product-preview__seller-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  margin: 0 0 20px 0;
  text-transform: uppercase;
}

.new-product-preview__phone-box {
  margin-bottom: 24px;
}

.new-product-preview__phone-field {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  background-color: #fff;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.new-product-preview__phone-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.new-product-preview__phone-number {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.5px;
}

.new-product-preview__phone-link {
  background: none;
  border: none;
  color: #22c55e;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  width: 100%;
  text-align: center;
  transition: color 0.2s;
}

.new-product-preview__phone-link:hover {
  color: #16a34a;
}

.new-product-preview__address {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: flex;
  gap: 10px;
  margin: 0;
}

.new-product-preview__address-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #d1d5db;
}

/* Payment Section */
.new-product-preview__card-subtitle {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 16px 0;
}

.new-product-preview__payment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.new-product-preview__payment-item {
  border: 1px solid #DFE2E9;
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-product-preview__payment-icon {
  width: 24px;
  height: 24px;
}

.new-product-preview__payment-name {
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
}

/* Responsive Handling */
@media (max-width: 1100px) {
  .new-product-preview__layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .new-product-preview__gallery {
    flex-direction: column-reverse;
  }
  .new-product-preview__thumbnails {
    flex-direction: row;
    overflow-x: auto;
  }
  .new-product-preview__main-views {
    grid-template-columns: 1fr;
  }
  .new-product-preview__main-img-wrap--secondary {
    display: none;
  }
}

/* Sticky Footer Styles */
.sticky-footer-wrapper {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.slide-up-footer-enter-active, .slide-up-footer-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-footer-enter, .slide-up-footer-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.step-action-bar {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 1000px;
}

.step-action-bar:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 0.95);
}

.sab-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sab-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #E0F2FE;
  color: #0284C7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sab-icon svg {
  width: 24px;
  height: 24px;
}

.sab-text {
  display: flex;
  flex-direction: column;
}

.sab-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.sab-text p {
  margin: 0;
  font-size: 14px;
  color: #6B7280;
}

.sab-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.sab-btn--secondary {
  background: #FFFFFF;
  color: #475569;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.sab-btn--secondary:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
  color: #1E293B;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.sab-btn--secondary:active {
  transform: translateY(0);
  background: #F1F5F9;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.sab-btn--primary {
  background: #22C55E;
  color: #ffffff;
}

.sab-btn--primary:hover {
  background: #16A34A;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -2px rgba(34, 197, 94, 0.25), 0 3px 6px -2px rgba(34, 197, 94, 0.15);
}

.sab-btn--primary:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .step-action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
  }
  .sab-right {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .sab-btn {
    width: 100%;
  }
}
</style>
