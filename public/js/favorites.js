/* favorites.js — Favorites localStorage + nav panel + dropdown */

/* ── FAVORITES — localStorage ── */
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
        showToast({
            type: 'favorite',
            label: t('fav_added_label') || 'Ditambahkan ke favorit',
            message: namaLatin,
        });
    }
    renderFavorites();
}

function removeFavorite(nomor) {
    const removed = getFavorites().find(f => f.nomor === nomor);
    const list = getFavorites().filter(f => f.nomor !== nomor);
    saveFavorites(list);
    renderFavorites();
    if (removed) {
        showToast({
            type: 'info',
            icon: 'fa-star-half-stroke',
            label: t('fav_removed_label') || 'Dihapus dari favorit',
            message: removed.namaLatin,
            duration: 2500,
        });
    }
    // Update bintang di kartu jika terlihat
    const starBtn = document.getElementById(`star-${nomor}`);
    if (starBtn) {
        starBtn.classList.remove('favorited');
        starBtn.title = t('add_favorite');
    }
}

function toggleFavorite(nomor, namaLatin, arti) {
    if (isFavorite(nomor)) {
        removeFavorite(nomor);
    } else {
        addFavorite(nomor, namaLatin, arti);
        const starBtn = document.getElementById(`star-${nomor}`);
        if (starBtn) {
            starBtn.classList.add('favorited');
            starBtn.title = t('remove_favorite');
        }
    }
}

/* ── FAVORITES RENDER (sidebar kanan) ── */
function renderFavorites() {
    const container = document.getElementById('favorites-list');
    const emptyMsg  = document.getElementById('favorites-empty');
    if (!container) return;

    container.querySelectorAll('.fav-item').forEach(el => el.remove());
    const list = getFavorites();

    if (list.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'flex';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
        list.forEach(fav => {
            const item = document.createElement('div');
            item.className = 'fav-item';
            item.innerHTML = `
                <button class="fav-read-btn">
                    <span class="fav-nomor">${fav.nomor}</span>
                    <span class="fav-name">${fav.namaLatin}</span>
                    <span class="fav-arti">${fav.arti}</span>
                </button>
                <button class="fav-remove-btn" title="${t('remove_favorite')}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            item.querySelector('.fav-read-btn').addEventListener('click', () => {
                if (typeof loadSurahDetails === 'function') loadSurahDetails(fav.nomor);
            });
            item.querySelector('.fav-remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(fav.nomor);
            });
            container.appendChild(item);
        });
    }

    renderFavoritesBadge();
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

/* ── FAVORITES PANEL (full overlay dari nav) ── */
function renderFavoritesPanel() {
    const list      = getFavorites();
    const container = document.getElementById('favorites-panel-list');
    const emptyMsg  = document.getElementById('favorites-panel-empty');
    const countEl   = document.getElementById('favorites-panel-count');
    if (!container) return;

    container.querySelectorAll('.fav-panel-item').forEach(el => el.remove());

    // Update count di header
    if (countEl) countEl.textContent = list.length;

    if (list.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'flex';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
        list.forEach(fav => {
            const item = document.createElement('div');
            item.className = 'fav-panel-item';
            item.innerHTML = `
                <div class="fav-panel-nomor">${fav.nomor}</div>
                <div class="fav-panel-info">
                    <span class="fav-panel-name">${fav.namaLatin}</span>
                    <span class="fav-panel-arti">${fav.arti}</span>
                </div>
                <button class="fav-panel-remove" title="${t('remove_favorite')}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            item.querySelector('.fav-panel-info').addEventListener('click', () => {
                document.getElementById('favorites-panel-overlay')?.classList.remove('open');
                if (typeof loadSurahDetails === 'function') loadSurahDetails(fav.nomor);
            });
            item.querySelector('.fav-panel-nomor').addEventListener('click', () => {
                document.getElementById('favorites-panel-overlay')?.classList.remove('open');
                if (typeof loadSurahDetails === 'function') loadSurahDetails(fav.nomor);
            });
            item.querySelector('.fav-panel-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(fav.nomor);
                renderFavoritesPanel();
            });
            container.appendChild(item);
        });
    }
}

function initFavoritesNav() {
    renderFavoritesBadge();

    const overlay  = document.getElementById('favorites-panel-overlay');
    const openBtn  = document.getElementById('nav-favorites-btn');
    const closeBtn = document.getElementById('close-favorites-panel-btn');
    if (!overlay || !openBtn) return;

    openBtn.addEventListener('click', (e) => {
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

/* ── CLOSE ALL NAV DROPDOWNS (shared utility) ── */
function closeAllNavDropdowns() {
    document.querySelectorAll('.nav-dropdown-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.nav-dropdown-arrow').forEach(a => a.classList.remove('rotated'));
}

/* ── FAVORITES DROPDOWN in nav-left ── */
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
            if (typeof loadSurahDetails === 'function') loadSurahDetails(fav.nomor);
        });
        item.querySelector('.fav-dd-del').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(fav.nomor);
            renderFavoritesDropdown();
        });
        container.appendChild(item);
    });
}
