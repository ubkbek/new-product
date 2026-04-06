<template>
  <transition name="drawer-fade">
    <div v-if="show" class="live-preview-overlay" @click.self="$emit('close')">
      <transition name="drawer-slide">
        <div v-if="show" class="live-preview-drawer">
          <!-- Drawer Header -->
          <div class="live-preview-header">
            <div class="live-preview-header-left">
              <h3 class="live-preview-title">Jonli ko'rinish</h3>
            </div>
            <button class="live-preview-close" @click="$emit('close')">&times;</button>
          </div>

          <!-- Mobile Phone Mockup Container -->
          <div class="mobile-container">
            <div class="mobile-frame">
              <!-- Mobile Content Area -->
              <div class="mobile-screen">
                <!-- iPhone 17 Pro Max Dynamic Island -->
                <div class="dynamic-island-container">
                  <div class="dynamic-island">
                    <div class="dynamic-island-camera"></div>
                  </div>
                </div>

                <!-- Status Bar Mock -->
                <div class="mobile-status-bar">
                  <span class="mobile-time">12:45</span>
                </div>

                <!-- Product Preview Content -->
                <div class="mobile-product-scroll">
                  <!-- Image Gallery -->
                  <div class="mobile-image-wrap">
                    <img v-if="mainImage" :src="mainImage" class="mobile-main-img" alt="Preview">
                    <div v-else class="mobile-img-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                  </div>

                  <!-- Info Section -->
                  <div class="mobile-product-info">
                    <div class="mobile-price-row">
                      <div class="mobile-price-group">
                        <span class="mobile-price">{{ formattedPrice }} so'm</span>
                        <span v-if="hasDiscount" class="mobile-old-price">{{ formattedOldPrice }} so'm</span>
                      </div>
                      <div v-if="hasDiscount" class="mobile-badge">-{{ discountPercent }}%</div>
                    </div>

                    <h1 class="mobile-product-title">{{ displayTitle }}</h1>

                    <!-- Rating & Reviews Mock -->
                    <div class="mobile-stats">
                      <div class="mobile-rating">⭐ 5.0 (0 sharh)</div>
                      <div class="mobile-orders">100+ buyurtma</div>
                    </div>

                    <!-- Divider -->
                    <div class="mobile-divider"></div>

                    <!-- Delivery Mock -->
                    <div class="mobile-delivery">
                      <span class="mobile-delivery-icon">🚚</span>
                      <div class="mobile-delivery-text">
                        <strong>Yetkazib berish</strong>
                        <span>1 kunda (bepul)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Buttons Mock -->
                <div class="mobile-footer">
                  <div class="mobile-footer-actions">
                    <button class="mobile-btn-cart">Savatga qo'shish</button>
                    <button class="mobile-btn-buy">Hozir sotib olish</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Helper Hint -->
          <div class="live-preview-hint">
            <span class="live-preview-hint-icon">⚠️</span>
            <p>Siz o'zgartirgan har bir ma'lumot shu yerda darhol aks etadi.</p>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LivePreviewDrawer',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  inject: ['sharedProduct'],
  computed: {
    displayTitle() {
      return this.sharedProduct.title || 'Mahsulot nomi hali kiritilmagan';
    },
    mainImage() {
      const img = this.sharedProduct.images && this.sharedProduct.images[0];
      if (!img) return null;
      if (img.startsWith('http')) return img;
      return `https://api.cabinet.smart-market.uz/uploads/images/${img}`;
    },
    firstSku() {
      return this.sharedProduct.skuRows && this.sharedProduct.skuRows[0];
    },
    hasDiscount() {
      return this.firstSku && this.firstSku.discount > 0;
    },
    formattedPrice() {
      const p = this.firstSku ? this.firstSku.sellingPrice : 0;
      return this.formatNum(p);
    },
    formattedOldPrice() {
      const p = this.firstSku ? this.firstSku.price : 0;
      return this.formatNum(p);
    },
    discountPercent() {
      if (!this.hasDiscount) return 0;
      return Math.round((this.firstSku.discount / this.firstSku.price) * 100);
    }
  },
  methods: {
    formatNum(n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }
}
</script>

<style scoped>
.live-preview-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.live-preview-drawer {
  width: 450px;
  height: 100%;
  background-color: #F8FAFC;
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
}

.live-preview-header {
  padding: 20px 30px;
  background-color: #fff;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-preview-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.live-preview-dot {
  width: 8px;
  height: 8px;
  background-color: #22C55E;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

.live-preview-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
}

.live-preview-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #94A3B8;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

/* Mobile Frame */
.mobile-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow-y: auto;
}

.mobile-frame {
  width: 330px;
  height: 680px;
  background-color: #0F172A; /* Dark Titanium */
  border-radius: 60px;
  padding: 3px; /* 100% Thicker than 1.5px */
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    inset 0 0 2px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  border: 3px solid #334155; /* 100% Thicker than 1.5px */
}

/* Side Buttons */
.mobile-frame::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 100px;
  width: 3px;
  height: 40px;
  background: #334155;
  border-radius: 2px 0 0 2px;
  box-shadow: 0 60px 0 #334155; /* Volume buttons */
}

.mobile-frame::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 160px;
  width: 3px;
  height: 60px;
  background: #334155;
  border-radius: 0 2px 2px 0;
}

.mobile-screen {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 60px; /* Same as outer radius as requested */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Dynamic Island */
.dynamic-island-container {
  position: absolute;
  top: 11px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
}

.dynamic-island {
  width: 85px;
  height: 25px;
  background-color: #000;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.dynamic-island-camera {
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #1a1a1a 0%, #000 70%);
  border-radius: 50%;
  box-shadow: inset 0 0 2px rgba(255,255,255,0.2);
}

/* Screen Content */
.mobile-status-bar {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}

.mobile-icons {
  display: flex;
  gap: 6px;
}

.mobile-icon {
  width: 14px;
  height: 14px;
}

.mobile-product-scroll {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.mobile-image-wrap {
  width: 100%;
  aspect-ratio: 1;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-img-placeholder svg {
  width: 48px;
  color: #cbd5e1;
}

.mobile-product-info {
  padding: 20px;
}

.mobile-price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.mobile-price-group {
  display: flex;
  flex-direction: column;
}

.mobile-price {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.mobile-old-price {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
}

.mobile-badge {
  background-color: #EF4444;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.mobile-product-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.mobile-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 16px;
}

.mobile-divider {
  height: 1px;
  background-color: #f1f5f9;
  margin-bottom: 16px;
}

.mobile-delivery {
  display: flex;
  gap: 12px;
  align-items: center;
  background-color: #F8FAFC;
  padding: 12px;
  border-radius: 12px;
}

.mobile-delivery-text {
  display: flex;
  flex-direction: column;
  font-size: 11px;
}

.mobile-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 15px;
  border-top: 1px solid #f1f5f9;
}

.mobile-footer-actions {
  display: flex;
  gap: 10px;
}

.mobile-btn-cart {
  flex: 1;
  background: #F1F5F9;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.mobile-btn-buy {
  flex: 1;
  background: #22C55E;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.live-preview-hint {
  padding: 16px 24px;
  background: #FFFBEB;
  color: #92400E;
  font-size: 13px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid #FEF3C7;
}

.live-preview-hint p {
  margin: 0;
  font-weight: 500;
}

.live-preview-hint-icon {
  font-size: 16px;
}

/* Animations */
.drawer-fade-enter-active, .drawer-fade-leave-active {
  transition: opacity 0.3s;
}
.drawer-fade-enter, .drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter, .drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
