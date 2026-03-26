<template>
  <div class="new-product-name">
    <h2 class="new-product-name__title">Mahsulot nomini kiriting</h2>
    
    <div class="new-product-name__card">
      
      <!-- Info Boxes -->
      <div class="new-product-name__info-grid">
        <div class="new-product-name__info-box">
          <h3 class="new-product-name__info-title">Nomlash tartibi</h3>
          <p class="new-product-name__info-desc">Mahsulotning aniq nomini zarur tasnif</p>
        </div>
        <div class="new-product-name__info-box">
          <h3 class="new-product-name__info-title">Matn uzunligi 100 ta belgi</h3>
          <p class="new-product-name__info-desc">Juda qisqa nomlar boshqa mahsulotlar bilan o‘xshash bo‘lib, qidiruvda topilishini kamaytirishi mumkin</p>
        </div>
      </div>
      
      <!-- Link -->
      <a href="#" class="new-product-name__link">
        Yo‘riqnomada batafsil <span class="new-product-name__link-arrow">&rarr;</span>
      </a>
      
      <!-- Inputs -->
      <div class="new-product-name__input-grid">
        <div class="new-product-name__group">
          <label class="new-product-name__label">
            Mahsulot nomi (O’zbek tilida)<span class="new-product-name__required">*</span>
          </label>
          <div class="new-product-name__input-wrapper">
            <input 
              type="text" 
              class="new-product-name__input" 
              placeholder="Mahsulotning aniq nomi" 
              v-model="form.name_uz"
              maxlength="100"
            />
            <span class="new-product-name__counter">{{ form.name_uz.length }} / 100</span>
          </div>
        </div>
        
        <div class="new-product-name__group">
          <label class="new-product-name__label">
            Mahsulot nomi (Rus tilida)<span class="new-product-name__required">*</span>
          </label>
          <div class="new-product-name__input-wrapper">
            <input 
              type="text" 
              class="new-product-name__input" 
              placeholder="Mahsulotning aniq nomi" 
              v-model="form.name_ru"
              maxlength="100"
            />
            <span class="new-product-name__counter">{{ form.name_ru.length }} / 100</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewProductName',
  data() {
    return {
      form: {
        name_uz: '',
        name_ru: ''
      }
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-name {
  font-family: 'Inter', sans-serif;
  width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0 0 2rem 0;
  box-sizing: border-box;
}

.new-product-name__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.new-product-name__card {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 20px;
}

.new-product-name__info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.new-product-name__info-box {
  border: 1px solid #F3F4F6;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: auto;
}

.new-product-name__info-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.new-product-name__info-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.new-product-name__link {
  display: inline-flex;
  align-items: center;
  color: #22c55e;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin: 20px 0;
  transition: color 0.2s ease;
}

.new-product-name__link:hover {
  color: #16a34a;
}

.new-product-name__link-arrow {
  margin-left: 4px;
  font-size: 16px;
}

.new-product-name__input-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.new-product-name__group {
  display: flex;
  flex-direction: column;
}

.new-product-name__label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #48545D;
  margin-bottom: 12px;
}

.new-product-name__required {
  color: #ef4444;
}

.new-product-name__input-wrapper {
  position: relative;
  width: 100%;
}

.new-product-name__input {
  width: 100%;
  height: 44px;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 60px 0 14px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.new-product-name__input::placeholder {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #7A889B;
}

.new-product-name__input:focus {
  border-color: #22c55e;
}

.new-product-name__counter {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #9ca3af;
  pointer-events: none;
}

/* Responsive Handling */
@media (max-width: 768px) {
  .new-product-name__info-grid,
  .new-product-name__input-grid {
    grid-template-columns: 1fr;
  }
}
</style>
