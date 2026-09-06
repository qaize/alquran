{{-- SETTINGS MODAL --}}
<div id="settings-overlay" class="settings-overlay">
  <div class="settings-panel">

    <div class="settings-header">
      <div class="settings-title">
        <i class="fa-solid fa-gear"></i>
        <h3 data-i18n="settings_title">Pengaturan</h3>
      </div>
      <div class="settings-header-actions">
        <button id="open-font-settings-btn" class="settings-advanced-btn" title="Pengaturan Font">
          <i class="fa-solid fa-font"></i>
          <span data-i18n="settings_font_group">Font</span>
        </button>
        <button id="open-advanced-settings-btn" class="settings-advanced-btn" title="Pengaturan Lanjutan">
          <i class="fa-solid fa-sliders"></i>
          <span>Lanjutan</span>
        </button>
        <button id="close-settings-btn" class="settings-close-btn" data-i18n-title="close" title="Tutup">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
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
          <button class="bg-option bg-option-dark" data-color="#0d1b2a" data-name-id="Biru Tengah Malam" data-name-en="Midnight Blue" style="background:#0d1b2a;" title="Biru Tengah Malam">
            <span class="bg-check"><i class="fa-solid fa-check"></i></span>
          </button>
          <button class="bg-option bg-option-dark" data-color="#1e1e1e" data-name-id="Abu Gelap" data-name-en="Dark Gray" style="background:#1e1e1e;" title="Abu Gelap">
            <span class="bg-check"><i class="fa-solid fa-check"></i></span>
          </button>
          <button class="bg-option bg-option-dark" data-color="#1a1a2e" data-name-id="Ungu Tua" data-name-en="Deep Purple" style="background:#1a1a2e;" title="Ungu Tua">
            <span class="bg-check"><i class="fa-solid fa-check"></i></span>
          </button>
          <button class="bg-option bg-option-dark" data-color="#0d2418" data-name-id="Hijau Hutan" data-name-en="Dark Forest" style="background:#0d2418;" title="Hijau Hutan">
            <span class="bg-check"><i class="fa-solid fa-check"></i></span>
          </button>
          <button class="bg-option bg-option-dark" data-color="#1c1410" data-name-id="Coklat Espresso" data-name-en="Dark Espresso" style="background:#1c1410;" title="Coklat Espresso">
            <span class="bg-check"><i class="fa-solid fa-check"></i></span>
          </button>
          <button class="bg-option bg-option-dark" data-color="#0a0a0a" data-name-id="Hitam Pekat" data-name-en="Pure Black" style="background:#0a0a0a;" title="Hitam Pekat">
            <span class="bg-check"><i class="fa-solid fa-check"></i></span>
          </button>
        </div>
        <p class="settings-selected-label"><span data-i18n="settings_selected">Dipilih:</span> <span id="bg-selected-name">Putih</span></p>
      </div>

      {{-- FONT GROUP dipindah ke bawah Dark Mode --}}

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
        <p class="settings-hint" style="color:var(--gold);margin-top:2px;">
          <i class="fa-solid fa-circle-info" style="font-size:10px;"></i>
          Mode tajwid menggunakan rasm Uthmani (alquran.cloud). Teks normal kembali saat dinonaktifkan.
        </p>
        {{-- Flag per-rule tajwid --}}
        <div id="tajweed-rules-section" style="display:none;">
          <p class="settings-hint" style="margin-top:6px;margin-bottom:6px;">Pilih hukum tajwid yang ingin diwarnai:</p>
          <div class="tajweed-rules-list">
            {{-- Huruf Tidak Dibaca --}}
            <div class="tjr-group-label">Huruf Tidak Dibaca</div>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="h">
              <span class="tjr-swatch" style="background:#AAAAAA"></span>
              <span class="tjr-name">Hamzat Wasl</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="s">
              <span class="tjr-swatch" style="background:#AAAAAA"></span>
              <span class="tjr-name">Lam Syamsiyyah / Huruf Sukun</span>
            </label>
            {{-- Mad --}}
            <div class="tjr-group-label">Mad (Panjang)</div>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="n">
              <span class="tjr-swatch" style="background:#537FFF"></span>
              <span class="tjr-name">Mad Thabi'i</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="p">
              <span class="tjr-swatch" style="background:#4050FF"></span>
              <span class="tjr-name">Mad Jaiz Munfashil</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="o">
              <span class="tjr-swatch" style="background:#2144C1"></span>
              <span class="tjr-name">Mad Wajib Muttashil</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="m">
              <span class="tjr-swatch" style="background:#000EBC"></span>
              <span class="tjr-name">Mad Lazim</span>
            </label>
            {{-- Nun Mati & Tanwin --}}
            <div class="tjr-group-label">Nun Mati &amp; Tanwin</div>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="f">
              <span class="tjr-swatch" style="background:#9400A8"></span>
              <span class="tjr-name">Ikhfa Haqiqi</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="c">
              <span class="tjr-swatch" style="background:#D500B7"></span>
              <span class="tjr-name">Ikhfa Syafawi</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="i">
              <span class="tjr-swatch" style="background:#26BFFD"></span>
              <span class="tjr-name">Iqlab</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="a">
              <span class="tjr-swatch" style="background:#169777"></span>
              <span class="tjr-name">Idgham bi Ghunnah</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="u">
              <span class="tjr-swatch" style="background:#169200"></span>
              <span class="tjr-name">Idgham bila Ghunnah</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="w">
              <span class="tjr-swatch" style="background:#58B800"></span>
              <span class="tjr-name">Idgham Syafawi (Mimi)</span>
            </label>
            {{-- Hukum Lainnya --}}
            <div class="tjr-group-label">Hukum Lainnya</div>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="q">
              <span class="tjr-swatch" style="background:#DD0008"></span>
              <span class="tjr-name">Qalqalah</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="g">
              <span class="tjr-swatch" style="background:#FF7E1E"></span>
              <span class="tjr-name">Ghunnah</span>
            </label>
            <label class="tjr-item">
              <input type="checkbox" class="tajweed-rule-cb" data-rule="d">
              <span class="tjr-swatch" style="background:#A1A1A1"></span>
              <span class="tjr-name">Idgham Mutajanisain / Mutaqaribain</span>
            </label>
          </div>
        </div>
        <div class="tajweed-legend" id="tajweed-legend" style="display:none;">
          <h4 class="tajweed-legend-title"><i class="fa-solid fa-palette"></i> <span data-i18n="tajweed_legend_title">Keterangan Warna Tajwid</span></h4>

          <div class="tajweed-legend-group">
            <span class="tajweed-group-label" data-i18n="tajweed_group_silent">Huruf Tidak Dibaca</span>
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
            <span class="tajweed-group-label" data-i18n="tajweed_group_mad">Mad (Panjang)</span>
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
            <span class="tajweed-group-label" data-i18n="tajweed_group_nun">Hukum Nun Mati &amp; Tanwin</span>
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
            <span class="tajweed-group-label" data-i18n="tajweed_group_other">Hukum Lainnya</span>
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

      {{-- Notifikasi PWA --}}
      <div class="settings-section">
        <label class="settings-label">
          <i class="fa-solid fa-bell"></i>
          <span>Notifikasi</span>
        </label>
        <div id="pwa-notif-settings-container"></div>
      </div>


    </div>{{-- .settings-panel-body --}}
  </div>
