<template>
  <div class="new-product-pricing">
    
    <!-- 1. SKU Info Card -->
    <div class="container-small">
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
    </div>

    <!-- 2. Product Name SKU Card -->
    <div class="container-small">
      <div class="new-product-pricing__card">
        <h3 class="new-product-pricing__card-title">MAHSULOT NOMI UCHUN SKU</h3>
        <div class="new-product-pricing__input-group">
          <label class="new-product-pricing__input-label">Mahsulot SKU (100 tagacha harf yoki raqam)</label>
          <div class="new-product-pricing__input-wrapper">
            <input 
              type="text" 
              class="new-product-pricing__input" 
              v-model="sharedProduct.productSku" 
              maxlength="100"
              placeholder="Jack"
            >
            <span class="new-product-pricing__counter">{{ (sharedProduct.productSku || '').length }}/100</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Pricing Table Section -->
    <div class="container-wide">
      <div class="new-product-pricing__table-wrapper">
        <table class="new-product-pricing__table">
          <thead>
            <tr>
              <th>№</th>
              <th>Sotuvchi kodi</th>
              <th>Shtrix-kod raqami</th>
              <th class="new-product-pricing__th--bulk">
                <div class="new-product-pricing__th-content">
                  <div class="new-product-pricing__th-inner">
                    <span class="new-product-pricing__th-text">MXIK kodi</span>
                    <button class="new-product-pricing__bulk-btn" @click="toggleBulkInput('mxikCode', $event)">
                      <svg class="new-product-pricing__bulk-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3L4 14H11V21L20 10H13V3Z" fill="#94A3B8" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <!-- Bulk Popover -->
                  <div v-if="activeBulkColumn === 'mxikCode'" class="new-product-pricing__bulk-popover" @click.stop>
                    <input 
                      type="text" 
                      class="new-product-pricing__bulk-input" 
                      placeholder="Kod yoki nomi..."
                      v-model="bulkInputs.mxikCode"
                      @keydown.enter="applyBulkValue('mxikCode')"
                      ref="bulkInput_mxikCode"
                    >
                    <button class="new-product-pricing__bulk-apply" @click="applyBulkValue('mxikCode')">Barchasiga</button>
                  </div>
                </div>
              </th>
              <th>Tavsiya qilingan narx</th>
              <th class="new-product-pricing__th--bulk" style="min-width: 300px;">
                <div class="new-product-pricing__th-content">
                  <div class="new-product-pricing__th-inner">
                    <span class="new-product-pricing__th-text">Barcha miqdori</span>
                    <button class="new-product-pricing__bulk-btn" @click="toggleBulkInput('totalQuantity', $event)">
                      <svg class="new-product-pricing__bulk-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3L4 14H11V21L20 10H13V3Z" fill="#94A3B8" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <!-- Bulk Popover -->
                  <div v-if="activeBulkColumn === 'totalQuantity'" class="new-product-pricing__bulk-popover" @click.stop>
                    <input 
                      type="text" 
                      class="new-product-pricing__bulk-input" 
                      placeholder="Miqdor..."
                      :value="formatPrice(bulkInputs.totalQuantity)"
                      @input="handleBulkNumericInput('totalQuantity', $event)"
                      @keydown.enter="applyBulkValue('totalQuantity')"
                      ref="bulkInput_totalQuantity"
                    >
                    <button class="new-product-pricing__bulk-apply" @click="applyBulkValue('totalQuantity')">Barchasiga</button>
                  </div>
                </div>
              </th>
              <th class="new-product-pricing__th--bulk">
                <div class="new-product-pricing__th-content">
                  <div class="new-product-pricing__th-inner">
                    <span class="new-product-pricing__th-text">Eng kam sotish miqdori</span>
                    <button class="new-product-pricing__bulk-btn" @click="toggleBulkInput('minSaleQuantity', $event)">
                      <svg class="new-product-pricing__bulk-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3L4 14H11V21L20 10H13V3Z" fill="#94A3B8" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <!-- Bulk Popover -->
                  <div v-if="activeBulkColumn === 'minSaleQuantity'" class="new-product-pricing__bulk-popover" @click.stop>
                    <input 
                      type="text" 
                      class="new-product-pricing__bulk-input" 
                      placeholder="Miqdor..."
                      :value="formatPrice(bulkInputs.minSaleQuantity)"
                      @input="handleBulkNumericInput('minSaleQuantity', $event)"
                      @keydown.enter="applyBulkValue('minSaleQuantity')"
                      ref="bulkInput_minSaleQuantity"
                    >
                    <button class="new-product-pricing__bulk-apply" @click="applyBulkValue('minSaleQuantity')">Barchasiga</button>
                  </div>
                </div>
              </th>
              <th class="new-product-pricing__th--bulk">
                <div class="new-product-pricing__th-content">
                  <div class="new-product-pricing__th-inner">
                    <span class="new-product-pricing__th-text">Bahosi (so'm)</span>
                    <button class="new-product-pricing__bulk-btn" @click="toggleBulkInput('price', $event)">
                      <svg class="new-product-pricing__bulk-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3L4 14H11V21L20 10H13V3Z" fill="#94A3B8" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <!-- Bulk Popover -->
                  <div v-if="activeBulkColumn === 'price'" class="new-product-pricing__bulk-popover" @click.stop>
                    <input 
                      type="text" 
                      class="new-product-pricing__bulk-input" 
                      placeholder="Narx..."
                      :value="formatPrice(bulkInputs.price)"
                      @input="handleBulkNumericInput('price', $event)"
                      @keydown.enter="applyBulkValue('price')"
                      ref="bulkInput_price"
                    >
                    <button class="new-product-pricing__bulk-apply" @click="applyBulkValue('price')">Barchasiga</button>
                  </div>
                </div>
              </th>
              <th class="new-product-pricing__th--bulk">
                <div class="new-product-pricing__th-content">
                  <div class="new-product-pricing__th-inner">
                    <span class="new-product-pricing__th-text">Chegirma (so'm)</span>
                    <button class="new-product-pricing__bulk-btn" @click="toggleBulkInput('discount', $event)">
                      <svg class="new-product-pricing__bulk-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3L4 14H11V21L20 10H13V3Z" fill="#94A3B8" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <!-- Bulk Popover -->
                  <div v-if="activeBulkColumn === 'discount'" class="new-product-pricing__bulk-popover" @click.stop>
                    <input 
                      type="text" 
                      class="new-product-pricing__bulk-input" 
                      placeholder="Chegirma..."
                      :value="formatPrice(bulkInputs.discount)"
                      @input="handleBulkNumericInput('discount', $event)"
                      @keydown.enter="applyBulkValue('discount')"
                      ref="bulkInput_discount"
                    >
                    <button class="new-product-pricing__bulk-apply" @click="applyBulkValue('discount')">Barchasiga</button>
                  </div>
                </div>
              </th>
              <th>Sotish narxi, so'm</th>
              <th>Dona uchun komissiya</th>
              <th>Har bir dona uchun chiqarish</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sharedProduct.skuRows" :key="row.id">
              <td class="new-product-pricing__td-center">{{ index + 1 }}</td>
              <td>
                <div class="new-product-pricing__cell-stack">
                  <span class="new-product-pricing__cell-sub">{{ row.variantLabel }}</span>
                  <input 
                    type="text" 
                    class="new-product-pricing__cell-input new-product-pricing__cell-input--sku"
                    :class="{ 'new-product-pricing__cell-input--error': getRowErrors(row).sku }"
                    v-model="row.sku"
                    @input="handleRowSkuInput(row)"
                    :ref="'cell_' + index + '_0'"
                    @keydown="handleTableKeydown(index, 0, $event)"
                  >
                </div>
              </td>
              <td>
                <input 
                  type="text" 
                  class="new-product-pricing__cell-input"
                  v-model="row.barcode"
                  placeholder="-"
                  :ref="'cell_' + index + '_1'"
                  @keydown="handleTableKeydown(index, 1, $event)"
                >
              </td>
              <td>
                <input 
                  type="text" 
                  class="new-product-pricing__select" 
                  v-model="row.mxikCode" 
                  placeholder="Kod yoki nomi..."
                  :ref="'cell_' + index + '_2'"
                  @keydown="handleTableKeydown(index, 2, $event)"
                >
              </td>
              <td>
                <span class="new-product-pricing__text-muted">
                  {{ row.recommendedPrice ? formatPrice(row.recommendedPrice) : 'Hozircha narx topilmadi' }}
                </span>
              </td>
              <td>
                <div class="new-product-pricing__cell-input-wrap" :class="{ 'new-product-pricing__cell-input-wrap--error': getRowErrors(row).totalQuantity }">
                  <input 
                    type="text" 
                    class="new-product-pricing__cell-input" 
                    :value="formatPrice(row.totalQuantity)" 
                    @input="handleNumericInput(row, 'totalQuantity', $event)"
                    :ref="'cell_' + index + '_3'"
                    @keydown="handleTableKeydown(index, 3, $event)"
                  >
                  <span class="new-product-pricing__cell-unit">ta</span>
                </div>
              </td>
              <td>
                <div class="new-product-pricing__cell-input-wrap" :class="{ 'new-product-pricing__cell-input-wrap--error': getRowErrors(row).minSaleQuantity }">
                  <input 
                    type="text" 
                    class="new-product-pricing__cell-input" 
                    :value="formatPrice(row.minSaleQuantity)" 
                    @input="handleNumericInput(row, 'minSaleQuantity', $event)"
                    :ref="'cell_' + index + '_4'"
                    @keydown="handleTableKeydown(index, 4, $event)"
                  >
                  <span class="new-product-pricing__cell-unit">ta</span>
                </div>
              </td>
              <td>
                <div class="new-product-pricing__cell-input-wrap" :class="{ 'new-product-pricing__cell-input-wrap--error': getRowErrors(row).price }">
                  <input 
                    type="text" 
                    class="new-product-pricing__cell-input new-product-pricing__cell-input--wide" 
                    :value="formatPrice(row.price)" 
                    @input="handleNumericInput(row, 'price', $event)"
                    placeholder="0"
                    :ref="'cell_' + index + '_5'"
                    @keydown="handleTableKeydown(index, 5, $event)"
                  >
                  <span class="new-product-pricing__cell-unit">so'm</span>
                </div>
              </td>
              <td>
                <div class="new-product-pricing__cell-input-wrap" :class="{ 'new-product-pricing__cell-input-wrap--error': getRowErrors(row).discount }">
                  <input 
                    type="text" 
                    class="new-product-pricing__cell-input new-product-pricing__cell-input--wide" 
                    :value="formatPrice(row.discount)" 
                    @input="handleNumericInput(row, 'discount', $event)"
                    placeholder="0"
                    :ref="'cell_' + index + '_6'"
                    @keydown="handleTableKeydown(index, 6, $event)"
                  >
                  <span class="new-product-pricing__cell-unit">so'm</span>
                </div>
              </td>
              <td>
                <span class="new-product-pricing__bold">{{ formatPrice(row.sellingPrice) }}</span>
              </td>
              <td>
                <div class="new-product-pricing__cell-stack">
                  <span class="new-product-pricing__bold">{{ formatPrice(row.commissionAmount) }}</span>
                  <span class="new-product-pricing__cell-sub">{{ commissionPercent }}%</span>
                </div>
              </td>
              <td>
                <span class="new-product-pricing__bold">{{ formatPrice(row.payoutAmount) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Premium Sticky Footer -->
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
              <h4>Ushbu bo'limdagi barcha ishlar yakunlandimi?</h4>
              <p>Keyingi qadamda mahsulotning umumiy ko'rinishi namoyish etiladi.</p>
            </div>
          </div>
          <div class="sab-right">
            <button class="sab-btn sab-btn--secondary" @click="$emit('change-step', 1)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ortga qaytish
            </button>
            <button class="sab-btn sab-btn--primary" @click="handleNextStep">
              Keyingi qadam
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import { formatPrice } from '../utils/formatters';

export default {
  name: 'NewProductPricing',
  inject: ['sharedProduct', 'showToast'],
  data() {
    return {
      showStickyFooter: false,
      rowErrors: {},
      commissionPercent: 3.2, // Constant as requested
      activeBulkColumn: null, // Tracks which lightning icon is clicked
      bulkInputs: {
        mxikCode: '',
        totalQuantity: '',
        minSaleQuantity: '',
        price: '',
        discount: ''
      }
    };
  },
  computed: {
    isStepValid() {
      // Check if there are rows and all are valid
      if (!this.sharedProduct.skuRows || this.sharedProduct.skuRows.length === 0) return false;
      return this.sharedProduct.skuRows.every(row => {
        const errors = this.validateRow(row);
        return Object.keys(errors).length === 0;
      });
    }
  },
  watch: {
    // Watch Base SKU to update automatic row SKUs
    'sharedProduct.productSku': {
      handler() {
        this.updateAutoSkus();
      }
    },
    // Watch features to regenerate rows if combinations change
    'sharedProduct.features': {
      handler() {
        this.generateVariantRows();
      },
      deep: true
    },
    // Watch colors to regenerate rows if color variants change
    'sharedProduct.colorMedia': {
      handler() {
        this.generateVariantRows();
      },
      deep: true
    }
  },
  mounted() {
    // Tizim doimo mount bo'lganda qatorlarni hisoblashi kerak, 
    // chunki user 1-chi qadamga qaytib, yangi xususiyat qo'shib yana 2-chi qadamga kelgan bo'lishi mumkin!
    this.generateVariantRows();
    
    // Global click listener to close bulk popovers
    window.addEventListener('click', this.handleGlobalClick);
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll(); // Initial check
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleGlobalClick);
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      // Show footer only when scrolled down (~200px)
      this.showStickyFooter = window.scrollY > 200;
    },
    formatPrice,
    
    // Bulk Apply Logic
    toggleBulkInput(column, event) {
      event.stopPropagation();
      if (this.activeBulkColumn === column) {
        this.activeBulkColumn = null;
      } else {
        this.activeBulkColumn = column;
        // Autofocus the input after it appears
        this.$nextTick(() => {
          const input = this.$refs[`bulkInput_${column}`];
          if (input) input.focus();
        });
      }
    },

    applyBulkValue(column) {
      const value = this.bulkInputs[column];
      if (value === '' || value === null) return;

      // Use mapping to ensure Vue 2 detects the change across the entire array
      this.sharedProduct.skuRows = this.sharedProduct.skuRows.map(row => {
        const newRow = { ...row };
        if (column === 'mxikCode') {
          newRow.mxikCode = String(value);
        } else {
          newRow[column] = Number(value);
          this.recalculateRow(newRow);
        }
        return newRow;
      });

      this.activeBulkColumn = null;
      this.bulkInputs[column] = ''; // Reset after apply
      this.showToast('Barcha qatorlar muvaffaqiyatli yangilandi', 'success');
      this.validateAllRows();
    },

    handleGlobalClick(event) {
      const popover = document.querySelector('.new-product-pricing__bulk-popover');
      if (popover && !popover.contains(event.target)) {
        this.activeBulkColumn = null;
      }
    },
    
    // 1. Sluggify helper for SKU parts
    slugify(text) {
      if (!text) return '';
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')         // Remove all non-word chars except -
        .replace(/--+/g, '-')            // Replace multiple - with single -
        .replace(/^-+/, '')               // Trim - from start of text
        .replace(/-+$/, '');              // Trim - from end of text
    },

    // 2. Generate Variant Combination Rows (Cartesian Product)
    generateVariantRows() {
      const explicitFeatures = (this.sharedProduct.features || []).filter(f => f.items && f.items.length > 0);
      
      const featuresToCombine = [];
      
      explicitFeatures.forEach(f => {
        featuresToCombine.push(f.items);
      });
      
      if (featuresToCombine.length === 0) {
        // Handle single product with no variants
        const singleRow = this.createNewRow([], 'Asosiy');
        this.sharedProduct.skuRows = [singleRow];
        return;
      }

      // Generate Cartesian Product
      const combinations = this.cartesianProduct(featuresToCombine);
      
      // Preserve existing data for matching combinations
      const existingRowsMap = new Map();
      (this.sharedProduct.skuRows || []).forEach(row => {
        existingRowsMap.set(JSON.stringify(row.variantValues), row);
      });

      const newRows = combinations.map(combo => {
        const comboKey = JSON.stringify(combo);
        if (existingRowsMap.has(comboKey)) {
          return existingRowsMap.get(comboKey);
        }
        
        const label = combo.join(', ');
        return this.createNewRow(combo, label);
      });

      this.sharedProduct.skuRows = newRows;
      this.updateAutoSkus();
    },

    cartesianProduct(arrays) {
      return arrays.reduce((acc, curr) => {
        const res = [];
        acc.forEach(a => {
          curr.forEach(b => {
            res.push([...a, b]);
          });
        });
        return res;
      }, [[]]);
    },

    createNewRow(values, label) {
      const row = {
        id: Date.now() + Math.random(),
        variantLabel: label,
        variantValues: values,
        sku: '',
        isSkuManuallyEdited: false,
        barcode: '',
        mxikCode: '0866132781256', // Default mock
        recommendedPrice: null,
        totalQuantity: 0,
        minSaleQuantity: 1,
        price: 0,
        discount: 0,
        sellingPrice: 0,
        commissionAmount: 0,
        commissionPercent: this.commissionPercent,
        payoutAmount: 0
      };
      row.sku = this.buildSku(row);
      return row;
    },

    // 3. SKU Building Logic
    buildSku(row) {
      if (row.isSkuManuallyEdited) return row.sku;
      
      const base = this.slugify(this.sharedProduct.productSku) || 'sku';
      const parts = row.variantValues.map(v => this.slugify(v));
      
      return [base, ...parts].filter(Boolean).join('-');
    },

    updateAutoSkus() {
      (this.sharedProduct.skuRows || []).forEach(row => {
        if (!row.isSkuManuallyEdited) {
          row.sku = this.buildSku(row);
        }
      });
    },

    handleRowSkuInput(row) {
      row.isSkuManuallyEdited = !!row.sku;
      this.validateAllRows();
    },

    // 4. Recalculation Logic

    handleNumericInput(row, field, event) {
      const val = event.target.value.replace(/\D/g, '');
      let finalVal = val ? parseInt(val) : 0;
      
      // minSaleQuantity shouldn't be less than 1
      if (field === 'minSaleQuantity' && finalVal < 1) {
        finalVal = 1;
      }
      
      row[field] = finalVal;
      this.recalculateRow(row);
      // Force update to show space separators
      this.$nextTick(() => {
        event.target.value = this.formatPrice(row[field]);
      });
    },

    handleBulkNumericInput(field, event) {
      const val = event.target.value.replace(/\D/g, '');
      let finalVal = val ? parseInt(val) : 0;
      
      // minSaleQuantity shouldn't be less than 1
      if (field === 'minSaleQuantity' && finalVal < 1) {
        finalVal = 1;
      }
      
      this.bulkInputs[field] = finalVal;
      this.$nextTick(() => {
        event.target.value = this.formatPrice(this.bulkInputs[field]);
      });
    },

    recalculateRow(row) {
      // 1. Selling Price
      row.sellingPrice = Math.max(0, Number(row.price) - Number(row.discount));
      
      // 2. Commission
      row.commissionAmount = Math.round((row.sellingPrice * this.commissionPercent) / 100);
      
      // 3. Payout
      row.payoutAmount = Math.max(0, row.sellingPrice - row.commissionAmount);
      
      this.validateRow(row);
    },

    recalculateAllRows() {
      (this.sharedProduct.skuRows || []).forEach(row => this.recalculateRow(row));
    },

    // 5. Excel-style Keyboard Navigation
    handleTableKeydown(rowIndex, colIndex, event) {
      const { key } = event;
      let targetRow = rowIndex;
      let targetCol = colIndex;

      if (key === 'ArrowUp') {
        targetRow--;
      } else if (key === 'ArrowDown' || key === 'Enter') {
        targetRow++;
      } else if (key === 'ArrowLeft') {
        targetCol--;
      } else if (key === 'ArrowRight') {
        targetCol++;
      } else {
        return; // Don't prevent default for other keys
      }

      const totalRows = (this.sharedProduct.skuRows || []).length;
      const totalCols = 7; // SKU, Barcode, MXIK, Qty, MinQty, Price, Discount

      // Bound checking
      if (targetRow < 0 || targetRow >= totalRows || targetCol < 0 || targetCol >= totalCols) {
        return;
      }

      event.preventDefault(); // Prevent scroll or default behavior

      this.$nextTick(() => {
        const refName = `cell_${targetRow}_${targetCol}`;
        const targetEl = this.$refs[refName];
        
        if (targetEl && targetEl[0]) {
          const input = targetEl[0];
          input.focus();
          
          // Selection logic for faster editing
          if (input.select) {
            input.select();
          }
        }
      });
    },

    // 6. Validation Logic
    validateRow(row) {
      const errors = {};
      
      if (!row.sku || !row.sku.trim()) {
        errors.sku = 'SKU bo\'sh bo\'lmasin';
      }
      
      // Check for duplicate SKUs across all rows
      const otherSkus = this.sharedProduct.skuRows
        .filter(r => r.id !== row.id)
        .map(r => (r.sku || '').trim().toLowerCase());
      
      if (row.sku && otherSkus.includes(row.sku.trim().toLowerCase())) {
        errors.sku = 'Bunday SKU allaqachon mavjud';
      }

      if (Number(row.totalQuantity) < 0) {
        errors.totalQuantity = 'Miqdor manfiy bo\'lmasin';
      }

      if (Number(row.minSaleQuantity) < 1) {
        errors.minSaleQuantity = 'Eng kam 1 ta bo\'lishi kerak';
      }

      if (Number(row.price) < 0) {
        errors.price = 'Narx manfiy bo\'lmasin';
      }

      if (Number(row.discount) > Number(row.price)) {
        errors.discount = 'Chegirma narxdan katta bo\'lmasin';
      }

      this.$set(this.rowErrors, row.id, errors);
      return errors;
    },

    validateAllRows() {
      let firstError = null;
      (this.sharedProduct.skuRows || []).forEach(row => {
        const err = this.validateRow(row);
        if (Object.keys(err).length > 0 && !firstError) {
          firstError = Object.values(err)[0];
        }
      });
      return firstError;
    },

    getRowErrors(row) {
      return this.rowErrors[row.id] || {};
    },

    handleNextStep() {
      const errorMsg = this.validateAllRows();
      if (errorMsg) {
        this.showToast(errorMsg, 'error');
        return;
      }
      this.$emit('change-step', 3);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-pricing {
  font-family: 'Inter', sans-serif;
  width: 100%;
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
  width: 100%;
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

/* Bulk Apply Header Styles */
.new-product-pricing__th--bulk {
  position: relative;
}

.new-product-pricing__th-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 40px;
}

.new-product-pricing__th-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

.new-product-pricing__th-text {
  margin-right: 4px;
}

.new-product-pricing__bulk-btn {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFB800 0%, #FF8A00 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  box-shadow: 0 4px 6px -1px rgba(255, 138, 0, 0.2), 0 2px 4px -2px rgba(255, 138, 0, 0.1);
}

.new-product-pricing__bulk-btn:hover {
  background: linear-gradient(135deg, #FFC837 0%, #FF8008 100%);
  transform: scale(1.2) rotate(-5deg);
  box-shadow: 0 0 15px rgba(255, 184, 0, 0.6);
}

.new-product-pricing__bulk-icon {
  width: 14px;
  height: 14px;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
}

.new-product-pricing__bulk-icon path {
  fill: #FFFFFF;
  stroke: #FFFFFF;
  stroke-width: 1;
}

.new-product-pricing__bulk-popover {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
}

.new-product-pricing__bulk-popover::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #ffffff;
  z-index: 101;
}

.new-product-pricing__bulk-popover::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 9px solid #E2E8F0;
  margin-bottom: 0px;
}

.new-product-pricing__bulk-input {
  width: 100%;
  height: 36px;
  border: 1.5px solid #DFE2E9!important;
  border-radius: 8px!important;
  padding: 0 12px!important;
  font-size: 13px!important;
  outline: none!important;
  box-sizing: border-box!important;
  background-color: #fff!important;
  text-align: left!important;
}

.new-product-pricing__bulk-input:focus {
  border-color: #22c55e!important;
}

.new-product-pricing__bulk-apply {
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-product-pricing__bulk-apply:hover {
  background-color: #16a34a;
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
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #DFE2E9;
  overflow: hidden; /* Remove scroll */
}

.new-product-pricing__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  table-layout: fixed;
}

.new-product-pricing__table th {
  background-color: #F9FAFB;
  color: #374151;
  font-weight: 600;
  text-align: center;
  padding: 10px 4px;
  border-bottom: 1px solid #DFE2E9;
  border-right: 1px solid #DFE2E9;
  line-height: 1.2;
  vertical-align: middle;
}

/* Precise column widths to fit 12 columns without scroll */
.new-product-pricing__table th:nth-child(1) { width: 3%; } /* № */
.new-product-pricing__table th:nth-child(2) { width: 10%; } /* Sotuvchi kodi */
.new-product-pricing__table th:nth-child(3) { width: 10%; } /* Shtrix-kod */
.new-product-pricing__table th:nth-child(4) { width: 10%; } /* MXIK */
.new-product-pricing__table th:nth-child(5) { width: 9%; } /* Tavsiya narx */
.new-product-pricing__table th:nth-child(6) { width: 7%; } /* Miqdori */
.new-product-pricing__table th:nth-child(7) { width: 7%; } /* Min. sotuv */
.new-product-pricing__table th:nth-child(8) { width: 10%; } /* Bahosi */
.new-product-pricing__table th:nth-child(9) { width: 9%; } /* Chegirma */
.new-product-pricing__table th:nth-child(10) { width: 9%; } /* Sotish narxi */
.new-product-pricing__table th:nth-child(11) { width: 8%; } /* Komissiya */
.new-product-pricing__table th:nth-child(12) { width: 8%; } /* Chiqarish */

.new-product-pricing__table td {
  padding: 8px 4px;
  border-bottom: 1px solid #DFE2E9;
  border-right: 1px solid #DFE2E9;
  vertical-align: middle;
  text-align: center;
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
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  text-align-last: center;
  transition: all 0.2s ease;
}

.new-product-pricing__select:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.new-product-pricing__cell-input-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #DFE2E9;
  border-radius: 8px;
  padding: 0 8px;
  height: 36px;
  background-color: #fff;
  transition: all 0.2s ease;
}

.new-product-pricing__cell-input-wrap:focus-within {
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
}

.new-product-pricing__cell-input {
  border: 1.5px solid #DFE2E9;
  border-radius: 8px;
  height: 36px;
  outline: none;
  width: 100%;
  font-size: 13px;
  color: #111827;
  font-family: inherit;
  text-align: center;
  background-color: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.new-product-pricing__cell-input:focus {
  border-color: #16a34a;
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
  outline: none;
  z-index: 10;
  position: relative;
}

.new-product-pricing__cell-input-wrap .new-product-pricing__cell-input {
  border: none;
  width: auto;
  min-width: 40px;
  max-width: 100%;
  height: 100%;
  background-color: transparent;
}

.new-product-pricing__cell-input--wide {
  width: 80px;
}

.new-product-pricing__cell-input--sku {
  width: 100%;
  border: 1.5px solid #DFE2E9;
  border-radius: 8px;
  height: 36px;
  margin-top: 4px;
  background-color: #F9FAFB;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.new-product-pricing__cell-input--sku:focus {
  background-color: #ffffff;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  outline: none;
}

.new-product-pricing__cell-input--error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.new-product-pricing__cell-input-wrap--error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
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

/* Navigation Footer */
.new-product-pricing__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #F1F5F9;
}

.new-product-pricing__btn-next {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  padding: 0 32px;
  background-color: #22c55e;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2);
  font-family: inherit;
}

.new-product-pricing__btn-next:hover {
  background-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3);
}

.new-product-pricing__btn-next:active {
  transform: translateY(0);
}

.new-product-pricing__btn-arrow {
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 900px) {
  .new-product-pricing__example-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Sticky Footer Styles */
.sticky-footer-wrapper {
  position: sticky;
  bottom: 24px;
  z-index: 50;
  margin-top: 40px;
  max-width: 966px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.slide-up-footer-enter-active, .slide-up-footer-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-footer-enter, .slide-up-footer-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.step-action-bar {
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
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .sab-btn {
    width: 100%;
  }
}
</style>
