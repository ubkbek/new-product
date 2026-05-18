<template>
  <div class="app-dropdown" v-click-outside="closeDropdown">
    <!-- Dropdown Trigger -->
    <div 
      class="app-dropdown__trigger" 
      :class="{ 
        'app-dropdown__trigger--active': isOpen,
        'app-dropdown__trigger--disabled': disabled 
      }" 
      @click="toggleDropdown"
      @keydown.down.prevent="onArrowDown"
      @keydown.up.prevent="onArrowUp"
      @keydown.enter.prevent="onEnter"
      @keydown.esc.prevent="closeDropdown"
      tabindex="0"
    >
      <div class="app-dropdown__content">
        <span v-if="selectedOption" class="app-dropdown__selected">
          {{ getLabel(selectedOption) }}
        </span>
        <span v-else class="app-dropdown__placeholder">
          {{ placeholder }}
        </span>
      </div>
      <div class="app-dropdown__icon" :class="{ 'app-dropdown__icon--rotated': isOpen }">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <transition name="app-dropdown-slide">
      <div v-if="isOpen" class="app-dropdown__menu">
        <!-- Search Area -->
        <div v-if="searchable" class="app-dropdown__search-container" @click.stop>
          <div class="app-dropdown__search-wrapper">
            <svg class="app-dropdown__search-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19L14.65 14.65M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input 
              ref="searchInput"
              v-model="searchQuery"
              type="text" 
              class="app-dropdown__search-input" 
              :placeholder="searchPlaceholder"
              @input="onSearchInput"
              @keydown.down.prevent="onArrowDown"
              @keydown.up.prevent="onArrowUp"
              @keydown.enter.prevent="onEnter"
              @keydown.esc.prevent="closeDropdown"
            >
          </div>
        </div>

        <!-- Options Container -->
        <div class="app-dropdown__options" ref="optionsList">
          <div 
            v-for="(option, index) in filteredOptions" 
            :key="getValue(option)"
            class="app-dropdown__option"
            :class="{ 
              'app-dropdown__option--selected': isSelected(option),
              'app-dropdown__option--highlighted': highlightIndex === index
            }"
            @click="selectOption(option)"
            @mouseover="highlightIndex = index"
          >
            <span class="app-dropdown__option-text">{{ getLabel(option) }}</span>
            <div v-if="isSelected(option)" class="app-dropdown__check">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div v-if="filteredOptions.length === 0" class="app-dropdown__empty">
            {{ emptyText }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppDropdown',
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            const hook = vnode.context[binding.expression];
            if (typeof hook === 'function') {
              hook(event);
            }
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
    // Current value for v-model
    value: {
      type: [String, Number],
      default: ''
    },
    // Array of options (strings or objects)
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    // Placeholder when no value is selected
    placeholder: {
      type: String,
      default: 'Kategoriyani tanlang'
    },
    // Key to use as label if option is an object
    labelKey: {
      type: String,
      default: 'name'
    },
    // Key to use as value if option is an object
    valueKey: {
      type: String,
      default: 'id'
    },
    // Enable search field
    searchable: {
      type: Boolean,
      default: false
    },
    // Placeholder for search input
    searchPlaceholder: {
      type: String,
      default: 'Qidirish...'
    },
    // Text to show when no results found
    emptyText: {
      type: String,
      default: 'Ma\'lumot topilmadi'
    },
    // Disable the dropdown
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      searchQuery: '',
      highlightIndex: -1
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
        this.highlightIndex = -1;
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
      if (typeof option === 'object' && option !== null) {
        return option[this.labelKey];
      }
      return option;
    },
    getValue(option) {
      if (typeof option === 'object' && option !== null) {
        return option[this.valueKey];
      }
      return option;
    },
    isSelected(option) {
      return this.getValue(option) === this.value;
    },
    onSearchInput() {
      this.highlightIndex = 0;
    },
    onArrowDown() {
      if (!this.isOpen) {
        this.toggleDropdown();
        return;
      }
      if (this.highlightIndex < this.filteredOptions.length - 1) {
        this.highlightIndex++;
        this.scrollToHighlighted();
      }
    },
    onArrowUp() {
      if (!this.isOpen) return;
      if (this.highlightIndex > 0) {
        this.highlightIndex--;
        this.scrollToHighlighted();
      }
    },
    onEnter() {
      if (!this.isOpen) {
        this.toggleDropdown();
        return;
      }
      if (this.highlightIndex >= 0 && this.highlightIndex < this.filteredOptions.length) {
        this.selectOption(this.filteredOptions[this.highlightIndex]);
      }
    },
    scrollToHighlighted() {
      this.$nextTick(() => {
        const container = this.$refs.optionsList;
        const highlighted = container.querySelector('.app-dropdown__option--highlighted');
        if (container && highlighted) {
          const containerRect = container.getBoundingClientRect();
          const highlightedRect = highlighted.getBoundingClientRect();

          if (highlightedRect.bottom > containerRect.bottom) {
            container.scrollTop += highlightedRect.bottom - containerRect.bottom;
          } else if (highlightedRect.top < containerRect.top) {
            container.scrollTop -= containerRect.top - highlightedRect.top;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.app-dropdown {
  position: relative;
  width: 100%;
}

.app-dropdown__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  padding: 0 14px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  box-sizing: border-box;
}

.app-dropdown__trigger:hover:not(.app-dropdown__trigger--disabled) {
  border-color: #CBD5E1;
}

.app-dropdown__trigger--active {
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.app-dropdown__trigger--disabled {
  background-color: #F8FAFC;
  border-color: #E2E8F0;
  cursor: not-allowed;
  opacity: 0.7;
}

.app-dropdown__content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-dropdown__selected {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.app-dropdown__placeholder {
  font-size: 14px;
  color: #7A889B;
  font-weight: 400;
}

.app-dropdown__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  color: #94A3B8;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-dropdown__icon--rotated {
  transform: rotate(180deg);
  color: #22c55e;
}

.app-dropdown__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 50;
  background-color: #ffffff;
  border: 1px solid #DFE2E9;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transform-origin: top;
}

.app-dropdown__search-container {
  padding: 12px 12px 8px 12px;
  background-color: #ffffff;
}

.app-dropdown__search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.app-dropdown__search-icon {
  position: absolute;
  left: 12px;
  color: #94A3B8;
}

.app-dropdown__search-input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 36px;
  font-size: 13px;
  color: #1f2937;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.app-dropdown__search-input:focus {
  background-color: #ffffff;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.05);
}

.app-dropdown__options {
  max-height: 220px;
  overflow-y: auto;
  padding: 6px;
}

.app-dropdown__options::-webkit-scrollbar {
  width: 6px;
}

.app-dropdown__options::-webkit-scrollbar-track {
  background: transparent;
}

.app-dropdown__options::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

.app-dropdown__options::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}

.app-dropdown__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 14px;
  color: #475569;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.app-dropdown__option:last-child {
  margin-bottom: 0;
}

.app-dropdown__option:hover, 
.app-dropdown__option--highlighted {
  background-color: #F8FAFC;
  color: #1f2937;
}

.app-dropdown__option--selected {
  background-color: #F0FDF4;
  color: #166534;
  font-weight: 500;
}

.app-dropdown__check {
  display: flex;
  align-items: center;
  color: #22c55e;
}

.app-dropdown__empty {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: #94A3B8;
}

/* Slide Transition */
.app-dropdown-slide-enter-active,
.app-dropdown-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-dropdown-slide-enter,
.app-dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
