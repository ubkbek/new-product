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
              v-for="(img, index) in galleryImages" 
              :key="'thumb-' + index"
              class="new-product-preview__thumb"
              :class="{ 'new-product-preview__thumb--active': selectedImageIndex === index }"
              @click="selectedImageIndex = index"
            >
              <img :src="img" alt="Thumbnail" class="new-product-preview__thumb-img">
              <div v-if="index === galleryImages.length - 1" class="new-product-preview__thumb-overlay">
                 <svg class="new-product-preview__play-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                 </svg>
              </div>
            </div>
          </div>
          
          <div class="new-product-preview__main-views">
             <div class="new-product-preview__main-img-wrap">
                <button class="new-product-preview__nav-btn new-product-preview__nav-btn--left" @click="prevImg">
                  &larr;
                </button>
                <img :src="galleryImages[selectedImageIndex]" alt="Product" class="new-product-preview__main-img">
                <button class="new-product-preview__nav-btn new-product-preview__nav-btn--right" @click="nextImg">
                  &rarr;
                </button>
             </div>
             <div class="new-product-preview__main-img-wrap new-product-preview__main-img-wrap--secondary">
                <img :src="galleryImages[(selectedImageIndex + 1) % galleryImages.length]" alt="Product" class="new-product-preview__main-img">
             </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="new-product-preview__description">
          <h2 class="new-product-preview__section-title">Описание</h2>
          
          <ul class="new-product-preview__spec-list">
            <li v-for="(spec, sIndex) in specs" :key="'spec-' + sIndex">
              <span class="new-product-preview__spec-icon">{{ spec.icon }}</span>
              {{ spec.label }}: {{ spec.value }}
            </li>
          </ul>

          <div class="new-product-preview__desc-text">
            <p>Motor quvvati: Odatda 1000W dan 1800W gacha bo'lgan cho'tkasiz (brushless) motor.</p>
            <p>Akkumulyator: 5 yoki 6 ta akkumulyatordan iborat bo'lib, odatda 60V yoki 72V kuchlanishda ishlaydi.</p>
            <p>Yurish masofasi (bir quvvatda): To'liq quvvat bilan 50 km dan 100 km gacha masofani bosib o'tishi mumkin (yukning og'irligiga qarab).</p>
            <p>Quvvatlanish vaqti: Taxminan 6-8 soat.</p>
          </div>

          <div class="new-product-preview__extra-img-wrap">
            <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80" alt="Extra Preview" class="new-product-preview__extra-img">
          </div>

          <div class="new-product-preview__desc-blocks">
             <div v-for="(block, bIndex) in descBlocks" :key="'block-' + bIndex" class="new-product-preview__desc-block">
                <h4 class="new-product-preview__desc-block-title">
                  {{ block.icon }} {{ block.title }}
                </h4>
                <p class="new-product-preview__desc-block-content">{{ block.content }}</p>
             </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Area -->
      <aside class="new-product-preview__sidebar">
        
        <!-- Options Section -->
        <div class="new-product-preview__card">
          <div class="new-product-preview__option-group">
            <label class="new-product-preview__option-label">Rang</label>
            <div class="new-product-preview__color-grid">
              <div 
                v-for="color in colorVariants" 
                :key="color.id"
                class="new-product-preview__color-item"
                :class="{ 
                  'new-product-preview__color-item--active': selectedColor === color.id,
                  'new-product-preview__color-item--disabled': color.disabled
                }"
                @click="!color.disabled && (selectedColor = color.id)"
              >
                <img :src="color.img" alt="Color" class="new-product-preview__color-img">
              </div>
            </div>
          </div>

          <div class="new-product-preview__option-group">
            <label class="new-product-preview__option-label">Xususiyatlar</label>
            <div class="new-product-preview__chip-grid">
              <div 
                v-for="feature in featureVariants" 
                :key="feature"
                class="new-product-preview__chip"
                :class="{ 
                  'new-product-preview__chip--active': selectedFeature === feature,
                  'new-product-preview__chip--disabled': feature === '512 GB'
                }"
                @click="feature !== '512 GB' && (selectedFeature = feature)"
              >
                {{ feature }}
              </div>
            </div>
          </div>
          
          <!-- Pricing -->
          <div class="new-product-preview__price-block">
            <h2 class="new-product-preview__price-main">{{ formatPrice(price) }} so'm</h2>
            <div class="new-product-preview__price-comparison">
              <span class="new-product-preview__price-arrow">&uarr;</span>
              <span class="new-product-preview__price-old">{{ formatPrice(price) }} so'm</span>
              <svg class="new-product-preview__price-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- CTA -->
          <button class="new-product-preview__cta-btn">Savatga qo'shish</button>
          
          <!-- Badges -->
          <div class="new-product-preview__info-badges">
            <div class="new-product-preview__info-badge new-product-preview__info-badge--danger">
              <span class="new-product-preview__badge-icon">🔥</span> Faqat 10 dona qoldi
            </div>
            <div class="new-product-preview__info-badge new-product-preview__info-badge--warning">
              <span class="new-product-preview__badge-icon">⭐</span> Bu haftada birinchi bo'lib sotib oling
            </div>
          </div>
        </div>

        <!-- Seller Section -->
        <div class="new-product-preview__card">
          <div class="new-product-preview__seller-header">
            <span class="new-product-preview__verified-badge">
               <svg class="new-product-preview__verified-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
               </svg>
               Ishonchli
            </span>
          </div>
          <h3 class="new-product-preview__seller-name">ZAFAR MOTO TA'MINOT MAS'ULIYATI CHEKLANGAN JAMIYAT</h3>
          
          <div class="new-product-preview__phone-box">
             <div class="new-product-preview__phone-input">
                <svg class="new-product-preview__phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                   <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="new-product-preview__phone-text">{{ isPhoneVisible ? '+998 90 123 45 67' : '+998 ** *** ** **' }}</span>
             </div>
             <button class="new-product-preview__phone-link" @click="isPhoneVisible = !isPhoneVisible">
                {{ isPhoneVisible ? 'Yashirish' : 'Telefon raqamini ko\'rsatish' }}
             </button>
          </div>

          <p class="new-product-preview__address">
            <svg class="new-product-preview__address-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
               <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Xorazm viloyati, Urganch shahar, Karauz Obidov ko'chasi, 6-uy
          </p>
        </div>

        <!-- Payments Section -->
        <div class="new-product-preview__card">
           <h4 class="new-product-preview__card-subtitle">To'lov usullari</h4>
           <div class="new-product-preview__payment-grid">
              <div v-for="pay in payments" :key="pay.id" class="new-product-preview__payment-item">
                 <img :src="pay.icon" :alt="pay.name" class="new-product-preview__payment-icon">
                 <span class="new-product-preview__payment-name">{{ pay.name }}</span>
              </div>
           </div>
        </div>

      </aside>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductPreview',
  data() {
    return {
      productTitle: 'Уч гилдиракли Мотороллер',
      selectedImageIndex: 2,
      isPhoneVisible: false,
      galleryImages: [
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1542362567-b52adfe46b3f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'
      ],
      specs: [
        { icon: '⚙️', label: 'Мотори', value: '1500w' },
        { icon: '🧠', label: 'Мияси', value: '1500w' },
        { icon: '🔘', label: 'Балон', value: '5.00 12 диска' },
        { icon: '📦', label: 'Yuk vazni', value: '1000kg' },
        { icon: '⚡', label: 'Bir zaryadkada', value: '60-90 km yuradi' },
        { icon: '🔋', label: 'Аккумлятори', value: '58AH 60V' },
        { icon: '🌟', label: 'Сифати А`ло даражада', value: '' },
        { icon: '📐', label: 'Борт ҳажми', value: '180×130 см' },
        { icon: '⚡', label: 'Электр Тизими ва Қувват', value: '' }
      ],
      descBlocks: [
        { 
          icon: '📦', 
          title: 'Yuk Tashish Imkoniyatlari', 
          content: 'Yuk ko\'tarish quvvati: Modeliga qarab 500 kg dan 1200 kg gacha. Bort o\'lchami: O\'rtacha 1.5m dan 1.8m gacha uzunlikdagi bortga ega. Tezlik: Maksimal tezligi soatiga 30-50 km oralig\'ida.' 
        },
        { 
          icon: '🛠️', 
          title: 'Konstruksiya va Qulayliklar', 
          content: 'Tormoz tizimi: Old va orqa barabanli yoki gidravlik tormozlar. Transmissiya: Past va baland uzatmalar (ponijenniy peredacha) tizimi mavjud bo\'lib, bu og\'ir yuk bilan tepalikka chiqishda yordam beradi. Qo\'shimchalar: LED faralar, signalizatsiya tizimi va ba\'zi modellarda kabina (yomg\'irdan himoya) mavjud.' 
        }
      ],
      colorVariants: [
        { id: 1, img: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=100&q=80', disabled: false },
        { id: 2, img: 'https://images.unsplash.com/photo-1542362567-b52adfe46b3f?auto=format&fit=crop&w=100&q=80', disabled: false },
        { id: 3, img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=100&q=80', disabled: true },
        { id: 4, img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=100&q=80', disabled: false }
      ],
      selectedColor: 1,
      featureVariants: ['128 GB', '256 GB', '512 GB'],
      selectedFeature: '128 GB',
      price: 33000000,
      payments: [
        { id: 1, name: 'Oilakredit', icon: 'https://img.icons8.com/color/48/000000/leaf.png' },
        { id: 2, name: 'Bank krediti', icon: 'https://img.icons8.com/color/48/000000/museum.png' },
        { id: 3, name: 'Naqd pulda', icon: 'https://img.icons8.com/color/48/000000/money-bag.png' },
        { id: 4, name: 'SSUDA', icon: 'https://img.icons8.com/color/48/000000/handshake.png' }
      ]
    };
  },
  methods: {
    nextImg() {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.galleryImages.length;
    },
    prevImg() {
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    },
    formatPrice(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-preview {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.new-product-preview__layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  padding-bottom: 3rem;
}

.new-product-preview__content {
  background-color: transparent;
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
}

.new-product-preview__thumbnails {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
}

.new-product-preview__main-img-wrap {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 480px;
}

.new-product-preview__main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-product-preview__nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.8);
  cursor: pointer;
  z-index: 2;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-product-preview__nav-btn--left { left: 16px; }
.new-product-preview__nav-btn--right { right: 16px; }

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

.new-product-preview__spec-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.new-product-preview__spec-list li {
  font-size: 14px;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 10px;
}

.new-product-preview__desc-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

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

/* Sidebar Area */
.new-product-preview__sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.new-product-preview__card {
  background-color: #fff;
  border: 1px solid #DFE2E9;
  border-radius: 16px;
  padding: 24px;
}

.new-product-preview__option-group {
  margin-bottom: 24px;
}

.new-product-preview__option-label {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.new-product-preview__color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.new-product-preview__color-item {
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 2.5px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.new-product-preview__color-item--active {
  border-color: #fbbf24;
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

.new-product-preview__price-block {
  margin: 32px 0 20px 0;
}

.new-product-preview__price-main {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 8px 0;
}

.new-product-preview__price-comparison {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #FFF7F0;
  border: 1px solid #FFF1E6;
  padding: 10px 16px;
  border-radius: 10px;
  color: #F87171;
  font-weight: 500;
  font-size: 14px;
}

.new-product-preview__price-old {
  color: #F87171;
}

.new-product-preview__price-info-icon {
  width: 14px;
  height: 14px;
  margin-left: auto;
}

.new-product-preview__cta-btn {
  width: 100%;
  height: 48px;
  background-color: #22c55e;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s;
}

.new-product-preview__cta-btn:hover {
  background-color: #16a34a;
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
  background-color: #ECFDF5;
  color: #059669;
}

.new-product-preview__info-badge--warning {
  background-color: #FFFBEB;
  color: #D97706;
}

/* Seller Card Styles */
.new-product-preview__seller-header {
  margin-bottom: 12px;
}

.new-product-preview__verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #10b981;
  color: #fff;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.new-product-preview__verified-icon {
  width: 14px;
  height: 14px;
}

.new-product-preview__seller-name {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  margin: 0 0 24px 0;
}

.new-product-preview__phone-box {
  background-color: #F9FAFB;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.new-product-preview__phone-input {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #374151;
  font-weight: 600;
  font-size: 15px;
}

.new-product-preview__phone-icon {
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.new-product-preview__phone-link {
  background: none;
  border: none;
  color: #10b981;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
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
</style>
