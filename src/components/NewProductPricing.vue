<template>
  <div class="new-product-pricing">
    
    <!-- 1. SKU Info Card -->
    <div class="new-product-pricing__card">
      <h3 class="new-product-pricing__card-title">SKU qanday shakllanadi</h3>
      <p class="new-product-pricing__card-desc">
        SKU — bu mahsulot yoki uning variantlarini ajratib turuvchi maxsus kod. Bu kod orqali tizim mahsulotlarni hisobga oladi va ombordagi zaxiralarni boshqaradi. Agar mahsulot bir nechta variantda bo'lsa (masalan: rang yoki o'lcham), har bir variant uchun alohida SKU bo'lishi kerak.
      </p>
      
      <div class="new-product-pricing__example-grid">
        <div class="new-product-pricing__example-col">
          <h4 class="new-product-pricing__example-subtitle">Misol: Mahsulot nomi: Jack</h4>
          <p class="new-product-pricing__example-label">Variantlar:</p>
          <ul class="new-product-pricing__example-list">
            <li>Qora C5c</li>
            <li>Qora W4-01</li>
            <li>Oq C5c</li>
            <li>Oq W4-01</li>
          </ul>
          <p class="new-product-pricing__example-note">Bu holatda har bir variant uchun alohida SKU belgilanadi.</p>
        </div>
        
        <div class="new-product-pricing__example-col">
          <h4 class="new-product-pricing__example-subtitle">Masalan:</h4>
          <ul class="new-product-pricing__example-list">
            <li>Jack-qora-C5c</li>
            <li>Jack-qora-W4-01</li>
            <li>Jack-oq-C5c</li>
            <li>Jack-oq-W4-01</li>
          </ul>
          <p class="new-product-pricing__example-note">Har bir mahsulot yoki variant uchun takrorlanmaydigan (noyob) SKU kiriting.</p>
        </div>
      </div>
    </div>

    <!-- 2. Product Name SKU Card -->
    <div class="new-product-pricing__card">
      <h3 class="new-product-pricing__card-title">MAHSULOT NOMI UCHUN SKU</h3>
      <div class="new-product-pricing__input-group">
        <label class="new-product-pricing__input-label">Mahsulot SKU (100 tagacha harf yoki raqam)</label>
        <div class="new-product-pricing__input-wrapper">
          <input 
            type="text" 
            class="new-product-pricing__input" 
            v-model="productSku" 
            maxlength="100"
            placeholder="Jack"
          >
          <span class="new-product-pricing__counter">{{ productSku.length }}/100</span>
        </div>
      </div>
    </div>

    <!-- 3. Pricing Table Section -->
    <div class="new-product-pricing__table-wrapper">
      <table class="new-product-pricing__table">
        <thead>
          <tr>
            <th>№</th>
            <th>Sotuvchi kodi</th>
            <th>Shtrix-kod raqami</th>
            <th>MXIK kodi</th>
            <th>Tavsiya qilingan narx</th>
            <th>Barcha miqdori</th>
            <th>Eng kam sotish miqdori</th>
            <th>Bahosi (so'm)</th>
            <th>Chegirma (so'm)</th>
            <th>Sotish narx, so'm</th>
            <th>Dona uchun komissiya</th>
            <th>Har bir dona uchun chiqarish</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in skuRows" :key="row.id">
            <td class="new-product-pricing__td-center">{{ index + 1 }}</td>
            <td>
              <div class="new-product-pricing__cell-stack">
                <span class="new-product-pricing__cell-sub">{{ row.variantName }}</span>
                <span class="new-product-pricing__cell-main">{{ productSku + '-' + row.variantSku }}</span>
              </div>
            </td>
            <td>
              <span v-if="row.barcode">{{ row.barcode }}</span>
              <span v-else class="new-product-pricing__text-muted">-</span>
            </td>
            <td>
              <select class="new-product-pricing__select" v-model="row.mxikCode">
                <option value="0866132781...">0866132781...</option>
                <option value="Kod yoki nomi">Kod yoki nomi</option>
              </select>
            </td>
            <td>
              <span class="new-product-pricing__text-muted">{{ row.recommendedPriceText }}</span>
            </td>
            <td>
              <div class="new-product-pricing__cell-input-wrap">
                <input type="number" class="new-product-pricing__cell-input" v-model="row.totalQuantity">
                <span class="new-product-pricing__cell-unit">ta</span>
              </div>
            </td>
            <td>
              <div class="new-product-pricing__cell-input-wrap">
                <input type="number" class="new-product-pricing__cell-input" v-model="row.minSellQuantity">
                <span class="new-product-pricing__cell-unit">ta</span>
              </div>
            </td>
            <td>
              <div class="new-product-pricing__cell-input-wrap">
                <input type="number" class="new-product-pricing__cell-input new-product-pricing__cell-input--wide" v-model="row.price">
                <span class="new-product-pricing__cell-unit">so'm</span>
              </div>
            </td>
            <td>
              <div class="new-product-pricing__cell-input-wrap">
                <input type="number" class="new-product-pricing__cell-input new-product-pricing__cell-input--wide" v-model="row.discount">
                <span class="new-product-pricing__cell-unit">so'm</span>
              </div>
            </td>
            <td>
              <span class="new-product-pricing__bold">{{ formatPrice(calculateSalePrice(row)) }}</span>
            </td>
            <td>
              <div class="new-product-pricing__cell-stack">
                <span class="new-product-pricing__bold">{{ formatPrice(row.commission) }}</span>
                <span class="new-product-pricing__cell-sub">{{ row.commissionPercent }}%</span>
              </div>
            </td>
            <td>
              <span class="new-product-pricing__bold">{{ formatPrice(calculatePayout(row)) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NewProductPricing',
  data() {
    return {
      productSku: 'Jack',
      skuRows: [
        { 
          id: 1, 
          variantName: 'Oq, W4-01', 
          variantSku: 'oq-W4-01', 
          barcode: '9815698156981', 
          mxikCode: '0866132781...', 
          recommendedPriceText: 'Hozircha narx topilmadi',
          totalQuantity: 30,
          minSellQuantity: 2,
          price: 500000,
          discount: 0,
          commission: 20000,
          commissionPercent: 2
        },
        { 
          id: 2, 
          variantName: 'Qora, W4-01', 
          variantSku: 'qora-W4-01', 
          barcode: '9815698156981', 
          mxikCode: '0866132781...', 
          recommendedPriceText: 'Hozircha narx topilmadi',
          totalQuantity: 20,
          minSellQuantity: 1,
          price: 450000,
          discount: 0,
          commission: 20000,
          commissionPercent: 2
        },
        { 
          id: 3, 
          variantName: 'Oq, C5c', 
          variantSku: 'oq-C5c', 
          barcode: '9815698156981', 
          mxikCode: '0866132781...', 
          recommendedPriceText: 'Hozircha narx topilmadi',
          totalQuantity: 10,
          minSellQuantity: 3,
          price: 400000,
          discount: 0,
          commission: 20000,
          commissionPercent: 2
        },
        { 
          id: 4, 
          variantName: 'Qora, C5c', 
          variantSku: 'qora-C5c', 
          barcode: '9815698156981', 
          mxikCode: '0866132781...', 
          recommendedPriceText: 'Hozircha narx topilmadi',
          totalQuantity: 15,
          minSellQuantity: 1,
          price: 600000,
          discount: 0,
          commission: 20000,
          commissionPercent: 2
        },
        { 
          id: 5, 
          variantName: 'Qora, A4-1', 
          variantSku: 'qora-A4-1', 
          barcode: '', 
          mxikCode: '0866132781...', 
          recommendedPriceText: 'Hozircha narx topilmadi',
          totalQuantity: 5,
          minSellQuantity: 1,
          price: 300000,
          discount: 5000,
          commission: 0,
          commissionPercent: 0
        },
        { 
          id: 6, 
          variantName: 'Oq, A4-1', 
          variantSku: 'oq-A4-1', 
          barcode: '', 
          mxikCode: 'Kod yoki nomi', 
          recommendedPriceText: 'Hozircha narx topilmadi',
          totalQuantity: 0,
          minSellQuantity: 0,
          price: 0,
          discount: 0,
          commission: 0,
          commissionPercent: 0
        }
      ]
    };
  },
  methods: {
    calculateSalePrice(row) {
      if (row.price <= 0) return 0;
      // Demo logic: Sale price is price - discount (though image shows 1,000,000 for 500k, let's stick to logical calculation or just use image values as samples)
      // I'll use image's visible result (1,000,000) as a fixed calc for demo if I want to match image perfectly, 
      // but standard logic is Price - Discount. Let's do Price * 2 - Discount to match the visual 1,000,000 for 500,000? 
      // Actually, image might show 1,000,000 as a reference. Let's just do row.price - row.discount for simplicity.
      return Math.max(0, row.price - row.discount);
    },
    calculatePayout(row) {
      const sale = this.calculateSalePrice(row);
      if (sale <= 0) return 0;
      return Math.max(0, sale - row.commission);
    },
    formatPrice(value) {
      if (!value) return '0';
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-pricing {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 2rem;
  box-sizing: border-box;
}

.new-product-pricing__card {
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  padding: 24px;
  max-width: 950px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.new-product-pricing__card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  text-transform: uppercase;
}

.new-product-pricing__card-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.new-product-pricing__example-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  background-color: #ffffff;
}

.new-product-pricing__example-col {
  display: flex;
  flex-direction: column;
}

.new-product-pricing__example-subtitle {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
}

.new-product-pricing__example-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.new-product-pricing__example-list {
  margin: 0 0 16px 0;
  padding-left: 18px;
  list-style-type: disc;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.new-product-pricing__example-note {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* SKU Input Section */
.new-product-pricing__input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.new-product-pricing__input-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.new-product-pricing__input-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.new-product-pricing__input {
  width: 100%;
  height: 44px;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 60px 0 14px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.new-product-pricing__input:focus {
  border-color: #22c55e;
}

.new-product-pricing__counter {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #9ca3af;
}

/* Table Section */
.new-product-pricing__table-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #DFE2E9;
}

.new-product-pricing__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.new-product-pricing__table th {
  background-color: #F9FAFB;
  color: #374151;
  font-weight: 600;
  text-align: center;
  padding: 12px 10px;
  border-bottom: 1px solid #DFE2E9;
  border-right: 1px solid #DFE2E9;
  line-height: 1.3;
  vertical-align: middle;
}

/* Specific column widths for better layout */
.new-product-pricing__table th:nth-child(1) { width: 40px; min-width: 40px; } /* № */
.new-product-pricing__table th:nth-child(2) { min-width: 160px; } /* Sotuvchi kodi */
.new-product-pricing__table th:nth-child(3) { min-width: 140px; } /* Shtrix-kod */
.new-product-pricing__table th:nth-child(4) { min-width: 150px; } /* MXIK */
.new-product-pricing__table th:nth-child(5) { min-width: 160px; } /* Tavsiya narx */
.new-product-pricing__table th:nth-child(6) { min-width: 100px; } /* Barcha miqdor */
.new-product-pricing__table th:nth-child(7) { min-width: 120px; } /* Eng kam sotish */
.new-product-pricing__table th:nth-child(8) { min-width: 140px; } /* Bahosi */
.new-product-pricing__table th:nth-child(9) { min-width: 140px; } /* Chegirma */
.new-product-pricing__table th:nth-child(10) { min-width: 140px; } /* Sotish narxi */
.new-product-pricing__table th:nth-child(11) { min-width: 120px; } /* Komissiya */
.new-product-pricing__table th:nth-child(12) { min-width: 150px; } /* Chiqarish */

.new-product-pricing__table td {
  padding: 12px;
  border-bottom: 1px solid #DFE2E9;
  border-right: 1px solid #DFE2E9;
  vertical-align: middle;
}

.new-product-pricing__table th:last-child,
.new-product-pricing__table td:last-child {
  border-right: none;
}

.new-product-pricing__td-center {
  text-align: center;
}

.new-product-pricing__cell-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.new-product-pricing__cell-main {
  font-weight: 500;
  color: #111827;
}

.new-product-pricing__cell-sub {
  color: #6b7280;
  font-size: 12px;
}

.new-product-pricing__select {
  height: 36px;
  border: 1.5px solid #DFE2E9;
  border-radius: 8px;
  padding: 0 8px;
  outline: none;
  font-family: inherit;
  background-color: #fff;
  width: 120px;
}

.new-product-pricing__cell-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #DFE2E9;
  border-radius: 8px;
  padding: 0 8px;
  height: 36px;
  background-color: #fff;
}

.new-product-pricing__cell-input {
  border: none;
  outline: none;
  width: 40px;
  font-size: 13px;
  color: #111827;
  font-family: inherit;
}

.new-product-pricing__cell-input--wide {
  width: 80px;
}

.new-product-pricing__cell-unit {
  color: #9ca3af;
  font-size: 12px;
  margin-left: 4px;
}

.new-product-pricing__bold {
  font-weight: 700;
  color: #111827;
}

.new-product-pricing__text-muted {
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 900px) {
  .new-product-pricing__example-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
