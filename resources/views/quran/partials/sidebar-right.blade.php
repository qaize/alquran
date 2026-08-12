{{-- RIGHT SIDEBAR: Favorites + Last Bookmark (tabbed) --}}
<aside class="sidebar-right" id="sidebar-right">

  {{-- Toggle collapse button --}}
  <button class="sidebar-right-toggle" id="sidebar-right-toggle" title="Sembunyikan sidebar">
    <i class="fa-solid fa-chevron-right"></i>
  </button>

  {{-- Tab buttons --}}
  <div class="sidebar-tabs">
    <button class="sidebar-tab active" data-tab="favorites">
      <i class="fa-solid fa-star"></i> <span data-i18n="tab_favorites">Favorit</span>
    </button>
    <button class="sidebar-tab" data-tab="bookmarks">
      <i class="fa-solid fa-bookmark"></i> <span data-i18n="tab_bookmarks">Bookmark</span>
    </button>
  </div>

  {{-- Tab: Favorites --}}
  <div class="sidebar-tab-content active" id="tab-favorites">
    <div id="favorites-list" class="favorites-list">
      <div class="favorites-empty" id="favorites-empty">
        <i class="fa-regular fa-star empty-star-icon"></i>
        <p data-i18n="fav_empty">Belum ada favorit.</p>
        <small data-i18n="fav_empty_hint">Klik ★ pada kartu surah untuk menambahkan.</small>
      </div>
    </div>
  </div>

  {{-- Tab: Last Bookmark --}}
  <div class="sidebar-tab-content" id="tab-bookmarks">
    <div id="bookmarks-list" class="bookmarks-list">
      <div class="bookmarks-empty" id="bookmarks-empty">
        <i class="fa-regular fa-bookmark empty-star-icon"></i>
        <p data-i18n="bm_empty">Belum ada bookmark.</p>
        <small data-i18n="bm_empty_hint">Buka surah, lalu arahkan kursor ke ayat yang ingin disimpan — tombol 🔖 akan muncul di samping nomor ayat.</small>
      </div>
    </div>
  </div>

</aside>

{{-- Tombol expand sidebar kanan (muncul saat collapsed) --}}
<button class="sidebar-right-expand" id="sidebar-right-expand" title="Tampilkan sidebar">
  <i class="fa-solid fa-chevron-left"></i>
</button>
