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
            <span>Home</span>
          </a>
          <a href="#" class="nav-item">
            <i class="fa-solid fa-book-open nav-icon"></i>
            <span>Juz</span>
          </a>
          <a href="#" class="nav-item" id="nav-last-read-btn">
            <i class="fa-solid fa-clock-rotate-left nav-icon"></i>
            <span>Last Read</span>
            <span id="last-read-badge" class="last-read-badge" style="display:none;"></span>
          </a>
          <a href="#" class="nav-item" id="nav-last-bookmark-btn">
            <i class="fa-solid fa-bookmark nav-icon"></i>
            <span>Last Bookmark</span>
            <span id="bookmark-count-badge" class="last-read-badge" style="display:none;"></span>
          </a>
          <a href="#" class="nav-item" id="open-settings-btn">
            <i class="fa-solid fa-gear nav-icon"></i>
            <span>Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer-info">
          <div class="ornament-divider">﴾ ✦ ﴿</div>
          <p class="data-source-label">Data berdasarkan:</p>
          <a href="https://equran.id/" target="_blank" class="data-source-link">equran.id</a>
        </div>
      </aside>

      {{-- CENTER COLUMN: Search + Content --}}
      <main class="main-content">
        @yield('search')

        <div class="info" id="info-section">
          <div class="info-inner">
            <span class="info-ornament">﷽</span>
          </div>
        </div>

        @yield('surah')
        @yield('content')
      </main>

      {{-- RIGHT SIDEBAR: Favorites + Last Bookmark (tabbed) --}}
      <aside class="sidebar-right">

        {{-- Tab buttons --}}
        <div class="sidebar-tabs">
          <button class="sidebar-tab active" data-tab="favorites">
            <i class="fa-solid fa-star"></i> Favorit
          </button>
          <button class="sidebar-tab" data-tab="bookmarks">
            <i class="fa-solid fa-bookmark"></i> Bookmark
          </button>
        </div>

        {{-- Tab: Favorites --}}
        <div class="sidebar-tab-content active" id="tab-favorites">
          <div id="favorites-list" class="favorites-list">
            <div class="favorites-empty" id="favorites-empty">
              <i class="fa-regular fa-star empty-star-icon"></i>
              <p>Belum ada favorit.</p>
              <small>Klik ★ pada kartu surah untuk menambahkan.</small>
            </div>
          </div>
        </div>

        {{-- Tab: Last Bookmark --}}
        <div class="sidebar-tab-content" id="tab-bookmarks">
          <div id="bookmarks-list" class="bookmarks-list">
            <div class="bookmarks-empty" id="bookmarks-empty">
              <i class="fa-regular fa-bookmark empty-star-icon"></i>
              <p>Belum ada bookmark.</p>
              <small>Hover ayat lalu klik 🔖 untuk menyimpan.</small>
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
      <p class="loading-text">Memuat data...</p>
    </div>

    {{-- SETTINGS MODAL --}}
    <div id="settings-overlay" class="settings-overlay">
      <div class="settings-panel">

        <div class="settings-header">
          <div class="settings-title">
            <i class="fa-solid fa-gear"></i>
            <h3>Pengaturan</h3>
          </div>
          <button id="close-settings-btn" class="settings-close-btn" title="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        {{-- Font Size --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-text-height"></i>
            Ukuran Teks Arab
          </label>
          <div class="font-size-controls">
            <button class="font-btn" id="font-decrease" title="Perkecil">A−</button>
            <span id="font-size-display" class="font-size-display">36px</span>
            <button class="font-btn" id="font-increase" title="Perbesar">A+</button>
          </div>
          <input type="range" id="font-size-slider" class="settings-slider"
            min="24" max="64" step="2" value="36">
        </div>

        {{-- Background Color --}}
        <div class="settings-section">
          <label class="settings-label">
            <i class="fa-solid fa-palette"></i>
            Warna Background Bacaan
          </label>
          <div class="bg-color-options">
            <button class="bg-option" data-color="#ffffff" data-name="Putih" style="background:#ffffff;" title="Putih">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#fdf6e3" data-name="Warm Cream" style="background:#fdf6e3;" title="Warm Cream">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#f5f0e8" data-name="Antique White" style="background:#f5f0e8;" title="Antique White">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#eef4f8" data-name="Cool Blue Tint" style="background:#eef4f8;" title="Cool Blue Tint">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option" data-color="#f0ede6" data-name="Sand Beige" style="background:#f0ede6;" title="Sand Beige">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
            <button class="bg-option bg-option-dark" data-color="#1a2e45" data-name="Dark Navy" style="background:#1a2e45;" title="Dark Navy">
              <span class="bg-check"><i class="fa-solid fa-check"></i></span>
            </button>
          </div>
          <p class="settings-selected-label">Dipilih: <span id="bg-selected-name">Putih</span></p>
        </div>

        {{-- Reset --}}
        <div class="settings-section settings-footer-row">
          <button id="settings-reset-btn" class="settings-reset-btn">
            <i class="fa-solid fa-rotate-left"></i> Reset ke Default
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
            <h3>Bookmark Ayat Saya</h3>
            <span id="bookmark-panel-count" class="bookmark-panel-count">0 ayat</span>
          </div>
          <button id="close-bookmark-panel-btn" class="settings-close-btn" title="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="bookmark-panel-toolbar">
          <input type="text" id="bookmark-search-input" class="bookmark-search"
            placeholder="Cari surah atau teks ayat...">
          <button id="bookmark-clear-all-btn" class="bookmark-clear-btn" title="Hapus semua bookmark">
            <i class="fa-solid fa-trash-can"></i> Hapus Semua
          </button>
        </div>

        <div id="bookmark-panel-list" class="bookmark-panel-list">
          {{-- Populated by JS --}}
        </div>

        <div id="bookmark-panel-empty" class="bookmark-panel-empty" style="display:none;">
          <i class="fa-regular fa-bookmark"></i>
          <p>Belum ada bookmark tersimpan.</p>
          <small>Double-click ayat lalu klik 🔖 saat hover untuk menyimpan.</small>
        </div>

      </div>
    </div>

    @yield('script')

  </body>
</html>
