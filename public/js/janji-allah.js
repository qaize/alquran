/* janji-allah.js — Fitur "Janji Allah": kategori situasi & ayat */

const JANJI_ALLAH_DATA = [
    {
        kategori: 'Manajemen Emosi dan Kesehatan Mental',
        icon: 'fa-heart-pulse',
        warna: '#4a90d9',
        items: [
            { kondisi: 'Sedih & Menangis',               surah: 12, ayat: [86] },
            { kondisi: 'Merasa Ditinggalkan Sendirian',  surah: 93, ayat: [3] },
            { kondisi: 'Gelisah & Overthinking',         surah: 13, ayat: [28] },
            { kondisi: 'Lelah Menjalani Hidup',          surah: 2,  ayat: [286] },
            { kondisi: 'Merasa Hina / Berlumur Dosa',    surah: 39, ayat: [53] },
            { kondisi: 'Takut Menghadapi Masa Depan',    surah: 41, ayat: [30] },
            { kondisi: 'Marah & Emosi Memuncak',         surah: 3,  ayat: [134] },
            { kondisi: 'Iri Hati / Insecure',            surah: 4,  ayat: [32] },
        ]
    },
    {
        kategori: 'Menghadapi Masalah, Konflik, dan Musibah',
        icon: 'fa-shield-halved',
        warna: '#e67e22',
        items: [
            { kondisi: 'Jalan Keluar Buntu / Mentok',         surah: 65, ayat: [2,3] },
            { kondisi: 'Musibah Bertubi-tubi',                surah: 94, ayat: [5,6] },
            { kondisi: 'Difitnah / Digosipkan',               surah: 24, ayat: [11] },
            { kondisi: 'Sakit Fisik yang Sulit Sembuh',       surah: 26, ayat: [80] },
            { kondisi: 'Kehilangan Orang Tercinta / Harta',   surah: 2,  ayat: [155,156] },
            { kondisi: 'Ditipu / Dikhianati Orang Lain',      surah: 8,  ayat: [62] },
            { kondisi: 'Utang / Kesempitan Finansial',        surah: 71, ayat: [10,11,12] },
        ]
    },
    {
        kategori: 'Panduan Adab, Komunikasi, dan Hubungan Sosial',
        icon: 'fa-people-group',
        warna: '#27ae60',
        items: [
            { kondisi: 'Berinteraksi dengan Haters',         surah: 25, ayat: [63] },
            { kondisi: 'Memperlakukan Orang Tua',            surah: 17, ayat: [23,24] },
            { kondisi: 'Menerima Berita Viral / Rumor',      surah: 49, ayat: [6] },
            { kondisi: 'Larangan Cyberbullying / Ghibah',    surah: 49, ayat: [11,12] },
            { kondisi: 'Memilih Teman / Circle',             surah: 18, ayat: [28] },
            { kondisi: 'Berdebat / Berdiskusi',              surah: 16, ayat: [125] },
        ]
    },
    {
        kategori: 'Visi, Misi, dan Etos Kerja',
        icon: 'fa-bullseye',
        warna: '#9b59b6',
        items: [
            { kondisi: 'Tujuan Hidup (Life Purpose)',             surah: 51, ayat: [56] },
            { kondisi: 'Motivasi Bekerja Keras',                  surah: 9,  ayat: [105] },
            { kondisi: 'Work-Life Balance (Dunia-Akhirat)',       surah: 28, ayat: [77] },
            { kondisi: 'Saat Berada di Puncak Kesuksesan',       surah: 31, ayat: [18] },
            { kondisi: 'Manajemen Keuangan',                      surah: 17, ayat: [26,27] },
        ]
    },
    {
        kategori: 'Garansi Mutlak dan Janji-Janji Allah',
        icon: 'fa-star-and-crescent',
        warna: '#c9a84c',
        items: [
            { kondisi: 'Janji tentang Doa',                  surah: 40, ayat: [60] },
            { kondisi: 'Janji tentang Syukur',               surah: 14, ayat: [7] },
            { kondisi: 'Janji tentang Sabar',                surah: 39, ayat: [10] },
            { kondisi: 'Janji tentang Mengingat-Nya',        surah: 2,  ayat: [152] },
            { kondisi: 'Janji tentang Amal Sekecil Atom',    surah: 99, ayat: [7] },
        ]
    },
];

// Cache detail surah yang sudah di-fetch
const _janjiCache = new Map();

function _fetchSurahDetail(nomorSurah) {
    if (_janjiCache.has(nomorSurah)) {
        return Promise.resolve(_janjiCache.get(nomorSurah));
    }
    // Reuse cache dari surahDetailCache di script.js jika ada
    if (typeof surahDetailCache !== 'undefined' && surahDetailCache.has(nomorSurah)) {
        _janjiCache.set(nomorSurah, surahDetailCache.get(nomorSurah));
        return Promise.resolve(surahDetailCache.get(nomorSurah));
    }
    return fetch(`https://equran.id/api/v2/surat/${nomorSurah}`)
        .then(r => r.json())
        .then(r => {
            const data = r.data !== undefined ? r.data : r;
            _janjiCache.set(nomorSurah, data);
            if (typeof trackApiCall === 'function') trackApiCall('surat_detail');
            return data;
        });
}

