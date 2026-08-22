{{-- FULL BOOKMARK PANEL --}}
<div id="bookmark-panel-overlay" class="bookmark-panel-overlay">
  <div class="bookmark-panel">

    <div class="bookmark-panel-header">
      <div class="bookmark-panel-title">
        <i class="fa-solid fa-bookmark"></i>
        <h3 data-i18n="bm_panel_title">Bookmark Saya</h3>
        <span id="bookmark-panel-count" class="bookmark-panel-count">0</span>
      </div>
      <button id="close-bookmark-panel-btn" class="settings-close-btn" data-i18n-title="close" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    {{-- Tab selector --}}
    <div class="bm-panel-tabs">
      <button class="bm-panel-tab active" id="bm-tab-ayat" data-tab="ayat">
        <i class="fa-solid fa-book-quran"></i>
        <span data-i18n="bm_tab_ayat">Ayat</span>
        <span class="bm-tab-count" id="bm-count-ayat">0</span>
      </button>
      <button class="bm-panel-tab" id="bm-tab-hadist" data-tab="hadist">
        <i class="fa-solid fa-scroll"></i>
        <span data-i18n="bm_tab_hadist">Hadits</span>
        <span class="bm-tab-count" id="bm-count-hadist">0</span>
      </button>
    </div>

    <div class="bookmark-panel-toolbar">
      <input type="text" id="bookmark-search-input" class="bookmark-search"
        placeholder="Cari bookmark...">
      <button id="bookmark-clear-all-btn" class="bookmark-clear-btn" title="Hapus semua">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>

    {{-- Ayat list --}}
    <div id="bookmark-panel-list" class="bookmark-panel-list bm-panel-section active">
      {{-- Populated by JS --}}
    </div>
    <div id="bookmark-panel-empty" class="bookmark-panel-empty" style="display:none;">
      <i class="fa-regular fa-bookmark"></i>
      <p data-i18n="bm_ayat_empty">Belum ada ayat yang disimpan.</p>
      <small data-i18n="bm_ayat_empty_hint">Buka surah → arahkan ke ayat → klik 🔖</small>
    </div>

    {{-- Hadist list --}}
    <div id="bookmark-hadist-list" class="bookmark-panel-list bm-panel-section" style="display:none;">
      {{-- Populated by JS --}}
    </div>
    <div id="bookmark-hadist-empty" class="bookmark-panel-empty" style="display:none;">
      <i class="fa-regular fa-bookmark"></i>
      <p data-i18n="bm_hadist_empty">Belum ada hadist yang disimpan.</p>
      <small data-i18n="bm_hadist_empty_hint">Buka panel Hadist → detail → klik 🔖</small>
    </div>

  </div>
</div>
