/* navigation.js — Mobile drawer */

const NAV_KONTEN_KEY = 'quran_nav_konten_open';

/* ──────────────────────────────────────────────
   KONTEN ISLAM — collapsible nav group
   ────────────────────────────────────────────── */
function initKontenGroup() {
    const trigger = document.getElementById('nav-konten-btn');
    const body    = document.getElementById('nav-konten-body');
    const arrow   = document.getElementById('nav-konten-arrow');
    if (!trigger || !body) return;

    // Restore state — default: collapsed
    const isOpen = localStorage.getItem(NAV_KONTEN_KEY) === 'true';
    if (isOpen) {
        body.classList.add('open');
        arrow && arrow.classList.add('rotated');
    }

    trigger.addEventListener('click', () => {
        const open = body.classList.toggle('open');
        arrow && arrow.classList.toggle('rotated', open);
        localStorage.setItem(NAV_KONTEN_KEY, open);
    });
}

/* ──────────────────────────────────────────────
   MOBILE DRAWER
   ────────────────────────────────────────────── */
function initMobileDrawer() {
    const sidebarLeft  = document.querySelector('.sidebar-left');
    const sidebarRight = document.querySelector('.sidebar-right');
    const backdrop     = document.getElementById('drawer-backdrop');
    const burgerLeft   = document.getElementById('burger-left-btn');
    const burgerRight  = document.getElementById('burger-right-btn');

    if (!sidebarLeft || !backdrop) return;

    function openDrawer(side) {
        closeAllDrawers();
        if (side === 'left')  sidebarLeft.classList.add('drawer-open');
        if (side === 'right') sidebarRight && sidebarRight.classList.add('drawer-open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeAllDrawers() {
        sidebarLeft.classList.remove('drawer-open');
        sidebarRight && sidebarRight.classList.remove('drawer-open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    burgerLeft  && burgerLeft.addEventListener('click',  () => openDrawer('left'));
    burgerRight && burgerRight.addEventListener('click', () => openDrawer('right'));
    backdrop.addEventListener('click', closeAllDrawers);

    // Tutup drawer saat klik nav item di dalam sidebar kiri (mobile)
    // Kecuali: dropdown trigger dan item yang punya data-no-close
    sidebarLeft.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth > 768) return;
            if (item.classList.contains('nav-dropdown-trigger')) return;
            // Tunda closeAllDrawers agar listener lain (dzikir, prayer, dll) jalan dulu
            setTimeout(closeAllDrawers, 0);
        });
    });
}


