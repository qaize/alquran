{{-- Banner --}}
<div class="banner">
  <a href="/">
    <div class="banner-ornament-top">﴾ بِسْمِ اللّٰهِ ﴿</div>
    <h1 class="banner-title"><span class="banner-a">Al</span> <span class="banner-q">Quran</span></h1>
    <p class="banner-subtitle" data-i18n="banner_subtitle">Bacaan Mulia, Panduan Abadi</p>
  </a>
  {{-- Widget waktu sholat khusus mobile --}}
  <div id="prayer-time-widget-mobile" class="prayer-time-widget-mobile"></div>
</div>

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
