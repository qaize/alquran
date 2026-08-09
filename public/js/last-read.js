/* last-read.js — Last read + reading categories + save popup */

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
    showToast({
        icon: 'fa-clock-rotate-left',
        label: t('last_read_saved'),
        message: `${namaLatin} — ${t('ayat_ref')} ${nomorAyat}`,
        type: 'lastread',
    });
}

function copyAyat(nomorSurah, nomorAyat, namaLatin, btnEl) {
    const ayatEl   = document.getElementById(`isi-ayat${nomorAyat}`);
    if (!ayatEl) return;

    const teksArab = ayatEl.querySelector('.arabic')?.textContent?.trim() || '';
    const teksLat  = ayatEl.querySelector('.tulisan-latin')?.textContent?.trim() || '';
    const teksIdn  = ayatEl.querySelector('.terjemahan')?.textContent?.trim() || '';

    const lines = [
        teksArab,
        teksLat ? `\n${teksLat}` : '',
        teksIdn ? `\n${teksIdn}` : '',
        `\n— ${namaLatin}, ${t('ayat_ref')} ${nomorAyat}`
    ].filter(Boolean).join('');

    navigator.clipboard.writeText(lines).then(() => {
        // Feedback visual pada tombol
        const icon = btnEl?.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-check';
            setTimeout(() => { icon.className = 'fa-regular fa-copy'; }, 1500);
        }
        showToast({
            type: 'success',
            icon: 'fa-copy',
            label: t('copy_success_label') || 'Ayat disalin',
            message: `${namaLatin} — ${t('ayat_ref')} ${nomorAyat}`,
            duration: 2500,
        });
    }).catch(() => {
        showToast({ type: 'error', message: t('copy_error') || 'Gagal menyalin teks', duration: 2500 });
    });
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

    // Smooth pulse highlight
    el.classList.add('ayat-jump-highlight');
    setTimeout(() => el.classList.remove('ayat-jump-highlight'), 2000);
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
   READING CATEGORIES — localStorage
   ────────────────────────────────────────────── */
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
    // Re-render dropdown hanya jika sedang open — hindari layout rusak
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
            : '—';

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

        // Klik item → jump ke posisi
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

    // Tombol tambah kategori — tampilkan input inline
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
            : `<span class="lr-cat-badge lr-cat-badge-empty">—</span>`;

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

/* ──────────────────────────────────────────────
   SAVE LAST-READ POPUP
   ────────────────────────────────────────────── */
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
            <div class="lr-popup-meta">${namaLatin} · ${t('ayat_ref')} ${nomorAyat}</div>
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
            : `<span class="lr-popup-item-empty">—</span>`;
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
    // Slide digantikan popup JS — tidak perlu init dari HTML
    // Backdrop lama di layout juga tidak dipakai, tapi tidak masalah
}
