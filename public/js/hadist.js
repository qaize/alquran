/* hadist.js — Hadist harian + panel browser
   API: hadis-api-id.vercel.app (primary)
   ──────────────────────────────────────── */

const HADIST_API   = 'https://hadis-api-id.vercel.app';
const HADIST_CACHE_KEY = 'quran_hadist_cache';
const HADIST_DAILY_KEY = 'quran_hadist_daily';

// Daftar kitab — total sesuai data aktual API (hadis-api-id.vercel.app)
const HADIST_KITAB = [
    { id: 'abu-dawud',  nama: 'Abu Dawud',    arab: 'أبو داود',   total: 4419 },
    { id: 'bukhari',    nama: 'Bukhari',       arab: 'البخاري',    total: 6638 },
    { id: 'tirmidzi',   nama: 'Tirmidzi',      arab: 'الترمذي',    total: 3625 },
    { id: 'ibnu-majah', nama: 'Ibnu Majah',    arab: 'ابن ماجه',   total: 4285 },
    { id: 'nasai',      nama: "An-Nasa'i",     arab: 'النسائي',    total: 5364 },
    { id: 'malik',      nama: 'Malik',         arab: 'مالك',       total: 1587 },
    { id: 'muslim',     nama: 'Muslim',        arab: 'مسلم',       total: 4930 },
    { id: 'ahmad',      nama: 'Ahmad',         arab: 'أحمد',       total: 4305 },
    { id: 'darimi',     nama: 'Ad-Darimi',     arab: 'الدارمي',    total: 2949 },
];

