<link href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel="stylesheet">
<script src="{{asset('js/script.js')}}"></script>
<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
<script>
/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   FAVORITES â€” localStorage
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FAVORITES_KEY = 'quran_favorites';

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveFavorites(list) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(nomor) {
    return getFavorites().some(f => f.nomor === nomor);
}

function addFavorite(nomor, namaLatin, arti) {
    const list = getFavorites();
    if (!list.some(f => f.nomor === nomor)) {
        list.push({ nomor, namaLatin, arti });
        saveFavorites(list);
    }
    renderFavorites();
}

function removeFavorite(nomor) {
    const list = getFavorites().filter(f => f.nomor !== nomor);
    saveFavorites(list);
    renderFavorites();
    // Update bintang di kartu jika terlihat
    const starBtn = document.getElementById(`star-${nomor}`);
    if (starBtn) {
        starBtn.classList.remove('favorited');
        starBtn.title = t('add_favorite');
    }
}

function renderFavorites() {
    const container = document.getElementById('favorites-list');
    const emptyMsg  = document.getElementById('favorites-empty');
    if (!container) return;

    // Hapus item lama (bukan pesan kosong)
    container.querySelectorAll('.fav-item').forEach(el => el.remove());

    const list = getFavorites();
    if (list.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'flex';
        renderFavoritesBadge();
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    list.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'fav-item';
        item.innerHTML = `
            <button class="fav-read-btn" title="${t('read_surah')}">
                <span class="fav-nomor">${fav.nomor}</span>
                <span class="fav-name">${fav.namaLatin}</span>
                <span class="fav-arti">${fav.arti}</span>
            </button>
            <button class="fav-remove-btn" title="${t('remove_favorite')}" data-nomor="${fav.nomor}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        // Klik nama â†’ buka surah
        item.querySelector('.fav-read-btn').addEventListener('click', () => {
            loadSurahDetails(fav.nomor);
        });
        // Klik hapus
        item.querySelector('.fav-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(fav.nomor);
        });
        container.appendChild(item);
    });
    // Sync badge di nav kiri
    if (typeof renderFavoritesBadge === 'function') renderFavoritesBadge();
}

// Toggle favorit dari kartu surah
function toggleFavorite(nomor, namaLatin, arti) {
    if (isFavorite(nomor)) {
        removeFavorite(nomor);
    } else {
        addFavorite(nomor, namaLatin, arti);
        // Update bintang
        const starBtn = document.getElementById(`star-${nomor}`);
        if (starBtn) {
            starBtn.classList.add('favorited');
            starBtn.title = t('remove_favorite');
        }
    }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   FAVORITES NAV PANEL (sidebar kiri)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderFavoritesPanel() {
    const list      = getFavorites();
    const container = document.getElementById('favorites-panel-list');
    const emptyMsg  = document.getElementById('favorites-panel-empty');
    const countEl   = document.getElementById('favorites-panel-count');
    if (!container) return;

    container.querySelectorAll('.fav-panel-item').forEach(el => el.remove());
    if (countEl) countEl.textContent = list.length;

    if (list.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'flex';
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    list.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'fav-panel-item';
        item.innerHTML = `
            <div class="fav-panel-main">
                <span class="fav-panel-nomor">${fav.nomor}</span>
                <div class="fav-panel-info">
                    <span class="fav-panel-name">${fav.namaLatin}</span>
                    <span class="fav-panel-arti">${fav.arti}</span>
                </div>
            </div>
            <button class="fav-panel-del" title="${t('remove_favorite')}" data-nomor="${fav.nomor}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        item.querySelector('.fav-panel-main').addEventListener('click', () => {
            document.getElementById('favorites-panel-overlay').classList.remove('open');
            loadSurahDetails(fav.nomor);
        });
        item.querySelector('.fav-panel-del').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(fav.nomor);
            renderFavoritesPanel();
            renderFavoritesBadge();
        });
        container.appendChild(item);
    });
}

function renderFavoritesBadge() {
    const badge = document.getElementById('favorites-count-badge');
    if (!badge) return;
    const count = getFavorites().length;
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

function initFavoritesNav() {
    renderFavoritesBadge();

    const overlay  = document.getElementById('favorites-panel-overlay');
    const openBtn  = document.getElementById('nav-favorites-btn');
    const closeBtn = document.getElementById('close-favorites-panel-btn');
    if (!overlay) return;

    openBtn && openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderFavoritesPanel();
        overlay.classList.add('open');
        document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
        document.body.style.overflow = '';
    });

    closeBtn && closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
}

