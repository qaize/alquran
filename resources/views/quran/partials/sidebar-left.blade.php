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
