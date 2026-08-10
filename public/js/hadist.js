/* hadist.js — Hadist harian + panel browser
   API: hadis-api-id.vercel.app (primary)
   ──────────────────────────────────────── */

const HADIST_API   = 'https://hadis-api-id.vercel.app';
const HADIST_CACHE_KEY = 'quran_hadist_cache';
const HADIST_DAILY_KEY = 'quran_hadist_daily';

// Daftar kitab
const HADIST_KITAB = [
    { id: 'abu-dawud',  nama: 'Abu Dawud',    arab: 'أبو داود',   total: 5274 },
    { id: 'bukhari',    nama: 'Bukhari',       arab: 'البخاري',    total: 7008 },
    { id: 'tirmidzi',   nama: 'Tirmidzi',      arab: 'الترمذي',    total: 3956 },
    { id: 'ibnu-majah', nama: 'Ibnu Majah',    arab: 'ابن ماجه',   total: 4341 },
    { id: 'nasai',      nama: "An-Nasa'i",     arab: 'النسائي',    total: 5774 },
    { id: 'malik',      nama: 'Malik',         arab: 'مالك',       total: 1857 },
    { id: 'muslim',     nama: 'Muslim',        arab: 'مسلم',       total: 5362 },
    { id: 'ahmad',      nama: 'Ahmad',         arab: 'أحمد',       total: 4305 },
    { id: 'darimi',     nama: 'Ad-Darimi',     arab: 'الدارمي',    total: 3367 },
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
            if (typeof trackApiCall === 'function') trackApiCall('surat_detail');
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
                <span class="hdw-title">Hadist Hari Ini</span>
                <div class="hdw-header-actions">
                    <button class="hdw-refresh" id="hdw-refresh-btn" title="Hadist lain">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
                    <button class="hdw-collapse-btn" id="hdw-collapse-btn" title="Sembunyikan">
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
                        Baca Lebih Banyak
                    </button>
                </div>
            </div>
        </div>
    `;

    // Fetch di background langsung saat init (tidak nunggu expand)
    _loadDailyWidget();

    document.getElementById('hdw-refresh-btn').addEventListener('click', () => {
        sessionStorage.removeItem(HADIST_DAILY_KEY);
        // Auto-expand saat refresh agar hadist terlihat
        _expandWidget();
        _loadDailyWidget(true);
    });

    document.getElementById('hdw-more-btn').addEventListener('click', openHadistPanel);

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
    collapseBtn.title = 'Tampilkan';

    // Re-enable transition setelah set default
    requestAnimationFrame(() => {
        collapsible.style.transition = '';
    });

    function _expandWidget() {
        if (!collapsible.classList.contains('hdw-collapsed')) return;
        collapsible.classList.remove('hdw-collapsed');
        // Pakai fixed large value, set ke none setelah transisi
        collapsible.style.maxHeight = '600px';
        collapsible.style.opacity   = '1';
        collapsible.addEventListener('transitionend', () => {
            if (!collapsible.classList.contains('hdw-collapsed'))
                collapsible.style.maxHeight = 'none';
        }, { once: true });
        collapseIcon.className = 'fa-solid fa-chevron-up';
        collapseBtn.title = 'Sembunyikan';
    }

    function _collapseWidget() {
        if (collapsible.classList.contains('hdw-collapsed')) return;
        // Set eksplisit dulu baru animate ke 0
        collapsible.style.maxHeight = collapsible.offsetHeight + 'px';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            collapsible.classList.add('hdw-collapsed');
            collapsible.style.maxHeight = '0px';
            collapsible.style.opacity   = '0';
        }));
        collapseIcon.className = 'fa-solid fa-chevron-down';
        collapseBtn.title = 'Tampilkan';
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

function _loadDailyWidget(random = false) {
    const body = document.getElementById('hdw-body');
    if (!body) return;

    body.innerHTML = `<div class="hdw-loading"><i class="fa-solid fa-spinner fa-spin"></i></div>`;

    const loader = random
        ? (() => {
            _widgetRandomOffset++;
            const kitab = HADIST_KITAB[_widgetRandomOffset % HADIST_KITAB.length];
            const nomor = Math.floor(Math.random() * Math.min(kitab.total, 300)) + 1;
            return _fetchHadist(kitab.id, nomor);
          })()
        : _getDailyHadist();

    loader
        .then(data => {
            const h        = data.data ?? data;
            const arab     = h.arab    ?? h.text_ar ?? '';
            const idn      = h.id      ?? h.text_id ?? h.Indonesia ?? '';
            const kitabId  = data.perawiSlug ?? data.name ?? '';
            const kitabNama = _getKitabNama(kitabId);
            const kitabArab = _getKitabArab(kitabId);
            const nomor    = h.number  ?? h.no ?? '';
            const isMarked = typeof isBookmarkedHadist === 'function' && isBookmarkedHadist(kitabId, nomor);

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
                        title="${isMarked ? 'Hapus bookmark' : 'Simpan bookmark'}">
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
                    bmBtn.title = isOn ? 'Hapus bookmark' : 'Simpan bookmark';
                    const icon = bmBtn.querySelector('i');
                    if (icon) icon.className = isOn ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
                });
            }
        })
        .catch(() => {
            body.innerHTML = `
                <div class="hdw-error">
                    <i class="fa-solid fa-wifi"></i>
                    <span>Gagal memuat. Periksa koneksi.</span>
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
    kitab:     HADIST_KITAB[1], // default: Bukhari
    page:      1,
    limit:     15,
    view:      'list',   // 'list' | 'detail'
    detailData: null,
};

