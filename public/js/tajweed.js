/* tajweed.js — Tajweed colored + panduan modal + tooltip */

/* ──────────────────────────────────────────────
   TAJWEED — Colored Tajwid from alquran.cloud API
   ────────────────────────────────────────────── */
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
    'n': { name: 'Mad Thabi\'i', desc: 'Mad asli. Dipanjangkan selama 2 harakat (satu alif). Terjadi ketika ada huruf mad (ا و ي) dan tidak bertemu hamzah atau sukun setelahnya.' },
    'p': { name: 'Mad Jaiz Munfashil', desc: 'Mad yang dipisah. Terjadi saat huruf mad di akhir kata bertemu hamzah di awal kata berikutnya. Boleh dibaca 2, 4, atau 5 harakat.' },
    'm': { name: 'Mad Lazim', desc: 'Mad yang wajib dipanjangkan selama 6 harakat (tiga alif). Terjadi saat huruf mad bertemu huruf bertasydid atau bersukun asli dalam satu kata.' },
    'q': { name: 'Qalqalah', desc: 'Bunyi pantulan atau getaran pada huruf Qaf, Tha, Ba, Jim, dan Dal (قطبجد) ketika huruf tersebut bersukun atau saat berhenti (waqaf).' },
    'o': { name: 'Mad Wajib Muttashil', desc: 'Mad yang wajib disambung. Terjadi saat huruf mad dan hamzah berada dalam satu kata. Wajib dipanjangkan selama 4 sampai 5 harakat.' },
    'c': { name: 'Ikhfa Syafawi', desc: 'Mim mati bertemu huruf Ba. Mim dibunyikan secara samar-samar melalui bibir yang hampir merapat, disertai dengung selama 2 harakat.' },
    'f': { name: 'Ikhfa Haqiqi', desc: 'Nun mati atau tanwin bertemu salah satu dari 15 huruf ikhfa. Nun dibunyikan samar (antara izhar dan idgham), disertai dengung selama 2 harakat. Posisi lidah menyesuaikan huruf ikhfa yang ditemui.' },
    'w': { name: 'Idgham Syafawi', desc: 'Mim mati bertemu huruf Mim. Kedua mim dilebur menjadi satu mim bertasydid. Dibaca dengan dengung selama 2 harakat.' },
    'i': { name: 'Iqlab', desc: 'Nun mati atau tanwin bertemu huruf Ba. Bunyi nun diganti (ditukar) menjadi bunyi Mim, lalu dibaca dengan dengung selama 2 harakat sambil merapatkan kedua bibir.' },
    'a': { name: 'Idgham bi Ghunnah', desc: 'Nun mati atau tanwin bertemu huruf Ya, Nun, Mim, atau Waw (ينمو). Nun dilebur ke huruf sesudahnya dan dibaca dengan dengung selama 2 harakat.' },
    'u': { name: 'Idgham bila Ghunnah', desc: 'Nun mati atau tanwin bertemu huruf Lam atau Ra (ل ر). Nun dilebur sepenuhnya ke huruf sesudahnya. Dibaca tanpa dengung sama sekali.' },
    'd': { name: 'Idgham Mutajanisain', desc: 'Dua huruf yang memiliki makhraj (tempat keluar) yang sama bertemu berurutan. Huruf pertama yang mati dilebur ke huruf kedua yang berharakat.' },
    'b': { name: 'Idgham Mutaqaribain', desc: 'Dua huruf yang makhrajnya berdekatan bertemu berurutan. Huruf pertama yang mati dilebur ke huruf kedua yang berharakat.' },
    'g': { name: 'Ghunnah', desc: 'Bunyi dengung yang keluar dari pangkal hidung selama 2 harakat. Terjadi pada huruf Nun atau Mim yang bertasydid (ditandai dengan tasydid/syaddah).' }
};

/**
 * Parse raw tajweed text from API ke HTML berwarna.
 * Format tag: [X:NUM[TEXT] atau [X[TEXT]
 * Contoh: [h:1[ٱ] atau [n[مَٰ]
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
    if (typeof NProgress !== 'undefined') NProgress.start();
    return fetch(`https://api.alquran.cloud/v1/surah/${nomorSurah}/quran-tajweed`)
        .then(res => res.json())
        .then(json => {
            if (typeof NProgress !== 'undefined') NProgress.done();
            const ayahs = json.data && json.data.ayahs ? json.data.ayahs : [];
            const map = new Map();
            ayahs.forEach(ayah => {
                map.set(ayah.numberInSurah, parseTajweedText(ayah.text));
            });
            tajweedCache.set(nomorSurah, map);
            if (typeof trackApiCall === 'function') trackApiCall('tajweed');
            return map;
        })
        .catch(err => {
            if (typeof NProgress !== 'undefined') NProgress.done();
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


/* ──────────────────────────────────────────────
   PANDUAN TAJWID — Modal Besar
   ────────────────────────────────────────────── */
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




/* ──────────────────────────────────────────────
   TAJWEED TOOLTIP — JS (appended to body, no overflow clip)
   ────────────────────────────────────────────── */
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
        // Wrap Arabic characters in desc with larger font span
        const descHTML = desc.replace(/([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+(?:\s[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)*)/g,
            '<span class="tj-modal-arab-inline">$1</span>');
        modal.querySelector('.tj-modal-desc').innerHTML = descHTML;
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