// Init saat halaman load
document.addEventListener('DOMContentLoaded', function () {
    try { renderFavorites(); } catch(e) { console.error('renderFavorites error:', e); }
    try { initI18n(); } catch(e) { console.error('initI18n error:', e); }
    try { initSettings(); } catch(e) { console.error('initSettings error:', e); }
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
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   TAJWEED â€” Colored Tajwid from alquran.cloud API
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const TAJWEED_KEY = 'quran_tajweed_enabled';
const tajweedCache = new Map();
let lastRenderedSurah = null;

function isTajweedEnabled() {
    return localStorage.getItem(TAJWEED_KEY) === 'true';
}

function setTajweedEnabled(val) {
    localStorage.setItem(TAJWEED_KEY, val ? 'true' : 'false');
}

// Mapping dari identifier tag ke CSS class
const TAJWEED_MAP = {
    'h': 'ham_wasl',
    's': 'slnt',
    'l': 'slnt',
    'n': 'madda_normal',
    'p': 'madda_permissible',
    'm': 'madda_necessary',
    'q': 'qlq',
    'o': 'madda_obligatory',
    'c': 'ikhf_shfw',
    'f': 'ikhf',
    'w': 'idghm_shfw',
    'i': 'iqlb',
    'a': 'idgh_ghn',
    'u': 'idgh_w_ghn',
    'd': 'idgh_mus',
    'b': 'idgh_mut',
    'g': 'ghn'
};

// Mapping deskripsi tajwid: nama + cara baca
const TAJWEED_INFO = {
    'h': { name: 'Hamzat Wasl', desc: 'Hamzah wasal tidak dibaca ketika menyambung bacaan dengan kata sebelumnya. Dibaca hanya saat memulai (ibtida) dari kata tersebut.' },
    's': { name: 'Huruf Sukun', desc: 'Huruf yang tidak memiliki harakat (tanda baca). Diucapkan dengan mematikan huruf tanpa menambahkan bunyi vokal apapun.' },
    'l': { name: 'Lam Syamsiyyah', desc: 'Huruf Lam pada kata sandang (al) tidak dibunyikan. Bacaan langsung berpindah ke huruf setelahnya yang dibaca dengan tasydid (penekanan ganda).' },
    'n': { name: 'Mad Thabi\'i', desc: 'Mad asli. Dipanjangkan selama 2 harakat (satu alif). Terjadi ketika ada huruf mad (Ø§ Ùˆ ÙŠ) dan tidak bertemu hamzah atau sukun setelahnya.' },
    'p': { name: 'Mad Jaiz Munfashil', desc: 'Mad yang dipisah. Terjadi saat huruf mad di akhir kata bertemu hamzah di awal kata berikutnya. Boleh dibaca 2, 4, atau 5 harakat.' },
    'm': { name: 'Mad Lazim', desc: 'Mad yang wajib dipanjangkan selama 6 harakat (tiga alif). Terjadi saat huruf mad bertemu huruf bertasydid atau bersukun asli dalam satu kata.' },
    'q': { name: 'Qalqalah', desc: 'Bunyi pantulan atau getaran pada huruf Qaf, Tha, Ba, Jim, dan Dal (Ù‚Ø·Ø¨Ø¬Ø¯) ketika huruf tersebut bersukun atau saat berhenti (waqaf).' },
    'o': { name: 'Mad Wajib Muttashil', desc: 'Mad yang wajib disambung. Terjadi saat huruf mad dan hamzah berada dalam satu kata. Wajib dipanjangkan selama 4 sampai 5 harakat.' },
    'c': { name: 'Ikhfa Syafawi', desc: 'Mim mati bertemu huruf Ba. Mim dibunyikan secara samar-samar melalui bibir yang hampir merapat, disertai dengung selama 2 harakat.' },
    'f': { name: 'Ikhfa Haqiqi', desc: 'Nun mati atau tanwin bertemu salah satu dari 15 huruf ikhfa. Nun dibunyikan samar (antara izhar dan idgham), disertai dengung selama 2 harakat. Posisi lidah menyesuaikan huruf ikhfa yang ditemui.' },
    'w': { name: 'Idgham Syafawi', desc: 'Mim mati bertemu huruf Mim. Kedua mim dilebur menjadi satu mim bertasydid. Dibaca dengan dengung selama 2 harakat.' },
    'i': { name: 'Iqlab', desc: 'Nun mati atau tanwin bertemu huruf Ba. Bunyi nun diganti (ditukar) menjadi bunyi Mim, lalu dibaca dengan dengung selama 2 harakat sambil merapatkan kedua bibir.' },
    'a': { name: 'Idgham bi Ghunnah', desc: 'Nun mati atau tanwin bertemu huruf Ya, Nun, Mim, atau Waw (ÙŠÙ†Ù…Ùˆ). Nun dilebur ke huruf sesudahnya dan dibaca dengan dengung selama 2 harakat.' },
    'u': { name: 'Idgham bila Ghunnah', desc: 'Nun mati atau tanwin bertemu huruf Lam atau Ra (Ù„ Ø±). Nun dilebur sepenuhnya ke huruf sesudahnya. Dibaca tanpa dengung sama sekali.' },
    'd': { name: 'Idgham Mutajanisain', desc: 'Dua huruf yang memiliki makhraj (tempat keluar) yang sama bertemu berurutan. Huruf pertama yang mati dilebur ke huruf kedua yang berharakat.' },
    'b': { name: 'Idgham Mutaqaribain', desc: 'Dua huruf yang makhrajnya berdekatan bertemu berurutan. Huruf pertama yang mati dilebur ke huruf kedua yang berharakat.' },
    'g': { name: 'Ghunnah', desc: 'Bunyi dengung yang keluar dari pangkal hidung selama 2 harakat. Terjadi pada huruf Nun atau Mim yang bertasydid (ditandai dengan tasydid/syaddah).' }
};

/**
 * Parse raw tajweed text from API ke HTML berwarna.
 * Format tag: [X:NUM[TEXT] atau [X[TEXT]
 * Contoh: [h:1[Ù±] atau [n[Ù…ÙŽÙ°]
 */
function parseTajweedText(rawText) {
    if (!rawText) return '';
    let result = '';
    let i = 0;
    while (i < rawText.length) {
        if (rawText[i] === '[') {
            // Ambil identifier (1 huruf setelah '[')
            const identifier = rawText[i + 1];
            if (identifier && TAJWEED_MAP[identifier]) {
                const cssClass = TAJWEED_MAP[identifier];
                // Cari posisi '[' kedua (pembuka teks)
                let j = i + 2;
                // Skip optional :NUM
                if (rawText[j] === ':') {
                    while (j < rawText.length && rawText[j] !== '[') {
                        j++;
                    }
                }
                // Sekarang j menunjuk ke '[' pembuka teks
                if (rawText[j] === '[') {
                    j++; // Masuk ke isi teks
                    // Cari ']' penutup
                    let textContent = '';
                    let depth = 1;
                    while (j < rawText.length && depth > 0) {
                        if (rawText[j] === '[') depth++;
                        else if (rawText[j] === ']') {
                            depth--;
                            if (depth === 0) break;
                        }
                        textContent += rawText[j];
                        j++;
                    }
                    const info = TAJWEED_INFO[identifier] || {};
                    const tjName = (info.name || '').replace(/"/g, '&quot;');
                    const tjDesc = (info.desc || '').replace(/"/g, '&quot;');
                    result += `<span class="tj-${cssClass}" data-tj-name="${tjName}" data-tj-desc="${tjDesc}">${textContent}</span>`;
                    i = j + 1; // Skip ']' penutup
                } else {
                    result += rawText[i];
                    i++;
                }
            } else {
                result += rawText[i];
                i++;
            }
        } else {
            result += rawText[i];
            i++;
        }
    }
    return result;
}

/**
 * Fetch data tajwid untuk satu surah dari alquran.cloud API.
 * Returns: Map<numberInSurah, parsedHTML>
 */
function fetchTajweedSurah(nomorSurah) {
    if (tajweedCache.has(nomorSurah)) {
        return Promise.resolve(tajweedCache.get(nomorSurah));
    }
    return fetch(`https://api.alquran.cloud/v1/surah/${nomorSurah}/quran-tajweed`)
        .then(res => res.json())
        .then(json => {
            const ayahs = json.data && json.data.ayahs ? json.data.ayahs : [];
            const map = new Map();
            ayahs.forEach(ayah => {
                map.set(ayah.numberInSurah, parseTajweedText(ayah.text));
            });
            tajweedCache.set(nomorSurah, map);
            return map;
        })
        .catch(err => {
            console.error('Tajweed fetch error:', err);
            return new Map();
        });
}

/**
 * Apply tajwid berwarna ke ayat-ayat yang sudah dirender di DOM.
 */
function applyTajweedToRendered(nomorSurah) {
    if (!isTajweedEnabled()) return;
    fetchTajweedSurah(nomorSurah).then(tajweedMap => {
        tajweedMap.forEach((html, nomorAyat) => {
            const el = document.querySelector(`#isi-ayat${nomorAyat} .arabic`);
            if (el && html) {
                // Simpan teks asli jika belum
                if (!el.dataset.originalText) {
                    el.dataset.originalText = el.textContent;
                }
                el.innerHTML = html;
                el.classList.add('tajweed-active');
            }
        });
    });
}

/**
 * Kembalikan teks Arab ke versi non-tajwid.
 */
function removeTajweedFromRendered() {
    document.querySelectorAll('.arabic.tajweed-active').forEach(el => {
        if (el.dataset.originalText) {
            el.textContent = el.dataset.originalText;
            el.classList.remove('tajweed-active');
        }
    });
}

/**
 * Init toggle di settings dan event listener.
 */
function initTajweedToggle() {
    const toggle = document.getElementById('tajweed-toggle');
    const label  = document.getElementById('tajweed-toggle-label');
    const legend = document.getElementById('tajweed-legend');
    if (!toggle) return;

    // Restore state
    const enabled = isTajweedEnabled();
    toggle.checked = enabled;
    if (label) label.textContent = enabled ? (typeof t === 'function' ? t('tajweed_on') : 'Aktif') : (typeof t === 'function' ? t('tajweed_off') : 'Nonaktif');
    if (legend) legend.style.display = enabled ? 'flex' : 'none';

    toggle.addEventListener('change', () => {
        const isOn = toggle.checked;
        setTajweedEnabled(isOn);
        if (label) label.textContent = isOn ? (typeof t === 'function' ? t('tajweed_on') : 'Aktif') : (typeof t === 'function' ? t('tajweed_off') : 'Nonaktif');
        if (legend) legend.style.display = isOn ? 'flex' : 'none';

        if (isOn) {
            // Apply ke ayat yang sedang ditampilkan
            if (lastRenderedSurah) {
                applyTajweedToRendered(lastRenderedSurah);
            }
        } else {
            removeTajweedFromRendered();
        }
    });

    // Listen event saat ayat baru dirender
    document.addEventListener('ayat-rendered', (e) => {
        const ns = e.detail && e.detail.nomorSurah ? e.detail.nomorSurah : (typeof nomorSurah !== 'undefined' ? nomorSurah : null);
        if (ns) lastRenderedSurah = ns;
        if (isTajweedEnabled() && ns) {
            setTimeout(() => applyTajweedToRendered(ns), 150);
        }
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PANDUAN TAJWID â€” Modal Besar
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initTajwidGuide() {
    const btn = document.getElementById('nav-tajwid-guide-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let modal = document.getElementById('tajwid-guide-overlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'tajwid-guide-overlay';
            modal.className = 'tajwid-guide-overlay';
            modal.innerHTML = getTajwidGuideHTML();
            document.body.appendChild(modal);
            modal.querySelector('#tajwid-guide-close').addEventListener('click', () => modal.classList.remove('open'));
            modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.classList.remove('open'); });
        }
        modal.classList.add('open');
        document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
        document.body.style.overflow = '';
    });
}

function getTajwidGuideHTML() {
    return `
    <div class="tajwid-guide-modal">
        <div class="tajwid-guide-header">
            <div class="tajwid-guide-title">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>Panduan Ilmu Tajwid</span>
            </div>
            <button class="asbab-modal-close" id="tajwid-guide-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="tajwid-guide-body">

            <section class="tg-section">
                <h3 class="tg-section-title"><i class="fa-solid fa-circle-info"></i> Hukum Nun Mati &amp; Tanwin</h3>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">1. Izhar Halqi</span>
                        <span class="tg-rule-badge">Dibaca Jelas</span>
                    </div>
                    <p class="tg-rule-desc">Nun mati atau tanwin bertemu salah satu dari 6 huruf halqi (tenggorokan). Dibaca jelas tanpa dengung.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">ء هـ ع ح غ خ</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">مَنْ آمَنَ — يَنْهَوْنَ — مِنْ عِلْمٍ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">2. Idgham bi Ghunnah</span>
                        <span class="tg-rule-badge tg-badge-green">Lebur + Dengung</span>
                    </div>
                    <p class="tg-rule-desc">Nun mati atau tanwin bertemu huruf Ya, Nun, Mim, atau Waw. Dilebur ke huruf sesudahnya dengan dengung 2 harakat.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">ي ن م و</span> (disingkat: يَنْمُو)</div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">مَنْ يَقُولُ — مِنْ نِعْمَةٍ — مِنْ مَاءٍ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">3. Idgham bila Ghunnah</span>
                        <span class="tg-rule-badge tg-badge-blue">Lebur Tanpa Dengung</span>
                    </div>
                    <p class="tg-rule-desc">Nun mati atau tanwin bertemu huruf Lam atau Ra. Dilebur sepenuhnya tanpa dengung.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">ل ر</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">مِنْ رَبِّهِمْ — مِنْ لَدُنْهُ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">4. Iqlab</span>
                        <span class="tg-rule-badge tg-badge-cyan">Ganti Jadi Mim</span>
                    </div>
                    <p class="tg-rule-desc">Nun mati atau tanwin bertemu huruf Ba. Bunyi nun diganti menjadi Mim, disertai dengung 2 harakat.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">ب</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">مِنْ بَعْدِ — أَنْبِئُونِي — سَمِيعٌۢ بَصِيرٌ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">5. Ikhfa Haqiqi</span>
                        <span class="tg-rule-badge tg-badge-purple">Dibaca Samar + Dengung</span>
                    </div>
                    <p class="tg-rule-desc">Nun mati atau tanwin bertemu salah satu dari 15 huruf ikhfa. Dibaca samar (antara izhar dan idgham) disertai dengung 2 harakat.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">مِنْ قَبْلُ — أَنْتُمْ — يُنْفِقُونَ</span></div>
                </div>
            </section>

            <section class="tg-section">
                <h3 class="tg-section-title"><i class="fa-solid fa-circle-info"></i> Hukum Mim Mati</h3>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">1. Idgham Syafawi (Mimi)</span>
                        <span class="tg-rule-badge tg-badge-green">Lebur + Dengung</span>
                    </div>
                    <p class="tg-rule-desc">Mim mati bertemu Mim. Dilebur jadi satu mim bertasydid dengan dengung 2 harakat.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">م</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">لَهُمْ مَا — أَمْ مَنْ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">2. Ikhfa Syafawi</span>
                        <span class="tg-rule-badge tg-badge-purple">Samar + Dengung</span>
                    </div>
                    <p class="tg-rule-desc">Mim mati bertemu Ba. Mim dibunyikan samar dengan bibir hampir merapat, disertai dengung 2 harakat.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">ب</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">تَرْمِيهِمْ بِحِجَارَةٍ — هُمْ بِهِ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">3. Izhar Syafawi</span>
                        <span class="tg-rule-badge">Dibaca Jelas</span>
                    </div>
                    <p class="tg-rule-desc">Mim mati bertemu huruf selain Mim dan Ba. Dibaca jelas tanpa dengung.</p>
                    <div class="tg-letters">Huruf: seluruh huruf selain <span class="tg-arab">م ب</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">أَمْ لَمْ — هُمْ فِيهَا</span></div>
                </div>
            </section>

            <section class="tg-section">
                <h3 class="tg-section-title"><i class="fa-solid fa-circle-info"></i> Hukum Mad (Panjang)</h3>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Mad Thabi'i (Asli)</span>
                        <span class="tg-rule-badge tg-badge-blue">2 Harakat</span>
                    </div>
                    <p class="tg-rule-desc">Huruf mad (alif, waw, ya) tidak bertemu hamzah atau sukun setelahnya. Panjangkan 2 harakat.</p>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">قَالَ — يَقُولُ — فِيهَا</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Mad Wajib Muttashil</span>
                        <span class="tg-rule-badge tg-badge-blue">4-5 Harakat</span>
                    </div>
                    <p class="tg-rule-desc">Huruf mad dan hamzah berada dalam satu kata. Wajib dipanjangkan 4-5 harakat.</p>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">جَاءَ — سُوءٌ — جِيءَ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Mad Jaiz Munfashil</span>
                        <span class="tg-rule-badge tg-badge-blue">2/4/5 Harakat</span>
                    </div>
                    <p class="tg-rule-desc">Huruf mad di akhir kata bertemu hamzah di awal kata berikutnya. Boleh dipanjangkan 2, 4, atau 5 harakat.</p>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">بِمَا أُنْزِلَ — قَالُوا آمَنَّا</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Mad Lazim</span>
                        <span class="tg-rule-badge tg-badge-blue">6 Harakat</span>
                    </div>
                    <p class="tg-rule-desc">Huruf mad bertemu huruf bersukun asli atau bertasydid dalam satu kata. Wajib 6 harakat.</p>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">الضَّالِّينَ — الْحَاقَّةُ — الٓمٓ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Mad 'Aridh lis Sukun</span>
                        <span class="tg-rule-badge tg-badge-blue">2/4/6 Harakat</span>
                    </div>
                    <p class="tg-rule-desc">Huruf mad bertemu huruf yang disukun karena waqaf (berhenti). Boleh 2, 4, atau 6 harakat.</p>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">نَسْتَعِينْ — الْعَالَمِينْ</span></div>
                </div>
            </section>

            <section class="tg-section">
                <h3 class="tg-section-title"><i class="fa-solid fa-circle-info"></i> Qalqalah</h3>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Qalqalah Sughra (Kecil)</span>
                        <span class="tg-rule-badge tg-badge-red">Memantul Ringan</span>
                    </div>
                    <p class="tg-rule-desc">Huruf qalqalah bersukun di tengah kata. Pantulan ringan.</p>
                    <div class="tg-letters">Huruf: <span class="tg-arab">ق ط ب ج د</span> (disingkat: قُطْبُ جَدٍّ)</div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">يَجْعَلُونَ — أَقْرَبُ — يَطْمَعُ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Qalqalah Kubra (Besar)</span>
                        <span class="tg-rule-badge tg-badge-red">Memantul Kuat</span>
                    </div>
                    <p class="tg-rule-desc">Huruf qalqalah berada di akhir kata saat waqaf (berhenti). Pantulan lebih kuat dan jelas.</p>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">الْفَلَقْ — مُحِيطْ — الْمَسَدْ</span></div>
                </div>
            </section>

            <section class="tg-section">
                <h3 class="tg-section-title"><i class="fa-solid fa-circle-info"></i> Ghunnah &amp; Lainnya</h3>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Ghunnah (Dengung)</span>
                        <span class="tg-rule-badge tg-badge-orange">2 Harakat</span>
                    </div>
                    <p class="tg-rule-desc">Bunyi dengung dari pangkal hidung selama 2 harakat. Terjadi pada Nun atau Mim bertasydid.</p>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">إِنَّ — ثُمَّ — أَنَّهُمْ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Lam Syamsiyyah</span>
                        <span class="tg-rule-badge">Lam Tidak Dibaca</span>
                    </div>
                    <p class="tg-rule-desc">Huruf Lam pada kata sandang (ال) tidak dibunyikan saat bertemu huruf syamsiyyah. Langsung baca huruf setelahnya dengan tasydid.</p>
                    <div class="tg-letters">Huruf Syamsiyyah: <span class="tg-arab">ت ث د ذ ر ز س ش ص ض ط ظ ل ن</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">الشَّمْسُ — النَّاسِ — الرَّحْمَنِ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Lam Qamariyyah</span>
                        <span class="tg-rule-badge">Lam Dibaca Jelas</span>
                    </div>
                    <p class="tg-rule-desc">Huruf Lam pada kata sandang (ال) tetap dibaca jelas saat bertemu huruf qamariyyah.</p>
                    <div class="tg-letters">Huruf Qamariyyah: <span class="tg-arab">ا ب ج ح خ ع غ ف ق ك م و هـ ي</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">الْقَمَرُ — الْكِتَابُ — الْحَمْدُ</span></div>
                </div>

                <div class="tg-rule">
                    <div class="tg-rule-header">
                        <span class="tg-rule-name">Idgham Mutajanisain</span>
                        <span class="tg-rule-badge tg-badge-green">Lebur</span>
                    </div>
                    <p class="tg-rule-desc">Dua huruf yang memiliki makhraj sama bertemu. Huruf pertama lebur ke huruf kedua.</p>
                    <div class="tg-letters">Pasangan: <span class="tg-arab">ت/د/ط — ث/ذ/ظ — ب/م</span></div>
                    <button class="tg-example-toggle" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><i class="fa-solid fa-chevron-down"></i> Lihat Contoh</button>
                    <div class="tg-example"><span class="tg-arab">قَدْ تَبَيَّنَ — إِذْ ظَلَمُوا</span></div>
                </div>
            </section>

            <section class="tg-section tg-source-section">
                <h3 class="tg-section-title"><i class="fa-solid fa-database"></i> Sumber Referensi</h3>
                <div class="tg-sources">
                    <p>&#8226; Tajweed Mushawwar &mdash; Dr. Ayman Rushdi Suwaid</p>
                    <p>&#8226; Tuhfatul Athfal &mdash; Sulaiman al-Jamzuri</p>
                    <p>&#8226; Al-Muqaddimah al-Jazariyyah &mdash; Ibn al-Jazari</p>
                    <p>&#8226; Kemenag RI &mdash; Panduan Baca Quran</p>
                    <p>&#8226; AlQuran.cloud &mdash; Tajweed Color Guide</p>
                </div>
            </section>

        </div>
    </div>`;
}



/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   DATA SOURCE â€” Modal
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initDataSourceModal() {
    const btn = document.getElementById('open-datasource-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let modal = document.getElementById('datasource-modal-overlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'datasource-modal-overlay';
            modal.className = 'asbab-modal-overlay';
            modal.innerHTML = `
                <div class="asbab-modal">
                    <div class="asbab-modal-header">
                        <div class="asbab-modal-title">
                            <i class="fa-solid fa-database"></i>
                            <span>Sumber Data</span>
                        </div>
                        <button class="asbab-modal-close" id="datasource-modal-close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="asbab-modal-body">
                        <div class="datasource-list">
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-book-quran"></i></div>
                                <div class="datasource-info">
                                    <h4>equran.id</h4>
                                    <p>Teks Arab, terjemahan bahasa Indonesia, transliterasi latin, dan tafsir Kemenag RI.</p>
                                    <a href="https://equran.id/" target="_blank">equran.id <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-palette"></i></div>
                                <div class="datasource-info">
                                    <h4>AlQuran Cloud</h4>
                                    <p>Data tajwid berwarna (color-coded) untuk setiap huruf Al-Quran berdasarkan hukum bacaan.</p>
                                    <a href="https://alquran.cloud/" target="_blank">alquran.cloud <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-scroll"></i></div>
                                <div class="datasource-info">
                                    <h4>Muslim API</h4>
                                    <p>Data Asbabun Nuzul (sebab turun ayat) dalam bahasa Indonesia, bersumber dari Kemenag RI.</p>
                                    <a href="https://muslim-api-three.vercel.app/" target="_blank">muslim-api <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-pen-nib"></i></div>
                                <div class="datasource-info">
                                    <h4>Quran Fonts CDN</h4>
                                    <p>Koleksi font Arab untuk tampilan mushaf (Amiri Quran, Scheherazade, Noorehuda, KFGQPC Hafs, Noto Naskh).</p>
                                    <a href="https://github.com/fawazahmed0/quran-api" target="_blank">quran-api fonts <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('#datasource-modal-close').addEventListener('click', () => modal.classList.remove('open'));
            modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.classList.remove('open'); });
        }
        modal.classList.add('open');
        // Tutup sidebar mobile jika terbuka
        document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   TAFSIR â€” Modal + Fetch dari equran.id API
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const tafsirCache = new Map();

function openTafsir(nomorSurah, nomorAyat) {
    let modal = document.getElementById('tafsir-modal-overlay');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'tafsir-modal-overlay';
        modal.className = 'asbab-modal-overlay';
        modal.innerHTML = `
            <div class="asbab-modal">
                <div class="asbab-modal-header">
                    <div class="asbab-modal-title">
                        <i class="fa-solid fa-book"></i>
                        <span>Tafsir Kemenag</span>
                    </div>
                    <button class="asbab-modal-close" id="tafsir-modal-close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="asbab-modal-body" id="tafsir-modal-body">
                    <div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> Memuat tafsir...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#tafsir-modal-close').addEventListener('click', () => modal.classList.remove('open'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }

    const body = modal.querySelector('#tafsir-modal-body');
    body.innerHTML = '<div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> Memuat tafsir...</div>';
    modal.classList.add('open');

    fetchTafsirSurah(nomorSurah).then(tafsirList => {
        const tafsir = tafsirList.find(t => t.ayat === nomorAyat || t.ayat === String(nomorAyat));
        if (!tafsir || !tafsir.teks) {
            body.innerHTML = '<div class="asbab-empty"><i class="fa-regular fa-file-lines"></i><p>Tafsir tidak tersedia untuk ayat ini.</p></div>';
            return;
        }
        body.innerHTML = `
            <div class="asbab-ayat-info">
                <span class="asbab-ayat-badge">Surah ${nomorSurah} : Ayat ${nomorAyat}</span>
            </div>
            <div class="asbab-content">${tafsir.teks.replace(/\n/g, '<br>')}</div>
        `;
    }).catch(() => {
        body.innerHTML = '<div class="asbab-empty"><p>Gagal memuat tafsir. Periksa koneksi internet.</p></div>';
    });
}

function fetchTafsirSurah(nomorSurah) {
    if (tafsirCache.has(nomorSurah)) {
        return Promise.resolve(tafsirCache.get(nomorSurah));
    }
    return fetch(`https://equran.id/api/v2/tafsir/${nomorSurah}`)
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(json => {
            const data = json.data && json.data.tafsir ? json.data.tafsir : [];
            tafsirCache.set(nomorSurah, data);
            return data;
        });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   ASBABUN NUZUL â€” Modal + Fetch dari Muslim API
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ASBAB_API = '/api/asbab/surah';
const asbabCache = new Map(); // cache per surah

function openAsbabunNuzul(nomorSurah, nomorAyat) {
    // Cari/buat modal
    let modal = document.getElementById('asbab-modal-overlay');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'asbab-modal-overlay';
        modal.className = 'asbab-modal-overlay';
        modal.innerHTML = `
            <div class="asbab-modal">
                <div class="asbab-modal-header">
                    <div class="asbab-modal-title">
                        <i class="fa-solid fa-scroll"></i>
                        <span>Asbabun Nuzul</span>
                    </div>
                    <button class="asbab-modal-close" id="asbab-modal-close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="asbab-modal-body" id="asbab-modal-body">
                    <div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#asbab-modal-close').addEventListener('click', () => modal.classList.remove('open'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }

    // Show modal with loading
    const body = modal.querySelector('#asbab-modal-body');
    body.innerHTML = '<div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</div>';
    modal.classList.add('open');

    // Fetch data
    fetchAsbabForSurah(nomorSurah).then(ayahList => {
        const ayahData = ayahList.find(a => String(a.ayah) === String(nomorAyat));
        if (!ayahData || ayahData.asbab === '0' || !ayahData.asbab) {
            body.innerHTML = `
                <div class="asbab-empty">
                    <i class="fa-regular fa-file-lines"></i>
                    <p>Tidak ada riwayat Asbabun Nuzul untuk ayat ini.</p>
                    <small>Tidak semua ayat memiliki sebab turun yang diriwayatkan secara khusus.</small>
                </div>
            `;
            return;
        }
        // Fetch detail asbab
        fetchAsbabDetail(ayahData.asbab).then(detail => {
            body.innerHTML = `
                <div class="asbab-ayat-info">
                    <span class="asbab-ayat-badge">Surah ${nomorSurah} : Ayat ${nomorAyat}</span>
                </div>
                <div class="asbab-content">
                    <p>${detail.text || 'Data tidak tersedia.'}</p>
                </div>
            `;
        }).catch(() => {
            body.innerHTML = '<div class="asbab-empty"><p>Gagal memuat data. Silakan coba lagi.</p></div>';
        });
    }).catch(() => {
        body.innerHTML = '<div class="asbab-empty"><p>Gagal memuat data. Periksa koneksi internet.</p></div>';
    });
}

function fetchAsbabForSurah(nomorSurah) {
    if (asbabCache.has(nomorSurah)) {
        return Promise.resolve(asbabCache.get(nomorSurah));
    }
    return fetch(`${ASBAB_API}/${nomorSurah}`)
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(json => {
            const data = json.data || [];
            asbabCache.set(nomorSurah, data);
            return data;
        });
}

function fetchAsbabDetail(asbabId) {
    return fetch(`/api/asbab/detail/${asbabId}`)
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(json => json.data || {});
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   TAJWEED TOOLTIP â€” JS (appended to body, no overflow clip)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
(function() {
    let tooltipEl = null;
    let modalEl = null;

    // === TOOLTIP (hover only, nama tajwid) ===
    function createTooltip() {
        if (tooltipEl) return tooltipEl;
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'tj-tooltip';
        tooltipEl.innerHTML = '<div class="tj-tooltip-arrow"></div><span class="tj-tooltip-name"></span>';
        document.body.appendChild(tooltipEl);
        return tooltipEl;
    }

    function showTooltip(e) {
        const span = e.target.closest('[data-tj-name]');
        if (!span) return;
        const name = span.getAttribute('data-tj-name');
        if (!name) return;

        const tip = createTooltip();
        tip.querySelector('.tj-tooltip-name').textContent = name;

        const rect = span.getBoundingClientRect();
        tip.style.left = rect.left + rect.width / 2 + 'px';
        tip.style.top = rect.bottom + 8 + 'px';
        tip.style.transform = 'translateX(-50%)';

        requestAnimationFrame(() => {
            tip.classList.add('visible');
            const tipRect = tip.getBoundingClientRect();
            if (tipRect.right > window.innerWidth - 10) {
                tip.style.left = (window.innerWidth - tipRect.width - 10) + 'px';
                tip.style.transform = 'none';
            }
            if (tipRect.left < 10) {
                tip.style.left = '10px';
                tip.style.transform = 'none';
            }
        });
    }

    function hideTooltip() {
        if (tooltipEl) tooltipEl.classList.remove('visible');
    }

    // === MODAL (click, detail lengkap) ===
    const TAJWEED_COLORS = {
        'ham_wasl': '#AAAAAA', 'slnt': '#AAAAAA',
        'madda_normal': '#537FFF', 'madda_permissible': '#4050FF',
        'madda_necessary': '#000EBC', 'madda_obligatory': '#2144C1',
        'qlq': '#DD0008', 'ikhf_shfw': '#D500B7', 'ikhf': '#9400A8',
        'idghm_shfw': '#58B800', 'iqlb': '#26BFFD',
        'idgh_ghn': '#169777', 'idgh_w_ghn': '#169200',
        'idgh_mus': '#A1A1A1', 'idgh_mut': '#A1A1A1', 'ghn': '#FF7E1E'
    };

    function createModal() {
        if (modalEl) return modalEl;
        modalEl = document.createElement('div');
        modalEl.className = 'tj-modal-overlay';
        modalEl.innerHTML = `
            <div class="tj-modal">
                <div class="tj-modal-header">
                    <span class="tj-modal-title"></span>
                    <button class="tj-modal-close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="tj-modal-body">
                    <div class="tj-modal-letter">
                        <span class="tj-modal-letter-text"></span>
                    </div>
                    <div class="tj-modal-section">
                        <div class="tj-modal-section-label">Cara Membaca</div>
                        <div class="tj-modal-section-text tj-modal-desc"></div>
                    </div>
                    <div class="tj-modal-color-badge">
                        <span class="tj-modal-color-dot"></span>
                        <span class="tj-modal-color-label"></span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalEl);

        // Close handlers
        modalEl.querySelector('.tj-modal-close').addEventListener('click', closeModal);
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) closeModal();
        });

        return modalEl;
    }

    function openModal(span) {
        const name = span.getAttribute('data-tj-name');
        const desc = span.getAttribute('data-tj-desc');
        const text = span.textContent;
        // Get color from class
        const classes = span.className.split(' ');
        const tjClass = classes.find(c => c.startsWith('tj-'));
        const colorKey = tjClass ? tjClass.replace('tj-', '') : '';
        const color = TAJWEED_COLORS[colorKey] || '#537FFF';

        const modal = createModal();
        modal.querySelector('.tj-modal-title').textContent = name;
        modal.querySelector('.tj-modal-letter-text').textContent = text;
        modal.querySelector('.tj-modal-letter-text').style.color = color;
        modal.querySelector('.tj-modal-desc').textContent = desc;
        modal.querySelector('.tj-modal-color-dot').style.background = color;
        modal.querySelector('.tj-modal-color-label').textContent = 'Warna: ' + name;

        modal.classList.add('open');
    }

    function closeModal() {
        if (modalEl) modalEl.classList.remove('open');
    }

    // === EVENT LISTENERS ===
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('[data-tj-name]')) showTooltip(e);
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('[data-tj-name]')) hideTooltip();
    });
    document.addEventListener('click', (e) => {
        const span = e.target.closest('[data-tj-name]');
        if (span) {
            e.preventDefault();
            hideTooltip();
            openModal(span);
        }
    });
})();

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SIDEBAR RIGHT â€” Collapse / Expand
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
            sidebar.classList.add('collapsed');
            wrapper.classList.add('sidebar-collapsed');
            localStorage.setItem(SIDEBAR_RIGHT_KEY, 'true');
        });
    }

    // Klik expand (buka kembali)
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            wrapper.classList.remove('sidebar-collapsed');
            localStorage.setItem(SIDEBAR_RIGHT_KEY, 'false');
        });
    }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   I18N â€” Sistem terjemahan antarmuka
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
        fav_empty_hint:       'Klik â˜… pada kartu surah untuk menambahkan.',
        bm_empty:             'Belum ada bookmark.',
        bm_empty_hint:        'Buka surah, lalu arahkan kursor ke ayat â€” tombol ðŸ”– akan muncul di samping nomor ayat.',
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
        // Tajweed
        settings_tajweed:     'Warna Tajwid',
        settings_tajweed_hint:'Mewarnai huruf Arab sesuai hukum bacaan tajwid.',
        tajweed_on:           'Aktif',
        tajweed_off:          'Nonaktif',
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
        fav_empty_hint:       'Click â˜… on a surah card to add.',
        bm_empty:             'No bookmarks yet.',
        bm_empty_hint:        'Open a surah, hover over a verse â€” the ðŸ”– button will appear next to the verse number.',
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
        // Tajweed
        settings_tajweed:     'Colored Tajweed',
        settings_tajweed_hint:'Display color-coded Arabic letters based on tajweed rules.',
        tajweed_on:           'Active',
        tajweed_off:          'Inactive',
    }
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
        });
    });

    // Re-apply teks dinamis setiap kali detail surah selesai di-render
    document.addEventListener('ayat-rendered', () => applyI18nDynamic());
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SETTINGS â€” localStorage
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SETTINGS_KEY = 'quran_settings';

