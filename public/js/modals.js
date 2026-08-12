/* modals.js — Tafsir + Asbabun Nuzul + Data Source modals */

/* ──────────────────────────────────────────────
   DATA SOURCE — Modal
   ────────────────────────────────────────────── */
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
                            <span>${t('modal_datasource')}</span>
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
                                    <p>${t('modal_datasource_desc')}</p>
                                    <a href="https://equran.id/" target="_blank">equran.id <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-palette"></i></div>
                                <div class="datasource-info">
                                    <h4>AlQuran Cloud</h4>
                                    <p>${t('modal_tajweed_desc')}</p>
                                    <a href="https://alquran.cloud/" target="_blank">alquran.cloud <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-scroll"></i></div>
                                <div class="datasource-info">
                                    <h4>Muslim API</h4>
                                    <p>${t('modal_asbab_desc')}</p>
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
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-clock"></i></div>
                                <div class="datasource-info">
                                    <h4>AlAdhan API</h4>
                                    <p>${t('modal_aladhan_desc')}</p>
                                    <a href="https://aladhan.com/prayer-times-api" target="_blank">aladhan.com <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-location-dot"></i></div>
                                <div class="datasource-info">
                                    <h4>BigDataCloud</h4>
                                    <p>${t('modal_bigdatacloud_desc')}</p>
                                    <a href="https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api" target="_blank">bigdatacloud.com <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <div class="datasource-item">
                                <div class="datasource-icon"><i class="fa-solid fa-scroll"></i></div>
                                <div class="datasource-info">
                                    <h4>Hadith API</h4>
                                    <p>${t('modal_hadith_desc')}</p>
                                    <a href="https://hadis-api-id.vercel.app" target="_blank">hadis-api-id <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
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
        document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
    });
}


/* ──────────────────────────────────────────────
   TAFSIR — Modal + Fetch dari equran.id API
   ────────────────────────────────────────────── */
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
                        <span>${t('modal_tafsir')}</span>
                    </div>
                    <button class="asbab-modal-close" id="tafsir-modal-close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="asbab-modal-body" id="tafsir-modal-body">
                    <div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${t('modal_loading_tafsir')}</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#tafsir-modal-close').addEventListener('click', () => modal.classList.remove('open'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }

    const body = modal.querySelector('#tafsir-modal-body');
    body.innerHTML = `<div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${t('modal_loading_tafsir')}</div>`;
    modal.classList.add('open');

    fetchTafsirSurah(nomorSurah).then(tafsirList => {
        const tafsir = tafsirList.find(item => item.ayat === nomorAyat || item.ayat === String(nomorAyat));
        if (!tafsir || !tafsir.teks) {
            body.innerHTML = `<div class="asbab-empty"><i class="fa-regular fa-file-lines"></i><p>${t('modal_tafsir_empty')}</p></div>`;
            return;
        }
        body.innerHTML = `
            <div class="asbab-ayat-info">
                <span class="asbab-ayat-badge">${t('surah_word')} ${nomorSurah} : ${t('ayat_ref')} ${nomorAyat}</span>
            </div>
            <div class="asbab-content">${tafsir.teks.replace(/\n/g, '<br>')}</div>
        `;
    }).catch(() => {
        body.innerHTML = `<div class="asbab-empty"><p>${t('modal_tafsir_fail')}</p></div>`;
    });
}

function fetchTafsirSurah(nomorSurah) {
    if (tafsirCache.has(nomorSurah)) {
        return Promise.resolve(tafsirCache.get(nomorSurah));
    }
    if (typeof NProgress !== 'undefined') NProgress.start();
    return fetch(`https://equran.id/api/v2/tafsir/${nomorSurah}`)
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(json => {
            if (typeof NProgress !== 'undefined') NProgress.done();
            const data = json.data && json.data.tafsir ? json.data.tafsir : [];
            tafsirCache.set(nomorSurah, data);
            if (typeof trackApiCall === 'function') trackApiCall('tafsir');
            return data;
        })
        .catch(err => {
            if (typeof NProgress !== 'undefined') NProgress.done();
            throw err;
        });
}


/* ──────────────────────────────────────────────
   ASBABUN NUZUL — Modal + Fetch dari Muslim API
   ────────────────────────────────────────────── */
const ASBAB_API = '/api/asbab/surah';
const asbabCache = new Map();

function openAsbabunNuzul(nomorSurah, nomorAyat) {
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
                        <span>${t('modal_asbab')}</span>
                    </div>
                    <button class="asbab-modal-close" id="asbab-modal-close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="asbab-modal-body" id="asbab-modal-body">
                    <div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${t('modal_loading_data')}</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#asbab-modal-close').addEventListener('click', () => modal.classList.remove('open'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }

    const body = modal.querySelector('#asbab-modal-body');
    body.innerHTML = `<div class="asbab-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${t('modal_loading_data')}</div>`;
    modal.classList.add('open');

    fetchAsbabForSurah(nomorSurah).then(ayahList => {
        const ayahData = ayahList.find(a => String(a.ayah) === String(nomorAyat));
        if (!ayahData || ayahData.asbab === '0' || !ayahData.asbab) {
            body.innerHTML = `
                <div class="asbab-empty">
                    <i class="fa-regular fa-file-lines"></i>
                    <p>${t('modal_asbab_empty')}</p>
                </div>
            `;
            return;
        }
        fetchAsbabDetail(ayahData.asbab).then(detail => {
            body.innerHTML = `
                <div class="asbab-ayat-info">
                    <span class="asbab-ayat-badge">${t('surah_word')} ${nomorSurah} : ${t('ayat_ref')} ${nomorAyat}</span>
                </div>
                <div class="asbab-content">
                    <p>${detail.text || t('modal_data_na')}</p>
                </div>
            `;
        }).catch(() => {
            body.innerHTML = `<div class="asbab-empty"><p>${t('modal_asbab_fail')}</p></div>`;
        });
    }).catch(() => {
        body.innerHTML = `<div class="asbab-empty"><p>${t('modal_asbab_fail')}</p></div>`;
    });
}

function fetchAsbabForSurah(nomorSurah) {
    if (asbabCache.has(nomorSurah)) {
        return Promise.resolve(asbabCache.get(nomorSurah));
    }
    if (typeof NProgress !== 'undefined') NProgress.start();
    return fetch(`${ASBAB_API}/${nomorSurah}`)
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(json => {
            if (typeof NProgress !== 'undefined') NProgress.done();
            const data = json.data || [];
            asbabCache.set(nomorSurah, data);
            if (typeof trackApiCall === 'function') trackApiCall('asbab');
            return data;
        })
        .catch(err => {
            if (typeof NProgress !== 'undefined') NProgress.done();
            throw err;
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