</div>

{{-- ADVANCED SETTINGS MODAL --}}
<div id="advanced-settings-overlay" class="adv-settings-overlay">
  <div class="adv-settings-panel">

    <div class="adv-settings-header">
      <div class="settings-title">
        <i class="fa-solid fa-sliders"></i>
        <h3>Pengaturan Lanjutan</h3>
      </div>
      <button id="close-advanced-settings-btn" class="settings-close-btn" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="adv-settings-body">

      {{-- Grid tombol aksi --}}
      <div class="adv-settings-grid">

        {{-- Export Backup --}}
        <button id="settings-export-btn" class="adv-action-card adv-card-export">
          <div class="adv-card-icon">
            <i class="fa-solid fa-file-arrow-down"></i>
          </div>
          <div class="adv-card-info">
            <span class="adv-card-title" data-i18n="backup_export">Export Backup</span>
            <span class="adv-card-desc">Simpan semua data ke file JSON</span>
          </div>
        </button>

        {{-- Import Backup --}}
        <label class="adv-action-card adv-card-import" for="settings-backup-file">
          <div class="adv-card-icon">
            <i class="fa-solid fa-file-arrow-up"></i>
          </div>
          <div class="adv-card-info">
            <span class="adv-card-title" data-i18n="backup_import">Import Backup</span>
            <span class="adv-card-desc">Pulihkan data dari file JSON</span>
          </div>
        </label>
        <input type="file" id="settings-backup-file" accept=".json" style="display:none;">

        {{-- Reset ke Default --}}
        <button id="settings-reset-btn" class="adv-action-card adv-card-reset">
          <div class="adv-card-icon">
            <i class="fa-solid fa-rotate-left"></i>
          </div>
          <div class="adv-card-info">
            <span class="adv-card-title" data-i18n="settings_reset">Reset ke Default</span>
            <span class="adv-card-desc">Kembalikan semua pengaturan tampilan</span>
          </div>
        </button>

        {{-- Hard Restart --}}
        <button id="hard-restart-btn" class="adv-action-card adv-card-restart">
          <div class="adv-card-icon">
            <i class="fa-solid fa-rotate-right"></i>
          </div>
          <div class="adv-card-info">
            <span class="adv-card-title">Hard Restart</span>
            <span class="adv-card-desc">Clear cache &amp; muat ulang aplikasi</span>
          </div>
        </button>

      </div>{{-- .adv-settings-grid --}}

      <p class="adv-settings-warning">
        <i class="fa-solid fa-triangle-exclamation"></i>
        Reset &amp; Hard Restart akan menghapus data yang tidak di-backup. Pastikan sudah export terlebih dahulu.
      </p>

    </div>{{-- .adv-settings-body --}}
  </div>