const SETTINGS_DEFAULT = {
    fontSize: 36,
    latinFontSize: 13,
    transFontSize: 13,
    bgColor: '#ffffff',
    bgName: 'Putih',
    arabFont: 'Amiri Quran'
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

    // Background & warna teks â€” pakai CSS variable di :root
    root.style.setProperty('--ayat-bg', s.bgColor);

    if (s.bgColor === '#1a2e45') {
        root.classList.add('theme-dark');
    } else {
        root.classList.remove('theme-dark');
    }
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
    });
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });

    // Font size â€” slider
    slider.addEventListener('input', () => {
        const val = parseInt(slider.value);
        display.textContent = val + 'px';
        const cur = getSettings();
        cur.fontSize = val;
        saveSettings(cur);
        applySettings(cur);
    });

    // Font size â€” A+ / Aâˆ’
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

    // Latin font size â€” slider
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

    // Translation font size â€” slider
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
    });
}

function markBgSelected(color, name, bgOptions, selectedLbl) {
    bgOptions.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === color);
    });
    if (selectedLbl) selectedLbl.textContent = name;
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   LAST READ â€” localStorage
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const LAST_READ_KEY = 'quran_last_read';

function saveLastRead(nomorSurah, namaLatin, nomorAyat) {
    const data = { nomorSurah, namaLatin, nomorAyat, savedAt: Date.now() };
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(data));
    renderLastReadBadge();
    showLastReadToast(namaLatin, nomorAyat);
}

