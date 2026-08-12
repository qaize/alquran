/* navigation.js — Mobile drawer + Juz panel */

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
    // Kecuali: dropdown trigger (Konten Islam, Terakhir Dibaca) — jangan tutup
    sidebarLeft.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth > 768) return;
            // Jangan tutup kalau ini adalah dropdown trigger
            if (item.classList.contains('nav-dropdown-trigger')) return;
            closeAllDrawers();
        });
    });
}


/* ──────────────────────────────────────────────
   JUZ — mapping & panel
   ────────────────────────────────────────────── */
const JUZ_MAP = [
    { juz:  1, surah:   1, ayat:   1, namaLatin: 'Al-Fatihah'   },
    { juz:  2, surah:   2, ayat: 142, namaLatin: 'Al-Baqarah'   },
    { juz:  3, surah:   2, ayat: 253, namaLatin: 'Al-Baqarah'   },
    { juz:  4, surah:   3, ayat:  93, namaLatin: 'Ali Imran'     },
    { juz:  5, surah:   4, ayat:  24, namaLatin: 'An-Nisa'       },
    { juz:  6, surah:   4, ayat: 148, namaLatin: 'An-Nisa'       },
    { juz:  7, surah:   5, ayat:  82, namaLatin: 'Al-Maidah'     },
    { juz:  8, surah:   6, ayat: 111, namaLatin: 'Al-Anam'       },
    { juz:  9, surah:   7, ayat:  88, namaLatin: 'Al-Araf'       },
    { juz: 10, surah:   8, ayat:  41, namaLatin: 'Al-Anfal'      },
    { juz: 11, surah:   9, ayat:  93, namaLatin: 'At-Taubah'     },
    { juz: 12, surah:  11, ayat:   6, namaLatin: 'Hud'           },
    { juz: 13, surah:  12, ayat:  53, namaLatin: 'Yusuf'         },
    { juz: 14, surah:  15, ayat:   1, namaLatin: 'Al-Hijr'       },
    { juz: 15, surah:  17, ayat:   1, namaLatin: 'Al-Isra'       },
    { juz: 16, surah:  18, ayat:  75, namaLatin: 'Al-Kahf'       },
    { juz: 17, surah:  21, ayat:   1, namaLatin: 'Al-Anbiya'     },
    { juz: 18, surah:  23, ayat:   1, namaLatin: 'Al-Muminun'    },
    { juz: 19, surah:  25, ayat:  21, namaLatin: 'Al-Furqan'     },
    { juz: 20, surah:  27, ayat:  56, namaLatin: 'An-Naml'       },
    { juz: 21, surah:  29, ayat:  46, namaLatin: 'Al-Ankabut'    },
    { juz: 22, surah:  33, ayat:  31, namaLatin: 'Al-Ahzab'      },
    { juz: 23, surah:  36, ayat:  28, namaLatin: 'Yasin'         },
    { juz: 24, surah:  39, ayat:  32, namaLatin: 'Az-Zumar'      },
    { juz: 25, surah:  41, ayat:  47, namaLatin: 'Fussilat'      },
    { juz: 26, surah:  46, ayat:   1, namaLatin: 'Al-Ahqaf'      },
    { juz: 27, surah:  51, ayat:  31, namaLatin: 'Az-Zariyat'    },
    { juz: 28, surah:  58, ayat:   1, namaLatin: 'Al-Mujadila'   },
    { juz: 29, surah:  67, ayat:   1, namaLatin: 'Al-Mulk'       },
    { juz: 30, surah:  78, ayat:   1, namaLatin: 'An-Naba'       },
];

function initJuz() {
    const overlay  = document.getElementById('juz-panel-overlay');
    const openBtn  = document.getElementById('nav-juz-btn');
    const closeBtn = document.getElementById('close-juz-panel-btn');
    const listEl   = document.getElementById('juz-panel-list');
    if (!overlay || !listEl) return;

    // Render list juz
    JUZ_MAP.forEach(j => {
        const item = document.createElement('button');
        item.className = 'juz-item';
        item.innerHTML = `
            <div class="juz-number">
                <span class="juz-num-label">Juz</span>
                <span class="juz-num-val">${j.juz}</span>
            </div>
            <div class="juz-info">
                <span class="juz-surah-name">${j.namaLatin}</span>
                <span class="juz-ayat-ref">${t('surah_word')} ${j.surah}, ${t('ayat_ref')} ${j.ayat}</span>
            </div>
            <div class="juz-arrow">
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        `;
        item.addEventListener('click', () => {
            overlay.classList.remove('open');
            // Tutup mobile drawer juga
            document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
            document.getElementById('drawer-backdrop')?.classList.remove('active');
            document.body.style.overflow = '';

            // Buka surah lalu jump ke ayat
            loadSurahDetails(j.surah);
            setTimeout(() => {
                jumpToLastRead({ nomorAyat: j.ayat });
            }, 950);
        });
        listEl.appendChild(item);
    });

    // Open
    openBtn && openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('open');
        // Animasi panel masuk
        const panel = overlay.querySelector('.juz-panel');
        if (panel) {
            panel.classList.remove('animate__animated','animate__fadeInLeft');
            void panel.offsetWidth;
            panel.classList.add('animate__animated','animate__fadeInLeft');
            panel.style.animationDuration = '0.3s';
        }
        // Tutup mobile drawer
        document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close
    closeBtn && closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
}
