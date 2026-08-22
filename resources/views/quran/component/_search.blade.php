{{-- Search Bar --}}
<div class="search-wrapper">
  <div class="search-container">
    <div id="search">
      <i class="fa-solid fa-magnifying-glass search-prefix-icon"></i>
      <input
        id="search-input"
        type="text"
        data-i18n-placeholder="search_placeholder"
        placeholder="Cari surah, nomor, atau arti..."
        autocomplete="off"
      />
      <button id="search-clear" class="search-clear-btn" title="Hapus pencarian" style="display:none;">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button id="search-button" data-i18n="search_btn">Cari</button>
    </div>
    <div class="suggestion" id="search-suggestion"></div>
  </div>
</div>

{{-- Widget waktu sholat — mobile only, di bawah search bar --}}
<div id="prayer-time-widget-mobile" class="prayer-time-widget-mobile"></div>