function getLastRead() {
    try { return JSON.parse(localStorage.getItem(LAST_READ_KEY)); }
    catch (e) { return null; }
}

function showLastReadToast(namaLatin, nomorAyat) {
    // Hapus toast lama jika masih ada
    const existing = document.getElementById('last-read-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'last-read-toast';
    toast.className = 'last-read-toast';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
        <div class="toast-body">
            <span class="toast-label">${t('last_read_saved')}</span>
            <span class="toast-info">${namaLatin} â€” ${t('ayat_ref')} ${nomorAyat}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    document.body.appendChild(toast);

    // Auto-dismiss setelah 3 detik
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function renderLastReadBadge() {
    const badge = document.getElementById('last-read-badge');
    if (!badge) return;
    const filled = getReadingCategories().filter(c => c.nomorSurah !== null).length;
    if (filled > 0) {
        badge.textContent = filled;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

function jumpToLastRead(lr) {
    const el = document.getElementById(`isi-ayat${lr.nomorAyat}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Efek kedip (blink) emas
    let count = 0;
    const blink = setInterval(() => {
        el.style.background = count % 2 === 0 ? '#fffbea' : '';
        el.style.outline    = count % 2 === 0 ? '2px solid var(--gold)' : '';
        count++;
        if (count >= 6) {
            clearInterval(blink);
            el.style.background = '';
            el.style.outline    = '';
        }
    }, 300);
}

function initLastRead() {
    renderLastReadBadge();

    const btn = document.getElementById('nav-last-read-btn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lr = getLastRead();
        if (!lr) return;
        // Buka surah lalu jump + kedip ke ayat terakhir
        loadSurahDetails(lr.nomorSurah);
        setTimeout(() => jumpToLastRead(lr), 950);
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   BOOKMARK AYAT â€” localStorage
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const BOOKMARKS_KEY = 'quran_bookmarks';

function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || []; }
    catch (e) { return []; }
}

function saveBookmarks(list) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
}

function isBookmarked(nomorSurah, nomorAyat) {
    return getBookmarks().some(b => b.nomorSurah === nomorSurah && b.nomorAyat === nomorAyat);
}

function toggleBookmarkAyat(nomorSurah, namaLatin, nomorAyat) {
    const list = getBookmarks();
    const idx  = list.findIndex(b => b.nomorSurah === nomorSurah && b.nomorAyat === nomorAyat);

    const btn = document.getElementById(`bookmark-btn-${nomorAyat}`);

    if (idx >= 0) {
        // Hapus bookmark
        list.splice(idx, 1);
        saveBookmarks(list);
        if (btn) btn.classList.remove('bookmarked');
    } else {
        // Ambil teks Arab dan terjemahan dari DOM
        const ayatEl   = document.getElementById(`isi-ayat${nomorAyat}`);
        const teksArab = ayatEl ? (ayatEl.querySelector('.arabic')?.textContent?.trim() || '') : '';
        const teksIdn  = ayatEl ? (ayatEl.querySelector('.terjemahan')?.textContent?.trim() || '') : '';
        const teksLat  = ayatEl ? (ayatEl.querySelector('.tulisan-latin')?.textContent?.trim() || '') : '';

        list.unshift({
            nomorSurah,
            namaLatin,
            nomorAyat,
            teksArab,
            teksLatin: teksLat,
            teksIndonesia: teksIdn,
            savedAt: Date.now()
        });
        saveBookmarks(list);
        if (btn) btn.classList.add('bookmarked');
    }
    renderBookmarks();
}

function renderBookmarks() {
    // â”€â”€ Sidebar mini (tab kanan) â”€â”€
    const container = document.getElementById('bookmarks-list');
    const emptyMsg  = document.getElementById('bookmarks-empty');
    if (container) {
        container.querySelectorAll('.bookmark-item').forEach(el => el.remove());
        const list = getBookmarks();
        if (list.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'flex';
        } else {
            if (emptyMsg) emptyMsg.style.display = 'none';
            list.forEach(bm => container.appendChild(buildBookmarkItem(bm, false)));
        }
    }

    // â”€â”€ Update count badge di nav sidebar kiri â”€â”€
    renderBookmarkCountBadge();

    // â”€â”€ Update panel lengkap jika terbuka â”€â”€
    renderBookmarkPanel();
}

function renderBookmarkCountBadge() {
    const badge = document.getElementById('bookmark-count-badge');
    if (!badge) return;
    const count = getBookmarks().length;
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

// Buat elemen bookmark item â€” isPanel=true untuk versi lengkap
function buildBookmarkItem(bm, isPanel) {
    const item = document.createElement('div');
    item.className = isPanel ? 'bm-panel-item' : 'bookmark-item';

    if (isPanel) {
        // Versi lengkap â€” tampilkan semua field
        const date = new Date(bm.savedAt);
        const dateStr = date.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
        item.innerHTML = `
            <div class="bm-panel-meta">
                <div class="bm-panel-surah">
                    <i class="fa-solid fa-book-quran"></i>
                    <span class="bm-panel-name">${bm.namaLatin}</span>
                    <span class="bm-panel-num">${t('ayat_ref')} ${bm.nomorAyat}</span>
                </div>
                <span class="bm-panel-date">${dateStr}</span>
            </div>
            <p class="bm-panel-arab" dir="rtl">${bm.teksArab}</p>
            ${bm.teksLatin ? `<p class="bm-panel-latin">${bm.teksLatin}</p>` : ''}
            <p class="bm-panel-idn">${bm.teksIndonesia || 'â€”'}</p>
            <div class="bm-panel-actions">
                <button class="bookmark-go-btn bm-panel-go-btn">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> ${t('open_ayat')}
                </button>
                <button class="bookmark-del-btn bm-panel-del-btn"
                    data-surah="${bm.nomorSurah}" data-ayat="${bm.nomorAyat}">
                    <i class="fa-solid fa-trash-can"></i> ${t('delete')}
                </button>
            </div>
        `;
    } else {
        // Versi mini â€” sidebar kanan
        item.innerHTML = `
            <div class="bookmark-header">
                <span class="bookmark-surah-name">${bm.namaLatin}</span>
                <span class="bookmark-ayat-num">${t('ayat_ref')} ${bm.nomorAyat}</span>
            </div>
            <p class="bookmark-arab">${bm.teksArab}</p>
            <p class="bookmark-idn">${bm.teksIndonesia || 'â€”'}</p>
            <div class="bookmark-actions">
                <button class="bookmark-go-btn">
                    <i class="fa-solid fa-arrow-right"></i> ${t('open')}
                </button>
                <button class="bookmark-del-btn"
                    data-surah="${bm.nomorSurah}" data-ayat="${bm.nomorAyat}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }

    // Buka ayat
    item.querySelector('.bookmark-go-btn').addEventListener('click', () => {
        loadSurahDetails(bm.nomorSurah);
        setTimeout(() => jumpToLastRead({ nomorAyat: bm.nomorAyat }), 950);
        // Tutup panel jika terbuka
        const overlay = document.getElementById('bookmark-panel-overlay');
        if (overlay) overlay.classList.remove('open');
    });

    // Hapus
    item.querySelector('.bookmark-del-btn').addEventListener('click', () => {
        const s = parseInt(item.querySelector('.bookmark-del-btn').dataset.surah);
        const a = parseInt(item.querySelector('.bookmark-del-btn').dataset.ayat);
        const l = getBookmarks().filter(b => !(b.nomorSurah === s && b.nomorAyat === a));
        saveBookmarks(l);
        const bbtn = document.getElementById(`bookmark-btn-${a}`);
        if (bbtn) bbtn.classList.remove('bookmarked');
        renderBookmarks();
    });

    return item;
}

function renderBookmarkPanel(filter = '') {
    const panelList  = document.getElementById('bookmark-panel-list');
    const panelEmpty = document.getElementById('bookmark-panel-empty');
    const panelCount = document.getElementById('bookmark-panel-count');
    if (!panelList) return;

    panelList.querySelectorAll('.bm-panel-item').forEach(el => el.remove());

    let list = getBookmarks();
    if (filter) {
        const q = filter.toLowerCase();
        list = list.filter(b =>
            b.namaLatin.toLowerCase().includes(q) ||
            b.teksArab.includes(filter) ||
            (b.teksIndonesia || '').toLowerCase().includes(q)
        );
    }

    if (panelCount) panelCount.textContent = `${getBookmarks().length} ${t('ayat_word')}`;

    if (list.length === 0) {
        if (panelEmpty) panelEmpty.style.display = 'flex';
    } else {
        if (panelEmpty) panelEmpty.style.display = 'none';
        list.forEach(bm => panelList.appendChild(buildBookmarkItem(bm, true)));
    }
}

function initBookmarks() {
    renderBookmarks();

    // Sidebar tab switching
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.sidebar-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    // Nav Last Bookmark â†’ buka PANEL LENGKAP
    const navBmBtn = document.getElementById('nav-last-bookmark-btn');
    if (navBmBtn) {
        navBmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderBookmarkPanel();
            document.getElementById('bookmark-panel-overlay').classList.add('open');
        });
    }

    // Tutup panel
    const closePanel = document.getElementById('close-bookmark-panel-btn');
    if (closePanel) {
        closePanel.addEventListener('click', () => {
            document.getElementById('bookmark-panel-overlay').classList.remove('open');
        });
    }

    // Klik overlay backdrop â†’ tutup
    const overlay = document.getElementById('bookmark-panel-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    }

    // Search dalam panel
    const searchInput = document.getElementById('bookmark-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderBookmarkPanel(searchInput.value.trim());
        });
    }

    // Hapus semua
    const clearBtn = document.getElementById('bookmark-clear-all-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!confirm(t('confirm_clear_bm'))) return;
            saveBookmarks([]);
            document.querySelectorAll('.btn-bookmark-ayat').forEach(b => b.classList.remove('bookmarked'));
            renderBookmarks();
        });
    }

    // Tandai tombol bookmark saat ayat dirender
    document.addEventListener('ayat-rendered', syncBookmarkButtons);
}