</div>

{{-- FONT SETTINGS MODAL --}}
<div id="font-settings-overlay" class="adv-settings-overlay">
  <div class="adv-settings-panel font-settings-panel">

    <div class="adv-settings-header">
      <div class="settings-title">
        <i class="fa-solid fa-font"></i>
        <h3 data-i18n="settings_font_group">Pengaturan Font</h3>
      </div>
      <button id="close-font-settings-btn" class="settings-close-btn" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="adv-settings-body font-settings-body">

      {{-- ── SEKSI 1: Ukuran Font (grid 3 kolom) ── --}}
      <div class="font-modal-section-label">
        <i class="fa-solid fa-text-height"></i> Ukuran Teks
      </div>
      <div class="font-size-grid">

        <div class="font-size-card">
          <div class="fsc-header">
            <i class="fa-solid fa-mosque"></i>
            <span>Arab</span>
          </div>
          <p class="fsc-preview fsc-preview-arab" id="arab-size-preview" dir="rtl">بِسْمِ اللَّهِ</p>
          <div class="fsc-controls">
            <button class="fsc-btn" id="font-decrease" title="Perkecil">A−</button>
            <span class="fsc-display" id="font-size-display">40px</span>
            <button class="fsc-btn" id="font-increase" title="Perbesar">A+</button>
          </div>
          <input type="range" id="font-size-slider" class="settings-slider fsc-slider" min="24" max="64" step="2" value="40">
        </div>

        <div class="font-size-card">
          <div class="fsc-header">
            <i class="fa-solid fa-italic"></i>
            <span>Latin</span>
          </div>
          <p class="fsc-preview fsc-preview-latin" id="latin-size-preview">Bismillāhir-raḥmān</p>
          <div class="fsc-controls">
            <button class="fsc-btn" id="latin-font-decrease" title="Perkecil">A−</button>
            <span class="fsc-display" id="latin-font-size-display">13px</span>
            <button class="fsc-btn" id="latin-font-increase" title="Perbesar">A+</button>
          </div>
          <input type="range" id="latin-font-size-slider" class="settings-slider fsc-slider" min="11" max="20" step="1" value="13">
        </div>

        <div class="font-size-card">
          <div class="fsc-header">
            <i class="fa-solid fa-book-open-reader"></i>
            <span>Terjemahan</span>
          </div>
          <p class="fsc-preview fsc-preview-trans" id="trans-size-preview">Dengan nama Allah</p>
          <div class="fsc-controls">
            <button class="fsc-btn" id="trans-font-decrease" title="Perkecil">A−</button>
            <span class="fsc-display" id="trans-font-size-display">13px</span>
            <button class="fsc-btn" id="trans-font-increase" title="Perbesar">A+</button>
          </div>
          <input type="range" id="trans-font-size-slider" class="settings-slider fsc-slider" min="11" max="20" step="1" value="13">
        </div>

      </div>{{-- .font-size-grid --}}

      {{-- ── SEKSI 2: Tampilan Teks Arab (grid 2 kolom) ── --}}
      <div class="font-modal-section-label">
        <i class="fa-solid fa-sliders"></i> Tampilan Teks Arab
      </div>
      <div class="font-display-grid">

        {{-- Line Height --}}
        <div class="font-size-card">
          <div class="fsc-header">
            <i class="fa-solid fa-arrows-up-down"></i>
            <span>Jarak Baris</span>
          </div>
          <div class="fsc-controls">
            <button class="fsc-btn" id="arab-lh-decrease" title="Rapat">−</button>
            <span class="fsc-display" id="arab-lh-display">2.4</span>
            <button class="fsc-btn" id="arab-lh-increase" title="Renggang">+</button>
          </div>
          <input type="range" id="arab-line-height-slider" class="settings-slider fsc-slider"
            min="1.4" max="4.0" step="0.2" value="2.4">
          <p class="fsc-hint">Jarak antar baris teks Arab</p>
        </div>

        {{-- Word Spacing --}}
        <div class="font-size-card">
          <div class="fsc-header">
            <i class="fa-solid fa-left-right"></i>
            <span>Jarak Kata</span>
          </div>
          <div class="fsc-controls">
            <button class="fsc-btn" id="arab-ws-decrease" title="Rapat">−</button>
            <span class="fsc-display" id="arab-ws-display">8px</span>
            <button class="fsc-btn" id="arab-ws-increase" title="Renggang">+</button>
          </div>
          <input type="range" id="arab-word-spacing-slider" class="settings-slider fsc-slider"
            min="0" max="24" step="2" value="8">
          <p class="fsc-hint">Jarak antar kata Arab</p>
        </div>

        {{-- Bold Arab --}}
        <div class="font-size-card font-toggle-card">
          <div class="fsc-header">
            <i class="fa-solid fa-bold"></i>
            <span>Tebal (Bold)</span>
          </div>
          <div class="fsc-toggle-row">
            <label class="toggle-switch">
              <input type="checkbox" id="arab-bold-toggle">
              <span class="toggle-slider"></span>
            </label>
            <span class="fsc-toggle-label" id="arab-bold-label">Nonaktif</span>
          </div>
          <p class="fsc-hint">Teks Arab lebih tebal, lebih mudah dibaca</p>
        </div>

        {{-- Harakat --}}
        <div class="font-size-card font-toggle-card">
          <div class="fsc-header">
            <i class="fa-solid fa-eye-slash"></i>
            <span>Sembunyikan Harakat</span>
          </div>
          <div class="fsc-toggle-row">
            <label class="toggle-switch">
              <input type="checkbox" id="hide-harakat-toggle">
              <span class="toggle-slider"></span>
            </label>
            <span class="fsc-toggle-label" id="hide-harakat-label">Nonaktif</span>
          </div>
          <p class="fsc-hint">Sembunyikan tanda baca (harakat) untuk latihan membaca</p>
        </div>

        {{-- Text Align --}}
        <div class="font-size-card font-align-card">
          <div class="fsc-header">
            <i class="fa-solid fa-align-right"></i>
            <span>Perataan Teks</span>
          </div>
          <div class="font-align-options">
            <button class="font-align-btn active" data-align="right" title="Rata Kanan">
              <i class="fa-solid fa-align-right"></i>
              <span>Kanan</span>
            </button>
            <button class="font-align-btn" data-align="justify" title="Rata Kiri-Kanan">
              <i class="fa-solid fa-align-justify"></i>
              <span>Justify</span>
            </button>
            <button class="font-align-btn" data-align="center" title="Tengah">
              <i class="fa-solid fa-align-center"></i>
              <span>Tengah</span>
            </button>
          </div>
          <p class="fsc-hint">Perataan teks Arab dalam baris</p>
        </div>

      </div>{{-- .font-display-grid --}}

      {{-- ── SEKSI 3: Jenis Font Arab ── --}}
      <div class="font-modal-section-label">
        <i class="fa-solid fa-pen-nib"></i> Jenis Font Arab
      </div>
      <div class="font-family-section">
        <select id="arab-font-select" class="settings-select">
          <optgroup label="── Mushaf Indonesia (Kemenag RI) ──">
            <option value="LPMQ Isep Misbah">LPMQ Isep Misbah</option>
          </optgroup>
          <optgroup label="── Mushaf Uthmani ──">
            <option value="KFGQPC Hafs Uthmanic">KFGQPC Uthmanic</option>
          </optgroup>
          <optgroup label="── Naskh Klasik ──">
            <option value="Amiri Quran">Amiri Quran</option>
            <option value="Scheherazade">⭐ Scheherazade New (Default)</option>
          </optgroup>
          <optgroup label="── Naskh Modern ──">
            <option value="Noto Naskh Arabic">Noto Naskh Arabic</option>
          </optgroup>
          <optgroup label="── Mushaf Pakistan ──">
            <option value="Al Mushaf">Al Mushaf (Alvi)</option>
            <option value="Al Qalam Quran Majeed">Al Qalam Quran Majeed</option>
            <option value="Al Qalam Quran Majeed 2">Al Qalam Quran Majeed 2</option>
            <option value="Noorehuda">Noorehuda</option>
          </optgroup>
        </select>
        <p class="settings-preview settings-preview-arab" id="arab-font-preview" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
      </div>

    </div>{{-- .font-settings-body --}}
  </div>
</div>
