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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"/>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <script
      src="https://kit.fontawesome.com/4cbbb9fb69.js"
      crossorigin="anonymous"
      defer
    ></script>

    <title>Al Quran Digital</title>
  </head>
  <body>

    {{-- Three-column layout wrapper --}}
    <div class="app-wrapper">

      {{-- LEFT SIDEBAR: Navigation --}}
      <aside class="sidebar-left sidebar-left-enter">
        <div class="sidebar-logo">
          <div class="logo-ornament">☽</div>
          <span class="logo-text">Al Quran</span>
        </div>

        <nav class="sidebar-nav">
          <a href="/" class="nav-item active">
            <i class="fa-solid fa-house nav-icon"></i>
            <span data-i18n="nav_home">Beranda</span>
          </a>
          <a href="#" class="nav-item" id="nav-janji-allah-btn">
            <i class="fa-solid fa-star-and-crescent nav-icon"></i>
            <span>Janji Allah</span>
          </a>
          <a href="#" class="nav-item" id="nav-hadist-btn">
            <i class="fa-solid fa-scroll nav-icon"></i>
            <span>Hadist</span>
          </a>
          <a href="#" class="nav-item" id="nav-juz-btn">
            <i class="fa-solid fa-book-open nav-icon"></i>
            <span data-i18n="nav_juz">Juz</span>
          </a>

          {{-- Terakhir Dibaca: expandable dropdown --}}
          <div class="nav-dropdown" id="nav-lastread-dropdown">
            <button class="nav-item nav-dropdown-trigger" id="nav-last-read-btn">
              <i class="fa-solid fa-clock-rotate-left nav-icon"></i>
              <span data-i18n="nav_last_read">Terakhir Dibaca</span>
              <span id="last-read-badge" class="last-read-badge" style="display:none;"></span>
              <i class="fa-solid fa-chevron-down nav-dropdown-arrow" id="lastread-arrow"></i>
            </button>
            <div class="nav-dropdown-body" id="lastread-dropdown-body">
              <div id="lr-category-list" class="lr-category-list">
                {{-- Populated by JS --}}
              </div>
              <button class="lr-add-btn" id="lr-add-category-btn">
                <i class="fa-solid fa-plus"></i>
                <span data-i18n="lr_add_category">Tambah Kategori</span>
              </button>
            </div>
          </div>

          <a href="#" class="nav-item" id="nav-favorites-btn">
            <i class="fa-solid fa-star nav-icon"></i>
            <span data-i18n="nav_favorites">Favorit</span>
            <span id="favorites-count-badge" class="last-read-badge" style="display:none;"></span>
          </a>

          <a href="#" class="nav-item" id="nav-last-bookmark-btn">
            <i class="fa-solid fa-bookmark nav-icon"></i>
            <span data-i18n="nav_bookmark">Bookmark</span>
            <span id="bookmark-count-badge" class="last-read-badge" style="display:none;"></span>
          </a>
          <a href="#" class="nav-item" id="nav-tajwid-guide-btn">
            <i class="fa-solid fa-graduation-cap nav-icon"></i>
            <span data-i18n="nav_tajwid_guide">Panduan Tajwid</span>
          </a>
          <a href="#" class="nav-item" id="open-settings-btn">
            <i class="fa-solid fa-gear nav-icon"></i>
            <span data-i18n="nav_settings">Pengaturan</span>
          </a>
        </nav>

        <div class="sidebar-footer-info">
          <div class="ornament-divider">﴾ ✦ ﴿</div>
          <button class="data-source-btn" id="open-datasource-btn">
            <i class="fa-solid fa-database"></i>
            <span data-i18n="data_source_label">Sumber Data</span>
          </button>
        </div>
      </aside>

      {{-- CENTER COLUMN: Search + Content --}}
      <main class="main-content">

        {{-- Mobile top bar --}}
        <div class="mobile-topbar">
          <button class="burger-btn" id="burger-left-btn" data-i18n-title="menu" title="Menu">
            <i class="fa-solid fa-bars"></i>
          </button>
          <span class="mobile-logo">☽ Al Quran</span>
          <button class="burger-btn" id="topbar-darkmode-btn" title="Toggle Dark Mode">
            <i class="fa-solid fa-moon"></i>
          </button>
          <button class="burger-btn" id="usage-footer-btn-mobile" title="Data Usage">
            <i class="fa-solid fa-chart-pie"></i>
            <span class="usage-badge usage-badge-mobile" id="usage-badge-mobile" style="display:none;">0B</span>
          </button>
          <button class="burger-btn" id="burger-right-btn" data-i18n-title="favorites_bookmark" title="Favorit & Bookmark">
            <i class="fa-solid fa-star"></i>
          </button>
        </div>

        @yield('search')

        <div class="info animate__animated animate__fadeIn" id="info-section" style="animation-duration:1s;">
          <div class="info-inner animate__animated animate__zoomIn" style="animation-delay:0.2s;animation-duration:0.8s;">
            <span class="info-ornament">﷽</span>
          </div>
          <p class="info-subtitle animate__animated animate__fadeInUp" style="animation-delay:0.5s;animation-duration:0.6s;" data-i18n="bismillah_subtitle">Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
        </div>

        @yield('surah')
        @yield('content')
      </main>

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

    </div>{{-- .app-wrapper --}}

    <footer class="footer">
      <span class="footer-ornament">❋</span>
      <h3>Copyright © Al Quran Digital 2026</h3>
      <span class="footer-ornament">❋</span>
      <button class="usage-footer-btn" id="usage-footer-btn" title="Data Usage">
        <i class="fa-solid fa-chart-pie"></i>
        <span class="usage-badge" id="usage-badge" style="display:none;">0 B</span>
      </button>
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
            <span class="juz-panel-subtitle" data-i18n="juz_subtitle">Al Quran 30 Juz</span>
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

        <div class="settings-panel-body">

        {{-- FONT GROUP — expandable --}}
        <div class="settings-group" id="settings-group-font">
          <button class="settings-group-trigger" id="settings-group-font-btn">
            <div class="settings-group-trigger-left">
              <i class="fa-solid fa-font"></i>
              <span data-i18n="settings_font_group">Pengaturan Font</span>
            </div>
            <i class="fa-solid fa-chevron-down settings-group-arrow" id="settings-group-font-arrow"></i>
          </button>
          <div class="settings-group-body" id="settings-group-font-body">

        {{-- Font Size Arab --}}
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
          <p class="settings-preview settings-preview-arab" id="arab-size-preview" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ</p>
        </div>

        {{-- Font Size Latin --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-italic"></i>
            <span data-i18n="settings_latin_font_size">Ukuran Teks Latin</span>
          </label>
          <div class="font-size-controls">
            <button class="font-btn" id="latin-font-decrease" title="Perkecil">A−</button>
            <span id="latin-font-size-display" class="font-size-display">13px</span>
            <button class="font-btn" id="latin-font-increase" title="Perbesar">A+</button>
          </div>
          <input type="range" id="latin-font-size-slider" class="settings-slider"
            min="11" max="20" step="1" value="13">
          <p class="settings-preview settings-preview-latin" id="latin-size-preview">Bismillāhir-raḥmānir-raḥīm</p>
        </div>

        {{-- Font Size Terjemahan --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-book-open-reader"></i>
            <span data-i18n="settings_translation_font_size">Ukuran Teks Terjemahan</span>
          </label>
          <div class="font-size-controls">
            <button class="font-btn" id="trans-font-decrease" title="Perkecil">A−</button>
            <span id="trans-font-size-display" class="font-size-display">13px</span>
            <button class="font-btn" id="trans-font-increase" title="Perbesar">A+</button>
          </div>
          <input type="range" id="trans-font-size-slider" class="settings-slider"
            min="11" max="20" step="1" value="13">
          <p class="settings-preview settings-preview-trans" id="trans-size-preview">Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
        </div>

        {{-- Jenis Font Arab --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-pen-nib"></i>
            <span data-i18n="settings_arab_font">Jenis Font Arab</span>
          </label>
          <select id="arab-font-select" class="settings-select">
            <option value="Amiri Quran">Amiri Quran</option>
            <option value="Scheherazade">Scheherazade</option>
            <option value="Noorehuda">Noorehuda</option>
            <option value="KFGQPC Hafs">KFGQPC Hafs (Uthmani)</option>
            <option value="Noto Naskh Arabic">Noto Naskh Arabic</option>
          </select>
          <p class="settings-preview settings-preview-arab" id="arab-font-preview" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
        </div>

          </div>{{-- .settings-group-body --}}
        </div>{{-- .settings-group --}}

        {{-- Warna Latar --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-palette"></i>
            <span data-i18n="settings_bg_color">Tema Warna Latar</span>
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

        {{-- Dark Mode --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-moon"></i>
            <span data-i18n="settings_dark_mode">Mode Gelap</span>
          </label>
          <div class="tajweed-toggle-wrap">
            <label class="toggle-switch">
              <input type="checkbox" id="dark-mode-toggle">
              <span class="toggle-slider"></span>
            </label>
            <span class="dark-mode-toggle-label" id="dark-mode-toggle-label" data-i18n="dark_mode_off">Nonaktif</span>
          </div>
          <p class="settings-hint" data-i18n="settings_dark_mode_hint">Tampilan latar gelap, nyaman untuk membaca di malam hari.</p>
        </div>

        {{-- Bahasa --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-globe"></i>
            <span data-i18n="settings_language">Bahasa Tampilan</span>
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

        {{-- Tajwid Berwarna --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span data-i18n="settings_tajweed">Warna Tajwid</span>
          </label>
          <div class="tajweed-toggle-wrap">
            <label class="toggle-switch">
              <input type="checkbox" id="tajweed-toggle">
              <span class="toggle-slider"></span>
            </label>
            <span class="tajweed-toggle-label" id="tajweed-toggle-label" data-i18n="tajweed_off">Nonaktif</span>
          </div>
          <p class="settings-hint" data-i18n="settings_tajweed_hint">Mewarnai huruf Arab sesuai hukum bacaan tajwid.</p>
          <div class="tajweed-legend" id="tajweed-legend" style="display:none;">
            <h4 class="tajweed-legend-title"><i class="fa-solid fa-palette"></i> Keterangan Warna Tajwid</h4>

            <div class="tajweed-legend-group">
              <span class="tajweed-group-label">Huruf Tidak Dibaca</span>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#AAAAAA"></span>
                <div class="tj-legend-text">
                  <strong>Hamzat Wasl</strong>
                  <small>Hamzah disambung, tidak dibaca di tengah kalimat</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#AAAAAA"></span>
                <div class="tj-legend-text">
                  <strong>Lam Syamsiyyah</strong>
                  <small>Lam "ال" yang tidak dibaca (idgham ke huruf setelahnya)</small>
                </div>
              </div>
            </div>

            <div class="tajweed-legend-group">
              <span class="tajweed-group-label">Mad (Panjang)</span>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#537FFF"></span>
                <div class="tj-legend-text">
                  <strong>Mad Thabi'i (Normal)</strong>
                  <small>Panjang 2 harakat — mad asli</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#4050FF"></span>
                <div class="tj-legend-text">
                  <strong>Mad Jaiz Munfashil</strong>
                  <small>Panjang 2, 4, atau 6 harakat — boleh dipanjangkan</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#2144C1"></span>
                <div class="tj-legend-text">
                  <strong>Mad Wajib Muttashil</strong>
                  <small>Panjang 4–5 harakat — wajib dipanjangkan</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#000EBC"></span>
                <div class="tj-legend-text">
                  <strong>Mad Lazim</strong>
                  <small>Panjang 6 harakat — wajib penuh</small>
                </div>
              </div>
            </div>

            <div class="tajweed-legend-group">
              <span class="tajweed-group-label">Hukum Nun Mati & Tanwin</span>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#9400A8"></span>
                <div class="tj-legend-text">
                  <strong>Ikhfa Haqiqi</strong>
                  <small>Nun mati/tanwin disembunyikan (samar) + dengung</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#D500B7"></span>
                <div class="tj-legend-text">
                  <strong>Ikhfa Syafawi</strong>
                  <small>Mim mati bertemu Ba — bibir hampir tertutup + dengung</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#26BFFD"></span>
                <div class="tj-legend-text">
                  <strong>Iqlab</strong>
                  <small>Nun mati/tanwin bertemu Ba — berubah jadi Mim + dengung</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#169777"></span>
                <div class="tj-legend-text">
                  <strong>Idgham dengan Ghunnah</strong>
                  <small>Nun mati/tanwin + huruf يَنْمُو — lebur dengan dengung</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#169200"></span>
                <div class="tj-legend-text">
                  <strong>Idgham tanpa Ghunnah</strong>
                  <small>Nun mati/tanwin + ل atau ر — lebur tanpa dengung</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#58B800"></span>
                <div class="tj-legend-text">
                  <strong>Idgham Syafawi (Mimi)</strong>
                  <small>Mim mati bertemu Mim — lebur dengan dengung</small>
                </div>
              </div>
            </div>

            <div class="tajweed-legend-group">
              <span class="tajweed-group-label">Hukum Lainnya</span>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#DD0008"></span>
                <div class="tj-legend-text">
                  <strong>Qalqalah</strong>
                  <small>Memantul pada huruf ق ط ب ج د saat sukun/waqaf</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#FF7E1E"></span>
                <div class="tj-legend-text">
                  <strong>Ghunnah</strong>
                  <small>Dengung 2 harakat pada Nun/Mim bertasydid</small>
                </div>
              </div>
              <div class="tajweed-legend-item">
                <span class="tj-swatch" style="background:#A1A1A1"></span>
                <div class="tj-legend-text">
                  <strong>Idgham Mutajanisain / Mutaqaribain</strong>
                  <small>Huruf makhraj-nya sama/berdekatan — lebur ke huruf kedua</small>
                </div>
              </div>
            </div>

          </div>
        </div>

        {{-- Reset --}}
        {{-- Tampilkan Terjemahan --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-language"></i>
            <span data-i18n="settings_show_trans">Tampilkan Terjemahan</span>
          </label>
          <div class="tajweed-toggle-wrap">
            <label class="toggle-switch">
              <input type="checkbox" id="show-translation-toggle" checked>
              <span class="toggle-slider"></span>
            </label>
            <span id="show-translation-label" data-i18n="trans_visible">Tampil</span>
          </div>
          <p class="settings-hint" data-i18n="settings_show_trans_hint">Tampilkan teks latin dan terjemahan di bawah setiap ayat.</p>
        </div>

        {{-- Pilihan Qori --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-microphone"></i>
            <span data-i18n="settings_qori">Pilihan Qori</span>
          </label>
          <select id="qori-select" class="settings-select">
            <option value="05">Misyari Rasyid Al-Afasy</option>
            <option value="03">Abdurrahman As-Sudais</option>
            <option value="01">Abdullah Al-Juhany</option>
            <option value="02">Abdul Muhsin Al-Qasim</option>
            <option value="04">Ibrahim Al-Dossari</option>
            <option value="06">Yasser Al-Dosari</option>
          </select>
          <p class="settings-hint" data-i18n="settings_qori_hint">Digunakan saat memutar audio murottal per ayat.</p>
        </div>

        {{-- Auto-play --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-list"></i>
            <span data-i18n="settings_autoplay">Auto-play Ayat</span>
          </label>
          <div class="tajweed-toggle-wrap">
            <label class="toggle-switch">
              <input type="checkbox" id="autoplay-toggle">
              <span class="toggle-slider"></span>
            </label>
            <span id="autoplay-label" data-i18n="autoplay_off">Nonaktif</span>
          </div>
          <p class="settings-hint" data-i18n="settings_autoplay_hint">Otomatis putar ayat berikutnya setelah selesai.</p>
        </div>

        <div class="settings-section settings-footer-row">
          {{-- Backup & Restore --}}
          <div class="settings-backup-row">
            <button id="settings-export-btn" class="settings-backup-btn settings-backup-export">
              <i class="fa-solid fa-file-arrow-down"></i>
              <span>Export Backup</span>
            </button>
            <label class="settings-backup-btn settings-backup-import" for="settings-backup-file">
              <i class="fa-solid fa-file-arrow-up"></i>
              <span>Import Backup</span>
            </label>
            <input type="file" id="settings-backup-file" accept=".json" style="display:none;">
          </div>
          <button id="settings-reset-btn" class="settings-reset-btn">
            <i class="fa-solid fa-rotate-left"></i> <span data-i18n="settings_reset">Reset ke Default</span>
          </button>
        </div>

        </div>{{-- .settings-panel-body --}}
      </div>
    </div>

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
            <span>Ayat</span>
            <span class="bm-tab-count" id="bm-count-ayat">0</span>
          </button>
          <button class="bm-panel-tab" id="bm-tab-hadist" data-tab="hadist">
            <i class="fa-solid fa-scroll"></i>
            <span>Hadist</span>
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
          <p>Belum ada ayat yang disimpan.</p>
          <small>Buka surah → arahkan ke ayat → klik 🔖</small>
        </div>

        {{-- Hadist list --}}
        <div id="bookmark-hadist-list" class="bookmark-panel-list bm-panel-section" style="display:none;">
          {{-- Populated by JS --}}
        </div>
        <div id="bookmark-hadist-empty" class="bookmark-panel-empty" style="display:none;">
          <i class="fa-regular fa-bookmark"></i>
          <p>Belum ada hadist yang disimpan.</p>
          <small>Buka panel Hadist → detail → klik 🔖</small>
        </div>

      </div>
    </div>

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

    @yield('script')

    <script>
    /* ── SMOOTH SCROLL — native, compatible dengan CSS Grid layout ── */
    (function initScroll() {
        // Lenis tidak kompatibel dengan layout grid ini (body bukan scroll container)
        // Gunakan native scrollIntoView + scroll-behavior: smooth dari CSS
        // Expose __lenis-compatible API agar kode lain tetap bekerja
        window.__lenis = {
            scrollTo: function(target, opts) {
                if (typeof target === 'number') {
                    window.scrollTo({ top: target, behavior: 'smooth' });
                    return;
                }
                if (typeof target === 'string') {
                    target = document.querySelector(target);
                }
                if (!target) return;
                const offset = (opts && opts.offset) ? opts.offset : -80;
                const rect = target.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({
                    top: rect.top + scrollTop + offset,
                    behavior: 'smooth'
                });
            }
        };
    })();
    </script>

  </body>
</html>