function syncBookmarkButtons() {
    getBookmarks().forEach(bm => {
        const btn = document.getElementById(`bookmark-btn-${bm.nomorAyat}`);
        if (!btn) return;

        // Cek apakah tombol ini milik surah yang sedang aktif
        // dengan membandingkan data-surah yang ada di onclick attribute
        const onclickAttr = btn.getAttribute('onclick') || '';
        const match = onclickAttr.match(/toggleBookmarkAyat\((\d+)/);
        const btnNomorSurah = match ? parseInt(match[1]) : null;

        if (btnNomorSurah === bm.nomorSurah) {
            btn.classList.add('bookmarked');
        }
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MOBILE DRAWER
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initMobileDrawer() {
    const sidebarLeft  = document.querySelector('.sidebar-left');
    const sidebarRight = document.querySelector('.sidebar-right');
    const backdrop     = document.getElementById('drawer-backdrop');
    const burgerLeft   = document.getElementById('burger-left-btn');
    const burgerRight  = document.getElementById('burger-right-btn');

    if (!sidebarLeft || !backdrop) return;

    function openDrawer(side) {
        closeAllDrawers();
        if (side === 'left')  sidebarLeft.classList.add('drawer-open');
        if (side === 'right') sidebarRight && sidebarRight.classList.add('drawer-open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeAllDrawers() {
        sidebarLeft.classList.remove('drawer-open');
        sidebarRight && sidebarRight.classList.remove('drawer-open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    burgerLeft  && burgerLeft.addEventListener('click',  () => openDrawer('left'));
    burgerRight && burgerRight.addEventListener('click', () => openDrawer('right'));
    backdrop.addEventListener('click', closeAllDrawers);

    // Tutup drawer saat klik nav item di dalam sidebar kiri (mobile)
    sidebarLeft.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeAllDrawers();
        });
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   JUZ â€” mapping & panel
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const JUZ_MAP = [
    { juz:  1, surah:   1, ayat:   1, namaLatin: 'Al-Fatihah'   },
    { juz:  2, surah:   2, ayat: 142, namaLatin: 'Al-Baqarah'   },
    { juz:  3, surah:   2, ayat: 253, namaLatin: 'Al-Baqarah'   },
    { juz:  4, surah:   3, ayat:  93, namaLatin: 'Ali Imran'     },
    { juz:  5, surah:   4, ayat:  24, namaLatin: 'An-Nisa'       },
    { juz:  6, surah:   4, ayat: 148, namaLatin: 'An-Nisa'       },
    { juz:  7, surah:   5, ayat:  82, namaLatin: 'Al-Maidah'     },
    { juz:  8, surah:   6, ayat: 111, namaLatin: 'Al-Anam'       },
    { juz:  9, surah:   7, ayat:  88, namaLatin: 'Al-Araf'       },
    { juz: 10, surah:   8, ayat:  41, namaLatin: 'Al-Anfal'      },
    { juz: 11, surah:   9, ayat:  93, namaLatin: 'At-Taubah'     },
    { juz: 12, surah:  11, ayat:   6, namaLatin: 'Hud'           },
    { juz: 13, surah:  12, ayat:  53, namaLatin: 'Yusuf'         },
    { juz: 14, surah:  15, ayat:   1, namaLatin: 'Al-Hijr'       },
    { juz: 15, surah:  17, ayat:   1, namaLatin: 'Al-Isra'       },
    { juz: 16, surah:  18, ayat:  75, namaLatin: 'Al-Kahf'       },
    { juz: 17, surah:  21, ayat:   1, namaLatin: 'Al-Anbiya'     },
    { juz: 18, surah:  23, ayat:   1, namaLatin: 'Al-Muminun'    },
    { juz: 19, surah:  25, ayat:  21, namaLatin: 'Al-Furqan'     },
    { juz: 20, surah:  27, ayat:  56, namaLatin: 'An-Naml'       },
    { juz: 21, surah:  29, ayat:  46, namaLatin: 'Al-Ankabut'    },
    { juz: 22, surah:  33, ayat:  31, namaLatin: 'Al-Ahzab'      },
    { juz: 23, surah:  36, ayat:  28, namaLatin: 'Yasin'         },
    { juz: 24, surah:  39, ayat:  32, namaLatin: 'Az-Zumar'      },
    { juz: 25, surah:  41, ayat:  47, namaLatin: 'Fussilat'      },
    { juz: 26, surah:  46, ayat:   1, namaLatin: 'Al-Ahqaf'      },
    { juz: 27, surah:  51, ayat:  31, namaLatin: 'Az-Zariyat'    },
    { juz: 28, surah:  58, ayat:   1, namaLatin: 'Al-Mujadila'   },
    { juz: 29, surah:  67, ayat:   1, namaLatin: 'Al-Mulk'       },
    { juz: 30, surah:  78, ayat:   1, namaLatin: 'An-Naba'       },
];

function initJuz() {
    const overlay  = document.getElementById('juz-panel-overlay');
    const openBtn  = document.getElementById('nav-juz-btn');
    const closeBtn = document.getElementById('close-juz-panel-btn');
    const listEl   = document.getElementById('juz-panel-list');
    if (!overlay || !listEl) return;

    // Render list juz
    JUZ_MAP.forEach(j => {
        const item = document.createElement('button');
        item.className = 'juz-item';
        item.innerHTML = `
            <div class="juz-number">
                <span class="juz-num-label">Juz</span>
                <span class="juz-num-val">${j.juz}</span>
            </div>
            <div class="juz-info">
                <span class="juz-surah-name">${j.namaLatin}</span>
                <span class="juz-ayat-ref">${t('surah_word')} ${j.surah}, ${t('ayat_ref')} ${j.ayat}</span>
            </div>
            <div class="juz-arrow">
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        `;
        item.addEventListener('click', () => {
            overlay.classList.remove('open');
            // Tutup mobile drawer juga
            document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
            document.getElementById('drawer-backdrop')?.classList.remove('active');
            document.body.style.overflow = '';

            // Buka surah lalu jump ke ayat
            loadSurahDetails(j.surah);
            setTimeout(() => {
                jumpToLastRead({ nomorAyat: j.ayat });
            }, 950);
        });
        listEl.appendChild(item);
    });

    // Open
    openBtn && openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('open');
        // Tutup mobile drawer
        document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close
    closeBtn && closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   FAVORITES PANEL (from nav-left)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function closeAllNavDropdowns() {
    document.querySelectorAll('.nav-dropdown-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.nav-dropdown-arrow').forEach(a => a.classList.remove('rotated'));
}

function renderFavoritesDropdown() {
    const container = document.getElementById('favorites-dropdown-list');
    if (!container) return;
    container.innerHTML = '';

    const list = getFavorites();
    if (list.length === 0) {
        container.innerHTML = `<div class="lr-empty-hint"><i class="fa-regular fa-star"></i> ${t('fav_empty')}</div>`;
        return;
    }

    list.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'fav-dd-item';
        item.innerHTML = `
            <div class="fav-dd-main">
                <span class="fav-dd-nomor">${fav.nomor}</span>
                <div class="fav-dd-info">
                    <span class="fav-dd-name">${fav.namaLatin}</span>
                    <span class="fav-dd-arti">${fav.arti}</span>
                </div>
            </div>
            <button class="fav-dd-del" title="${t('remove_favorite')}" data-nomor="${fav.nomor}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        item.querySelector('.fav-dd-main').addEventListener('click', () => {
            closeAllNavDropdowns();
            loadSurahDetails(fav.nomor);
        });
        item.querySelector('.fav-dd-del').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(fav.nomor);
            renderFavoritesDropdown();
        });
        container.appendChild(item);
    });
}

function initFavoritesPanel() {
    const trigger = document.getElementById('nav-favorites-btn');
    const body    = document.getElementById('favorites-dropdown-body');
    const arrow   = document.getElementById('favorites-arrow');
    if (!trigger || !body) return;

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = body.classList.contains('open');
        closeAllNavDropdowns();
        if (!isOpen) {
            body.classList.add('open');
            if (arrow) arrow.classList.add('rotated');
            renderFavoritesDropdown();
        }
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   READING CATEGORIES â€” localStorage
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const READING_CATEGORIES_KEY = 'quran_reading_categories';

function getReadingCategories() {
    try {
        return JSON.parse(localStorage.getItem(READING_CATEGORIES_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveReadingCategories(list) {
    localStorage.setItem(READING_CATEGORIES_KEY, JSON.stringify(list));
}

function addReadingCategory(name) {
    const list = getReadingCategories();
    const newCat = {
        id: Date.now().toString(),
        name: name,
        nomorSurah: null,
        namaLatin: null,
        nomorAyat: null,
        savedAt: null
    };
    list.push(newCat);
    saveReadingCategories(list);
    return newCat;
}

function removeReadingCategory(categoryId) {
    const list = getReadingCategories().filter(c => c.id !== categoryId);
    saveReadingCategories(list);
}

function saveToCategory(categoryId, nomorSurah, namaLatin, nomorAyat) {
    const list = getReadingCategories();
    const cat = list.find(c => c.id === categoryId);
    if (cat) {
        cat.nomorSurah = nomorSurah;
        cat.namaLatin = namaLatin;
        cat.nomorAyat = nomorAyat;
        cat.savedAt = Date.now();
        saveReadingCategories(list);
        showLastReadToast(namaLatin, nomorAyat);
    }
    // Re-render dropdown hanya jika sedang open â€” hindari layout rusak
    const dropBody = document.getElementById('lastread-dropdown-body');
    if (dropBody && dropBody.classList.contains('open')) {
        renderLastReadDropdown();
    }
    renderLastReadBadge();
}

function renderLastReadPanel() {
    const container = document.getElementById('lr-category-list');
    if (!container) return;

    container.innerHTML = '';
    const list = getReadingCategories();

    if (list.length === 0) {
        container.innerHTML = `
            <div class="lr-category-empty">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <p>${t('lr_empty')}</p>
            </div>
        `;
        return;
    }

    list.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'lr-category-item';

        const positionText = cat.nomorSurah 
            ? `${cat.namaLatin} : ${t('ayat_ref')} ${cat.nomorAyat}`
            : t('lr_no_position');
        
        const dateStr = cat.savedAt 
            ? new Date(cat.savedAt).toLocaleDateString(getCurrentLang() === 'en' ? 'en-US' : 'id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
            : 'â€”';

        item.innerHTML = `
            <div class="lr-cat-icon">
                <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div class="lr-cat-info">
                <span class="lr-cat-name">${cat.name}</span>
                <span class="lr-cat-position">${positionText}</span>
                <span class="lr-cat-date">${dateStr}</span>
            </div>
            <button class="lr-cat-remove" title="${t('delete')}" data-id="${cat.id}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;

        // Klik item â†’ jump ke posisi
        item.querySelector('.lr-cat-info').addEventListener('click', () => {
            if (cat.nomorSurah) {
                document.getElementById('last-read-panel-overlay').classList.remove('open');
                loadSurahDetails(cat.nomorSurah);
                setTimeout(() => jumpToLastRead({ nomorAyat: cat.nomorAyat }), 950);
            }
        });
        item.querySelector('.lr-cat-icon').addEventListener('click', () => {
            if (cat.nomorSurah) {
                document.getElementById('last-read-panel-overlay').classList.remove('open');
                loadSurahDetails(cat.nomorSurah);
                setTimeout(() => jumpToLastRead({ nomorAyat: cat.nomorAyat }), 950);
            }
        });

        // Hapus kategori
        item.querySelector('.lr-cat-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeReadingCategory(cat.id);
            renderLastReadPanel();
            renderLastReadBadge();
        });

        container.appendChild(item);
    });
}

function initLastReadPanel() {
    // Pastikan kategori default ada
    ensureDefaultCategory();
    renderLastReadBadge();
    renderLastReadDropdown();

    const trigger = document.getElementById('nav-last-read-btn');
    const body    = document.getElementById('lastread-dropdown-body');
    const arrow   = document.getElementById('lastread-arrow');
    if (!trigger || !body) return;

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = body.classList.contains('open');
        // Tutup semua dropdown lain dulu
        closeAllNavDropdowns();
        if (!isOpen) {
            body.classList.add('open');
            if (arrow) arrow.classList.add('rotated');
            renderLastReadDropdown();
        }
    });

    // Tombol tambah kategori â€” tampilkan input inline
    const addBtn = document.getElementById('lr-add-category-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showAddCategoryInput();
        });
    }
}

