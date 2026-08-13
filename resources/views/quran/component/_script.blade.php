{{-- ============================================================
   _script.blade.php
   Semua modul JS sudah di-bundle oleh Vite menjadi satu file.
   Urutan load diatur di resources/js/app.js
   ============================================================ --}}

{{-- Vite bundled JS (menggantikan 16 script tags manual) --}}
@vite(['resources/js/app.js'])

<script>

// Init saat halaman load
document.addEventListener('DOMContentLoaded', function () {
    // i18n harus pertama agar t() tersedia untuk semua modul
    try { initI18n(); } catch(e) { console.error('initI18n error:', e); }
    try { initSettings(); } catch(e) { console.error('initSettings error:', e); }
    try { applySettings(getSettings()); } catch(e) { console.error('applySettings error:', e); }
    // Render data dari localStorage
    try { renderFavorites(); } catch(e) { console.error('renderFavorites error:', e); }
    // Init fitur-fitur
    try { initLastReadPanel(); } catch(e) { console.error('initLastReadPanel error:', e); }
    try { initSaveLastReadSlide(); } catch(e) { console.error('initSaveLastReadSlide error:', e); }
    try { initBookmarks(); } catch(e) { console.error('initBookmarks error:', e); }
    try { initFavoritesNav(); } catch(e) { console.error('initFavoritesNav error:', e); }
    try { initMobileDrawer(); } catch(e) { console.error('initMobileDrawer error:', e); }
    try { initJuz(); } catch(e) { console.error('initJuz error:', e); }
    try { initKontenGroup(); } catch(e) { console.error('initKontenGroup error:', e); }
    try { initDataSourceModal(); } catch(e) { console.error('initDataSourceModal error:', e); }
    try { initTajwidGuide(); } catch(e) { console.error('initTajwidGuide error:', e); }
    try { initSidebarRightCollapse(); } catch(e) { console.error('initSidebarRightCollapse error:', e); }
    try { initTajweedToggle(); } catch(e) { console.error('initTajweedToggle error:', e); }
    try { initDarkModeTopbar(); } catch(e) { console.error('initDarkModeTopbar error:', e); }
    try { initSettingsGroups(); } catch(e) { console.error('initSettingsGroups error:', e); }
    try { initUsageTracker();   } catch(e) { console.error('initUsageTracker error:', e); }
    try { initBackupPanel();    } catch(e) { console.error('initBackupPanel error:', e); }
    try { initJanjiAllah();     } catch(e) { console.error('initJanjiAllah error:', e); }
    try { initHadist();         } catch(e) { console.error('initHadist error:', e); }
    try { initPrayerTime();    } catch(e) { console.error('initPrayerTime error:', e); }
    try { initPwa();           } catch(e) { console.error('initPwa error:', e); }
});

</script>