function _getAyatFromData(surahData, nomorAyat) {
    const ayatList = surahData.ayat || [];
    return ayatList.find(a => (a.nomorAyat ?? a.nomor) === nomorAyat);
}

function _refStr(surah, ayatArr) {
    if (ayatArr.length === 1) return `QS. ${surah}:${ayatArr[0]}`;
    return `QS. ${surah}:${ayatArr[0]}-${ayatArr[ayatArr.length - 1]}`;
}

/* ── Render panel utama Janji Allah ── */
function openJanjiAllahPanel() {
    let overlay = document.getElementById('janji-allah-overlay');
    if (overlay) { overlay.classList.add('open'); return; }

    overlay = document.createElement('div');
    overlay.id = 'janji-allah-overlay';
    overlay.className = 'janji-allah-overlay';

    overlay.innerHTML = `
        <div class="janji-allah-panel">
            <div class="janji-panel-header">
                <div class="janji-panel-title">
                    <i class="fa-solid fa-star-and-crescent"></i>
                    <div>
                        <h2>Janji Allah</h2>
                        <p>Temukan ayat yang relevan dengan situasimu</p>
                    </div>
                </div>
                <button class="janji-panel-close" id="janji-panel-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="janji-panel-search">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="janji-search-input"
                    placeholder="Cari kondisi atau kategori..."
                    autocomplete="off">
            </div>

            <div class="janji-panel-body" id="janji-panel-body">
                ${_renderKategoriList(JANJI_ALLAH_DATA)}
            </div>
        </div>

        <div class="janji-ayat-panel" id="janji-ayat-panel" style="display:none;">
            <div class="janji-ayat-header">
                <button class="janji-back-btn" id="janji-back-btn">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div class="janji-ayat-title" id="janji-ayat-title">—</div>
            </div>
            <div class="janji-ayat-body" id="janji-ayat-body">
                <div class="janji-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>Memuat ayat...</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close
    overlay.querySelector('#janji-panel-close').addEventListener('click', () => {
        overlay.classList.remove('open');
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });

    // Back
    overlay.querySelector('#janji-back-btn').addEventListener('click', () => {
        document.getElementById('janji-panel-body').style.display = '';
        document.getElementById('janji-ayat-panel').style.display = 'none';
    });

    // Search
    const searchInput = overlay.querySelector('#janji-search-input');
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        _filterJanjiList(q);
    });

    // Item click (event delegation)
    overlay.querySelector('#janji-panel-body').addEventListener('click', (e) => {
        const item = e.target.closest('.janji-item');
        if (!item) return;
        const surah = parseInt(item.dataset.surah);
        const ayat  = JSON.parse(item.dataset.ayat);
        const kondisi = item.dataset.kondisi;
        openJanjiAyat(surah, ayat, kondisi);
    });

    requestAnimationFrame(() => overlay.classList.add('open'));
}

function _renderKategoriList(data) {
    return data.map(kat => `
        <div class="janji-kategori" data-kategori="${kat.kategori}">
            <div class="janji-kategori-header">
                <span class="janji-kat-icon" style="background:${kat.warna}20; color:${kat.warna}">
                    <i class="fa-solid ${kat.icon}"></i>
                </span>
                <span class="janji-kat-name">${kat.kategori}</span>
                <span class="janji-kat-count">${kat.items.length}</span>
            </div>
            <div class="janji-items">
                ${kat.items.map(item => `
                    <div class="janji-item"
                        data-surah="${item.surah}"
                        data-ayat="${JSON.stringify(item.ayat)}"
                        data-kondisi="${item.kondisi}">
                        <div class="janji-item-left">
                            <span class="janji-item-kondisi">${item.kondisi}</span>
                            <span class="janji-item-ref">${_refStr(item.surah, item.ayat)}</span>
                        </div>
                        <i class="fa-solid fa-chevron-right janji-item-arrow"></i>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function _filterJanjiList(q) {
    const body = document.getElementById('janji-panel-body');
    if (!q) {
        body.innerHTML = _renderKategoriList(JANJI_ALLAH_DATA);
        _rebindItemClicks();
        return;
    }

    const filtered = JANJI_ALLAH_DATA.map(kat => ({
        ...kat,
        items: kat.items.filter(it =>
            it.kondisi.toLowerCase().includes(q) ||
            kat.kategori.toLowerCase().includes(q) ||
            `${it.surah}`.includes(q)
        )
    })).filter(kat => kat.items.length > 0);

    body.innerHTML = filtered.length
        ? _renderKategoriList(filtered)
        : `<div class="janji-empty"><i class="fa-solid fa-search"></i><p>Tidak ada hasil untuk "${q}"</p></div>`;

    _rebindItemClicks();
}

function _rebindItemClicks() {
    const body = document.getElementById('janji-panel-body');
    if (!body) return;
    body.querySelectorAll('.janji-item').forEach(item => {
        item.addEventListener('click', () => {
            const surah   = parseInt(item.dataset.surah);
            const ayat    = JSON.parse(item.dataset.ayat);
            const kondisi = item.dataset.kondisi;
            openJanjiAyat(surah, ayat, kondisi);
        });
    });
}

/* ── Tampilkan ayat untuk kondisi yang dipilih ── */
function openJanjiAyat(nomorSurah, ayatArr, kondisi) {
    const panelBody = document.getElementById('janji-panel-body');
    const ayatPanel = document.getElementById('janji-ayat-panel');
    const ayatTitle = document.getElementById('janji-ayat-title');
    const ayatBody  = document.getElementById('janji-ayat-body');

    panelBody.style.display = 'none';
    ayatPanel.style.display = 'flex';
    ayatTitle.textContent   = kondisi;

    ayatBody.innerHTML = `
        <div class="janji-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Memuat ayat...</span>
        </div>`;

    _fetchSurahDetail(nomorSurah)
        .then(data => {
            const namaLatin = data.namaLatin ?? data.nama_latin;
            const ref = _refStr(nomorSurah, ayatArr);

            let html = `
                <div class="janji-surah-badge">
                    <span class="janji-surah-arab">${data.nama}</span>
                    <span class="janji-surah-latin">${namaLatin}</span>
                    <span class="janji-surah-ref">${ref}</span>
                </div>
            `;

            ayatArr.forEach(nomorAyat => {
                const ayat = _getAyatFromData(data, nomorAyat);
                if (!ayat) return;
                const arab   = ayat.teksArab ?? ayat.ar ?? '';
                const latin  = ayat.teksLatin ?? ayat.tr ?? '';
                const idn    = ayat.teksIndonesia ?? ayat.idn ?? '';
                const nomor  = ayat.nomorAyat ?? ayat.nomor;

                html += `
                    <div class="janji-ayat-card">
                        <div class="janji-ayat-nomor">${nomor}</div>
                        <div class="janji-ayat-content">
                            <p class="janji-arab" dir="rtl">${arab}</p>
                            <p class="janji-latin">${latin}</p>
                            <p class="janji-terjemah">"${idn}"</p>
                        </div>
                        <div class="janji-ayat-actions">
                            <button class="janji-action-btn" title="Buka di Al-Quran"
                                onclick="openJanjiInQuran(${nomorSurah}, ${nomor})">
                                <i class="fa-solid fa-book-open"></i>
                                <span>Buka Surah</span>
                            </button>
                            <button class="janji-action-btn" title="Salin ayat"
                                onclick="copyJanjiAyat('${arab.replace(/'/g,"\\'")}', '${idn.replace(/'/g,"\\'")}', '${namaLatin}', ${nomor})">
                                <i class="fa-regular fa-copy"></i>
                                <span>Salin</span>
                            </button>
                        </div>
                    </div>
                `;
            });

            ayatBody.innerHTML = html;
        })
        .catch(() => {
            ayatBody.innerHTML = `
                <div class="janji-empty">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <p>Gagal memuat ayat. Periksa koneksi internet.</p>
                </div>`;
        });
}

/* ── Buka surah di halaman utama ── */
function openJanjiInQuran(nomorSurah, nomorAyat) {
    // Tutup panel
    const overlay = document.getElementById('janji-allah-overlay');
    if (overlay) overlay.classList.remove('open');

    // Load surah lalu scroll ke ayat
    if (typeof loadSurahDetails === 'function') {
        loadSurahDetails(nomorSurah);
        // Scroll ke ayat setelah render
        const tryScroll = (attempts) => {
            const el = document.getElementById(`isi-ayat${nomorAyat}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ayat-jump-highlight');
                setTimeout(() => el.classList.remove('ayat-jump-highlight'), 2000);
            } else if (attempts > 0) {
                setTimeout(() => tryScroll(attempts - 1), 300);
            }
        };
        setTimeout(() => tryScroll(10), 600);
    }
}

/* ── Salin ayat ── */
function copyJanjiAyat(arab, idn, namaLatin, nomor) {
    const text = `${arab}\n\n"${idn}"\n\n(${namaLatin}: ${nomor})`;
    navigator.clipboard.writeText(text).then(() => {
        if (typeof showToast === 'function') {
            showToast({ type: 'success', message: 'Ayat berhasil disalin!', duration: 2000 });
        }
    });
}

/* ── Init ── */
function initJanjiAllah() {
    const btn = document.getElementById('nav-janji-allah-btn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openJanjiAllahPanel();
        // Tutup drawer mobile jika terbuka
        document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
        document.body.style.overflow = '';
    });
}
