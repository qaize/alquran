<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/ico" href="{{asset('img/quran.png')}}" />

    {{-- Google Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{asset('css/styles.css')}}">
    <script
      src="https://kit.fontawesome.com/4cbbb9fb69.js"
      crossorigin="anonymous"
      defer
    ></script>

    <title>Al-Qur'an Digital</title>
  </head>
  <body>

    {{-- Three-column layout wrapper --}}
    <div class="app-wrapper">

      {{-- LEFT SIDEBAR: Navigation --}}
      <aside class="sidebar-left">
        <div class="sidebar-logo">
          <div class="logo-ornament">☽</div>
          <span class="logo-text">Al-Qur'an</span>
        </div>

        <nav class="sidebar-nav">
          <a href="/" class="nav-item active">
            <i class="fa-solid fa-house nav-icon"></i>
            <span data-i18n="nav_home">Beranda</span>
          </a>
          <a href="#" class="nav-item" id="nav-juz-btn">
            <i class="fa-solid fa-book-open nav-icon"></i>
            <span data-i18n="nav_juz">Juz</span>
          </a>
          <a href="#" class="nav-item" id="nav-last-read-btn">
            <i class="fa-solid fa-clock-rotate-left nav-icon"></i>
            <span data-i18n="nav_last_read">Terakhir Dibaca</span>
            <span id="last-read-badge" class="last-read-badge" style="display:none;"></span>
          </a>
          <a href="#" class="nav-item" id="nav-last-bookmark-btn">
            <i class="fa-solid fa-bookmark nav-icon"></i>
            <span data-i18n="nav_bookmark">Bookmark</span>
            <span id="bookmark-count-badge" class="last-read-badge" style="display:none;"></span>
          </a>
          <a href="#" class="nav-item" id="open-settings-btn">
            <i class="fa-solid fa-gear nav-icon"></i>
            <span data-i18n="nav_settings">Pengaturan</span>
          </a>
        </nav>

        <div class="sidebar-footer-info">
          <div class="ornament-divider">﴾ ✦ ﴿</div>
          <p class="data-source-label" data-i18n="data_source_label">Data berdasarkan:</p>
          <a href="https://equran.id/" target="_blank" class="data-source-link">equran.id</a>
        </div>
      </aside>

      {{-- CENTER COLUMN: Search + Content --}}
      <main class="main-content">

        {{-- Mobile top bar --}}
        <div class="mobile-topbar">
          <button class="burger-btn" id="burger-left-btn" data-i18n-title="menu" title="Menu">
            <i class="fa-solid fa-bars"></i>
          </button>
          <span class="mobile-logo">☽ Al-Qur'an</span>
          <button class="burger-btn" id="burger-right-btn" data-i18n-title="favorites_bookmark" title="Favorit & Bookmark">
            <i class="fa-solid fa-star"></i>
          </button>
        </div>

        @yield('search')

        <div class="info" id="info-section">
          <div class="info-inner">
            <span class="info-ornament">﷽</span>
          </div>
          <p class="info-subtitle" data-i18n="bismillah_subtitle">Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
        </div>

        @yield('surah')
        @yield('content')
      </main>

      {{-- RIGHT SIDEBAR: Favorites + Last Bookmark (tabbed) --}}
      <aside class="sidebar-right">

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

    </div>{{-- .app-wrapper --}}

    <footer class="footer">
      <span class="footer-ornament">❋</span>
      <h3>Copyright © Al-Qur'an Digital 2024</h3>
      <span class="footer-ornament">❋</span>
    </footer>

    <div id="loading-screen">
      <div class="loader-ring">
        <div class="loader-ornament">☽</div>
      </div>
      <p class="loading-text" data-i18n="loading">Memuat data...</p>
    </div>

    {{-- JUZ PANEL --}}
    <div id="juz-panel-overlay" class="juz-panel-overlay">
      <div class="juz-panel">
        <div class="juz-panel-header">
          <div class="juz-panel-title">
            <i class="fa-solid fa-book-open"></i>
            <h3 data-i18n="juz_title">Daftar Juz</h3>
            <span class="juz-panel-subtitle" data-i18n="juz_subtitle">Al-Qur'an 30 Juz</span>
          </div>
          <button id="close-juz-panel-btn" class="settings-close-btn" data-i18n-title="close" title="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div id="juz-panel-list" class="juz-panel-list">
          {{-- Populated by JS --}}
        </div>
      </div>
    </div>

    {{-- Mobile drawer backdrop --}}
    <div id="drawer-backdrop" class="drawer-backdrop"></div>

    {{-- SETTINGS MODAL --}}
    <div id="settings-overlay" class="settings-overlay">
      <div class="settings-panel">

        <div class="settings-header">
          <div class="settings-title">
            <i class="fa-solid fa-gear"></i>
            <h3 data-i18n="settings_title">Pengaturan</h3>
          </div>
          <button id="close-settings-btn" class="settings-close-btn" data-i18n-title="close" title="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        {{-- Font Size --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-text-height"></i>
            <span data-i18n="settings_font_size">Ukuran Teks Arab</span>
          </label>
          <div class="font-size-controls">
            <button class="font-btn" id="font-decrease" data-i18n-title="font_decrease" title="Perkecil">A−</button>
            <span id="font-size-display" class="font-size-display">36px</span>
            <button class="font-btn" id="font-increase" data-i18n-title="font_increase" title="Perbesar">A+</button>
          </div>
          <input type="range" id="font-size-slider" class="settings-slider"
            min="24" max="64" step="2" value="36">
        </div>

        {{-- Background Color --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-palette"></i>
            <span data-i18n="settings_bg_color">Warna Latar Bacaan</span>
          </label>
          <div class="bg-color-options">
            <button class="bg-option" data-color="#ffffff" data-name-id="Putih" data-name-en="White" style="background:#ffffff;" title="Putih">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#fdf6e3" data-name-id="Krem Hangat" data-name-en="Warm Cream" style="background:#fdf6e3;" title="Krem Hangat">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#f5f0e8" data-name-id="Putih Antik" data-name-en="Antique White" style="background:#f5f0e8;" title="Putih Antik">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#eef4f8" data-name-id="Biru Muda" data-name-en="Cool Blue" style="background:#eef4f8;" title="Biru Muda">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#f0ede6" data-name-id="Krem Pasir" data-name-en="Sand Beige" style="background:#f0ede6;" title="Krem Pasir">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option bg-option-dark" data-color="#1a2e45" data-name-id="Biru Gelap" data-name-en="Dark Navy" style="background:#1a2e45;" title="Biru Gelap">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
          </div>
          <p class="settings-selected-label"><span data-i18n="settings_selected">Dipilih:</span> <span id="bg-selected-name">Putih</span></p>
        </div>

        {{-- Language Toggle --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-language"></i>
            <span data-i18n="settings_language">Bahasa Antarmuka</span>
          </label>
          <div class="lang-options">
            <button class="lang-btn active" id="lang-id-btn" data-lang="id">
              🇮🇩 Indonesia
            </button>
            <button class="lang-btn" id="lang-en-btn" data-lang="en">
              🇬🇧 English
            </button>
          </div>
        </div>

        {{-- Reset --}}
        <div class="settings-section settings-footer-row">
          <button id="settings-reset-btn" class="settings-reset-btn">
            <i class="fa-solid fa-rotate-left"></i> <span data-i18n="settings_reset">Reset ke Default</span>
          </button>
        </div>

      </div>
    </div>

    {{-- FULL BOOKMARK PANEL --}}
    <div id="bookmark-panel-overlay" class="bookmark-panel-overlay">
      <div class="bookmark-panel">

        <div class="bookmark-panel-header">
          <div class="bookmark-panel-title">
            <i class="fa-solid fa-bookmark"></i>
            <h3 data-i18n="bm_panel_title">Bookmark Ayat Saya</h3>
            <span id="bookmark-panel-count" class="bookmark-panel-count">0 <span data-i18n="ayat_word">ayat</span></span>
          </div>
          <button id="close-bookmark-panel-btn" class="settings-close-btn" data-i18n-title="close" title="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="bookmark-panel-toolbar">
          <input type="text" id="bookmark-search-input" class="bookmark-search"
            data-i18n-placeholder="bm_search_placeholder" placeholder="Cari surah atau teks ayat...">
          <button id="bookmark-clear-all-btn" class="bookmark-clear-btn" data-i18n-title="bm_clear_all" title="Hapus semua bookmark">
            <i class="fa-solid fa-trash-can"></i> <span data-i18n="bm_clear_all">Hapus Semua</span>
          </button>
        </div>

        <div id="bookmark-panel-list" class="bookmark-panel-list">
          {{-- Populated by JS --}}
        </div>

        <div id="bookmark-panel-empty" class="bookmark-panel-empty" style="display:none;">
          <i class="fa-regular fa-bookmark"></i>
          <p data-i18n="bm_panel_empty">Belum ada ayat yang disimpan.</p>
          <small data-i18n="bm_panel_empty_hint">
            Cara menyimpan bookmark:<br>
            1. Buka salah satu surah<br>
            2. Arahkan kursor ke ayat yang disukai<br>
            3. Klik tombol 🔖 yang muncul di samping nomor ayat<br><br>
            Ayat tersimpan bisa dibuka kembali kapan saja dari menu ini.
          </small>
        </div>

      </div>
    </div>

    @yield('script')

  </body>
</html>