function showAddCategoryInput() {
    // Jangan tampilkan dobel
    if (document.getElementById('lr-add-input-row')) return;

    const container = document.getElementById('lr-category-list');
    if (!container) return;

    const row = document.createElement('div');
    row.id = 'lr-add-input-row';
    row.className = 'lr-add-input-row';
    row.innerHTML = `
        <input id="lr-new-cat-input" class="lr-new-cat-input" type="text"
            placeholder="${t('lr_new_category_prompt')}" maxlength="30" autofocus>
        <button class="lr-new-cat-confirm" id="lr-new-cat-confirm" title="Simpan">
            <i class="fa-solid fa-check"></i>
        </button>
        <button class="lr-new-cat-cancel" id="lr-new-cat-cancel" title="Batal">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(row);

    const input   = row.querySelector('#lr-new-cat-input');
    const confirm = row.querySelector('#lr-new-cat-confirm');
    const cancel  = row.querySelector('#lr-new-cat-cancel');

    // Fokus langsung ke input
    setTimeout(() => input.focus(), 50);

    function doAdd() {
        const name = input.value.trim();
        if (name) {
            addReadingCategory(name);
            renderLastReadDropdown();
            renderLastReadBadge();
        } else {
            row.remove();
        }
    }

    confirm.addEventListener('click', (e) => { e.stopPropagation(); doAdd(); });
    cancel.addEventListener('click',  (e) => { e.stopPropagation(); row.remove(); });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter')  { e.preventDefault(); doAdd(); }
        if (e.key === 'Escape') { e.preventDefault(); row.remove(); }
    });
    // Cegah klik di dalam input menutup dropdown
    input.addEventListener('click', (e) => e.stopPropagation());
}

function ensureDefaultCategory() {
    const list = getReadingCategories();
    if (list.length === 0) {
        const def = {
            id: 'default',
            name: 'Baca Quran',
            nomorSurah: null,
            namaLatin: null,
            nomorAyat: null,
            savedAt: null
        };
        saveReadingCategories([def]);
    }
}

function renderLastReadDropdown() {
    const container = document.getElementById('lr-category-list');
    if (!container) return;
    container.innerHTML = '';

    const list = getReadingCategories();
    if (list.length === 0) {
        container.innerHTML = `<div class="lr-empty-hint"><i class="fa-solid fa-circle-info"></i> ${t('lr_empty')}</div>`;
        return;
    }

    list.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'lr-cat-item';

        const hasPos = cat.nomorSurah !== null;
        const posBadge = hasPos
            ? `<span class="lr-cat-badge">${cat.nomorSurah}:${cat.nomorAyat}</span>`
            : `<span class="lr-cat-badge lr-cat-badge-empty">â€”</span>`;

        item.innerHTML = `
            <div class="lr-cat-main" ${hasPos ? 'style="cursor:pointer"' : ''}>
                <span class="lr-cat-name"><span>${cat.name}</span></span>
                ${posBadge}
            </div>
            ${cat.id !== 'default' ? `<button class="lr-cat-del" title="${t('delete')}" data-id="${cat.id}"><i class="fa-solid fa-xmark"></i></button>` : ''}
            <div class="lr-cat-tooltip">${cat.name}</div>
        `;

        // Hitung offset marquee setelah elemen masuk DOM
        requestAnimationFrame(() => {
            const nameEl    = item.querySelector('.lr-cat-name');
            const innerSpan = item.querySelector('.lr-cat-name span');
            if (nameEl && innerSpan) {
                const overflow = innerSpan.scrollWidth - nameEl.clientWidth;
                if (overflow > 4) {
                    // Set offset sebagai px negatif agar terbaca penuh
                    nameEl.style.setProperty('--marquee-offset', `-${overflow}px`);
                } else {
                    // Teks muat, tidak perlu animasi
                    nameEl.dataset.noScroll = '1';
                }
            }
        });

        if (hasPos) {
            item.querySelector('.lr-cat-main').addEventListener('click', () => {
                closeAllNavDropdowns();
                loadSurahDetails(cat.nomorSurah);
                setTimeout(() => jumpToLastRead({ nomorAyat: cat.nomorAyat }), 950);
            });
        }

        const delBtn = item.querySelector('.lr-cat-del');
        if (delBtn) {
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeReadingCategory(cat.id);
                renderLastReadDropdown();
                renderLastReadBadge();
            });
        }

        container.appendChild(item);
    });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SAVE LAST-READ POPUP
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function showSaveLastReadSlide(nomorSurah, namaLatin, nomorAyat) {
    // Hapus popup lama jika ada
    const existing = document.getElementById('lr-popup-overlay');
    if (existing) existing.remove();

    const list = getReadingCategories();

    // Buat overlay + popup
    const overlay = document.createElement('div');
    overlay.id = 'lr-popup-overlay';
    overlay.className = 'lr-popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'lr-popup';

    // Header
    popup.innerHTML = `
        <div class="lr-popup-header">
            <div class="lr-popup-title">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <span>${t('lr_slide_title')}</span>
            </div>
            <div class="lr-popup-meta">${namaLatin} Â· ${t('ayat_ref')} ${nomorAyat}</div>
            <button class="lr-popup-close" id="lr-popup-close-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="lr-popup-list" id="lr-popup-list"></div>
        <div class="lr-popup-footer">
            <div class="lr-popup-add-row" id="lr-popup-add-row">
                <input class="lr-popup-add-input" id="lr-popup-add-input"
                    type="text" placeholder="${t('lr_new_category_prompt')}" maxlength="30">
                <button class="lr-popup-add-confirm" id="lr-popup-add-confirm">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="lr-popup-add-cancel" id="lr-popup-add-cancel">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <button class="lr-popup-add-btn" id="lr-popup-add-btn">
                <i class="fa-solid fa-plus"></i> ${t('lr_add_category')}
            </button>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Render daftar kategori
    const listEl = popup.querySelector('#lr-popup-list');
    list.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'lr-popup-item';
        const posText = cat.nomorSurah
            ? `<span class="lr-popup-item-pos">${cat.nomorSurah}:${cat.nomorAyat}</span>`
            : `<span class="lr-popup-item-empty">â€”</span>`;
        btn.innerHTML = `
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span class="lr-popup-item-name">${cat.name}</span>
            ${posText}
        `;
        btn.addEventListener('click', () => {
            saveToCategory(cat.id, nomorSurah, namaLatin, nomorAyat);
            overlay.remove();
            // Tampilkan konfirmasi visual di tombol baris ayat
            const lrBtn = document.getElementById(`lastread-btn-${nomorAyat}`);
            if (lrBtn) {
                lrBtn.classList.add('saved');
                setTimeout(() => lrBtn.classList.remove('saved'), 1500);
            }
        });
        listEl.appendChild(btn);
    });

    // Inline tambah kategori baru
    const addRow   = popup.querySelector('#lr-popup-add-row');
    const addInput = popup.querySelector('#lr-popup-add-input');
    const addBtn   = popup.querySelector('#lr-popup-add-btn');
    const confirm  = popup.querySelector('#lr-popup-add-confirm');
    const cancelAdd = popup.querySelector('#lr-popup-add-cancel');

    addRow.style.display = 'none';

    addBtn.addEventListener('click', () => {
        addRow.style.display = 'flex';
        addBtn.style.display = 'none';
        setTimeout(() => addInput.focus(), 50);
    });

    function doAddCat() {
        const name = addInput.value.trim();
        if (name) {
            const newCat = addReadingCategory(name);
            saveToCategory(newCat.id, nomorSurah, namaLatin, nomorAyat);
            overlay.remove();
        } else {
            addRow.style.display = 'none';
            addBtn.style.display = 'flex';
        }
    }

    confirm.addEventListener('click', doAddCat);
    cancelAdd.addEventListener('click', () => {
        addRow.style.display = 'none';
        addBtn.style.display = 'flex';
    });
    addInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter')  { e.preventDefault(); doAddCat(); }
        if (e.key === 'Escape') { e.preventDefault(); addRow.style.display = 'none'; addBtn.style.display = 'flex'; }
    });

    // Tutup
    popup.querySelector('#lr-popup-close-btn').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    // Animasi masuk
    requestAnimationFrame(() => overlay.classList.add('open'));
}

function hideSaveLastReadSlide() {
    const overlay = document.getElementById('lr-popup-overlay');
    if (overlay) overlay.remove();
}

function initSaveLastReadSlide() {
    // Slide digantikan popup JS â€” tidak perlu init dari HTML
    // Backdrop lama di layout juga tidak dipakai, tapi tidak masalah
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   AUTOCOMPLETE (jQuery UI)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

