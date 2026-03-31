<template>
  <div class="npv">
    <h2 class="npv__title">Mahsulot yoki xizmat videosi</h2>

    <!-- Tabs Header -->
    <div class="npv__tabs" :title="isImagesIncomplete ? 'Video yuklash uchun avval rasm yuklang' : ''">
      <button
        class="npv__tab"
        :class="{ 'npv__tab--active': activeTab === 'upload', 'npv__tab--disabled': isImagesIncomplete }"
        @click="switchTab('upload')"
        :disabled="isImagesIncomplete"
      >
        Videoni yuklash
      </button>
      <button
        class="npv__tab"
        :class="{ 'npv__tab--active': activeTab === 'link', 'npv__tab--disabled': isImagesIncomplete }"
        @click="switchTab('link')"
        :disabled="isImagesIncomplete"
      >
        Video linkini joylash
      </button>
    </div>

    <!-- Main Content -->
    <div class="npv__content">

      <!-- Info Cards -->
      <div class="npv__info-grid">
        <div class="npv__info-box npv__info-box--green">
          <div class="npv__icon-wrap">
            <svg class="npv__info-icon npv__info-icon--green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <p class="npv__info-text">Sifatli video tovar yoki xizmatni xaridorlarga yaxshiroq ko&#8216;rsatishga imkon beradi</p>
        </div>
        <div class="npv__info-box npv__info-box--yellow">
          <div class="npv__icon-wrap">
            <svg class="npv__info-icon npv__info-icon--orange" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="npv__info-text">MP4, MOV, WEBM format. Hajmi 5 MB dan oshmasin. O&#8216;lcham: 1080x1440</p>
        </div>
      </div>

      <!-- ===================== TAB: Video Upload ===================== -->
      <div v-show="activeTab === 'upload'" class="npv__tab-content">

        <!-- No video yet: show upload box -->
        <template v-if="!video_id">
          <label
            class="npv__upload-box"
            :class="{
              'npv__upload-box--disabled': isImagesIncomplete || isUploading,
              'npv__upload-box--dragover': isDragover
            }"
            @dragover.prevent="isDragover = true"
            @dragleave="isDragover = false"
            @drop.prevent="handleDrop"
          >
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              class="npv__file-input"
              @change="handleFileSelect"
              :disabled="isImagesIncomplete || isUploading"
            >

            <template v-if="!isUploading">
              <svg class="npv__upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="npv__upload-text">Video yuklash</span>
              <span class="npv__upload-hint">yoki bu yerga tashlang</span>
            </template>

            <template v-else>
              <div class="npv__progress-wrap">
                <div class="npv__spinner"></div>
                <span class="npv__upload-text">Yuklanmoqda...</span>
                <div v-if="uploadProgress > 0" class="npv__progress-bar-wrap">
                  <div class="npv__progress-bar" :style="{ width: uploadProgress + '%' }"></div>
                </div>
              </div>
            </template>
          </label>

          <!-- Error -->
          <div v-if="errorMessage && activeTab === 'upload'" class="npv__error-msg">
            <svg class="npv__error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ errorMessage }}
          </div>
        </template>

        <!-- Video uploaded: show preview -->
        <div v-else class="npv__preview-card">
          <div class="npv__preview-badge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="npv__badge-icon"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Video yuklandi
          </div>
          <p class="npv__preview-id">ID: <code>{{ video_id }}</code></p>
          <button class="npv__remove-btn" @click="clearVideo">Videoni o'chirish</button>
        </div>

      </div>

      <!-- ===================== TAB: Video Link ===================== -->
      <div v-show="activeTab === 'link'" class="npv__tab-content">

        <template v-if="!video_id">
          <div class="npv__link-group">
            <input
              type="url"
              class="npv__link-input"
              :class="{ 'npv__link-input--error': errorMessage && activeTab === 'link' }"
              placeholder="https://example.com/video.mp4"
              v-model="videoLink"
              :disabled="isImagesIncomplete || isSubmittingLink"
              @keyup.enter="handleLinkSubmit"
            >
            <button
              class="npv__link-btn"
              @click="handleLinkSubmit"
              :disabled="isImagesIncomplete || isSubmittingLink || !videoLink.trim()"
            >
              <div v-if="isSubmittingLink" class="npv__spinner-sm"></div>
              {{ isSubmittingLink ? 'Yuklanmoqda...' : 'Saqlash' }}
            </button>
          </div>

          <p class="npv__link-hint">
            Backend linkdagi videoni yuklab olib serverga saqlaydi. Faqat <code>video_id</code> bazaga yoziladi.
          </p>

          <!-- Error -->
          <div v-if="errorMessage && activeTab === 'link'" class="npv__error-msg">
            <svg class="npv__error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ errorMessage }}
          </div>
        </template>

        <!-- Video saved via link: show preview -->
        <div v-else class="npv__preview-card">
          <div class="npv__preview-badge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="npv__badge-icon"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Video saqlandi
          </div>
          <p class="npv__preview-id">ID: <code>{{ video_id }}</code></p>
          <button class="npv__remove-btn" @click="clearVideo">Videoni o'chirish</button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// ─── API Methods ──────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.cabinet.smart-market.uz';