function openHadistPanel() {
    let overlay = document.getElementById('hadist-panel-overlay');
    if (overlay) { overlay.classList.add('open'); _renderHadistList(); return; }

    overlay = document.createElement('div');
    overlay.id = 'hadist-panel-overlay';
    overlay.className = 'hadist-panel-overlay';

    // Pre-fetch halaman 1 semua kitab di background agar tidak kosong saat diklik
    HADIST_KITAB.forEach(k => {
        _fetchHadistList(k.id, 1, 15).catch(() => {});
    });
    overlay.innerHTML = `
        <div class="hadist-panel">

            <div class="hadist-panel-header">
                <div class="hadist-panel-title">
                    <i class="fa-solid fa-scroll"></i>
                    <div>
                        <h2>Hadist</h2>
                        <p id="hadist-panel-subtitle">Pilih kitab untuk mulai membaca</p>
                    </div>
                </div>
                <button class="hadist-panel-close" id="hadist-panel-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            {{-- Kitab selector --}}
            <div class="hadist-kitab-bar" id="hadist-kitab-bar">
                ${HADIST_KITAB.map(k => `
                    <button class="hadist-kitab-btn ${k.id === _panelState.kitab.id ? 'active' : ''}"
                        data-kitab="${k.id}">
                        ${k.nama}
                    </button>
                `).join('')}
            </div>

            {{-- Search --}}
            <div class="hadist-search-bar">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="number" id="hadist-goto-input"
                    placeholder="Ketik nomor hadist, lalu Enter..."
                    min="1">
                <button id="hadist-goto-btn">
                    <i class="fa-solid fa-arrow-right"></i> Go
                </button>
            </div>

            {{-- Content area --}}
            <div class="hadist-panel-body" id="hadist-panel-body">
                <div class="hadist-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>Memuat hadist...</span>
                </div>
            </div>

            {{-- Pagination --}}
            <div class="hadist-pagination" id="hadist-pagination">
                <button class="hadist-page-btn" id="hadist-prev-page">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span class="hadist-page-info" id="hadist-page-info">—</span>
                <button class="hadist-page-btn" id="hadist-next-page">
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

    // Kitab selector
    overlay.querySelector('#hadist-kitab-bar').addEventListener('click', e => {
        const btn = e.target.closest('.hadist-kitab-btn');
        if (!btn) return;
        _panelState.kitab = HADIST_KITAB.find(k => k.id === btn.dataset.kitab);
        _panelState.page  = 1;
        _panelState.view  = 'list';
        overlay.querySelectorAll('.hadist-kitab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _renderHadistList();
    });

    // Goto nomor
    overlay.querySelector('#hadist-goto-btn').addEventListener('click', _gotoHadist);
    overlay.querySelector('#hadist-goto-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') _gotoHadist();
    });

    // Pagination
    overlay.querySelector('#hadist-prev-page').addEventListener('click', () => {
        if (_panelState.page > 1) { _panelState.page--; _renderHadistList(); }
    });
    overlay.querySelector('#hadist-next-page').addEventListener('click', () => {
        _panelState.page++;
        _renderHadistList();
    });

    requestAnimationFrame(() => overlay.classList.add('open'));
    _renderHadistList();
}

function _gotoHadist() {
    const input = document.getElementById('hadist-goto-input');
    const nomor = parseInt(input?.value);
    if (!nomor || nomor < 1) return;
    _renderHadistDetail(_panelState.kitab.id, nomor);
    if (input) input.value = '';
}

function _renderHadistList() {
    const body     = document.getElementById('hadist-panel-body');
    const subtitle = document.getElementById('hadist-panel-subtitle');
    const pageInfo = document.getElementById('hadist-page-info');
    const paginationEl = document.getElementById('hadist-pagination');
    if (!body) return;

    _panelState.view = 'list';
    if (subtitle) subtitle.textContent = _panelState.kitab.nama;
    if (paginationEl) paginationEl.style.display = 'flex';

    body.innerHTML = `<div class="hadist-loading"><i class="fa-solid fa-spinner fa-spin"></i><span>Memuat...</span></div>`;

    _fetchHadistList(_panelState.kitab.id, _panelState.page, _panelState.limit)
        .then(res => {
            const items     = res.data   ?? res.hadiths ?? res ?? [];
            const totalPage = res.pagination?.totalPage ?? Math.ceil(_panelState.kitab.total / _panelState.limit);

            if (pageInfo) pageInfo.textContent = `${_panelState.page} / ${totalPage}`;

            const prevBtn = document.getElementById('hadist-prev-page');
            const nextBtn = document.getElementById('hadist-next-page');
            if (prevBtn) prevBtn.disabled = _panelState.page <= 1;
            if (nextBtn) nextBtn.disabled = _panelState.page >= totalPage;

            if (!items.length) {
                body.innerHTML = `<div class="hadist-empty"><i class="fa-solid fa-inbox"></i><p>Tidak ada data.</p></div>`;
                return;
            }

            body.innerHTML = items.map(h => {
                const nomor = h.number ?? h.no ?? '?';
                const arab  = (h.arab  ?? h.text_ar ?? '').slice(0, 120) + '...';
                const idn   = (h.id    ?? h.text_id ?? h.Indonesia ?? '').slice(0, 100) + '...';
                return `
                    <div class="hadist-list-item" data-nomor="${nomor}">
                        <div class="hli-nomor">${nomor}</div>
                        <div class="hli-content">
                            <p class="hli-arab" dir="rtl">${arab}</p>
                            <p class="hli-idn">${idn}</p>
                        </div>
                        <i class="fa-solid fa-chevron-right hli-arrow"></i>
                    </div>
                `;
            }).join('');

            // Click item → detail
            body.querySelectorAll('.hadist-list-item').forEach(item => {
                item.addEventListener('click', () => {
                    _renderHadistDetail(_panelState.kitab.id, parseInt(item.dataset.nomor));
                });
            });
        })
        .catch(() => {
            body.innerHTML = `<div class="hadist-empty"><i class="fa-solid fa-wifi"></i><p>Gagal memuat. Periksa koneksi.</p></div>`;
        });
}

function _renderHadistDetail(kitabId, nomor) {
    const body      = document.getElementById('hadist-panel-body');
    const subtitle  = document.getElementById('hadist-panel-subtitle');
    const paginationEl = document.getElementById('hadist-pagination');
    if (!body) return;

    _panelState.view = 'detail';
    if (paginationEl) paginationEl.style.display = 'none';

    body.innerHTML = `<div class="hadist-loading"><i class="fa-solid fa-spinner fa-spin"></i><span>Memuat hadist...</span></div>`;

    _fetchHadist(kitabId, nomor)
        .then(data => {
            const h        = data.data ?? data;
            const arab     = h.arab    ?? h.text_ar ?? '';
            const idn      = h.id      ?? h.text_id ?? h.Indonesia ?? '';
            const nomorH   = h.number  ?? h.no ?? nomor;
            const kitabNama = _getKitabNama(kitabId);

            if (subtitle) subtitle.textContent = `${kitabNama} · No. ${nomorH}`;

            body.innerHTML = `
                <div class="hadist-detail">
                    <button class="hadist-back-btn" id="hadist-back-btn">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Kembali ke daftar</span>
                    </button>

                    <div class="hadist-detail-badge">
                        <span class="hdb-arab">${_getKitabArab(kitabId)}</span>
                        <span class="hdb-nama">${kitabNama}</span>
                        <span class="hdb-nomor">No. ${nomorH}</span>
                    </div>

                    <div class="hadist-detail-arab">
                        <p dir="rtl">${arab}</p>
                    </div>

                    <div class="hadist-detail-idn">
                        <div class="hdi-label"><i class="fa-solid fa-language"></i> Terjemahan</div>
                        <p>${idn}</p>
                    </div>

                    <div class="hadist-detail-actions">
                        <button class="hadist-action-btn" id="hadist-bookmark-btn"
                            title="${isBookmarkedHadist(kitabId, nomorH) ? 'Hapus bookmark' : 'Simpan bookmark'}">
                            <i class="${isBookmarkedHadist(kitabId, nomorH) ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                            Bookmark
                        </button>
                        <button class="hadist-action-btn" id="hadist-copy-btn">
                            <i class="fa-regular fa-copy"></i>
                            Salin
                        </button>
                        <button class="hadist-action-btn" id="hadist-prev-hadist">
                            <i class="fa-solid fa-chevron-left"></i>
                            Sebelumnya
                        </button>
                        <button class="hadist-action-btn" id="hadist-next-hadist">
                            Selanjutnya
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('hadist-back-btn').addEventListener('click', () => {
                _panelState.view = 'list';
                if (subtitle) subtitle.textContent = _panelState.kitab.nama;
                if (paginationEl) paginationEl.style.display = 'flex';
                _renderHadistList();
            });

            // Bookmark
            const bookmarkBtn = document.getElementById('hadist-bookmark-btn');
            if (bookmarkBtn) {
                bookmarkBtn.addEventListener('click', () => {
                    if (typeof toggleBookmarkHadist === 'function') {
                        toggleBookmarkHadist(
                            kitabId,
                            kitabNama,
                            _getKitabArab(kitabId),
                            nomorH,
                            arab,
                            idn
                        );
                        // Update button state
                        const isOn = isBookmarkedHadist(kitabId, nomorH);
                        bookmarkBtn.classList.toggle('bookmarked', isOn);
                        const icon = bookmarkBtn.querySelector('i');
                        if (icon) icon.className = isOn ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
                    }
                });
            }

            document.getElementById('hadist-copy-btn').addEventListener('click', () => {
                const text = `${arab}\n\n"${idn}"\n\n(${kitabNama} No. ${nomorH})`;
                navigator.clipboard.writeText(text).then(() => {
                    if (typeof showToast === 'function')
                        showToast({ type: 'success', message: 'Hadist berhasil disalin!', duration: 2000 });
                });
            });

            const maxNomor = _panelState.kitab.total;
            const prevBtn2  = document.getElementById('hadist-prev-hadist');
            const nextBtn2  = document.getElementById('hadist-next-hadist');
            if (prevBtn2) {
                prevBtn2.disabled = nomorH <= 1;
                prevBtn2.addEventListener('click', () => _renderHadistDetail(kitabId, nomorH - 1));
            }
            if (nextBtn2) {
                nextBtn2.disabled = nomorH >= maxNomor;
                nextBtn2.addEventListener('click', () => _renderHadistDetail(kitabId, nomorH + 1));
            }
        })
        .catch(() => {
            body.innerHTML = `<div class="hadist-empty"><i class="fa-solid fa-wifi"></i><p>Gagal memuat hadist ini.</p></div>`;
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
