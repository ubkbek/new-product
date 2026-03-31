<template>
  <div class="new-product-delivery">
    
    <!-- Section 1: Delivery Days -->
    <div class="new-product-delivery__section">
      <h2 class="new-product-delivery__title">Yetkazib berish kuni tanlang</h2>
      <div class="new-product-delivery__grid new-product-delivery__grid--days">
        <div 
          v-for="day in deliveryOptions" 
          :key="'day-' + day"
          class="new-product-delivery__item new-product-delivery__item--day"
          :class="{ 'new-product-delivery__item--active': sharedProduct.delivery.selectedDelivery === day, 'new-product-delivery__item--disabled': isImagesIncomplete }"
          @click="isImagesIncomplete ? null : sharedProduct.delivery.selectedDelivery = day"
        >
          <div class="new-product-delivery__radio-circle"></div>
          <span class="new-product-delivery__text">{{ day }} kun</span>
        </div>
      </div>
    </div>

    <!-- Section 2: Payment Types -->
    <div class="new-product-delivery__section">
      <h2 class="new-product-delivery__title">To'lov turlari:</h2>
      <div class="new-product-delivery__grid new-product-delivery__grid--payments">
        <div 
          v-for="payment in paymentOptions" 
          :key="payment.id"
          class="new-product-delivery__item new-product-delivery__item--payment"
          :class="{ 'new-product-delivery__item--active': sharedProduct.delivery.selectedPayments.includes(payment.id), 'new-product-delivery__item--disabled': isImagesIncomplete }"
          @click="isImagesIncomplete ? null : togglePayment(payment.id)"
        >
          <div class="new-product-delivery__checkbox-box">
             <svg v-if="sharedProduct.delivery.selectedPayments.includes(payment.id)" class="new-product-delivery__check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
          </div>
          <div class="new-product-delivery__payment-icon-wrap">
             <div class="new-product-delivery__payment-bg" :style="{ backgroundColor: payment.color }">
                <svg v-html="payment.icon" class="new-product-delivery__payment-svg" viewBox="0 0 24 24"></svg>
             </div>
          </div>
          <span class="new-product-delivery__text">{{ payment.name }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NewProductDelivery',
  inject: ['sharedProduct'],
  computed: {
    isImagesIncomplete() {
      return !this.sharedProduct.images || this.sharedProduct.images.length === 0;
    }
  },
  data() {
    return {
      deliveryOptions: [1, 2, 3, 4, 5],
      paymentOptions: [
        { 
          id: 1, 
          name: 'Oila kredit', 
          color: '#D1FAE5', 
          icon: '<path fill="#10B981" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' 
        },
        { 
          id: 2, 
          name: 'SSUDA', 
          color: '#DBEAFE', 
          icon: '<circle fill="#3B82F6" cx="12" cy="12" r="10"/><path fill="#FFF" d="M12 6v12M6 12h12"/>' 
        },
        { 
          id: 3, 
          name: 'Bank kredit', 
          color: '#D1FAE5', 
          icon: '<path fill="#10B981" d="M11.5 2L2 6v2h19V6l-9.5-4zM5 9v11h3V9H5zm5 0v11h3V9h-3zm5 0v11h3V9h-3zM2 22h20v-2H2v2z"/>' 
        },
        { 
          id: 4, 
          name: 'Naqd to\'lov', 
          color: '#D1FAE5', 
          icon: '<path fill="#10B981" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>' 
        },
        { 
          id: 5, 
          name: 'Pul o\'tkazish', 
          color: '#D1FAE5', 
          icon: '<path fill="#10B981" d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 19H5V5h14v2h-3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h3v2zM9 9h6v2H9V9zm0 4h6v2H9v-2z"/>' 
        }
      ]
    };
  },
  methods: {
    togglePayment(id) {
      const index = this.sharedProduct.delivery.selectedPayments.indexOf(id);
      if (index === -1) {
        this.sharedProduct.delivery.selectedPayments.push(id);
      } else {
        this.sharedProduct.delivery.selectedPayments.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.new-product-delivery {
  font-family: 'Inter', sans-serif;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 2rem;
}

.new-product-delivery__title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.new-product-delivery__grid {
  display: grid;
  gap: 16px;
}

.new-product-delivery__grid--days {
  grid-template-columns: repeat(5, 1fr);
}

.new-product-delivery__grid--payments {
  grid-template-columns: repeat(5, 1fr);
}

.new-product-delivery__item {
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.new-product-delivery__item--day {
  padding: 14px 16px;
  justify-content: flex-start;
  gap: 12px;
}

.new-product-delivery__item--payment {
  padding: 24px 16px;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.new-product-delivery__item--active {
  border-color: #22c55e;
  border-width: 1px;
}

.new-product-delivery__radio-circle {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.new-product-delivery__item--active .new-product-delivery__radio-circle {
  border-color: #22c55e;
}

.new-product-delivery__item--active .new-product-delivery__radio-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
}

.new-product-delivery__checkbox-box {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.new-product-delivery__item--active .new-product-delivery__checkbox-box {
  background-color: #22c55e;
  border-color: #22c55e;
}

.new-product-delivery__check-icon {
  width: 12px;
  height: 12px;
  color: #ffffff;
}

.new-product-delivery__payment-icon-wrap {
  display: flex;
  justify-content: center;
}

.new-product-delivery__payment-bg {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.new-product-delivery__item:hover .new-product-delivery__payment-bg {
  transform: scale(1.05);
}

.new-product-delivery__payment-svg {
  width: 24px;
  height: 24px;
}

.new-product-delivery__text {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* Responsive Handling */
@media (max-width: 900px) {
  .new-product-delivery__grid--days,
  .new-product-delivery__grid--payments {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .new-product-delivery__grid--days,
  .new-product-delivery__grid--payments {
    grid-template-columns: 1fr;
  }
}
.new-product-delivery__item--disabled {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
  cursor: not-allowed;
  opacity: 0.6;
}

.new-product-delivery__item--disabled:hover {
  border-color: #E2E8F0;
}
</style>
