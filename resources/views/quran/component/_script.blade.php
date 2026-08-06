<link href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel="stylesheet">
<script src="{{asset('js/script.js')}}"></script>
<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
<script>
/* ──────────────────────────────────────────────
   FAVORITES — localStorage
   ────────────────────────────────────────────── */
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
        starBtn.title = 'Tambah ke favorit';
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
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    list.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'fav-item';
        item.innerHTML = `
            <button class="fav-read-btn" title="Baca surah ini">
                <span class="fav-nomor">${fav.nomor}</span>
                <span class="fav-name">${fav.namaLatin}</span>
                <span class="fav-arti">${fav.arti}</span>
            </button>
            <button class="fav-remove-btn" title="Hapus dari favorit" data-nomor="${fav.nomor}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        // Klik nama → buka surah
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
            starBtn.title = 'Hapus dari favorit';
        }
    }
}

// Init saat halaman load
document.addEventListener('DOMContentLoaded', function () {
    renderFavorites();
    initSettings();
    initLastRead();
    initBookmarks();
});

/* ──────────────────────────────────────────────
   SETTINGS — localStorage
   ────────────────────────────────────────────── */
const SETTINGS_KEY = 'quran_settings';

const SETTINGS_DEFAULT = {
    fontSize: 36,
    bgColor: '#ffffff',
    bgName: 'Putih'
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
    // Ukuran font Arab
    document.documentElement.style.setProperty('--arabic-font-size', s.fontSize + 'px');

    // Background area baca (.ayat)
    // Jika dark navy, teks Arab jadi putih/emas
    const ayatEls = document.querySelectorAll('.ayat');
    ayatEls.forEach(el => {
        el.style.background = s.bgColor;
        if (s.bgColor === '#1a2e45') {
            el.style.color = '#e8c97a';
            el.classList.add('ayat-dark');
        } else {
            el.style.color = '';
            el.classList.remove('ayat-dark');
        }
    });
}

function initSettings() {
    const s = getSettings();
    applySettings(s);

    const overlay     = document.getElementById('settings-overlay');
    const openBtn     = document.getElementById('open-settings-btn');
    const closeBtn    = document.getElementById('close-settings-btn');
    const slider      = document.getElementById('font-size-slider');
    const display     = document.getElementById('font-size-display');
    const incBtn      = document.getElementById('font-increase');
    const decBtn      = document.getElementById('font-decrease');
    const bgOptions   = document.querySelectorAll('.bg-option');
    const selectedLbl = document.getElementById('bg-selected-name');
    const resetBtn    = document.getElementById('settings-reset-btn');

    if (!overlay) return;

    // Set initial UI state
    slider.value = s.fontSize;
    display.textContent = s.fontSize + 'px';
    markBgSelected(s.bgColor, s.bgName, bgOptions, selectedLbl);

    // Open / close
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('open');
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

    // Background color
    bgOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            const name  = btn.dataset.name;
            const cur = getSettings();
            cur.bgColor = color;
            cur.bgName  = name;
            saveSettings(cur);
            applySettings(cur);
            markBgSelected(color, name, bgOptions, selectedLbl);
        });
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        saveSettings(Object.assign({}, SETTINGS_DEFAULT));
        const s = getSettings();
        slider.value = s.fontSize;
        display.textContent = s.fontSize + 'px';
        applySettings(s);
        markBgSelected(s.bgColor, s.bgName, bgOptions, selectedLbl);
    });
}

function markBgSelected(color, name, bgOptions, selectedLbl) {
    bgOptions.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === color);
    });
    if (selectedLbl) selectedLbl.textContent = name;
}

/* ──────────────────────────────────────────────
   LAST READ — localStorage
   ────────────────────────────────────────────── */
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
            <span class="toast-label">Bacaan terakhir disimpan</span>
            <span class="toast-info">${namaLatin} — Ayat ${nomorAyat}</span>
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
    const lr = getLastRead();
    const badge = document.getElementById('last-read-badge');
    if (!badge) return;
    if (lr) {
        badge.textContent = lr.nomorAyat;
        badge.style.display = 'inline-flex';
        badge.title = `${lr.namaLatin} : Ayat ${lr.nomorAyat}`;
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

/* ──────────────────────────────────────────────
   BOOKMARK AYAT — localStorage
   ────────────────────────────────────────────── */
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
    // ── Sidebar mini (tab kanan) ──
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

    // ── Update count badge di nav sidebar kiri ──
    renderBookmarkCountBadge();

    // ── Update panel lengkap jika terbuka ──
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

// Buat elemen bookmark item — isPanel=true untuk versi lengkap
function buildBookmarkItem(bm, isPanel) {
    const item = document.createElement('div');
    item.className = isPanel ? 'bm-panel-item' : 'bookmark-item';

    if (isPanel) {
        // Versi lengkap — tampilkan semua field
        const date = new Date(bm.savedAt);
        const dateStr = date.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
        item.innerHTML = `
            <div class="bm-panel-meta">
                <div class="bm-panel-surah">
                    <i class="fa-solid fa-book-quran"></i>
                    <span class="bm-panel-name">${bm.namaLatin}</span>
                    <span class="bm-panel-num">Ayat ${bm.nomorAyat}</span>
                </div>
                <span class="bm-panel-date">${dateStr}</span>
            </div>
            <p class="bm-panel-arab" dir="rtl">${bm.teksArab}</p>
            ${bm.teksLatin ? `<p class="bm-panel-latin">${bm.teksLatin}</p>` : ''}
            <p class="bm-panel-idn">${bm.teksIndonesia || '—'}</p>
            <div class="bm-panel-actions">
                <button class="bookmark-go-btn bm-panel-go-btn">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Ayat
                </button>
                <button class="bookmark-del-btn bm-panel-del-btn"
                    data-surah="${bm.nomorSurah}" data-ayat="${bm.nomorAyat}">
                    <i class="fa-solid fa-trash-can"></i> Hapus
                </button>
            </div>
        `;
    } else {
        // Versi mini — sidebar kanan
        item.innerHTML = `
            <div class="bookmark-header">
                <span class="bookmark-surah-name">${bm.namaLatin}</span>
                <span class="bookmark-ayat-num">Ayat ${bm.nomorAyat}</span>
            </div>
            <p class="bookmark-arab">${bm.teksArab}</p>
            <p class="bookmark-idn">${bm.teksIndonesia || '—'}</p>
            <div class="bookmark-actions">
                <button class="bookmark-go-btn">
                    <i class="fa-solid fa-arrow-right"></i> Buka
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

    if (panelCount) panelCount.textContent = `${getBookmarks().length} ayat`;

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

    // Nav Last Bookmark → buka PANEL LENGKAP
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

    // Klik overlay backdrop → tutup
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
            if (!confirm('Hapus semua bookmark?')) return;
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
