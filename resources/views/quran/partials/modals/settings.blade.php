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
              <button class="font-btn" id="font-decrease"
                data-i18n-title="font_decrease_arab"
                title="Perkecil ukuran teks Arab">A−</button>
              <span id="font-size-display" class="font-size-display">36px</span>
              <button class="font-btn" id="font-increase"
                data-i18n-title="font_increase_arab"
                title="Perbesar ukuran teks Arab">A+</button>
            </div>
            <input type="range" id="font-size-slider" class="settings-slider"
              min="24" max="64" step="2" value="36"
              title="Geser untuk mengatur ukuran teks Arab">
            <p class="settings-preview settings-preview-arab" id="arab-size-preview" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ</p>
          </div>

          {{-- Font Size Latin --}}
          <div class="settings-section">
            <label class="settings-label">
              <i class="fa-solid fa-italic"></i>
              <span data-i18n="settings_latin_font_size">Ukuran Teks Latin</span>
            </label>
            <div class="font-size-controls">
              <button class="font-btn" id="latin-font-decrease"
                data-i18n-title="font_decrease_latin"
                title="Perkecil ukuran teks Latin">A−</button>
              <span id="latin-font-size-display" class="font-size-display">13px</span>
              <button class="font-btn" id="latin-font-increase"
                data-i18n-title="font_increase_latin"
                title="Perbesar ukuran teks Latin">A+</button>
            </div>
            <input type="range" id="latin-font-size-slider" class="settings-slider"
              min="11" max="20" step="1" value="13"
              title="Geser untuk mengatur ukuran teks Latin">
            <p class="settings-preview settings-preview-latin" id="latin-size-preview">Bismillāhir-raḥmānir-raḥīm</p>
          </div>

          {{-- Font Size Terjemahan --}}
          <div class="settings-section">
            <label class="settings-label">
              <i class="fa-solid fa-book-open-reader"></i>
              <span data-i18n="settings_translation_font_size">Ukuran Teks Terjemahan</span>
            </label>
            <div class="font-size-controls">
              <button class="font-btn" id="trans-font-decrease"
                data-i18n-title="font_decrease_trans"
                title="Perkecil ukuran teks Terjemahan">A−</button>
              <span id="trans-font-size-display" class="font-size-display">13px</span>
              <button class="font-btn" id="trans-font-increase"
                data-i18n-title="font_increase_trans"
                title="Perbesar ukuran teks Terjemahan">A+</button>
            </div>
            <input type="range" id="trans-font-size-slider" class="settings-slider"
              min="11" max="20" step="1" value="13"
              title="Geser untuk mengatur ukuran teks Terjemahan">
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
            <span class="tajweed-group-label">Hukum Nun Mati &amp; Tanwin</span>
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

      {{-- Backup & Reset --}}
      <div class="settings-section settings-footer-row">
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
