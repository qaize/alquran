{{-- FAVORITES PANEL --}}
<div id="favorites-panel-overlay" class="favorites-panel-overlay">
  <div class="favorites-panel">

    <div class="favorites-panel-header">
      <div class="favorites-panel-title">
        <i class="fa-solid fa-star"></i>
        <h3 data-i18n="nav_favorites">Favorit</h3>
        <span id="favorites-panel-count" class="bookmark-panel-count">0</span>
      </div>
      <button id="close-favorites-panel-btn" class="settings-close-btn" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div id="favorites-panel-list" class="favorites-panel-list">
      {{-- Populated by JS --}}
    </div>

    <div id="favorites-panel-empty" class="bookmark-panel-empty" style="display:none;">
      <i class="fa-regular fa-star"></i>
      <p data-i18n="fav_empty">Belum ada favorit.</p>
      <small data-i18n="fav_empty_hint">Klik ★ pada kartu surah untuk menambahkan.</small>
    </div>

  </div>
</div>