const AUTH_TOKEN = () => localStorage.getItem('token') || '737ff01b-47d1-45df-bdfa-0ec0953091eb';

/**
 * Upload a video file directly to the smart-market server.
 * POST /files/upload/category/ads
 * @param {File} file
 * @returns {Promise<string|number>} video id
 */
async function uploadVideoFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('form_element_project_id', 12);

  const res = await fetch(`${BASE_URL}/files/upload/category/ads`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN()}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server xatoligi: ${res.status}`);
  }

  const data = await res.json();
  const id = data?.id || data?.data?.id;
  if (!id) throw new Error('Server ID qaytarmadi');
  return id;
}

/**
 * Ask the backend to download the video from `link` and upload it.
 * POST /v1/videos/upload-by-link  ← placeholder endpoint
 * @param {string} link
 * @returns {Promise<string|number>} video id
 */
async function uploadVideoByLink(link) {
  const res = await fetch(`${BASE_URL}/v1/videos/upload-by-link`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: link }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server xatoligi: ${res.status}`);
  }

  const data = await res.json();
  const id = data?.data?.id || data?.id;
  if (!id) throw new Error('Server ID qaytarmadi');
  return id;
}

// ─── Validators ───────────────────────────────────────────────────────────────

const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function validateVideoFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Fayl turi noto\'g\'ri. Faqat MP4, MOV, WEBM.');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`Fayl hajmi juda katta. Maksimal ${MAX_SIZE_BYTES / 1024 / 1024} MB.`);
  }
}

