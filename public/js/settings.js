/* settings.js — i18n + Settings + Dark mode + Sidebar groups */

/* ──────────────────────────────────────────────
   SIDEBAR RIGHT — Collapse / Expand
   ────────────────────────────────────────────── */
const SIDEBAR_RIGHT_KEY = 'quran_sidebar_right_collapsed';

function initSidebarRightCollapse() {
    const sidebar   = document.getElementById('sidebar-right');
    const wrapper   = document.querySelector('.app-wrapper');
    const toggleBtn = document.getElementById('sidebar-right-toggle');
    const expandBtn = document.getElementById('sidebar-right-expand');
    if (!sidebar || !wrapper) return;

    // Restore state dari localStorage
    const isCollapsed = localStorage.getItem(SIDEBAR_RIGHT_KEY) === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        wrapper.classList.add('sidebar-collapsed');
    }

    // Klik toggle (tutup)
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            // Animasi icon keluar sebelum collapse
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.style.transition = 'transform 0.25s ease, opacity 0.2s ease';
                icon.style.transform  = 'translateX(6px)';
                icon.style.opacity    = '0';
            }
            setTimeout(() => {
                sidebar.classList.add('collapsed');
                wrapper.classList.add('sidebar-collapsed');
                localStorage.setItem(SIDEBAR_RIGHT_KEY, 'true');
                // Reset icon state for next open
                if (icon) { icon.style.transform = ''; icon.style.opacity = ''; }
            }, 180);
        });
    }

    // Klik expand (buka kembali)
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            wrapper.classList.remove('sidebar-collapsed');
            localStorage.setItem(SIDEBAR_RIGHT_KEY, 'false');
            // Trigger re-animation on expand button next show
            expandBtn.style.animation = 'none';
            void expandBtn.offsetWidth;
            expandBtn.style.animation = '';
        });
    }
}


/* ──────────────────────────────────────────────
   I18N — Sistem terjemahan antarmuka
   ────────────────────────────────────────────── */
const I18N_KEY = 'quran_lang';

