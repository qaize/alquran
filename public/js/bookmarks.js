/* bookmarks.js — Bookmark ayat + bookmark hadist + panel */

/* ──────────────────────────────────────────────
   BOOKMARK AYAT — localStorage
   ────────────────────────────────────────────── */
const BOOKMARKS_KEY        = 'quran_bookmarks';
const BOOKMARKS_HADIST_KEY = 'quran_bookmarks_hadist';

function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || []; }
    catch (e) { return []; }
}

function saveBookmarks(list) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
}

/* ──────────────────────────────────────────────
   BOOKMARK HADIST — localStorage
   ────────────────────────────────────────────── */
function getBookmarksHadist() {
    try { return JSON.parse(localStorage.getItem(BOOKMARKS_HADIST_KEY)) || []; }
    catch (e) { return []; }
}

function saveBookmarksHadist(list) {
    localStorage.setItem(BOOKMARKS_HADIST_KEY, JSON.stringify(list));
}

function isBookmarkedHadist(kitabId, nomor) {
    return getBookmarksHadist().some(b => b.kitabId === kitabId && b.nomor === nomor);
}

function toggleBookmarkHadist(kitabId, kitabNama, kitabArab, nomor, arab, idn) {
    const list = getBookmarksHadist();
    const idx  = list.findIndex(b => b.kitabId === kitabId && b.nomor === nomor);

    if (idx >= 0) {
        list.splice(idx, 1);
        saveBookmarksHadist(list);
        showToast({
            type: 'info',
            icon: 'fa-bookmark',
            label: 'Bookmark dihapus',
            message: `${kitabNama} — No. ${nomor}`,
            duration: 2000,
        });
    } else {
        list.unshift({ kitabId, kitabNama, kitabArab, nomor, arab, idn, savedAt: Date.now() });
        saveBookmarksHadist(list);
        showToast({
            type: 'bookmark',
            label: 'Hadist disimpan',
            message: `${kitabNama} — No. ${nomor}`,
        });
    }

    renderBookmarks();

    // Sync tombol bookmark di panel hadist jika ada
    _syncHadistBookmarkBtn(kitabId, nomor);
}