function validateUrl(url) {
  try { new URL(url); } catch {
    throw new Error('URL formati noto\'g\'ri.');
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default {
  name: 'NewProductVideo',
  inject: ['sharedProduct', 'showToast'],

  data() {
    return {
      // Tab
      activeTab: 'upload',

      // Shared final value
      video_id: null,

      // Upload tab
      uploadFile: null,
      isUploading: false,
      uploadProgress: 0,
      isDragover: false,

      // Link tab
      videoLink: '',
      isSubmittingLink: false,

      // Shared UI
      errorMessage: '',
      successMessage: '',
    };
  },

  computed: {
    isImagesIncomplete() {
      return !this.sharedProduct.images || this.sharedProduct.images.length === 0;
    },
  },

  watch: {
    // Keep sharedProduct.video.videoId in sync
    video_id(val) {
      this.sharedProduct.video.videoId = val;
      console.log('[NewProductVideo] video_id changed:', val);
    },
  },

  methods: {

    // ── Tab management ────────────────────────────────────────────────
    switchTab(tab) {
      if (this.isImagesIncomplete) return;
      if (tab === this.activeTab) return;

      // Clear previous tab state (but keep video_id if already saved)
      if (this.activeTab === 'upload') {
        this.uploadFile = null;
        this.isUploading = false;
        this.uploadProgress = 0;
      }
      if (this.activeTab === 'link') {
        this.videoLink = '';
        this.isSubmittingLink = false;
      }

      this.errorMessage = '';
      this.successMessage = '';
      this.activeTab = tab;
    },

    clearVideo() {
      this.video_id = null;
      this.uploadFile = null;
      this.videoLink = '';
      this.errorMessage = '';
      this.successMessage = '';
      this.uploadProgress = 0;
    },

    // ── Upload tab ────────────────────────────────────────────────────
    handleDrop(e) {
      this.isDragover = false;
      const file = e.dataTransfer?.files?.[0];
      if (file) this.processFile(file);
    },

    handleFileSelect(e) {
      const file = e.target.files?.[0];
      if (file) this.processFile(file);
      e.target.value = '';
    },

    async processFile(file) {
      this.errorMessage = '';
      this.successMessage = '';
      this.video_id = null;

      try {
        validateVideoFile(file);
      } catch (e) {
        this.errorMessage = e.message;
        this.showToast(e.message, 'error');
        return;
      }

      this.uploadFile = file;
      this.isUploading = true;
      this.uploadProgress = 0;

      // Simulate progress (real progress requires XHR, not fetch)
      const progressInterval = setInterval(() => {
        if (this.uploadProgress < 85) this.uploadProgress += 10;
      }, 300);

      try {
        const id = await uploadVideoFile(file);
        this.uploadProgress = 100;
        this.video_id = id;
        this.showToast('Video muvaffaqiyatli yuklandi ✓', 'success');
      } catch (e) {
        this.errorMessage = e.message;
        this.video_id = null;
        this.showToast(e.message, 'error');
      } finally {
        clearInterval(progressInterval);
        this.isUploading = false;
      }
    },

    // ── Link tab ──────────────────────────────────────────────────────
    async handleLinkSubmit() {
      const link = this.videoLink.trim();
      this.errorMessage = '';
      this.successMessage = '';

      try {
        validateUrl(link);
      } catch (e) {
        this.errorMessage = e.message;
        return;
      }

      this.isSubmittingLink = true;
      this.video_id = null;

      try {
        const id = await uploadVideoByLink(link);
        this.video_id = id;
        this.videoLink = ''; // spec: don't keep link in state
        this.showToast('Video muvaffaqiyatli saqlandi ✓', 'success');
      } catch (e) {
        this.errorMessage = e.message;
        this.video_id = null;
        this.showToast(e.message, 'error');
      } finally {
        this.isSubmittingLink = false;
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.npv {
  font-family: 'Inter', sans-serif;
  width: 100%;
  padding-bottom: 2rem;
}

.npv__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

/* ── Tabs ─────────────────────────────────────────────────────────── */
.npv__tabs {
  display: flex;
}

.npv__tab {
  padding: 12px 22px;
  background: #f9fafb;
  border: 1px solid #dfe2e9;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.npv__tab--active {
  background: #fff;
  color: #22c55e;
  border-bottom-color: #fff;
  z-index: 1;
}

.npv__tab--disabled {
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ── Content Area ─────────────────────────────────────────────────── */
.npv__content {
  background: #fff;
  border: 1px solid #dfe2e9;
  border-radius: 0 12px 12px 12px;
  padding: 24px;
  margin-top: -1px;
}

.npv__tab-content {
  margin-top: 20px;
}

/* ── Info Grid ────────────────────────────────────────────────────── */
.npv__info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 4px;
}

.npv__info-box {
  border: 1px solid #dfe2e9;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.npv__info-box--green { background: linear-gradient(90deg, #ecfdf5, #fff); }
.npv__info-box--yellow { background: linear-gradient(90deg, #fffbeb, #fff); }

.npv__icon-wrap {
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
}

.npv__info-icon { width: 16px; height: 16px; }
.npv__info-icon--green { color: #10b981; }
.npv__info-icon--orange { color: #f59e0b; }
.npv__info-text { font-size: 13px; color: #374151; line-height: 1.5; margin: 0; }

/* ── Upload Box ───────────────────────────────────────────────────── */
.npv__file-input { display: none; }

.npv__upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed #dfe2e9;
  border-radius: 14px;
  min-height: 160px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
}

.npv__upload-box:hover:not(.npv__upload-box--disabled) {
  border-color: #22c55e;
  background: #f0fdf4;
}

.npv__upload-box--dragover {
  border-color: #22c55e;
  background: #f0fdf4;
}

.npv__upload-box--disabled {
  background: #f8fafc;
  cursor: not-allowed;
  opacity: 0.6;
}

.npv__upload-icon {
  width: 40px;
  height: 40px;
  color: #22c55e;
}

.npv__upload-text {
  font-size: 14px;
  font-weight: 600;
  color: #22c55e;
}

.npv__upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

/* ── Progress ─────────────────────────────────────────────────────── */
.npv__progress-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.npv__progress-bar-wrap {
  width: 180px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
}

.npv__progress-bar {
  height: 100%;
  background: #22c55e;
  border-radius: 99px;
  transition: width 0.3s ease;
}

/* ── Spinner ──────────────────────────────────────────────────────── */
.npv__spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #22c55e;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.npv__spinner-sm {
  width: 15px;
  height: 15px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Error ────────────────────────────────────────────────────────── */
.npv__error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 10px;
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
}

.npv__error-icon { width: 16px; height: 16px; flex-shrink: 0; }

/* ── Preview ──────────────────────────────────────────────────────── */
.npv__preview-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 20px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 14px;
}

.npv__preview-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}

.npv__badge-icon { width: 18px; height: 18px; }

.npv__preview-id {
  font-size: 13px;
  color: #374151;
  margin: 0;
}

.npv__preview-id code {
  background: #e5e7eb;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
}

.npv__remove-btn {
  padding: 7px 16px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #ef4444;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.npv__remove-btn:hover { background: #fee2e2; }

/* ── Link Tab ─────────────────────────────────────────────────────── */
.npv__link-group {
  display: flex;
  gap: 10px;
}

.npv__link-input {
  flex: 1;
  height: 44px;
  border: 1.5px solid #dfe2e9;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  color: #1f2937;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}

.npv__link-input:focus { border-color: #22c55e; }
.npv__link-input--error { border-color: #ef4444; }
.npv__link-input::placeholder { color: #9ca3af; }
.npv__link-input:disabled { background: #f8fafc; cursor: not-allowed; }

.npv__link-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 22px;
  height: 44px;
  background: #fff;
  border: 1.5px solid #22c55e;
  color: #22c55e;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.2s;
}

.npv__link-btn:hover:not(:disabled) { background: #f0fdf4; }
.npv__link-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.npv__link-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.6;
}

.npv__link-hint code {
  background: #f3f4f6;
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .npv__info-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .npv__link-group { flex-direction: column; }
  .npv__link-btn { width: 100%; justify-content: center; }
}
</style>
