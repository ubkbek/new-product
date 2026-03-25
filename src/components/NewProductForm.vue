<template>
  <div class="new-product-form">
    <!-- Required Note -->
    <div class="new-product-form__hint">
      <span class="new-product-form__hint-asterisk">*</span>
      <span class="new-product-form__hint-text">- To'ldirilishi shart bo'lgan maydonlar</span>
    </div>

    <!-- Title -->
    <h2 class="new-product-form__title">Asosiylar ma'lumotlar</h2>

    <!-- Form Card -->
    <div class="new-product-form__card">
      
      <!-- Row 1: Barcode -->
      <div class="new-product-form__row new-product-form__row--bar-code">
        <div class="new-product-form__group">
          <label class="new-product-form__label">Mahsulotni shtrix kodini kiriting</label>
          <input 
            type="text" 
            class="new-product-form__input" 
            placeholder="13 xonali raqam" 
            v-model="form.barcode" 
          />
        </div>
        <div class="new-product-form__info-box">
          Agar mahsulotni shtrix kodi mavjud bo'lsa va uni kiritsangiz biz sizga ushbu mahsulot haqida ma'lumotlarni va rasmini topib berishimiz mumkin
        </div>
      </div>

      <!-- Row 2: Names -->
      <div class="new-product-form__row new-product-form__row--half">
        <div class="new-product-form__group">
          <label class="new-product-form__label">
            Mahsulot yoki xizmat nomi (O'zbek tilida)<span class="new-product-form__required">*</span>
          </label>
          <input 
            type="text" 
            class="new-product-form__input" 
            placeholder="-" 
            v-model="form.nameUz" 
          />
        </div>
        <div class="new-product-form__group">
          <label class="new-product-form__label">
            Mahsulot yoki xizmat nomi (Rus tilida)<span class="new-product-form__required">*</span>
          </label>
          <div class="new-product-form__select-wrapper">
            <select class="new-product-form__select" v-model="form.nameRu" required>
              <option value="" disabled>Выбрать</option>
              <option value="rus1">Rus 1</option>
              <option value="rus2">Rus 2</option>
            </select>
            <svg class="new-product-form__select-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Row 3: MXIK -->
      <div class="new-product-form__row new-product-form__row--full">
        <div class="new-product-form__group">
          <label class="new-product-form__label">
            Identifikatsiya kodini kiriting (MXIK kod)<span class="new-product-form__required">*</span>
          </label>
          <input 
            type="text" 
            class="new-product-form__input" 
            placeholder="-" 
            v-model="form.mxik" 
          />
        </div>
      </div>

      <!-- Row 4: Details -->
      <div class="new-product-form__row new-product-form__row--quarter">
        <div class="new-product-form__group">
          <label class="new-product-form__label">
            O'lchov birligi<span class="new-product-form__required">*</span>
          </label>
          <div class="new-product-form__select-wrapper">
            <select class="new-product-form__select" v-model="form.unit" required>
              <option value="" disabled>Выбрать</option>
              <option value="kg">Kg</option>
              <option value="dona">Dona</option>
            </select>
            <svg class="new-product-form__select-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="new-product-form__group">
          <label class="new-product-form__label">
            Bahosi (so'm)<span class="new-product-form__required">*</span>
          </label>
          <input 
            type="text" 
            class="new-product-form__input" 
            placeholder="Выбрать" 
            v-model="form.price" 
          />
        </div>
        <div class="new-product-form__group">
          <label class="new-product-form__label">
            Barcha miqdori<span class="new-product-form__required">*</span>
          </label>
          <input 
            type="text" 
            class="new-product-form__input" 
            placeholder="Выбрать" 
            v-model="form.totalQuantity" 
          />
        </div>
        <div class="new-product-form__group">
          <label class="new-product-form__label">
            Eng kam sotish miqdori<span class="new-product-form__required">*</span>
          </label>
          <input 
            type="text" 
            class="new-product-form__input" 
            placeholder="Выбрать" 
            v-model="form.minQuantity" 
          />
        </div>
      </div>

      <!-- Row 5: Disabled fields -->
      <div class="new-product-form__row new-product-form__row--half">
        <div class="new-product-form__group">
          <label class="new-product-form__label">Mahsulot toifasi</label>
          <input 
            type="text" 
            class="new-product-form__input new-product-form__input--disabled" 
            placeholder="-" 
            disabled 
            readonly 
            v-model="form.category" 
          />
        </div>
        <div class="new-product-form__group">
          <label class="new-product-form__label">Jami qiymati</label>
          <input 
            type="text" 
            class="new-product-form__input new-product-form__input--disabled" 
            placeholder="___ so'm" 
            disabled 
            readonly 
            v-model="form.totalValue" 
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductForm',
  data() {
    return {
      form: {
        barcode: '',
        nameUz: '',
        nameRu: '',
        mxik: '',
        unit: '',
        price: '',
        totalQuantity: '',
        minQuantity: '',
        category: '',
        totalValue: ''
      }
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-form {
  font-family: 'Inter', sans-serif;
  width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 0 3rem 0;
  box-sizing: border-box;
}

.new-product-form__hint {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.new-product-form__hint-asterisk {
  color: #ef4444;
  font-weight: 700;
  font-size: 13px;
  margin-right: 4px;
}

.new-product-form__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.new-product-form__card {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.new-product-form__row {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.new-product-form__row:last-child {
  margin-bottom: 0;
}

.new-product-form__row--bar-code {
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 2fr);
  align-items: end;
}

.new-product-form__row--half {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.new-product-form__row--full {
  grid-template-columns: 1fr;
}

.new-product-form__row--quarter {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.new-product-form__group {
  display: flex;
  flex-direction: column;
}

.new-product-form__label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #48545D;
  margin-bottom: 8px;
}

.new-product-form__required {
  color: #ef4444;
}

.new-product-form__input,
.new-product-form__select {
  height: 44px;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
  width: 100%;
}

.new-product-form__input::placeholder,
.new-product-form__select:invalid,
.new-product-form__select option[value=""] {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #7A889B;
}

.new-product-form__input:focus,
.new-product-form__select:focus {
  border-color: #22c55e;
}

.new-product-form__input--disabled {
  background-color: #f3f4f6;
  border-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.new-product-form__input--disabled::placeholder {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #7A889B;
}

.new-product-form__select-wrapper {
  position: relative;
}

.new-product-form__select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: #fff;
  cursor: pointer;
}

.new-product-form__select-icon {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

.new-product-form__info-box {
  background-color: #fef3c7;
  color: #92400e;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  min-height: 44px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

/* Responsive Styles */
@media (max-width: 900px) {
  .new-product-form__row--quarter {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .new-product-form__row--bar-code {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .new-product-form__info-box {
    height: auto;
  }
}

@media (max-width: 600px) {
  .new-product-form__card {
    padding: 16px;
  }
  .new-product-form__row--half,
  .new-product-form__row--quarter {
    grid-template-columns: 1fr;
  }
}
</style>