function _syncHadistBookmarkBtn(kitabId, nomor) {
    const btn = document.getElementById('hadist-bookmark-btn');
    if (!btn) return;
    const isOn = isBookmarkedHadist(kitabId, nomor);
    btn.classList.toggle('bookmarked', isOn);
    btn.title = isOn ? 'Hapus bookmark' : 'Simpan bookmark';
    const icon = btn.querySelector('i');
    if (icon) icon.className = isOn ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
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
        showToast({
            type: 'info',
            icon: 'fa-bookmark',
            label: t('bm_removed_label') || 'Bookmark dihapus',
            message: `${namaLatin} — ${t('ayat_ref') || 'Ayat'} ${nomorAyat}`,
            duration: 2500,
        });
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
        showToast({
            type: 'bookmark',
            label: t('bm_saved_label') || 'Bookmark disimpan',
            message: `${namaLatin} — ${t('ayat_ref') || 'Ayat'} ${nomorAyat}`,
        });
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
    const count = getBookmarks().length + getBookmarksHadist().length;
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
                    <span class="bm-panel-num">${t('ayat_ref')} ${bm.nomorAyat}</span>
                </div>
                <span class="bm-panel-date">${dateStr}</span>
            </div>
            <p class="bm-panel-arab" dir="rtl">${bm.teksArab}</p>
            ${bm.teksLatin ? `<p class="bm-panel-latin">${bm.teksLatin}</p>` : ''}
            <p class="bm-panel-idn">${bm.teksIndonesia || '—'}</p>
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
        // Versi mini — sidebar kanan
        item.innerHTML = `
            <div class="bookmark-header">
                <span class="bookmark-surah-name">${bm.namaLatin}</span>
                <span class="bookmark-ayat-num">${t('ayat_ref')} ${bm.nomorAyat}</span>
            </div>
            <p class="bookmark-arab">${bm.teksArab}</p>
            <p class="bookmark-idn">${bm.teksIndonesia || '—'}</p>
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
    const hadistList  = document.getElementById('bookmark-hadist-list');
    const hadistEmpty = document.getElementById('bookmark-hadist-empty');
    if (!panelList) return;

    // Update count badges
    const ayatCount   = getBookmarks().length;
    const hadistCount = getBookmarksHadist().length;
    const total       = ayatCount + hadistCount;

    if (panelCount) panelCount.textContent = total;

    const cntAyat   = document.getElementById('bm-count-ayat');
    const cntHadist = document.getElementById('bm-count-hadist');
    if (cntAyat)   cntAyat.textContent   = ayatCount;
    if (cntHadist) cntHadist.textContent = hadistCount;

    // ── Render Ayat ──
    panelList.querySelectorAll('.bm-panel-item').forEach(el => el.remove());
    let listAyat = getBookmarks();
    if (filter) {
        const q = filter.toLowerCase();
        listAyat = listAyat.filter(b =>
            b.namaLatin.toLowerCase().includes(q) ||
            b.teksArab.includes(filter) ||
            (b.teksIndonesia || '').toLowerCase().includes(q)
        );
    }
    if (listAyat.length === 0) {
        if (panelEmpty) panelEmpty.style.display = 'flex';
    } else {
        if (panelEmpty) panelEmpty.style.display = 'none';
        listAyat.forEach(bm => panelList.appendChild(buildBookmarkItem(bm, true)));
    }

    // ── Render Hadist ──
    if (hadistList) {
        hadistList.querySelectorAll('.bm-panel-item').forEach(el => el.remove());
        let listHadist = getBookmarksHadist();
        if (filter) {
            const q = filter.toLowerCase();
            listHadist = listHadist.filter(b =>
                b.kitabNama.toLowerCase().includes(q) ||
                (b.arab || '').includes(filter) ||
                (b.idn || '').toLowerCase().includes(q)
            );
        }
        if (listHadist.length === 0) {
            if (hadistEmpty) hadistEmpty.style.display = 'flex';
        } else {
            if (hadistEmpty) hadistEmpty.style.display = 'none';
            listHadist.forEach(bm => hadistList.appendChild(buildBookmarkHadistItem(bm)));
        }
    }

    // ── Enforce display sesuai tab aktif ──
    const activeTab = document.querySelector('.bm-panel-tab.active');
    const isAyatTab = !activeTab || activeTab.dataset.tab === 'ayat';

    if (panelList)  panelList.style.display  = isAyatTab ? '' : 'none';
    if (panelEmpty && listAyat.length === 0)
        panelEmpty.style.display = isAyatTab ? 'flex' : 'none';
    else if (panelEmpty)
        panelEmpty.style.display = 'none';

    if (hadistList)  hadistList.style.display  = isAyatTab ? 'none' : '';
    if (hadistEmpty) {
        const hList = getBookmarksHadist();
        hadistEmpty.style.display = (!isAyatTab && hList.length === 0) ? 'flex' : 'none';
    }
}

// Build hadist bookmark item untuk panel
function buildBookmarkHadistItem(bm) {
    const item = document.createElement('div');
    item.className = 'bm-panel-item';
    const date = new Date(bm.savedAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    item.innerHTML = `
        <div class="bm-panel-meta">
            <div class="bm-panel-surah">
                <i class="fa-solid fa-scroll"></i>
                <span class="bm-panel-name">${bm.kitabNama}</span>
                <span class="bm-panel-num">No. ${bm.nomor}</span>
            </div>
            <span class="bm-panel-date">${date}</span>
        </div>
        <p class="bm-panel-arab" dir="rtl">${bm.arab || '—'}</p>
        <p class="bm-panel-idn">${bm.idn || '—'}</p>
        <div class="bm-panel-actions">
            <button class="bookmark-go-btn bm-panel-go-btn">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Hadist
            </button>
            <button class="bookmark-del-btn bm-panel-del-btn"
                data-kitab="${bm.kitabId}" data-nomor="${bm.nomor}">
                <i class="fa-solid fa-trash-can"></i> Hapus
            </button>
        </div>
    `;

    // Buka hadist
    item.querySelector('.bookmark-go-btn').addEventListener('click', () => {
        const overlay = document.getElementById('bookmark-panel-overlay');
        if (overlay) overlay.classList.remove('open');
        if (typeof openHadistPanel === 'function') {
            openHadistPanel();
            setTimeout(() => {
                // Pilih kitab yang sesuai
                const kitabBtn = document.querySelector(`.hadist-kitab-btn[data-kitab="${bm.kitabId}"]`);
                if (kitabBtn) kitabBtn.click();
                // Navigasi ke nomor
                setTimeout(() => {
                    if (typeof _renderHadistDetail === 'function') {
                        _renderHadistDetail(bm.kitabId, bm.nomor);
                    }
                }, 400);
            }, 300);
        }
    });

    // Hapus
    item.querySelector('.bookmark-del-btn').addEventListener('click', () => {
        const kitabId = item.querySelector('.bookmark-del-btn').dataset.kitab;
        const nomor   = parseInt(item.querySelector('.bookmark-del-btn').dataset.nomor);
        const list    = getBookmarksHadist().filter(b => !(b.kitabId === kitabId && b.nomor === nomor));
        saveBookmarksHadist(list);
        renderBookmarks();
    });

    return item;
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

    // ── Tab switching: Ayat / Hadist ──
    document.querySelectorAll('.bm-panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.bm-panel-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const isAyat = tab.dataset.tab === 'ayat';

            // Ayat sections
            const ayatList  = document.getElementById('bookmark-panel-list');
            const ayatEmpty = document.getElementById('bookmark-panel-empty');
            // Hadist sections
            const hadistList  = document.getElementById('bookmark-hadist-list');
            const hadistEmpty = document.getElementById('bookmark-hadist-empty');

            if (isAyat) {
                if (ayatList)  ayatList.style.display  = '';
                if (ayatEmpty) ayatEmpty.style.display = getBookmarks().length === 0 ? 'flex' : 'none';
                if (hadistList)  hadistList.style.display  = 'none';
                if (hadistEmpty) hadistEmpty.style.display = 'none';
            } else {
                if (ayatList)  ayatList.style.display  = 'none';
                if (ayatEmpty) ayatEmpty.style.display = 'none';
                if (hadistList)  hadistList.style.display  = '';
                if (hadistEmpty) hadistEmpty.style.display = getBookmarksHadist().length === 0 ? 'flex' : 'none';
            }
        });
    });

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

    // Hapus semua — ikut tab aktif
    const clearBtn = document.getElementById('bookmark-clear-all-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.bm-panel-tab.active');
            const isAyat    = !activeTab || activeTab.dataset.tab === 'ayat';
            if (!confirm(isAyat ? 'Hapus semua bookmark ayat?' : 'Hapus semua bookmark hadist?')) return;
            if (isAyat) {
                saveBookmarks([]);
                document.querySelectorAll('.btn-bookmark-ayat').forEach(b => b.classList.remove('bookmarked'));
            } else {
                saveBookmarksHadist([]);
            }
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
