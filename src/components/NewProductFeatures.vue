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
        <div 
          class="new-product-features__add-field" 
          :class="{ 'new-product-features__add-field--disabled': isImagesIncomplete }"
          @click="handleAddFieldClick"
        >
          <span class="new-product-features__add-text">Xususiyat qo'shish</span>
          
          <!-- Custom + Icon if hasColorFeature -->
          <svg v-if="hasColorFeature"
            class="new-product-features__add-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>

          <!-- Chevron Icon if not hasColorFeature -->
          <svg v-else
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
        <div v-show="isDropdownOpen && !hasColorFeature" class="new-product-features__dropdown-menu">
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
        <div class="new-product-features__card" v-for="(feature, fIndex) in sharedProduct.features" :key="feature.id">
          
          <!-- Card Header -->
          <div class="new-product-features__card-header">
            <h3 class="new-product-features__card-title">{{ feature.title }}</h3>
            <button class="new-product-features__card-remove" @click="removeFeature(fIndex)">O'chirish</button>
          </div>
          
          <!-- Chip Group -->
          <div class="new-product-features__chip-group">
            <div 
              class="new-product-features__chip" 
              v-for="(item, iIndex) in feature.items" 
              :key="'item-' + fIndex + '-' + item"
            >
              <span class="new-product-features__chip-text">{{ item }}</span>
              <button class="new-product-features__chip-close" @click="removeFeatureItem(fIndex, iIndex)">
                <svg class="new-product-features__chip-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Add Button -->
          <button class="new-product-features__btn-add" @click="addFeatureItem(fIndex)">
            <span class="new-product-features__btn-icon">+</span> Qo'shish
          </button>

        </div>
      </div>

    </div>

    <!-- Custom Modal -->
    <transition name="modal-fade">
      <div v-show="isModalOpen" class="new-product-features__modal-overlay" @click.self="closeModal">
        <div class="new-product-features__modal">
          <div class="new-product-features__modal-header">
            <h3 class="new-product-features__modal-title">{{ modalTitle }}</h3>
            <button class="new-product-features__modal-close" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="new-product-features__modal-body">
            <!-- Normal Text Input -->
            <input 
              v-if="modalType !== 'color_multiselect'"
              type="text" 
              class="new-product-features__modal-input" 
              v-model="modalInput" 
              :placeholder="modalPlaceholder"
              @keyup.enter="submitModal"
              ref="modalInputRef"
            >
            
            <!-- Color Multiselect Grid -->
            <div v-else class="new-product-features__color-multiselect">
              <div class="new-product-features__color-search">
                <input 
                  type="text" 
                  class="new-product-features__color-search-input" 
                  v-model="colorSearchQuery" 
                  placeholder="Rang qidirish..."
                >
              </div>
              <div class="new-product-features__color-grid">
                <div 
                  v-for="color in filteredColors" 
                  :key="color.id"
                  class="new-product-features__color-item"
                  :class="{ 'new-product-features__color-item--active': selectedColors.includes(color.name) }"
                  @click="toggleColorSelection(color.name)"
                >
                <div 
                  class="new-product-features__color-circle" 
                  :style="{ backgroundColor: color.hex, border: color.border ? '1px solid ' + color.border : '1px solid rgba(0,0,0,0.05)' }"
                ></div>
                <span class="new-product-features__color-name">{{ color.name }}</span>
                <svg v-if="selectedColors.includes(color.name)" class="new-product-features__color-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            </div>
          </div>
          <div class="new-product-features__modal-footer">
            <button class="new-product-features__modal-btn new-product-features__modal-btn--cancel" @click="closeModal">Bekor qilish</button>
            <button class="new-product-features__modal-btn new-product-features__modal-btn--submit" @click="submitModal">Qo'shish</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'NewProductFeatures',
  inject: ['sharedProduct', 'showAlert', 'showToast'],
  computed: {
    isImagesIncomplete() {
      return !this.sharedProduct.images || this.sharedProduct.images.length === 0;
    },
    hasColorFeature() {
      return this.sharedProduct.features.some(f => f.title === "Rang / Цвет");
    },
    filteredColors() {
      if (!this.colorSearchQuery) return this.predefinedColors;
      const q = this.colorSearchQuery.toLowerCase();
      return this.predefinedColors.filter(c => c.name.toLowerCase().includes(q));
    }
  },
  data() {
    return {
      isDropdownOpen: false,
      availableFeatures: [
        { id: 101, title: "Rang / Цвет" },
        { id: 102, title: "Boshqa xususiyat qo'shish" }
      ],
      // Modal state
      isModalOpen: false,
      modalType: '', // 'feature', 'item', or 'color_multiselect'
      modalTitle: '',
      modalPlaceholder: '',
      modalInput: '',
      colorSearchQuery: '',
      currentFeatureIndex: null,
      
      // Color options
      predefinedColors: [
        { id: 1, name: "Oq", hex: "#FFFFFF", border: "#E2E8F0" },
        { id: 2, name: "Qora", hex: "#000000" },
        { id: 3, name: "Qizil", hex: "#EF4444" },
        { id: 4, name: "Ko'k", hex: "#3B82F6" },
        { id: 5, name: "Sariq", hex: "#F59E0B" },
        { id: 6, name: "Yashil", hex: "#10B981" },
        { id: 7, name: "Kulrang", hex: "#9CA3AF" },
        { id: 8, name: "Pushti", hex: "#EC4899" },
        { id: 9, name: "Apelsin", hex: "#F97316" }, 
        { id: 10, name: "Jigarrang", hex: "#8B5A2B" }, 
        { id: 11, name: "Binafsha", hex: "#8B5CF6" }, 
        { id: 12, name: "Och ko'k", hex: "#0EA5E9" }
      ],
      selectedColors: []
    };
  },
  methods: {
    handleAddFieldClick() {
      if (this.isImagesIncomplete) return;
      
      if (this.hasColorFeature) {
        this.openModal('feature', 'Yangi xususiyat qo\'shish', 'Xususiyat nomini kiriting');
        this.isDropdownOpen = false;
      } else {
        this.isDropdownOpen = !this.isDropdownOpen;
      }
    },
    addFeature(option) {
      if (option.id === 102) {
        this.openModal('feature', 'Yangi xususiyat qo\'shish', 'Xususiyat nomini kiriting');
        this.isDropdownOpen = false;
        return;
      }
      
      if (option.id === 101) {
        this.openModal('color_multiselect', 'Ranglarni tanlang', '');
        this.isDropdownOpen = false;
        return;
      }

      this.processAddFeature(option.title);
      this.isDropdownOpen = false;
    },
    processAddFeature(title) {
      // Avoid duplicates
      const exists = this.sharedProduct.features.find(f => f.title === title);
      if (exists) {
        this.showToast("Bu xususiyat allaqachon qo'shilgan", 'warning');
        return;
      }

      this.sharedProduct.features.push({
        id: Date.now(),
        title: title,
        items: []
      });
    },
    addFeatureItem(fIndex) {
      const feature = this.sharedProduct.features[fIndex];
      if (feature.title === "Rang / Цвет") {
         this.openModal('color_multiselect', 'Ranglarni tanlang', '', fIndex);
      } else {
         this.openModal('item', `${feature.title} uchun variant qo'shish`, `${feature.title} uchun variant kiriting`, fIndex);
      }
    },
    openModal(type, title, placeholder, fIndex = null) {
      this.modalType = type;
      this.modalTitle = title;
      this.modalPlaceholder = placeholder;
      this.currentFeatureIndex = fIndex;
      this.modalInput = '';
      this.colorSearchQuery = '';
      
      // Initialize selected colors if opening the color multiselect
      if (type === 'color_multiselect') {
        const feature = fIndex !== null 
          ? this.sharedProduct.features[fIndex] 
          : this.sharedProduct.features.find(f => f.title === 'Rang / Цвет');
        this.selectedColors = feature ? [...feature.items] : [];
      } else {
        this.selectedColors = [];
      }

      this.isModalOpen = true;
      
      if (type !== 'color_multiselect') {
        this.$nextTick(() => {
          if (this.$refs.modalInputRef) {
            this.$refs.modalInputRef.focus();
          }
        });
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.modalInput = '';
      this.colorSearchQuery = '';
      this.selectedColors = [];
    },
    toggleColorSelection(colorName) {
      const index = this.selectedColors.indexOf(colorName);
      if (index === -1) {
        this.selectedColors.push(colorName);
      } else {
        this.selectedColors.splice(index, 1);
      }
    },
    submitModal() {
      if (this.modalType === 'color_multiselect') {
        let feature;
        if (this.currentFeatureIndex === null) {
          this.processAddFeature("Rang / Цвет");
          feature = this.sharedProduct.features.find(f => f.title === 'Rang / Цвет');
        } else {
          feature = this.sharedProduct.features[this.currentFeatureIndex];
        }

        if (feature) {
          // Replace with the current selection from the modal
          feature.items = [...this.selectedColors];
        }
        this.closeModal();
        return;
      }

      const val = this.modalInput.trim();
      if (!val) return;

      if (this.modalType === 'feature') {
        this.processAddFeature(val);
      } else if (this.modalType === 'item' && this.currentFeatureIndex !== null) {
        const feature = this.sharedProduct.features[this.currentFeatureIndex];
        if (feature) {
          if (feature.items.includes(val)) {
            this.showToast(`"${val}" allaqachon mavjud`, 'warning');
            return;
          }
          feature.items.push(val);
        }
      }
      this.closeModal();
    },
    removeFeature(fIndex) {
      this.sharedProduct.features.splice(fIndex, 1);
    },
    removeFeatureItem(fIndex, iIndex) {
      if (this.sharedProduct.features[fIndex]) {
        this.sharedProduct.features[fIndex].items.splice(iIndex, 1);
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
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
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
  background-color: #ECFDF5;
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

.new-product-features__add-field--disabled {
  background-color: #F8FAFC;
  border-color: #DFE2E9;
  cursor: not-allowed;
  opacity: 0.6;
}

.new-product-features__add-field--disabled:hover {
  border-color: #DFE2E9;
}

/* Modal Styles */
.new-product-features__modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(17, 24, 39, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.new-product-features__modal {
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin: 0 20px;
}

.new-product-features__modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #F1F5F9;
}

.new-product-features__modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.new-product-features__modal-close {
  background: transparent;
  border: none;
  color: #94A3B8;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-product-features__modal-close:hover {
  background-color: #F1F5F9;
  color: #475569;
}

.new-product-features__modal-close svg {
  width: 20px;
  height: 20px;
}

.new-product-features__modal-body {
  padding: 24px;
}

.new-product-features__modal-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  color: #1f2937;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.new-product-features__modal-input::placeholder {
  color: #7A889B;
  font-size: 12px;
  font-weight: 400;
}

.new-product-features__color-search-input::placeholder {
  color: #7A889B;
  font-size: 12px;
  font-weight: 400;
}

.new-product-features__modal-input:focus {
  background-color: #ffffff;
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.new-product-features__modal-footer {
  padding: 16px 24px;
  background-color: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.new-product-features__modal-btn {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.new-product-features__modal-btn--cancel {
  background-color: transparent;
  border: 1px solid #E2E8F0;
  color: #475569;
}

.new-product-features__modal-btn--cancel:hover {
  background-color: #F1F5F9;
  color: #1e293b;
}

.new-product-features__modal-btn--submit {
  background-color: #22c55e;
  border: none;
  color: #ffffff;
}

.new-product-features__modal-btn--submit:hover {
  background-color: #16a34a;
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .new-product-features__modal,
.modal-fade-leave-to .new-product-features__modal {
  transform: translateY(20px) scale(0.95);
}

/* Color Multiselect Layout */
.new-product-features__color-multiselect {
  display: flex;
  flex-direction: column;
}

.new-product-features__color-search {
  margin-bottom: 16px;
}

.new-product-features__color-search-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  color: #1f2937;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.new-product-features__color-search-input:focus {
  background-color: #ffffff;
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

/* Color Grid Styles */
.new-product-features__color-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px;
}

.new-product-features__color-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.new-product-features__color-item:hover {
  border-color: #94A3B8;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.new-product-features__color-item--active {
  background-color: #F0FDF4;
  border-color: #22c55e;
}

.new-product-features__color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.new-product-features__color-name {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  flex-grow: 1;
}

.new-product-features__color-item--active .new-product-features__color-name {
  color: #16a34a;
}

.new-product-features__color-check {
  width: 20px;
  height: 20px;
  color: #22c55e;
  flex-shrink: 0;
}
</style>
