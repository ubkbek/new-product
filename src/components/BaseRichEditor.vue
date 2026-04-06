<template>
  <div class="base-rich-editor" :class="{ 'base-rich-editor--disabled': disabled }">
    <!-- Toolbar -->
    <div class="base-rich-editor__toolbar">
      <!-- Undo/Redo -->
      <button class="base-rich-editor__btn" @click.prevent="exec('undo')" title="Undo">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
      </button>
      <button class="base-rich-editor__btn" @click.prevent="exec('redo')" title="Redo">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>
      </button>

      <div class="base-rich-editor__divider"></div>

      <!-- Format Dropdown -->
      <select class="base-rich-editor__select" @change="exec('formatBlock', $event.target.value)" title="Choose Format">
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <div class="base-rich-editor__divider"></div>

      <!-- Bold/Italic -->
      <button class="base-rich-editor__btn" @click.prevent="exec('bold')" title="Bold">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
      </button>
      <button class="base-rich-editor__btn" @click.prevent="exec('italic')" title="Italic">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </button>

      <div class="base-rich-editor__divider"></div>

      <!-- Image Upload -->
      <button class="base-rich-editor__btn" @click.prevent="triggerImageUpload" title="Insert Image" :disabled="isUploading">
        <svg v-if="!isUploading" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <div v-else class="base-rich-editor__loader"></div>
      </button>
      
      <!-- Hidden file input -->
      <input 
        type="file" 
        ref="fileInput" 
        style="display: none" 
        accept="image/*" 
        @change="onFileSelected"
      >
    </div>

    <!-- Editable Area -->
    <div 
      class="base-rich-editor__content"
      ref="editor"
      contenteditable="true"
      @input="onInput"
      @blur="onBlur"
      @paste="onPaste"
      :data-placeholder="placeholder"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'BaseRichEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Write something...'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    uploadFile: {
      from: 'uploadFile',
      default: null
    },
    showToast: {
      from: 'showToast',
      default: null
    }
  },
  data() {
    return {
      isUploading: false
    };
  },
  watch: {
    value(newVal) {
      if (this.$refs.editor && newVal !== this.$refs.editor.innerHTML) {
        this.$refs.editor.innerHTML = newVal;
      }
    }
  },
  mounted() {
    if (this.$refs.editor) {
      this.$refs.editor.innerHTML = this.value;
    }
    // Set focus if possible
    document.execCommand('defaultParagraphSeparator', false, 'p');
  },
  methods: {
    exec(command, value = null) {
      if (this.disabled) return;
      document.execCommand(command, false, value);
      this.$refs.editor.focus();
      this.onInput();
    },
    onInput() {
      const html = this.$refs.editor.innerHTML;
      this.$emit('input', html === '<p><br></p>' || html === '<br>' ? '' : html);
    },
    onBlur() {
      this.$emit('blur');
    },
    onPaste() {
      // Basic paste handling to maintain some level of cleanliness
      // For images, we want to allow standard paste too, but for now we focus on text cleanliness
    },
    triggerImageUpload() {
      if (this.disabled || this.isUploading) return;
      this.$refs.fileInput.click();
    },
    async onFileSelected(e) {
      const file = e.target.files ? e.target.files[0] : null;
      if (!file) return;

      this.isUploading = true;
      try {
        if (typeof this.uploadFile === 'function') {
          const imageId = await this.uploadFile(file);
          const url = `https://api.cabinet.smart-market.uz/uploads/images/${imageId}`;
          this.insertImage(url);
          if (this.showToast) this.showToast('Rasm muvaffaqiyatli yuklandi!', 'success');
        } else {
          console.error('uploadFile method not found');
          // Fallback to local preview for demo/testing
          const reader = new FileReader();
          reader.onload = (re => this.insertImage(re.target.result));
          reader.readAsDataURL(file);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        if (this.showToast) this.showToast('Rasm yuklashda xatolik yuz berdi.', 'error');
      } finally {
        this.isUploading = false;
        this.$refs.fileInput.value = ''; // Reset input
      }
    },
    insertImage(url) {
      this.$refs.editor.focus();
      document.execCommand('insertImage', false, url);
      // Clean up the image potentially being placed outside of a P tag or having weird styles
      const imgs = this.$refs.editor.getElementsByTagName('img');
      const lastImg = imgs[imgs.length - 1];
      if (lastImg) {
        lastImg.style.maxWidth = '100%';
        lastImg.style.borderRadius = '8px';
        lastImg.style.display = 'block';
        lastImg.style.margin = '10px 0';
      }
      this.onInput();
    }
  }
};
</script>

<style scoped>
.base-rich-editor {
  border: 1.5px solid #DFE2E9;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.2s;
}

.base-rich-editor:focus-within {
  border-color: #22c55e;
}

.base-rich-editor--disabled {
  background-color: #F9FAF7;
  opacity: 0.7;
  cursor: not-allowed;
}

.base-rich-editor__toolbar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #DFE2E9;
  flex-wrap: wrap;
  gap: 4px;
}

.base-rich-editor__btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #4b5563;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.base-rich-editor__btn:hover:not(:disabled) {
  background: #F1F5F9;
  color: #111827;
}

.base-rich-editor__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-rich-editor__divider {
  width: 1px;
  height: 20px;
  background: #DFE2E9;
  margin: 0 4px;
}

.base-rich-editor__select {
  border: 1px solid #DFE2E9;
  background: #ffffff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: #374151;
  outline: none;
  cursor: pointer;
}

.base-rich-editor__content {
  padding: 16px;
  min-height: 200px;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.6;
  outline: none;
  word-break: break-word;
}

.base-rich-editor__content:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.base-rich-editor__loader {
  width: 14px;
  height: 14px;
  border: 2px solid #22c55e;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Base HTML styles for the editor content */
::v-deep img {
  max-width: 100%;
  border-radius: 8px;
  display: block;
  margin: 12px 0;
}

::v-deep h1 { font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700; }
::v-deep h2 { font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 700; }
::v-deep h3 { font-size: 1.1rem; margin-bottom: 0.5rem; font-weight: 700; }
::v-deep p { margin-bottom: 0.5rem; }
</style>
