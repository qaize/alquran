/* ============================================================
   share-ayat.js — Fitur Share Ayat Al-Quran
   Generate gambar kartu 9:16 (story), share via Web Share API
   atau download PNG.
   Depends on: html2canvas (global), getSettings(), showToast(),
               getAyatData() dari audio.js
   ============================================================ */

(function () {
    'use strict';

    /* ── Konstanta ID ── */
    const MODAL_ID     = 'share-ayat-modal';
    const CARD_ID      = 'share-ayat-card';
    const PREVIEW_ID   = 'share-ayat-preview';
    const LOADING_ID   = 'share-ayat-loading';
    const CLOSE_ID     = 'share-ayat-close';
    const BTN_SHARE_ID = 'share-ayat-btn-share';
    const BTN_DL_ID    = 'share-ayat-btn-download';
    const THEME_GROUP  = 'share-ayat-themes';

    /* ── Tema — overlay di atas background ── */
    const THEMES = [
        { id: 'putih1', label: 'Putih',
          overlay: 'rgba(255,252,245,0.88)', text: '#2c1a0e', sub: '#6b4c2a', line: 'rgba(107,76,42,0.2)',    ref: '#7a5030' },
        { id: 'krem',   label: 'Krem',
          overlay: 'rgba(245,235,210,0.88)', text: '#1e1206', sub: '#7a5c3a', line: 'rgba(122,92,58,0.25)',   ref: '#8b6340' },
        { id: 'abu',    label: 'Abu',
          overlay: 'rgba(238,238,235,0.88)', text: '#1a1a1a', sub: '#555555', line: 'rgba(80,80,80,0.2)',     ref: '#666666' },
        { id: 'hijau',  label: 'Hijau',
          overlay: 'rgba(8,32,18,0.88)',     text: '#f0edd8', sub: '#c9b98a', line: 'rgba(201,185,138,0.3)',  ref: '#a89468' },
        { id: 'biru',   label: 'Biru',
          overlay: 'rgba(8,20,42,0.88)',     text: '#e8f0f8', sub: '#b8cfe8', line: 'rgba(184,207,232,0.3)',  ref: '#8aafc8' },
        { id: 'emas',   label: 'Emas',
          overlay: 'rgba(18,10,0,0.86)',     text: '#fdf3dc', sub: '#d4a843', line: 'rgba(212,168,67,0.35)',  ref: '#c9a030' },
        { id: 'gelap',  label: 'Gelap',
          overlay: 'rgba(0,0,0,0.88)',       text: '#f0edd8', sub: '#c9b98a', line: 'rgba(201,185,138,0.25)', ref: '#a89468' },
    ];

    /*
     * Gambar background — bebas makhluk hidup:
     * masjid, Mekah/Madinah, alam tanpa orang/hewan
     * object-fit: fill (tidak crop, tidak paksa proporsional)
     */
    const BG_IMAGES = [
        // 1. Interior masjid — lengkung & ornamen
        'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=80&auto=format',
        // 2. Masjid Nabawi — kubah hijau dari luar
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80&auto=format',
        // 3. Masjidil Haram — Ka'bah aerial view
        'https://images.unsplash.com/photo-1564769610726-59cde7fef88a?w=600&q=80&auto=format',
        // 4. Masjid kubah — siluet saat senja
        'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80&auto=format',
        // 5. Padang pasir + langit senja tanpa makhluk
        'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80&auto=format',
        // 6. Langit biru cerah + awan
        'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=600&q=80&auto=format',
        // 7. Pegunungan + kabut pagi
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80&auto=format',
        // 8. Bukit hijau + langit dramatis
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80&auto=format',
        // 9. Tekstur parchment / kertas tua
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80&auto=format',
    ];

    /* ── State ── */
    let _activeTheme   = 0;
    let _activeBg      = 0; // index BG_IMAGES
    let _currentData   = null;
    let _previewData   = null;
    let _generating    = false;
    let _cardContainer = null;

    /* ================================================================
       PUBLIC API
       ================================================================ */
    function initShareAyat() {
        _injectModal();
        _bindModalEvents();
        _ensureCardContainer();
    }

    function openShareAyat(nomorSurah, namaLatin, nomorAyat) {
        // Pastikan nomorAyat selalu number untuk konsistensi
        nomorAyat = parseInt(nomorAyat, 10);

        // Cari elemen ayat — bisa pakai ID format surah (isi-ayat5)
        // atau format juz (isi-ayat-2-5), cek data-surah & data-ayat untuk akurasi
        let ayatEl = null;
        const candidate = document.getElementById('isi-ayat' + nomorAyat);
        if (candidate && parseInt(candidate.dataset.surah, 10) === nomorSurah
                      && parseInt(candidate.dataset.ayat,  10) === nomorAyat) {
            ayatEl = candidate;
        }
        // Fallback: cari lewat data attribute (mode juz pakai id berbeda)
        if (!ayatEl) {
            ayatEl = document.querySelector(
                `.isi-ayat[data-surah="${nomorSurah}"][data-ayat="${nomorAyat}"]`
            );
        }
        if (!ayatEl) {
            console.warn('[ShareAyat] isi-ayat tidak ditemukan:', nomorSurah, nomorAyat);
            return;
        }

        // ── Teks Arab dari DOM (innerHTML agar harakat ikut) ──
        const arabEl   = ayatEl.querySelector('.arabic');
        const arabText = arabEl ? arabEl.innerHTML.trim() : '';

        // ── Terjemahan: ambil dari data-terjemah attribute (paling reliable & sinkron),
        //    fallback ke .terjemahan DOM, fallback ke getAyatData
        let terjemahText = '';

        // 1. Dari data-terjemah attribute — disimpan saat render awal, selalu sinkron
        const dataTerjemah = ayatEl.dataset.terjemah;
        if (dataTerjemah) {
            terjemahText = dataTerjemah.trim()
                .replace(/^["""''""]+|["""''""]+$/g, '')
                .trim();
        }

        // 2. Fallback: cari p.terjemahan di DOM (jika data-terjemah tidak ada)
        if (!terjemahText) {
            const terjemahEl = ayatEl.querySelector('.terjemahan');
            if (terjemahEl) {
                terjemahText = terjemahEl.textContent.trim()
                    .replace(/^artinya:\s*/i, '')
                    .replace(/^meaning:\s*/i, '')
                    .replace(/^["""''""]+|["""''""]+$/g, '')
                    .trim();
            }
        }

        // 3. Fallback ke getAyatData (hanya untuk surah aktif di audio cache)
        if (!terjemahText && typeof getAyatData === 'function') {
            const ayatData = getAyatData(nomorAyat);
            if (ayatData) {
                const raw = ayatData.teksIndonesia ?? ayatData.idn ?? '';
                terjemahText = raw.replace(/^["""''""]+|["""''""]+$/g, '').trim();
            }
        }

        const settings = (typeof getSettings === 'function') ? getSettings() : {};
        const arabFont  = settings.arabFont || 'Amiri Quran';

        _currentData = {
            arab:       arabText,
            terjemah:   terjemahText,
            surahName:  namaLatin,
            surahNomor: nomorSurah,
            ayatNomor:  nomorAyat,
            arabFont:   arabFont,
        };

        _previewData = null;
        _generating  = false;

        _openModal();
        _scheduleGenerate();
    }

    /* ================================================================
       Inject modal HTML ke body
       ================================================================ */
    function _injectModal() {
        if (document.getElementById(MODAL_ID)) return;

        const modal = document.createElement('div');
        modal.id        = MODAL_ID;
        modal.className = 'sa-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Share Ayat');
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="sa-backdrop" id="sa-backdrop"></div>
            <div class="sa-container">
                <div class="sa-header">
                    <span class="sa-title">
                        <i class="fa-solid fa-share-nodes"></i>
                        Share Ayat
                    </span>
                    <button class="sa-close" id="${CLOSE_ID}" aria-label="Tutup">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Pilih tema warna -->
                <div class="sa-section">
                    <p class="sa-label">Tema Warna</p>
                    <div class="sa-themes" id="${THEME_GROUP}" style="flex-wrap:wrap;gap:8px;">
                        ${THEMES.map((t, i) => `
                            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                                <button
                                    class="sa-theme-btn${i === 0 ? ' active' : ''}"
                                    data-type="theme"
                                    data-idx="${i}"
                                    title="${t.label}"
                                    aria-label="Tema ${t.label}"
                                    style="background:${t.overlay.replace(/,[\d.]+\)$/, ',1)')};border:1.5px solid rgba(128,128,128,0.25);">
                                    <span style="display:block;width:10px;height:10px;border-radius:50%;background:${t.text};margin:auto;opacity:0.7;border:1px solid rgba(0,0,0,0.1);"></span>
                                </button>
                                <span style="font-size:9px;color:var(--text-secondary,#94a3b8);letter-spacing:0.3px;">${t.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Pilih background -->
                <div class="sa-section">
                    <p class="sa-label">Background</p>
                    <div class="sa-themes" id="sa-bg-group" style="flex-wrap:wrap;gap:8px;">
                        ${BG_IMAGES.map((url, i) => `
                            <button
                                class="sa-theme-btn${i === 0 ? ' active' : ''}"
                                data-type="bg"
                                data-idx="${i}"
                                title="BG ${i + 1}"
                                aria-label="Background ${i + 1}"
                                style="
                                    background-image:url('${url}');
                                    background-size:cover;
                                    background-position:center;
                                    border:1.5px solid rgba(128,128,128,0.25);">
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Preview -->
                <div class="sa-section">
                    <p class="sa-label">Preview</p>
                    <div class="sa-preview-wrap">
                        <div class="sa-loading" id="${LOADING_ID}" aria-live="polite">
                            <div class="sa-spinner"></div>
                            <span>Membuat gambar…</span>
                        </div>
                        <img
                            class="sa-preview-img"
                            id="${PREVIEW_ID}"
                            alt="Preview kartu ayat"
                            style="display:none;"
                        />
                    </div>
                </div>

                <!-- Aksi -->
                <div class="sa-actions">
                    <button class="sa-btn sa-btn-secondary" id="${BTN_DL_ID}">
                        <i class="fa-solid fa-download"></i>
                        <span>Simpan</span>
                    </button>
                    <button class="sa-btn sa-btn-primary" id="${BTN_SHARE_ID}">
                        <i class="fa-solid fa-share-nodes"></i>
                        <span>Bagikan</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /* ================================================================
       Card container — di body, bukan di modal, agar html2canvas bisa render
       ================================================================ */
    function _ensureCardContainer() {
        if (_cardContainer && document.body.contains(_cardContainer)) return;
        _cardContainer = document.createElement('div');
        _cardContainer.id        = 'sa-card-offscreen';
        _cardContainer.className = 'sa-offscreen';
        const card = document.createElement('div');
        card.id        = CARD_ID;
        card.className = 'sa-card';
        _cardContainer.appendChild(card);
        document.body.appendChild(_cardContainer);
    }

    /* ================================================================
       Event binding
       ================================================================ */
    function _bindModalEvents() {
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;

        // Tutup modal
        modal.addEventListener('click', (e) => {
            if (e.target.closest('#' + CLOSE_ID) || e.target.id === 'sa-backdrop') {
                _closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                _closeModal();
            }
        });

        // Pilih tema warna
        const themeGroup = document.getElementById(THEME_GROUP);
        if (themeGroup) {
            themeGroup.addEventListener('click', (e) => {
                const btn = e.target.closest('.sa-theme-btn');
                if (!btn) return;
                const idx = parseInt(btn.dataset.idx, 10);
                if (isNaN(idx) || idx === _activeTheme) return;
                _activeTheme = idx;
                themeGroup.querySelectorAll('.sa-theme-btn').forEach((b, i) => {
                    b.classList.toggle('active', i === idx);
                });
                _scheduleGenerate();
            });
        }

        // Pilih background
        const bgGroup = document.getElementById('sa-bg-group');
        if (bgGroup) {
            bgGroup.addEventListener('click', (e) => {
                const btn = e.target.closest('.sa-theme-btn');
                if (!btn) return;
                const idx = parseInt(btn.dataset.idx, 10);
                if (isNaN(idx) || idx === _activeBg) return;
                _activeBg = idx;
                bgGroup.querySelectorAll('.sa-theme-btn').forEach((b, i) => {
                    b.classList.toggle('active', i === idx);
                });
                _scheduleGenerate();
            });
        }

        document.getElementById(BTN_DL_ID)?.addEventListener('click', _handleDownload);
        document.getElementById(BTN_SHARE_ID)?.addEventListener('click', _handleShare);
    }

    /* ================================================================
       Buka / tutup modal
       ================================================================ */
    function _openModal() {
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('sa-modal-open');
        document.body.classList.add('sa-body-lock');
        setTimeout(() => document.getElementById(CLOSE_ID)?.focus(), 120);
    }

    function _closeModal() {
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('sa-modal-open');
        document.body.classList.remove('sa-body-lock');
        _previewData = null;
        _currentData = null;
        _generating  = false;
    }

    /* ================================================================
       Build kartu 9:16
       ================================================================ */
    function _buildCard(data, theme, bgUrl) {
        _ensureCardContainer();
        const card = document.getElementById(CARD_ID);
        if (!card) return;

        card.setAttribute('style', [
            'width:540px',
            'height:960px',
            'box-sizing:border-box',
            'display:flex',
            'flex-direction:column',
            'align-items:center',
            'justify-content:center',
            'overflow:hidden',
            'position:relative',
            'padding:64px 52px',
        ].join(';'));

        card.innerHTML = `
            <!-- Background: div dengan background-image cover (html2canvas support) -->
            <div style="position:absolute;inset:0;background-image:url('${bgUrl}');background-size:cover;background-position:center;background-repeat:no-repeat;z-index:0;"></div>

            <!-- Overlay warna tema -->
            <div style="position:absolute;inset:0;background:${theme.overlay};z-index:1;"></div>

            <!-- Konten teks -->
            <div style="position:relative;z-index:2;width:100%;display:flex;flex-direction:column;align-items:center;text-align:center;">

                <!-- Teks Arab -->
                <div style="
                    direction:rtl;
                    text-align:center;
                    font-family:'${_esc(data.arabFont)}','Amiri Quran','Amiri',serif;
                    font-size:30px;
                    line-height:2.1;
                    color:${theme.text};
                    margin-bottom:24px;
                    word-spacing:0px;">
                    ${data.arab}
                </div>

                <!-- Garis pemisah -->
                <div style="width:40px;height:1px;background:${theme.line};margin-bottom:20px;"></div>

                <!-- Terjemahan -->
                ${data.terjemah ? `
                <p style="
                    font-size:15px;
                    color:${theme.sub};
                    line-height:1.9;
                    text-align:center;
                    margin:0 0 28px;
                    font-style:italic;
                    font-family:'Georgia','Amiri',serif;">
                    &ldquo;${_esc(data.terjemah)}&rdquo;
                </p>` : ''}

                <!-- Referensi -->
                <div style="
                    color:${theme.ref};
                    font-size:11px;
                    font-weight:600;
                    letter-spacing:2.5px;
                    text-transform:uppercase;
                    font-family:'Inter','Segoe UI',sans-serif;">
                    ${_esc(data.surahName)}&nbsp;&bull;&nbsp;Ayat&nbsp;${_esc(String(data.ayatNomor))}
                </div>
            </div>

            <!-- Watermark -->
            <div style="position:absolute;bottom:16px;z-index:2;width:100%;text-align:center;">
                <span style="color:${theme.text};opacity:0.18;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Inter','Segoe UI',sans-serif;">
                    Al Quran Digital
                </span>
            </div>
        `;
    }

    /* ================================================================
       Schedule generate — preload gambar ke base64 dulu baru build card
       ================================================================ */
    function _scheduleGenerate() {
        if (!_currentData) return;
        _setLoading(true);
        _generating = true;

        const bgUrl = BG_IMAGES[_activeBg];

        // Preload gambar ke base64 agar html2canvas tidak kena masalah CORS
        _loadImageAsBase64(bgUrl)
            .then((base64Url) => {
                _buildCard(_currentData, THEMES[_activeTheme], base64Url);
                return document.fonts.ready;
            })
            .then(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        _runHtml2Canvas();
                    });
                });
            })
            .catch(() => {
                // Fallback: pakai URL langsung jika preload gagal
                _buildCard(_currentData, THEMES[_activeTheme], bgUrl);
                document.fonts.ready.then(() => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            _runHtml2Canvas();
                        });
                    });
                });
            });
    }

    /* ================================================================
       Preload gambar dari URL → base64 DataURL
       Ini bypass masalah CORS pada html2canvas untuk background-image
       ================================================================ */
    function _loadImageAsBase64(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width  = img.naturalWidth  || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = () => reject(new Error('Gagal load: ' + url));
            img.src = url;
        });
    }

    /* ================================================================
       Jalankan html2canvas
       ================================================================ */
    function _runHtml2Canvas() {
        const card = document.getElementById(CARD_ID);
        if (!card) { _generating = false; _setLoading(false); return; }

        if (typeof html2canvas !== 'function') {
            console.error('[ShareAyat] html2canvas tidak tersedia.');
            _setLoading(false);
            _generating = false;
            return;
        }

        html2canvas(card, {
            scale:           2,
            useCORS:         true,
            allowTaint:      false,
            backgroundColor: null,
            logging:         false,
            imageTimeout:    12000,
            removeContainer: true,
            windowWidth:     600,
            windowHeight:    1000,
        })
        .then((canvas) => {
            const dataUrl = canvas.toDataURL('image/png');
            _previewData  = { dataUrl };
            const previewEl = document.getElementById(PREVIEW_ID);
            if (previewEl) {
                previewEl.src           = dataUrl;
                previewEl.style.display = 'block';
            }
            _setLoading(false);
        })
        .catch((err) => {
            console.error('[ShareAyat] html2canvas error:', err);
            _setLoading(false);
            _showToast('Gagal membuat gambar, coba lagi.', 'error');
        })
        .finally(() => {
            _generating = false;
        });
    }

    /* ================================================================
       Download
       ================================================================ */
    function _handleDownload() {
        if (!_previewData) { _showToast('Gambar belum siap.', 'info'); return; }
        const { surahName, ayatNomor } = _currentData;
        const filename = `quran-${surahName.toLowerCase().replace(/\s+/g, '-')}-${ayatNomor}.png`;
        const a = document.createElement('a');
        a.href = _previewData.dataUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        _showToast('Gambar tersimpan!', 'success');
    }

    /* ================================================================
       Share
       ================================================================ */
    async function _handleShare() {
        if (!_previewData) { _showToast('Gambar belum siap.', 'info'); return; }
        const { surahName, ayatNomor, terjemah } = _currentData;
        const filename  = `quran-${surahName.toLowerCase().replace(/\s+/g, '-')}-${ayatNomor}.png`;
        const shareText = `Q.S. ${surahName} : ${ayatNomor}\n${terjemah ? '"' + terjemah + '"\n' : ''}\nDibagikan dari Al Quran Digital`;

        if (navigator.canShare) {
            try {
                const blob = await _dataUrlToBlob(_previewData.dataUrl);
                const file = new File([blob], filename, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ title: `Q.S. ${surahName} : ${ayatNomor}`, text: shareText, files: [file] });
                    return;
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        if (navigator.share) {
            try {
                await navigator.share({ title: `Q.S. ${surahName} : ${ayatNomor}`, text: shareText, url: window.location.href });
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        _handleDownload();
    }

    /* ================================================================
       Helpers
       ================================================================ */
    function _dataUrlToBlob(dataUrl) {
        return new Promise((resolve, reject) => {
            try {
                const [meta, b64] = dataUrl.split(',');
                const mime   = meta.match(/:(.*?);/)[1];
                const binary = atob(b64);
                const bytes  = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                resolve(new Blob([bytes], { type: mime }));
            } catch (e) { reject(e); }
        });
    }

    function _esc(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function _setLoading(show) {
        const loadingEl = document.getElementById(LOADING_ID);
        const previewEl = document.getElementById(PREVIEW_ID);
        if (loadingEl) loadingEl.style.display = show ? 'flex' : 'none';
        if (previewEl && show) previewEl.style.display = 'none';
        const dlBtn    = document.getElementById(BTN_DL_ID);
        const shareBtn = document.getElementById(BTN_SHARE_ID);
        if (dlBtn)    dlBtn.disabled    = show;
        if (shareBtn) shareBtn.disabled = show;
    }

    function _showToast(message, type) {
        if (typeof showToast === 'function') {
            const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
            showToast({ message, icon: icons[type] || icons.info, duration: 2500 });
            return;
        }
        console.info('[ShareAyat]', message);
    }

    /* ── Expose ke window ── */
    window.initShareAyat = initShareAyat;
    window.openShareAyat = openShareAyat;

})();
