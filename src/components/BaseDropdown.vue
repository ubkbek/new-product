<template>
  <div class="base-dropdown" v-click-outside="closeDropdown">
    <!-- Dropdown Header/Trigger -->
    <div 
      class="base-dropdown__header" 
      :class="{ 'base-dropdown__header--active': isOpen, 'base-dropdown__header--disabled': disabled }"
      @click="toggleDropdown"
    >
      <div v-if="selectedOption" class="base-dropdown__selected">
        {{ getLabel(selectedOption) }}
      </div>
      <div v-else class="base-dropdown__placeholder">
        {{ placeholder }}
      </div>
      
      <div class="base-dropdown__arrow" :class="{ 'base-dropdown__arrow--rotated': isOpen }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <transition name="dropdown-fade">
      <div v-if="isOpen" class="base-dropdown__menu">
        <!-- Search Input -->
        <div v-if="searchable" class="base-dropdown__search-wrapper">
          <svg class="base-dropdown__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            type="text" 
            class="base-dropdown__search-input" 
            v-model="searchQuery" 
            placeholder="Qidirish..."
            ref="searchInput"
            @click.stop
          >
        </div>

        <!-- Options List -->
        <div class="base-dropdown__options" ref="optionsList">
          <div 
            v-for="(option, index) in filteredOptions" 
            :key="getValue(option)"
            class="base-dropdown__option"
            :class="{ 
              'base-dropdown__option--selected': isSelected(option),
              'base-dropdown__option--hover': hoverIndex === index
            }"
            @click="selectOption(option)"
          >
            {{ getLabel(option) }}
            <svg v-if="isSelected(option)" class="base-dropdown__check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-if="filteredOptions.length === 0" class="base-dropdown__no-results">
            Ma'lumot topilmadi
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseDropdown',
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    },
  },
  props: {
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Tanlang'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    searchable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      searchQuery: '',
      hoverIndex: -1
    };
  },
  computed: {
    selectedOption() {
      return this.options.find(opt => this.getValue(opt) === this.value);
    },
    filteredOptions() {
      if (!this.searchable || !this.searchQuery) return this.options;
      const query = this.searchQuery.toLowerCase();
      return this.options.filter(opt => 
        this.getLabel(opt).toLowerCase().includes(query)
      );
    }
  },
  methods: {
    toggleDropdown() {
      if (this.disabled) return;
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchQuery = '';
        this.$nextTick(() => {
          if (this.searchable && this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
        });
      }
    },
    closeDropdown() {
      this.isOpen = false;
    },
    selectOption(option) {
      this.$emit('input', this.getValue(option));
      this.isOpen = false;
    },
    getLabel(option) {
      return typeof option === 'object' ? option[this.labelKey] : option;
    },
    getValue(option) {
      return typeof option === 'object' ? option[this.valueKey] : option;
    },
    isSelected(option) {
      return this.getValue(option) === this.value;
    }
  }
};
</script>

<style scoped>
.base-dropdown {
  position: relative;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.base-dropdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background-color: #ffffff;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  box-sizing: border-box;
}

.base-dropdown__header:hover {
  border-color: #CBD5E1;
}

.base-dropdown__header--active {
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.base-dropdown__header--disabled {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
  cursor: not-allowed;
  opacity: 0.7;
}

.base-dropdown__header--disabled:hover {
  border-color: #E2E8F0;
}

.base-dropdown__selected {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-dropdown__placeholder {
  font-size: 14px;
  color: #7A889B;
  font-weight: 400;
}

.base-dropdown__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #94A3B8;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.base-dropdown__arrow--rotated {
  transform: rotate(180deg);
  color: #22c55e;
}

.base-dropdown__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1000;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transform-origin: top;
}

.base-dropdown__search-wrapper {
  position: relative;
  padding: 12px;
  border-bottom: 1px solid #F1F5F9;
}

.base-dropdown__search-icon {
  position: absolute;
  top: 50%;
  left: 22px;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #94A3B8;
}

.base-dropdown__search-input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 32px;
  font-size: 13px;
  color: #1f2937;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.base-dropdown__search-input:focus {
  background-color: #ffffff;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.05);
}

.base-dropdown__options {
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
}

/* Custom Scrollbar */
.base-dropdown__options::-webkit-scrollbar {
  width: 6px;
}

.base-dropdown__options::-webkit-scrollbar-track {
  background: transparent;
}

.base-dropdown__options::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

.base-dropdown__options::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}

.base-dropdown__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 14px;
  color: #475569;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.base-dropdown__option:hover {
  background-color: #F8FAFC;
  color: #1f2937;
}

.base-dropdown__option--selected {
  background-color: #F0FDF4;
  color: #166534;
  font-weight: 500;
}

.base-dropdown__check-icon {
  width: 16px;
  height: 16px;
  color: #22c55e;
}

.base-dropdown__no-results {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: #94A3B8;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fade-enter,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