// ── Helpers ──
function _memCache(key, data) {
    try { sessionStorage.setItem(key, JSON.stringify(data)); } catch(e){}
}
function _memGet(key) {
    try { const r = sessionStorage.getItem(key); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}

function _fetchHadist(kitabId, nomor) {
    const cacheKey = `${HADIST_CACHE_KEY}_${kitabId}_${nomor}`;
    const cached   = _memGet(cacheKey);
    if (cached) return Promise.resolve(cached);

    return fetch(`${HADIST_API}/hadith/${kitabId}/${nomor}`)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(data => {
            _memCache(cacheKey, data);
            if (typeof trackApiCall === 'function') trackApiCall('hadist');
            return data;
        });
}

function _fetchHadistList(kitabId, page = 1, limit = 20) {
    const cacheKey = `${HADIST_CACHE_KEY}_list_${kitabId}_${page}_${limit}`;
    const cached   = _memGet(cacheKey);
    if (cached) return Promise.resolve(cached);

    return fetch(`${HADIST_API}/hadith/${kitabId}?page=${page}&limit=${limit}`)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(data => {
            _memCache(cacheKey, data);
            return data;
        });
}

// ── Hadist Harian — rotasi berdasarkan tanggal ──
function _getDailyHadist() {
    const today = new Date().toISOString().slice(0, 10);
    const saved = _memGet(HADIST_DAILY_KEY);
    if (saved && saved.date === today) return Promise.resolve(saved.data);

    // Pilih kitab dan nomor berdasarkan hari (deterministik)
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const kitab     = HADIST_KITAB[dayOfYear % HADIST_KITAB.length];
    const nomor     = (dayOfYear % Math.min(kitab.total, 500)) + 1;

    return _fetchHadist(kitab.id, nomor)
        .then(data => {
            _memCache(HADIST_DAILY_KEY, { date: today, data });
            return data;
        });
}

/* ══════════════════════════════════════════
   WIDGET HADIST HARIAN (di homepage)
   ══════════════════════════════════════════ */
function initHadistWidget() {
    const container = document.getElementById('hadist-daily-widget');
    if (!container) return;

    container.innerHTML = `
        <div class="hdw-inner">
            <div class="hdw-header">
                <span class="hdw-icon"><i class="fa-solid fa-scroll"></i></span>
                <span class="hdw-title">${t('hdw_title')}</span>
                <div class="hdw-header-actions">
                    <button class="hdw-refresh" id="hdw-refresh-btn" title="${t('hdw_show')}">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
                    <button class="hdw-collapse-btn" id="hdw-collapse-btn" title="${t('hdw_hide')}">
                        <i class="fa-solid fa-chevron-up"></i>
                    </button>
                </div>
            </div>
            <div class="hdw-collapsible" id="hdw-collapsible">
                <div class="hdw-body" id="hdw-body">
                    <div class="hdw-loading">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                    </div>
                </div>
                <div class="hdw-footer">
                    <button class="hdw-more-btn" id="hdw-more-btn">
                        <i class="fa-solid fa-book-open"></i>
                        ${t('hdw_read_more')}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Fetch di background langsung saat init (tidak nunggu expand)
    _loadDailyWidget();

    document.getElementById('hdw-refresh-btn').addEventListener('click', () => {
        sessionStorage.removeItem(HADIST_DAILY_KEY);
        _expandWidget();
        _loadDailyWidget(true);
    });

    document.getElementById('hdw-more-btn').addEventListener('click', () => {
        openHadistPanel(_widgetCurrent);
    });

    // Re-render static strings saat bahasa berubah
    document.addEventListener('lang-changed', () => {
        const hdwTitle   = container.querySelector('.hdw-title');
        const hdwMoreBtn = container.querySelector('.hdw-more-btn');
        const refreshBtn = container.querySelector('#hdw-refresh-btn');
        const collapseBtn2 = container.querySelector('#hdw-collapse-btn');
        if (hdwTitle)    hdwTitle.textContent = t('hdw_title');
        if (hdwMoreBtn)  hdwMoreBtn.innerHTML = `<i class="fa-solid fa-book-open"></i> ${t('hdw_read_more')}`;
        if (refreshBtn)  refreshBtn.title = t('hdw_show');
        if (collapseBtn2) {
            const isCollapsed = container.querySelector('#hdw-collapsible')?.classList.contains('hdw-collapsed');
            collapseBtn2.title = isCollapsed ? t('hdw_show') : t('hdw_hide');
        }
    });

    // ── Collapse / Expand — default: closed ──
    const collapseBtn  = document.getElementById('hdw-collapse-btn');
    const collapsible  = document.getElementById('hdw-collapsible');
    const collapseIcon = collapseBtn.querySelector('i');

    // Default: collapsed tanpa animasi
    collapsible.style.transition = 'none';
    collapsible.classList.add('hdw-collapsed');
    collapsible.style.maxHeight = '0px';
    collapsible.style.opacity   = '0';
    collapseIcon.className = 'fa-solid fa-chevron-down';
    collapseBtn.title = t('hdw_show');

    // Re-enable transition setelah set default
    requestAnimationFrame(() => {
        collapsible.style.transition = '';
    });

    function _expandWidget() {
        if (!collapsible.classList.contains('hdw-collapsed')) return;
        collapsible.classList.remove('hdw-collapsed');
        collapsible.style.maxHeight = '600px';
        collapsible.style.opacity   = '1';
        collapsible.addEventListener('transitionend', () => {
            if (!collapsible.classList.contains('hdw-collapsed'))
                collapsible.style.maxHeight = 'none';
        }, { once: true });
        collapseIcon.className = 'fa-solid fa-chevron-up';
        collapseBtn.title = t('hdw_hide');
    }

    function _collapseWidget() {
        if (collapsible.classList.contains('hdw-collapsed')) return;
        collapsible.style.maxHeight = collapsible.offsetHeight + 'px';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            collapsible.classList.add('hdw-collapsed');
            collapsible.style.maxHeight = '0px';
            collapsible.style.opacity   = '0';
        }));
        collapseIcon.className = 'fa-solid fa-chevron-down';
        collapseBtn.title = t('hdw_show');
    }

    collapseBtn.addEventListener('click', () => {
        if (collapsible.classList.contains('hdw-collapsed')) {
            _expandWidget();
        } else {
            _collapseWidget();
        }
    });
}

let _widgetRandomOffset = 0;
let _widgetCurrent = null; // { kitabId, nomor } dari hadist yang sedang tampil di widget

function _loadDailyWidget(random = false) {
    const body = document.getElementById('hdw-body');
    if (!body) return;

    body.innerHTML = `<div class="hdw-loading"><i class="fa-solid fa-spinner fa-spin"></i></div>`;

    const loader = random
        ? (() => {
            _widgetRandomOffset++;
            const kitab = HADIST_KITAB[_widgetRandomOffset % HADIST_KITAB.length];
            const nomor = Math.floor(Math.random() * kitab.total) + 1;
            return _fetchHadist(kitab.id, nomor);
          })()
        : _getDailyHadist();

    loader
        .then(data => {
            const h        = data.data ?? data;
            const arab     = h.arab    ?? h.text_ar ?? '';
            const idn      = h.id      ?? h.text_id ?? h.Indonesia ?? '';
            const kitabId  = data.slug ?? data.perawiSlug ?? data.name ?? '';
            const kitabNama = _getKitabNama(kitabId);
            const kitabArab = _getKitabArab(kitabId);
            const nomor    = h.number  ?? h.no ?? '';
            const isMarked = typeof isBookmarkedHadist === 'function' && isBookmarkedHadist(kitabId, nomor);

            // Simpan referensi hadist aktif untuk tombol "Baca Lebih Banyak"
            _widgetCurrent = { kitabId, nomor };

            body.innerHTML = `
                <div class="hdw-kitab-badge">
                    <span class="hdw-kitab-arab">${kitabArab}</span>
                    <span class="hdw-kitab-nama">${kitabNama} No. ${nomor}</span>
                </div>
                <p class="hdw-arab" dir="rtl">${arab}</p>
                <p class="hdw-idn">"${idn}"</p>
                <div class="hdw-actions">
                    <button class="hdw-bm-btn ${isMarked ? 'bookmarked' : ''}"
                        id="hdw-bm-btn"
                        data-kitab="${kitabId}"
                        data-kitab-nama="${kitabNama}"
                        data-kitab-arab="${kitabArab}"
                        data-nomor="${nomor}"
                        data-arab="${arab.replace(/"/g,'&quot;')}"
                        data-idn="${idn.replace(/"/g,'&quot;')}"
                        title="${isMarked ? t('hdw_bm_remove') : t('hdw_bm_save')}">
                        <i class="${isMarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                    </button>
                </div>
            `;

            // Event listener bookmark
            const bmBtn = document.getElementById('hdw-bm-btn');
            if (bmBtn && typeof toggleBookmarkHadist === 'function') {
                bmBtn.addEventListener('click', () => {
                    toggleBookmarkHadist(
                        bmBtn.dataset.kitab,
                        bmBtn.dataset.kitabNama,
                        bmBtn.dataset.kitabArab,
                        parseInt(bmBtn.dataset.nomor),
                        bmBtn.dataset.arab,
                        bmBtn.dataset.idn
                    );
                    const isOn = typeof isBookmarkedHadist === 'function' &&
                                 isBookmarkedHadist(bmBtn.dataset.kitab, parseInt(bmBtn.dataset.nomor));
                    bmBtn.classList.toggle('bookmarked', isOn);
                    bmBtn.title = isOn ? t('hdw_bm_remove') : t('hdw_bm_save');
                    const icon = bmBtn.querySelector('i');
                    if (icon) icon.className = isOn ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
                });
            }
        })
        .catch(() => {
            body.innerHTML = `
                <div class="hdw-error">
                    <i class="fa-solid fa-wifi"></i>
                    <span>${t('hdw_error')}</span>
                </div>`;
        });
}

function _getKitabNama(slug) {
    const k = HADIST_KITAB.find(k => k.id === slug || k.nama.toLowerCase().includes(slug.toLowerCase()));
    return k ? k.nama : slug;
}
function _getKitabArab(slug) {
    const k = HADIST_KITAB.find(k => k.id === slug || k.nama.toLowerCase().includes(slug.toLowerCase()));
    return k ? k.arab : '';
}

/* ══════════════════════════════════════════
   PANEL BROWSER HADIST
   ══════════════════════════════════════════ */
let _panelState = {
    kitab:   HADIST_KITAB[1], // default: Bukhari
    nomor:   1,               // hadist yang sedang ditampilkan
};

// Ambil nomor random dari kitab yang dipilih (range 1 s/d total aktual)
function _randomNomor(kitab) {
    return Math.floor(Math.random() * kitab.total) + 1;
}

function openHadistPanel(target = null) {
    let overlay = document.getElementById('hadist-panel-overlay');
    if (overlay) {
        overlay.classList.add('open');
        if (target && target.kitabId && target.nomor) {
            // Sync kitab aktif ke kitab dari widget
            const kitab = HADIST_KITAB.find(k => k.id === target.kitabId);
            if (kitab) {
                _panelState.kitab = kitab;
                overlay.querySelectorAll('.hadist-kitab-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.kitab === kitab.id);
                });
            }
            _panelState.nomor = target.nomor;
            _renderHadistDetail(target.kitabId, target.nomor);
        } else {
            _panelState.nomor = _randomNomor(_panelState.kitab);
            _renderHadistDetail(_panelState.kitab.id, _panelState.nomor);
        }
        return;
    }

    overlay = document.createElement('div');
    overlay.id = 'hadist-panel-overlay';
    overlay.className = 'hadist-panel-overlay';

    overlay.innerHTML = `
        <div class="hadist-panel">

            <div class="hadist-panel-header">
                <div class="hadist-panel-title">
                    <i class="fa-solid fa-scroll"></i>
                    <div>
                        <h2>Hadist</h2>
                        <p id="hadist-panel-subtitle">Memuat...</p>
                    </div>
                </div>
                <button class="hadist-panel-close" id="hadist-panel-close" title="Tutup">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="hadist-kitab-bar" id="hadist-kitab-bar">
                ${HADIST_KITAB.map(k => `
                    <button class="hadist-kitab-btn ${k.id === _panelState.kitab.id ? 'active' : ''}"
                        data-kitab="${k.id}" title="${k.nama}">
                        ${k.nama}
                    </button>
                `).join('')}
            </div>

            <div class="hadist-search-bar">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="number" id="hadist-goto-input"
                    placeholder="${t('hadist_goto_placeholder')}"
                    min="1">
                <button id="hadist-goto-btn" title="${t('hadist_goto_placeholder')}">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>

            <div class="hadist-panel-body" id="hadist-panel-body">
                <div class="hadist-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>${t('hadist_loading')}</span>
                </div>
            </div>

            <div class="hadist-nav-bar" id="hadist-nav-bar">
                <button class="hadist-nav-btn" id="hadist-prev-btn" title="${t('hadist_prev_title')}">
                    <i class="fa-solid fa-chevron-left"></i>
                    <span>${t('hadist_prev')}</span>
                </button>
                <button class="hadist-nav-btn hadist-nav-random" id="hadist-random-btn" title="${t('hadist_random')}">
                    <i class="fa-solid fa-shuffle"></i>
                </button>
                <button class="hadist-nav-btn" id="hadist-next-btn" title="${t('hadist_next_title')}">
                    <span>${t('hadist_next')}</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

        </div>
    `;
    document.body.appendChild(overlay);

    // Close
    overlay.querySelector('#hadist-panel-close').addEventListener('click', () => {
        overlay.classList.remove('open');
    });
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
    });

    // Kitab selector → fetch random dari kitab baru
    overlay.querySelector('#hadist-kitab-bar').addEventListener('click', e => {
        const btn = e.target.closest('.hadist-kitab-btn');
        if (!btn) return;
        _panelState.kitab = HADIST_KITAB.find(k => k.id === btn.dataset.kitab);
        _panelState.nomor = _randomNomor(_panelState.kitab);
        overlay.querySelectorAll('.hadist-kitab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _renderHadistDetail(_panelState.kitab.id, _panelState.nomor);
    });

    // Goto nomor
    overlay.querySelector('#hadist-goto-btn').addEventListener('click', _gotoHadist);
    overlay.querySelector('#hadist-goto-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') _gotoHadist();
    });

    // Nav: Prev / Next / Random
    overlay.querySelector('#hadist-prev-btn').addEventListener('click', () => {
        if (_panelState.nomor > 1) {
            _panelState.nomor--;
            _renderHadistDetail(_panelState.kitab.id, _panelState.nomor);
        }
    });
    overlay.querySelector('#hadist-next-btn').addEventListener('click', () => {
        if (_panelState.nomor < _panelState.kitab.total) {
            _panelState.nomor++;
            _renderHadistDetail(_panelState.kitab.id, _panelState.nomor);
        }
    });
    overlay.querySelector('#hadist-random-btn').addEventListener('click', () => {
        _panelState.nomor = _randomNomor(_panelState.kitab);
        _renderHadistDetail(_panelState.kitab.id, _panelState.nomor);
    });

    requestAnimationFrame(() => overlay.classList.add('open'));

    // Tampilkan hadist: dari widget jika ada target, atau random
    if (target && target.kitabId && target.nomor) {
        const kitab = HADIST_KITAB.find(k => k.id === target.kitabId);
        if (kitab) {
            _panelState.kitab = kitab;
            overlay.querySelectorAll('.hadist-kitab-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.kitab === kitab.id);
            });
        }
        _panelState.nomor = target.nomor;
        _renderHadistDetail(target.kitabId, target.nomor);
    } else {
        _panelState.nomor = _randomNomor(_panelState.kitab);
        _renderHadistDetail(_panelState.kitab.id, _panelState.nomor);
    }
}

function _gotoHadist() {
    const input = document.getElementById('hadist-goto-input');
    const nomor = parseInt(input?.value);
    if (!nomor || nomor < 1) return;
    _panelState.nomor = nomor;
    _renderHadistDetail(_panelState.kitab.id, _panelState.nomor);
    if (input) input.value = '';
}

function _updateNavButtons() {
    const prevBtn = document.getElementById('hadist-prev-btn');
    const nextBtn = document.getElementById('hadist-next-btn');
    if (prevBtn) prevBtn.disabled = _panelState.nomor <= 1;
    if (nextBtn) nextBtn.disabled = _panelState.nomor >= _panelState.kitab.total;
}

function _renderHadistDetail(kitabId, nomor) {
    const body     = document.getElementById('hadist-panel-body');
    const subtitle = document.getElementById('hadist-panel-subtitle');
    if (!body) return;

    _panelState.nomor = nomor;
    _updateNavButtons();

    body.innerHTML = `<div class="hadist-loading"><i class="fa-solid fa-spinner fa-spin"></i><span>${t('hadist_loading')}</span></div>`;

    _fetchHadist(kitabId, nomor)
        .then(data => {
            const h         = data.data ?? data;
            const arab      = h.arab    ?? h.text_ar ?? '';
            const idn       = h.id      ?? h.text_id ?? h.Indonesia ?? '';
            const nomorH    = h.number  ?? h.no ?? nomor;
            const kitabNama = _getKitabNama(kitabId);
            const kitabArab = _getKitabArab(kitabId);

            _panelState.nomor = nomorH;
            _updateNavButtons();

            if (subtitle) subtitle.textContent = `${kitabNama} · No. ${nomorH}`;

            const isMarked = typeof isBookmarkedHadist === 'function' && isBookmarkedHadist(kitabId, nomorH);

            body.innerHTML = `
                <div class="hadist-detail">
                    <div class="hadist-detail-badge">
                        <span class="hdb-arab">${kitabArab}</span>
                        <span class="hdb-nama">${kitabNama}</span>
                        <span class="hdb-nomor">No. ${nomorH}</span>
                    </div>

                    <div class="hadist-detail-arab">
                        <p dir="rtl">${arab}</p>
                    </div>

                    <div class="hadist-detail-idn">
                        <div class="hdi-label"><i class="fa-solid fa-language"></i> ${t('hadist_translation')}</div>
                        <p>${idn}</p>
                    </div>

                    <div class="hadist-detail-actions">
                        <button class="hadist-action-btn ${isMarked ? 'bookmarked' : ''}" id="hadist-bookmark-btn"
                            title="${isMarked ? t('hdw_bm_remove') : t('hdw_bm_save')}">
                            <i class="${isMarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                            ${t('hadist_bookmark')}
                        </button>
                        <button class="hadist-action-btn" id="hadist-copy-btn">
                            <i class="fa-regular fa-copy"></i>
                            ${t('hadist_copy')}
                        </button>
                    </div>
                </div>
            `;

            // Bookmark
            const bookmarkBtn = document.getElementById('hadist-bookmark-btn');
            if (bookmarkBtn && typeof toggleBookmarkHadist === 'function') {
                bookmarkBtn.addEventListener('click', () => {
                    toggleBookmarkHadist(kitabId, kitabNama, kitabArab, nomorH, arab, idn);
                    const isOn = typeof isBookmarkedHadist === 'function' && isBookmarkedHadist(kitabId, nomorH);
                    bookmarkBtn.classList.toggle('bookmarked', isOn);
                    bookmarkBtn.title = isOn ? t('hdw_bm_remove') : t('hdw_bm_save');
                    const icon = bookmarkBtn.querySelector('i');
                    if (icon) icon.className = isOn ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
                });
            }

            // Copy
            document.getElementById('hadist-copy-btn').addEventListener('click', () => {
                const text = `${arab}\n\n"${idn}"\n\n(${kitabNama} No. ${nomorH})`;
                navigator.clipboard.writeText(text).then(() => {
                    if (typeof showToast === 'function')
                        showToast({ type: 'success', message: t('hdw_copied'), duration: 2000 });
                });
            });
        })
        .catch(() => {
            body.innerHTML = `<div class="hadist-empty"><i class="fa-solid fa-wifi"></i><p>${t('hadist_error')}</p></div>`;
        });
}

/* ── Init ── */
function initHadist() {
    initHadistWidget();

    const navBtn = document.getElementById('nav-hadist-btn');
    if (navBtn) {
        navBtn.addEventListener('click', e => {
            e.preventDefault();
            openHadistPanel();
            document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
            document.getElementById('drawer-backdrop')?.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}