const I18N = {
    id: {
        nav_home:             'Beranda',
        nav_juz:              'Juz',
        nav_last_read:        'Terakhir Dibaca',
        nav_bookmark:         'Bookmark',
        nav_tajwid_guide:     'Panduan Tajwid',
        nav_settings:         'Pengaturan',
        data_source_label:    'Data berdasarkan:',
        banner_subtitle:      'Bacaan Mulia, Panduan Abadi',
        bismillah_subtitle:   'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang',
        search_placeholder:   'Cari surah, nomor, atau arti...',
        search_btn:           'Cari',
        tab_favorites:        'Favorit',
        tab_bookmarks:        'Bookmark',
        fav_empty:            'Belum ada favorit.',
        fav_empty_hint:       'Klik ★ pada kartu surah untuk menambahkan.',
        bm_empty:             'Belum ada bookmark.',
        bm_empty_hint:        'Buka surah, lalu arahkan kursor ke ayat — tombol ðŸ”– akan muncul di samping nomor ayat.',
        loading:              'Memuat data...',
        juz_title:            'Daftar Juz',
        juz_subtitle:         'Al Quran 30 Juz',
        close:                'Tutup',
        menu:                 'Menu',
        favorites_bookmark:   'Favorit & Bookmark',
        settings_title:       'Pengaturan',
        settings_font_size:   'Ukuran Teks Arab',
        settings_latin_font_size: 'Ukuran Teks Latin',
        settings_translation_font_size: 'Ukuran Teks Terjemahan',
        settings_arab_font:   'Jenis Font Arab',
        font_decrease:        'Perkecil',
        font_increase:        'Perbesar',
        font_decrease_arab:   'Perkecil ukuran teks Arab',
        font_increase_arab:   'Perbesar ukuran teks Arab',
        font_decrease_latin:  'Perkecil ukuran teks Latin',
        font_increase_latin:  'Perbesar ukuran teks Latin',
        font_decrease_trans:  'Perkecil ukuran teks Terjemahan',
        font_increase_trans:  'Perbesar ukuran teks Terjemahan',
        settings_bg_color:    'Tema Warna Latar',
        settings_selected:    'Dipilih:',
        settings_language:    'Bahasa Tampilan',
        settings_reset:       'Reset ke Default',
        bm_panel_title:       'Bookmark Ayat Saya',
        ayat_word:            'ayat',
        bm_search_placeholder:'Cari surah atau teks ayat...',
        bm_clear_all:         'Hapus Semua',
        bm_panel_empty:       'Belum ada ayat yang disimpan.',
        bm_panel_empty_hint:  'Cara menyimpan bookmark:\n1. Buka salah satu surah\n2. Arahkan kursor ke ayat\n3. Klik tombol ðŸ”– di samping nomor ayat',
        // JS-rendered strings
        read_btn:             'Baca',
        add_favorite:         'Tambah ke favorit',
        remove_favorite:      'Hapus dari favorit',
        read_surah:           'Baca surah ini',
        prev_surah:           'Surah Sebelumnya',
        next_surah:           'Surah Berikutnya',
        jump_to_ayat:         'Lompat ke ayat:',
        show_translation:     'Tampilkan Terjemahan',
        hide_translation:     'Sembunyikan Terjemahan',
        see_translation:      'Lihat terjemahan',
        hide_translation_s:   'Sembunyikan terjemahan',
        last_read_saved:      'Bacaan terakhir disimpan',
        fav_added_label:      'Ditambahkan ke favorit',
        fav_removed_label:    'Dihapus dari favorit',
        bm_saved_label:       'Bookmark disimpan',
        bm_removed_label:     'Bookmark dihapus',
        confirm_clear_bm:     'Hapus semua bookmark?',
        open_ayat:            'Buka Ayat',
        delete:               'Hapus',
        open:                 'Buka',
        surah_word:           'Surah',
        ayat_ref:             'Ayat',
        data_not_found:       'Data tidak ditemukan',
        total_ayat:           'Jumlah Ayat:',
        place_revealed:       'Tempat Turun:',
        description:          'Deskripsi:',
        save_bookmark:        'Simpan bookmark ayat ini',
        prev_page:            'Sebelumnya',
        next_page:            'Berikutnya',
        translation_suffix:   'artinya:',
        // Favorites panel
        fav_panel_title:      'Surah Favorit Saya',
        nav_favorites:        'Favorit',
        // Last read categories
        lr_panel_title:       'Terakhir Dibaca',
        lr_add_category:      'Tambah Kategori',
        lr_empty:             'Belum ada kategori. Tambahkan kategori untuk menyimpan posisi bacaan.',
        lr_new_category_prompt:'Nama kategori baru:',
        lr_category_default:  'Bacaan Utama',
        lr_saved_toast:       'Posisi disimpan ke kategori',
        lr_no_position:       'Belum ada posisi',
        lr_slide_title:       'Simpan ke Kategori',
        lr_new_category_slide:'+ Kategori Baru',
        save_lastread:        'Simpan terakhir dibaca',
        play_audio:           'Putar murottal ayat ini',
        audio_error:          'Gagal memuat audio. Periksa koneksi.',
        prev_ayat:            'Ayat sebelumnya',
        next_ayat:            'Ayat berikutnya',
        play_pause:           'Play / Pause',
        stop_audio:           'Hentikan audio',
        copy_ayat:            'Salin ayat',
        copy_success_label:   'Ayat disalin',
        copy_error:           'Gagal menyalin teks',
        // Qori & Audio
        settings_font_group:    'Pengaturan Font',
        settings_qori:          'Pilihan Qori',
        settings_qori_hint:     'Digunakan saat memutar audio murottal per ayat.',
        settings_autoplay:      'Auto-play Ayat',
        settings_autoplay_hint: 'Otomatis putar ayat berikutnya setelah selesai.',
        autoplay_on:            'Aktif',
        autoplay_off:           'Nonaktif',
        // Dark Mode
        settings_dark_mode:     'Mode Gelap',
        settings_dark_mode_hint:'Tampilan latar gelap, nyaman untuk baca malam hari.',
        dark_mode_off:          'Nonaktif',
        dark_mode_on:           'Aktif',
        // Terjemahan toggle
        settings_show_trans:      'Tampilkan Terjemahan',
        settings_show_trans_hint: 'Tampilkan teks latin dan terjemahan di bawah setiap ayat.',
        trans_visible:            'Tampil',
        trans_hidden:             'Tersembunyi',
        // Tajweed
        settings_tajweed:     'Warna Tajwid',
        settings_tajweed_hint:'Mewarnai huruf Arab sesuai hukum bacaan tajwid.',
        tajweed_on:           'Aktif',
        tajweed_off:          'Nonaktif',
        // Tajweed legend groups
        tajweed_legend_title:       'Keterangan Warna Tajwid',
        tajweed_group_silent:       'Huruf Tidak Dibaca',
        tajweed_group_mad:          'Mad (Panjang)',
        tajweed_group_nun:          'Hukum Nun Mati & Tanwin',
        tajweed_group_other:        'Hukum Lainnya',
        // Sidebar nav
        nav_konten_islam:     'Konten Islam',
        nav_janji_allah:      'Janji Allah',
        nav_hadist:           'Hadist',
        // Bookmark panel tabs
        bm_tab_ayat:          'Ayat',
        bm_tab_hadist:        'Hadist',
        bm_ayat_empty:        'Belum ada ayat yang disimpan.',
        bm_ayat_empty_hint:   'Buka surah → arahkan ke ayat → klik 🔖',
        bm_hadist_empty:      'Belum ada hadist yang disimpan.',
        bm_hadist_empty_hint: 'Buka panel Hadist → detail → klik 🔖',
        // Backup
        backup_export:        'Export Backup',
        backup_import:        'Import Backup',
        backup_exported:      'Backup berhasil diunduh!',
        backup_restored:      'Backup berhasil di-restore! Halaman akan dimuat ulang.',
        backup_invalid:       'Format file tidak valid',
        backup_fail:          'Gagal membaca file backup: ',
        backup_confirm:       'Import backup dari {date}?\n\n{count} data akan di-restore.\nData yang ada sekarang akan ditimpa.',
        backup_saved:         'Tersimpan',
        backup_empty:         'Kosong',
        backup_fav:           'Favorit',
        backup_bm_ayat:       'Bookmark Ayat',
        backup_bm_hadist:     'Bookmark Hadist',
        backup_last_read:     'Terakhir Dibaca',
        backup_categories:    'Kategori Baca',
        backup_settings:      'Pengaturan',
        backup_tajweed:       'Status Tajwid',
        // Hadist widget
        hdw_title:            'Hadist Hari Ini',
        hdw_read_more:        'Baca Lebih Banyak',
        hdw_hide:             'Sembunyikan',
        hdw_show:             'Tampilkan',
        hdw_bm_save:          'Simpan bookmark',
        hdw_bm_remove:        'Hapus bookmark',
        hdw_error:            'Gagal memuat. Periksa koneksi.',
        hdw_copied:           'Hadist berhasil disalin!',
        // Hadist panel
        hadist_loading:       'Memuat hadist...',
        hadist_goto_placeholder: 'Nomor hadist, lalu Enter...',
        hadist_prev:          'Sebelumnya',
        hadist_next:          'Berikutnya',
        hadist_random:        'Hadist acak',
        hadist_prev_title:    'Hadist sebelumnya',
        hadist_next_title:    'Hadist berikutnya',
        hadist_translation:   'Terjemahan',
        hadist_copy:          'Salin',
        hadist_bookmark:      'Bookmark',
        hadist_error:         'Gagal memuat hadist ini.',
        // Modals
        modal_datasource:     'Sumber Data',
        modal_tafsir:         'Tafsir Kemenag',
        modal_asbab:          'Asbabun Nuzul',
        modal_loading_tafsir: 'Memuat tafsir...',
        modal_loading_data:   'Memuat data...',
        modal_tafsir_empty:   'Tafsir tidak tersedia untuk ayat ini.',
        modal_tafsir_fail:    'Gagal memuat tafsir. Periksa koneksi internet.',
        modal_asbab_empty:    'Tidak ada riwayat Asbabun Nuzul untuk ayat ini.',
        modal_asbab_fail:     'Gagal memuat data. Periksa koneksi internet.',
        modal_data_na:        'Data tidak tersedia.',
        modal_datasource_desc:'Teks Arab, terjemahan bahasa Indonesia, transliterasi latin, dan tafsir Kemenag RI.',
        modal_tajweed_desc:   'Data tajwid berwarna (color-coded) untuk setiap huruf Al-Quran berdasarkan hukum bacaan.',
        modal_asbab_desc:     'Data Asbabun Nuzul (sebab turun ayat) dalam bahasa Indonesia, bersumber dari Kemenag RI.',
        modal_aladhan_desc:   'Waktu shalat akurat berdasarkan koordinat GPS, menggunakan metode SIHAT Kemenag RI.',
        modal_bigdatacloud_desc: 'Reverse geocoding gratis untuk mengubah koordinat GPS menjadi nama kota/lokasi.',
        modal_hadith_desc:    'Data hadist dari 9 kitab (Bukhari, Muslim, Abu Dawud, dll) dalam bahasa Indonesia.',
        // Usage panel
        usage_reset_confirm:  'Reset semua data usage?',
        usage_audio_played:   'Audio Diputar',
        usage_api_detail:     'Rincian API',
        usage_no_data:        'Belum ada data',
        usage_since:          'Mulai:',
        usage_last:           'Terakhir:',
        // Janji Allah panel
        janji_panel_title:    'Janji Allah',
        janji_all_cat:        'Semua',
        janji_search_ph:      'Cari janji atau situasi...',
        janji_open_quran:     'Buka di Al Quran',
        janji_copy:           'Salin',
        janji_copied:         'Ayat berhasil disalin!',
        janji_error:          'Gagal memuat ayat. Periksa koneksi internet.',
        // Prayer times
        nav_prayer_time:      'Waktu Shalat',
        pt_title:             'Waktu Shalat',
        pt_loading:           'Mendeteksi lokasi...',
        pt_next:              'Berikutnya',
        pt_location_error:    'Izinkan akses lokasi untuk melihat waktu shalat.',
        pt_allow_location:    'Izinkan lokasi',
        pt_fajr:              'Subuh',
        pt_dhuhr:             'Zuhur',
        pt_asr:               'Asar',
        pt_maghrib:           'Maghrib',
        pt_isha:              'Isya',
    },
    en: {
        nav_home:             'Home',
        nav_juz:              'Juz',
        nav_last_read:        'Last Read',
        nav_bookmark:         'Bookmark',
        nav_tajwid_guide:     'Tajweed Guide',
        nav_settings:         'Settings',
        data_source_label:    'Data source:',
        banner_subtitle:      'Noble Reading, Eternal Guide',
        bismillah_subtitle:   'In the name of Allah, the Most Gracious, the Most Merciful',
        search_placeholder:   'Search surah, number, or meaning...',
        search_btn:           'Search',
        tab_favorites:        'Favorites',
        tab_bookmarks:        'Bookmarks',
        fav_empty:            'No favorites yet.',
        fav_empty_hint:       'Click ★ on a surah card to add.',
        bm_empty:             'No bookmarks yet.',
        bm_empty_hint:        'Open a surah, hover over a verse — the ðŸ”– button will appear next to the verse number.',
        loading:              'Loading data...',
        juz_title:            'Juz List',
        juz_subtitle:         'Qur\'an 30 Juz',
        close:                'Close',
        menu:                 'Menu',
        favorites_bookmark:   'Favorites & Bookmarks',
        settings_title:       'Settings',
        settings_font_size:   'Arabic Text Size',
        settings_latin_font_size: 'Latin Text Size',
        settings_translation_font_size: 'Translation Text Size',
        settings_arab_font:   'Arabic Font Style',
        font_decrease:        'Decrease',
        font_increase:        'Increase',
        font_decrease_arab:   'Decrease Arabic text size',
        font_increase_arab:   'Increase Arabic text size',
        font_decrease_latin:  'Decrease Latin text size',
        font_increase_latin:  'Increase Latin text size',
        font_decrease_trans:  'Decrease Translation text size',
        font_increase_trans:  'Increase Translation text size',
        settings_bg_color:    'Background Theme',
        settings_selected:    'Selected:',
        settings_language:    'Display Language',
        settings_reset:       'Reset to Default',
        bm_panel_title:       'My Verse Bookmarks',
        ayat_word:            'verses',
        bm_search_placeholder:'Search surah or verse text...',
        bm_clear_all:         'Clear All',
        bm_panel_empty:       'No saved verses yet.',
        bm_panel_empty_hint:  'How to bookmark:\n1. Open a surah\n2. Hover over a verse\n3. Click ðŸ”– next to the verse number',
        // JS-rendered strings
        read_btn:             'Read',
        add_favorite:         'Add to favorites',
        remove_favorite:      'Remove from favorites',
        read_surah:           'Read this surah',
        prev_surah:           'Previous Surah',
        next_surah:           'Next Surah',
        jump_to_ayat:         'Jump to verse:',
        show_translation:     'Show Translation',
        hide_translation:     'Hide Translation',
        see_translation:      'View translation',
        hide_translation_s:   'Hide translation',
        last_read_saved:      'Last reading saved',
        fav_added_label:      'Added to favorites',
        fav_removed_label:    'Removed from favorites',
        bm_saved_label:       'Bookmark saved',
        bm_removed_label:     'Bookmark removed',
        confirm_clear_bm:     'Delete all bookmarks?',
        open_ayat:            'Open Verse',
        delete:               'Delete',
        open:                 'Open',
        surah_word:           'Surah',
        ayat_ref:             'Verse',
        data_not_found:       'Data not found',
        total_ayat:           'Total Verses:',
        place_revealed:       'Revealed at:',
        description:          'Description:',
        save_bookmark:        'Save verse bookmark',
        prev_page:            'Previous',
        next_page:            'Next',
        translation_suffix:   'meaning:',
        // Favorites panel
        fav_panel_title:      'My Favorite Surahs',
        nav_favorites:        'Favorites',
        // Last read categories
        lr_panel_title:       'Last Read',
        lr_add_category:      'Add Category',
        lr_empty:             'No categories yet. Add a category to save your reading position.',
        lr_new_category_prompt:'New category name:',
        lr_category_default:  'Main Reading',
        lr_saved_toast:       'Position saved to category',
        lr_no_position:       'No position saved',
        lr_slide_title:       'Save to Category',
        lr_new_category_slide:'+ New Category',
        save_lastread:        'Save last read',
        play_audio:           'Play recitation',
        audio_error:          'Failed to load audio. Check connection.',
        prev_ayat:            'Previous verse',
        next_ayat:            'Next verse',
        play_pause:           'Play / Pause',
        stop_audio:           'Stop audio',
        copy_ayat:            'Copy verse',
        copy_success_label:   'Verse copied',
        copy_error:           'Failed to copy text',
        // Qori & Audio
        settings_font_group:    'Font Settings',
        settings_qori:          'Reciter (Qori)',
        settings_qori_hint:     'Used when playing per-verse audio recitation.',
        settings_autoplay:      'Auto-play Verses',
        settings_autoplay_hint: 'Automatically play the next verse when finished.',
        autoplay_on:            'Active',
        autoplay_off:           'Inactive',
        // Dark Mode
        settings_dark_mode:     'Dark Mode',
        settings_dark_mode_hint:'Dark background, comfortable for night reading.',
        dark_mode_off:          'Inactive',
        dark_mode_on:           'Active',
        // Translation toggle
        settings_show_trans:      'Show Translation',
        settings_show_trans_hint: 'Show transliteration and translation below each verse.',
        trans_visible:            'Visible',
        trans_hidden:             'Hidden',
        // Tajweed
        settings_tajweed:     'Colored Tajweed',
        settings_tajweed_hint:'Display color-coded Arabic letters based on tajweed rules.',
        tajweed_on:           'Active',
        tajweed_off:          'Inactive',
        // Tajweed legend groups
        tajweed_legend_title:       'Tajweed Color Guide',
        tajweed_group_silent:       'Silent Letters',
        tajweed_group_mad:          'Mad (Elongation)',
        tajweed_group_nun:          'Noon Sakin & Tanwin Rules',
        tajweed_group_other:        'Other Rules',
        // Sidebar nav
        nav_konten_islam:     'Islamic Content',
        nav_janji_allah:      "Allah's Promises",
        nav_hadist:           'Hadith',
        // Bookmark panel tabs
        bm_tab_ayat:          'Verses',
        bm_tab_hadist:        'Hadith',
        bm_ayat_empty:        'No saved verses yet.',
        bm_ayat_empty_hint:   'Open a surah → hover over a verse → click 🔖',
        bm_hadist_empty:      'No saved hadith yet.',
        bm_hadist_empty_hint: 'Open Hadith panel → detail → click 🔖',
        // Backup
        backup_export:        'Export Backup',
        backup_import:        'Import Backup',
        backup_exported:      'Backup downloaded successfully!',
        backup_restored:      'Backup restored! Page will reload.',
        backup_invalid:       'Invalid file format',
        backup_fail:          'Failed to read backup file: ',
        backup_confirm:       'Import backup from {date}?\n\n{count} items will be restored.\nExisting data will be overwritten.',
        backup_saved:         'Saved',
        backup_empty:         'Empty',
        backup_fav:           'Favorites',
        backup_bm_ayat:       'Verse Bookmarks',
        backup_bm_hadist:     'Hadith Bookmarks',
        backup_last_read:     'Last Read',
        backup_categories:    'Reading Categories',
        backup_settings:      'Settings',
        backup_tajweed:       'Tajweed Status',
        // Hadist widget
        hdw_title:            "Today's Hadith",
        hdw_read_more:        'Read More',
        hdw_hide:             'Hide',
        hdw_show:             'Show',
        hdw_bm_save:          'Save bookmark',
        hdw_bm_remove:        'Remove bookmark',
        hdw_error:            'Failed to load. Check connection.',
        hdw_copied:           'Hadith copied!',
        // Hadist panel
        hadist_loading:       'Loading hadith...',
        hadist_goto_placeholder: 'Hadith number, then Enter...',
        hadist_prev:          'Previous',
        hadist_next:          'Next',
        hadist_random:        'Random hadith',
        hadist_prev_title:    'Previous hadith',
        hadist_next_title:    'Next hadith',
        hadist_translation:   'Translation',
        hadist_copy:          'Copy',
        hadist_bookmark:      'Bookmark',
        hadist_error:         'Failed to load this hadith.',
        // Modals
        modal_datasource:     'Data Source',
        modal_tafsir:         'Tafsir Kemenag',
        modal_asbab:          'Asbabun Nuzul',
        modal_loading_tafsir: 'Loading tafsir...',
        modal_loading_data:   'Loading data...',
        modal_tafsir_empty:   'Tafsir not available for this verse.',
        modal_tafsir_fail:    'Failed to load tafsir. Check connection.',
        modal_asbab_empty:    'No Asbabun Nuzul record for this verse.',
        modal_asbab_fail:     'Failed to load data. Check connection.',
        modal_data_na:        'Data not available.',
        modal_datasource_desc:'Arabic text, Indonesian translation, Latin transliteration, and Kemenag RI tafsir.',
        modal_tajweed_desc:   'Color-coded tajweed data for every letter in the Quran based on recitation rules.',
        modal_asbab_desc:     'Asbabun Nuzul (reasons of revelation) in Indonesian, sourced from Kemenag RI.',
        modal_aladhan_desc:   'Accurate prayer times based on GPS coordinates, using the SIHAT Kemenag RI method.',
        modal_bigdatacloud_desc: 'Free reverse geocoding to convert GPS coordinates into city/location names.',
        modal_hadith_desc:    'Hadith data from 9 books (Bukhari, Muslim, Abu Dawud, etc.) in Indonesian.',
        // Usage panel
        usage_reset_confirm:  'Reset all usage data?',
        usage_audio_played:   'Audio Played',
        usage_api_detail:     'API Breakdown',
        usage_no_data:        'No data yet',
        usage_since:          'Since:',
        usage_last:           'Last:',
        // Janji Allah panel
        janji_panel_title:    "Allah's Promises",
        janji_all_cat:        'All',
        janji_search_ph:      'Search promise or situation...',
        janji_open_quran:     'Open in Quran',
        janji_copy:           'Copy',
        janji_copied:         'Verse copied!',
        janji_error:          'Failed to load verse. Check connection.',
        // Prayer times
        nav_prayer_time:      'Prayer Times',
        pt_title:             'Prayer Times',
        pt_loading:           'Detecting location...',
        pt_next:              'Next',
        pt_location_error:    'Allow location access to view prayer times.',
        pt_allow_location:    'Allow location',
        pt_fajr:              'Fajr',
        pt_dhuhr:             'Dhuhr',
        pt_asr:               'Asr',
        pt_maghrib:           'Maghrib',
        pt_isha:              'Isha',
    },
};

