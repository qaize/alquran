{{-- ============================================================
   _script.blade.php
   Entry point JS — load order matters:
   1. toast.js      (showToast)
   2. settings.js   (t, getSettings, getCurrentLang, applySettings)
   3. favorites.js  (toggleFavorite, isFavorite, renderFavorites)
   4. bookmarks.js  (toggleBookmarkAyat, renderBookmarks)
   5. last-read.js  (saveToCategory, showSaveLastReadSlide, jumpToLastRead)
   6. audio.js      (playAyatAudio, setActiveAyatData)
   7. tajweed.js    (applyTajweed, openTajwidGuide)
   8. modals.js     (openTafsir, openAsbabunNuzul, initDataSourceModal)
   9. navigation.js (initJuz, initMobileDrawer)
   ============================================================ --}}

{{-- External libs --}}
<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>

{{-- App modules (load order: dependencies first) --}}
<script src="{{asset('js/toast.js')}}"></script>
<script src="{{asset('js/settings.js')}}"></script>
<script src="{{asset('js/favorites.js')}}"></script>
<script src="{{asset('js/bookmarks.js')}}"></script>
<script src="{{asset('js/last-read.js')}}"></script>
<script src="{{asset('js/audio.js')}}"></script>
<script src="{{asset('js/tajweed.js')}}"></script>
<script src="{{asset('js/modals.js')}}"></script>
<script src="{{asset('js/navigation.js')}}"></script>

{{-- Core app — dimuat terakhir karena memanggil fungsi dari semua modul di atas --}}
<script src="{{asset('js/script.js')}}"></script>

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
    try { initDataSourceModal(); } catch(e) { console.error('initDataSourceModal error:', e); }
    try { initTajwidGuide(); } catch(e) { console.error('initTajwidGuide error:', e); }
    try { initSidebarRightCollapse(); } catch(e) { console.error('initSidebarRightCollapse error:', e); }
    try { initTajweedToggle(); } catch(e) { console.error('initTajweedToggle error:', e); }
    try { initDarkModeTopbar(); } catch(e) { console.error('initDarkModeTopbar error:', e); }
    try { initSettingsGroups(); } catch(e) { console.error('initSettingsGroups error:', e); }
});

/* ──────────────────────────────────────────────
   AUTOCOMPLETE (jQuery UI)
   ────────────────────────────────────────────── */
$(function () {
    var listSurah = [];
    loadAllSurah().then(function (data) {
        data.forEach(function (element) {
            listSurah.push(element.nama_latin);
        });
    });

    $('#search-input').autocomplete({
        source: function (request, response) {
            response(listSurah.filter(function (s) {
                return s.toLowerCase().includes(request.term.toLowerCase());
            }));
        },
        minLength: 1
    });
});
</script>