function getCurrentLang() {
    return localStorage.getItem(I18N_KEY) || 'id';
}

function t(key) {
    const lang = getCurrentLang();
    return (I18N[lang] && I18N[lang][key]) ? I18N[lang][key] : (I18N['id'][key] || key);
}

function applyI18n() {
    const lang = getCurrentLang();

    // Update <html lang="">
    document.documentElement.lang = lang;

    // Teks biasa: [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (val) el.textContent = val;
    });

    // Placeholder: [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const val = t(key);
        if (val) el.placeholder = val;
    });

    // Title attribute: [data-i18n-title]
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const val = t(key);
        if (val) el.title = val;
    });

    // Update tombol bahasa aktif
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update label bg-selected-name sesuai bahasa
    const selectedBgBtn = document.querySelector('.bg-option.selected');
    if (selectedBgBtn) {
        const nameKey = lang === 'en' ? 'data-name-en' : 'data-name-id';
        const name = selectedBgBtn.getAttribute(nameKey) || selectedBgBtn.getAttribute('data-name-id');
        const lbl = document.getElementById('bg-selected-name');
        if (lbl && name) lbl.textContent = name;
    }

    // Update pagination buttons
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    if (prevBtn) prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i> ${t('prev_page')}`;
    if (nextBtn) nextBtn.innerHTML = `${t('next_page')} <i class="fa-solid fa-chevron-right"></i>`;

    // Update elemen dinamis di detail surah (jika sedang terbuka)
    applyI18nDynamic();
}

// Update teks elemen yang di-render JS secara dinamis (detail surah)
function applyI18nDynamic() {
    // Navigasi surah
    const prevSurah = document.getElementById('surah-prev');
    const nextSurah = document.getElementById('surah-next');
    if (prevSurah) prevSurah.textContent = t('prev_surah');
    if (nextSurah) nextSurah.textContent = t('next_surah');

    // Label "Lompat ke ayat"
    const jumpLabel = document.querySelector('label[for="scroll-input"]');
    if (jumpLabel) jumpLabel.textContent = t('jump_to_ayat');

    // Tombol tampilkan/sembunyikan terjemahan
    const toggleBtn = document.getElementById('toggle-translation-btn');
    if (toggleBtn) {
        const isActive = toggleBtn.classList.contains('active');
        const icon = isActive ? 'fa-eye' : 'fa-eye-slash';
        const label = isActive ? t('show_translation') : t('hide_translation');
        toggleBtn.innerHTML = `<i class="fa-solid ${icon}"></i><span>${label}</span>`;
        toggleBtn.title = label;
    }

    // Semua link "Lihat/Sembunyikan terjemahan" per ayat
    document.querySelectorAll('.show-hide-terjemahan').forEach(el => {
        const id = el.id; // toggleTerjemahanX
        if (!id) return;
        const nomorAyat = id.replace('toggleTerjemahan', '');
        const terjDiv = document.getElementById(`terjemahan${nomorAyat}`);
        const isShowing = terjDiv && terjDiv.style.display === 'block';
        el.innerHTML = isShowing ? t('hide_translation_s') : t('see_translation');
    });

    // Semua tombol bookmark per ayat
    document.querySelectorAll('.btn-bookmark-ayat').forEach(btn => {
        btn.title = t('save_bookmark');
    });

    // Semua tombol lastread per ayat
    document.querySelectorAll('.btn-lastread-ayat').forEach(btn => {
        btn.title = t('save_lastread');
    });
}

function initI18n() {
    applyI18n();

    // Pasang event listener tombol bahasa
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.setItem(I18N_KEY, btn.dataset.lang);
            applyI18n();
            document.dispatchEvent(new CustomEvent('lang-changed'));
        });
    });

    // Re-apply teks dinamis setiap kali detail surah selesai di-render
    document.addEventListener('ayat-rendered', () => applyI18nDynamic());
}

/* ──────────────────────────────────────────────
   SETTINGS — localStorage
   ────────────────────────────────────────────── */
const SETTINGS_KEY = 'quran_settings';

const SETTINGS_DEFAULT = {
    fontSize: 36,
    latinFontSize: 13,
    transFontSize: 13,
    bgColor: '#ffffff',
    bgName: 'Putih',
    arabFont: 'Amiri Quran',
    qori: '05',
    darkMode: false,
    showTranslation: true,
    autoPlay: false
};

function getSettings() {
    try {
        return Object.assign({}, SETTINGS_DEFAULT, JSON.parse(localStorage.getItem(SETTINGS_KEY)));
    } catch (e) {
        return Object.assign({}, SETTINGS_DEFAULT);
    }
}

function saveSettings(obj) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
}

function applySettings(s) {
    const root = document.documentElement;

    // Ukuran font Arab
    root.style.setProperty('--arabic-font-size', s.fontSize + 'px');

    // Ukuran font Latin/Terjemahan
    if (s.latinFontSize) {
        root.style.setProperty('--latin-font-size', s.latinFontSize + 'px');
    }
    if (s.transFontSize) {
        root.style.setProperty('--trans-font-size', s.transFontSize + 'px');
    }

    // Font Arab
    if (s.arabFont) {
        root.style.setProperty('--arabic-font-family', "'" + s.arabFont + "', 'Amiri', serif");
    }

    // Background & warna teks — pakai CSS variable di :root
    root.style.setProperty('--ayat-bg', s.bgColor);

    if (s.bgColor === '#1a2e45') {
        root.classList.add('theme-dark');
    } else {
        root.classList.remove('theme-dark');
    }
    // expose qori globally for audio player
    const prevQori = window.__activeQori;
    window.__activeQori = s.qori || '05';

    // Kalau qori berubah dan ada audio aktif (play/pause) → reload dengan qori baru
    if (prevQori && prevQori !== window.__activeQori) {
        if (typeof __audioAyat !== 'undefined' && __audioAyat &&
            typeof __audioObj   !== 'undefined' && __audioObj) {
            const currentSurah   = __audioAyat.surah;
            const currentAyat    = __audioAyat.ayat;
            const currentBtn     = __audioAyat.btn;
            const wasPlaying     = typeof __audioPlaying !== 'undefined' && __audioPlaying;
            if (typeof stopAudio === 'function') stopAudio();
            // Auto-play kalau sebelumnya sedang play, auto-pause kalau sedang pause
            setTimeout(() => {
                if (typeof playAyatAudio === 'function') {
                    playAyatAudio(currentSurah, currentAyat, currentBtn);
                    // Kalau sebelumnya pause, pause lagi setelah canplay
                    if (!wasPlaying && typeof __audioObj !== 'undefined' && __audioObj) {
                        __audioObj.addEventListener('canplay', () => {
                            __audioObj.pause();
                        }, { once: true });
                    }
                }
            }, 100);
        }
    }

    // Show/hide terjemahan
    const showTrans = s.showTranslation !== false; // default true
    document.querySelectorAll('.terjemahan-ayat').forEach(el => {
        el.style.display = showTrans ? 'block' : 'none';
    });
    window.__showTranslation = showTrans;

    // Dark mode toggle (independent of bgColor)
    if (s.darkMode) {
        document.documentElement.classList.add('theme-dark');
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) toggle.checked = true;
        const lbl = document.getElementById('dark-mode-toggle-label');
        if (lbl) lbl.setAttribute('data-i18n', 'dark_mode_on'), lbl.textContent = getCurrentLang() === 'en' ? 'Active' : 'Aktif';
        const topBtn = document.getElementById('topbar-darkmode-btn');
        if (topBtn) { topBtn.querySelector('i').className = 'fa-solid fa-sun'; topBtn.classList.add('darkmode-active'); }
    } else {
        document.documentElement.classList.remove('theme-dark');
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) toggle.checked = false;
        const lbl = document.getElementById('dark-mode-toggle-label');
        if (lbl) lbl.setAttribute('data-i18n', 'dark_mode_off'), lbl.textContent = getCurrentLang() === 'en' ? 'Inactive' : 'Nonaktif';
        const topBtn = document.getElementById('topbar-darkmode-btn');
        if (topBtn) { topBtn.querySelector('i').className = 'fa-solid fa-moon'; topBtn.classList.remove('darkmode-active'); }
    }

    // Disable / enable bg-option buttons saat dark mode aktif
    document.querySelectorAll('.bg-option').forEach(btn => {
        if (s.darkMode) {
            btn.disabled = true;
            btn.classList.add('bg-option-disabled');
        } else {
            btn.disabled = false;
            btn.classList.remove('bg-option-disabled');
        }
    });
}

function initSettings() {
    const s = getSettings();
    applySettings(s);

    // Re-apply setiap kali ayat dirender (surah dibuka)
    document.addEventListener('ayat-rendered', () => applySettings(getSettings()));

    const overlay     = document.getElementById('settings-overlay');
    const openBtn     = document.getElementById('open-settings-btn');
    const closeBtn    = document.getElementById('close-settings-btn');
    const slider      = document.getElementById('font-size-slider');
    const display     = document.getElementById('font-size-display');
    const incBtn      = document.getElementById('font-increase');
    const decBtn      = document.getElementById('font-decrease');
    const latinSlider = document.getElementById('latin-font-size-slider');
    const latinDisplay= document.getElementById('latin-font-size-display');
    const latinIncBtn = document.getElementById('latin-font-increase');
    const latinDecBtn = document.getElementById('latin-font-decrease');
    const transSlider = document.getElementById('trans-font-size-slider');
    const transDisplay= document.getElementById('trans-font-size-display');
    const transIncBtn = document.getElementById('trans-font-increase');
    const transDecBtn = document.getElementById('trans-font-decrease');
    const bgOptions   = document.querySelectorAll('.bg-option');
    const selectedLbl = document.getElementById('bg-selected-name');
    const resetBtn    = document.getElementById('settings-reset-btn');
    const fontSelect  = document.getElementById('arab-font-select');
    const fontPreview = document.getElementById('arab-font-preview');

    if (!overlay) return;

    // Set initial UI state
    slider.value = s.fontSize;
    display.textContent = s.fontSize + 'px';
    markBgSelected(s.bgColor, s.bgName, bgOptions, selectedLbl);

    // Font select initial
    if (fontSelect && s.arabFont) {
        fontSelect.value = s.arabFont;
    }
    if (fontPreview && s.arabFont) {
        fontPreview.style.fontFamily = "'" + s.arabFont + "', serif";
    }

    // Open / close
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('open');
        // Animate panel masuk
        const panel = overlay.querySelector('.settings-panel');
        if (panel) {
            panel.classList.remove('animate__animated','animate__fadeInRight');
            void panel.offsetWidth; // reflow
            panel.classList.add('animate__animated','animate__fadeInRight');
            panel.style.animationDuration = '0.3s';
        }
    });
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });

    // Font size — slider
    slider.addEventListener('input', () => {
        const val = parseInt(slider.value);
        display.textContent = val + 'px';
        const cur = getSettings();
        cur.fontSize = val;
        saveSettings(cur);
        applySettings(cur);
    });

    // Font size — A+ / A−
    incBtn.addEventListener('click', () => {
        const val = Math.min(64, parseInt(slider.value) + 2);
        slider.value = val;
        slider.dispatchEvent(new Event('input'));
    });
    decBtn.addEventListener('click', () => {
        const val = Math.max(24, parseInt(slider.value) - 2);
        slider.value = val;
        slider.dispatchEvent(new Event('input'));
    });

    // Latin font size — slider
    if (latinSlider) {
        latinSlider.value = s.latinFontSize || 13;
        latinDisplay.textContent = (s.latinFontSize || 13) + 'px';

        latinSlider.addEventListener('input', () => {
            const val = parseInt(latinSlider.value);
            latinDisplay.textContent = val + 'px';
            const cur = getSettings();
            cur.latinFontSize = val;
            saveSettings(cur);
            applySettings(cur);
        });
    }
    if (latinIncBtn) {
        latinIncBtn.addEventListener('click', () => {
            const val = Math.min(22, parseInt(latinSlider.value) + 1);
            latinSlider.value = val;
            latinSlider.dispatchEvent(new Event('input'));
        });
    }
    if (latinDecBtn) {
        latinDecBtn.addEventListener('click', () => {
            const val = Math.max(11, parseInt(latinSlider.value) - 1);
            latinSlider.value = val;
            latinSlider.dispatchEvent(new Event('input'));
        });
    }

    // Translation font size — slider
    if (transSlider) {
        transSlider.value = s.transFontSize || 13;
        transDisplay.textContent = (s.transFontSize || 13) + 'px';

        transSlider.addEventListener('input', () => {
            const val = parseInt(transSlider.value);
            transDisplay.textContent = val + 'px';
            const cur = getSettings();
            cur.transFontSize = val;
            saveSettings(cur);
            applySettings(cur);
        });
    }
    if (transIncBtn) {
        transIncBtn.addEventListener('click', () => {
            const val = Math.min(20, parseInt(transSlider.value) + 1);
            transSlider.value = val;
            transSlider.dispatchEvent(new Event('input'));
        });
    }
    if (transDecBtn) {
        transDecBtn.addEventListener('click', () => {
            const val = Math.max(11, parseInt(transSlider.value) - 1);
            transSlider.value = val;
            transSlider.dispatchEvent(new Event('input'));
        });
    }

    // Background color
    bgOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            const lang  = getCurrentLang();
            const name  = (lang === 'en' ? btn.dataset.nameEn : btn.dataset.nameId) || btn.dataset.nameId || btn.dataset.name || '';
            const cur = getSettings();
            cur.bgColor = color;
            cur.bgName  = name;
            saveSettings(cur);
            applySettings(cur);
            markBgSelected(color, name, bgOptions, selectedLbl);
        });
    });

    // Font Arab select
    if (fontSelect) {
        fontSelect.addEventListener('change', () => {
            const font = fontSelect.value;
            const cur = getSettings();
            cur.arabFont = font;
            saveSettings(cur);
            applySettings(cur);
            if (fontPreview) fontPreview.style.fontFamily = "'" + font + "', serif";
        });
    }

    // Qori select
    const qoriSelect = document.getElementById('qori-select');
    if (qoriSelect) {
        qoriSelect.value = s.qori || '05';
        qoriSelect.addEventListener('change', () => {
            const cur = getSettings();
            cur.qori = qoriSelect.value;
            saveSettings(cur);
            applySettings(cur);
        });
    }

    // Dark mode toggle (in settings panel)
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.checked = s.darkMode || false;
        darkModeToggle.addEventListener('change', () => {
            const cur = getSettings();
            cur.darkMode = darkModeToggle.checked;
            // If dark mode on, also set bgColor to dark navy
            if (cur.darkMode) {
                cur.bgColor = '#1a2e45';
                cur.bgName  = getCurrentLang() === 'en' ? 'Dark Navy' : 'Biru Gelap';
            } else {
                cur.bgColor = '#ffffff';
                cur.bgName  = getCurrentLang() === 'en' ? 'White' : 'Putih';
            }
            saveSettings(cur);
            applySettings(cur);
            markBgSelected(cur.bgColor, cur.bgName, bgOptions, selectedLbl);
        });
    }

    // Auto-play toggle
    const autoPlayToggle = document.getElementById('autoplay-toggle');
    const autoPlayLabel  = document.getElementById('autoplay-label');
    if (autoPlayToggle) {
        autoPlayToggle.checked = s.autoPlay === true;
        autoPlayToggle.addEventListener('change', () => {
            const cur = getSettings();
            cur.autoPlay = autoPlayToggle.checked;
            saveSettings(cur);
            if (autoPlayLabel) {
                autoPlayLabel.textContent = t(cur.autoPlay ? 'autoplay_on' : 'autoplay_off');
            }
            if (typeof updateAutoPlayBtn === 'function') updateAutoPlayBtn();
        });
    }

    // Show/hide translation toggle
    const showTransToggle = document.getElementById('show-translation-toggle');    const showTransLabel  = document.getElementById('show-translation-label');
    if (showTransToggle) {
        showTransToggle.checked = s.showTranslation !== false;
        showTransToggle.addEventListener('change', () => {
            const cur = getSettings();
            cur.showTranslation = showTransToggle.checked;
            saveSettings(cur);
            applySettings(cur);
            if (showTransLabel) {
                showTransLabel.setAttribute('data-i18n', cur.showTranslation ? 'trans_visible' : 'trans_hidden');
                showTransLabel.textContent = t(cur.showTranslation ? 'trans_visible' : 'trans_hidden');
            }
        });
    }

    // Reset
    resetBtn.addEventListener('click', () => {
        saveSettings(Object.assign({}, SETTINGS_DEFAULT));
        const s = getSettings();
        slider.value = s.fontSize;
        display.textContent = s.fontSize + 'px';
        if (latinSlider) { latinSlider.value = s.latinFontSize; latinDisplay.textContent = s.latinFontSize + 'px'; }
        if (transSlider) { transSlider.value = s.transFontSize; transDisplay.textContent = s.transFontSize + 'px'; }
        applySettings(s);
        markBgSelected(s.bgColor, s.bgName, bgOptions, selectedLbl);
        if (fontSelect) fontSelect.value = s.arabFont;
        if (fontPreview) fontPreview.style.fontFamily = "'" + s.arabFont + "', serif";
        if (qoriSelect) qoriSelect.value = s.qori || '05';
        if (darkModeToggle) darkModeToggle.checked = false;
        if (autoPlayToggle) { autoPlayToggle.checked = false; }
        if (autoPlayLabel)  { autoPlayLabel.textContent = t('autoplay_off'); }
        if (showTransToggle) { showTransToggle.checked = true; }
        if (showTransLabel)  { showTransLabel.setAttribute('data-i18n', 'trans_visible'); showTransLabel.textContent = t('trans_visible'); }
    });
}

function initDarkModeTopbar() {
    const btn = document.getElementById('topbar-darkmode-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const cur = getSettings();
        cur.darkMode = !cur.darkMode;
        cur.bgColor  = cur.darkMode ? '#1a2e45' : '#ffffff';
        cur.bgName   = cur.darkMode
            ? (getCurrentLang() === 'en' ? 'Dark Navy' : 'Biru Gelap')
            : (getCurrentLang() === 'en' ? 'White'     : 'Putih');
        saveSettings(cur);
        applySettings(cur);

        // Sync settings panel toggle
        const panelToggle = document.getElementById('dark-mode-toggle');
        if (panelToggle) panelToggle.checked = cur.darkMode;
        const panelLabel = document.getElementById('dark-mode-toggle-label');
        if (panelLabel) {
            panelLabel.setAttribute('data-i18n', cur.darkMode ? 'dark_mode_on' : 'dark_mode_off');
            panelLabel.textContent = cur.darkMode
                ? (getCurrentLang() === 'en' ? 'Active'   : 'Aktif')
                : (getCurrentLang() === 'en' ? 'Inactive' : 'Nonaktif');
        }

        // Animate icon
        const icon = btn.querySelector('i');
        icon.classList.add('animate__animated', 'animate__rotateIn');
        icon.style.animationDuration = '0.4s';
        setTimeout(() => icon.classList.remove('animate__animated', 'animate__rotateIn'), 500);
    });
}

function initSettingsGroups() {
    // Wire semua .settings-group-trigger ke toggle expand/collapse
    document.querySelectorAll('.settings-group-trigger').forEach(trigger => {
        const group = trigger.closest('.settings-group');
        if (!group) return;
        trigger.addEventListener('click', () => {
            const isOpen = group.classList.contains('open');
            // Tutup semua group dulu (accordion behavior)
            document.querySelectorAll('.settings-group').forEach(g => g.classList.remove('open'));
            // Toggle yang diklik
            if (!isOpen) group.classList.add('open');
        });
    });
}

function markBgSelected(color, name, bgOptions, selectedLbl) {
    bgOptions.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === color);
    });
    if (selectedLbl) selectedLbl.textContent = name;
}
