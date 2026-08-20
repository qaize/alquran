/* service-worker.js — Al Quran Digital PWA
   Fase 1: Offline cache
   Fase 2: Local notifications (waktu shalat, hadist harian, reminder)
   ──────────────────────────────────────────────────────────────────── */

const SW_VERSION   = 'v1.0.1-1723470000';
const CACHE_NAME   = `alquran-${SW_VERSION}`;
const CACHE_STATIC = `alquran-static-${SW_VERSION}`;

// Gunakan origin dinamis agar tidak perlu ganti saat pindah domain
const APP_ORIGIN = self.location.origin;

// File yang di-cache saat install (app shell)
// ⚠️  List ini di-inject secara dinamis oleh routes/web.php
//     berdasarkan Vite manifest — jangan edit manual di sini
const STATIC_ASSETS = [
    '/',
    '/img/quran.png',
    '/img/icon-192.png',
    '/manifest.json',
];

// ── Install: cache static assets ──
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ── Activate: hapus cache lama ──
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
                    .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: Cache First untuk static, Network First untuk API ──
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip non-GET dan chrome-extension
    if (event.request.method !== 'GET') return;
    if (url.protocol === 'chrome-extension:') return;

    // API calls → Network First (jangan cache response dinamis)
    const isApiCall = url.hostname.includes('aladhan') ||
                      url.hostname.includes('equran') ||
                      url.hostname.includes('hadis-api') ||
                      url.hostname.includes('bigdatacloud') ||
                      url.hostname.includes('alquran.cloud') ||
                      url.hostname.includes('muslim-api');

    if (isApiCall) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Static assets & app shell → Network First, fallback cache
    event.respondWith(
        fetch(event.request).then(response => {
            // Update cache dengan response terbaru
            if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_STATIC).then(cache => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => {
            // Offline → serve dari cache
            return caches.match(event.request).then(cached => {
                if (cached) return cached;
                // Offline fallback untuk navigasi
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});

/* ══════════════════════════════════════════
   NOTIFICATION SCHEDULING
   Pesan dari pwa.js via postMessage
   ══════════════════════════════════════════ */

// Notification configs per tipe
const NOTIF_CONFIG = {
    prayer: {
        icon:  '/img/icon-192.png',
        badge: '/img/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'prayer-time',
        renotify: true,
    },
    hadist: {
        icon:  '/img/icon-192.png',
        badge: '/img/icon-192.png',
        tag: 'daily-hadist',
    },
    quran: {
        icon:  '/img/icon-192.png',
        badge: '/img/icon-192.png',
        tag: 'quran-reminder',
    },
};

// Simpan scheduled timeouts (key: id, value: timeoutId)
const _swTimers = {};

self.addEventListener('message', event => {
    const { type, payload } = event.data || {};

    switch (type) {
        case 'SCHEDULE_PRAYER':
            _schedulePrayerNotifs(payload);
            break;
        case 'SCHEDULE_HADIST':
            _scheduleHadistNotif(payload);
            break;
        case 'SCHEDULE_QURAN_REMINDER':
            _scheduleQuranReminder(payload);
            break;
        case 'CLEAR_SCHEDULES':
            _clearAllTimers();
            break;
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
    }
});

// ── Schedule notif untuk semua waktu shalat hari ini ──
function _schedulePrayerNotifs(timings) {
    if (!timings) return;
    _clearTimerGroup('prayer');

    const prayerNames = {
        Fajr: 'Subuh', Dhuhr: 'Zuhur', Asr: 'Asar', Maghrib: 'Maghrib', Isha: 'Isya'
    };
    const prayerQuotes = {
        Fajr:    'وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ',
        Dhuhr:   'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ',
        Asr:     'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
        Maghrib: 'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ',
        Isha:    'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ',
    };

    const now = Date.now();

    Object.entries(prayerNames).forEach(([key, name]) => {
        if (!timings[key]) return;
        const [h, m]  = timings[key].split(':').map(Number);
        const today   = new Date();
        today.setHours(h, m, 0, 0);
        const fireAt  = today.getTime();
        const delay   = fireAt - now;

        if (delay <= 0) return; // waktu sudah lewat

        const id = `prayer_${key}`;
        _swTimers[id] = setTimeout(() => {
            self.registration.showNotification(`🕌 Waktu ${name} Telah Tiba`, {
                body:    prayerQuotes[key],
                ...NOTIF_CONFIG.prayer,
                data: { url: '/', type: 'prayer', prayer: key },
                actions: [
                    { action: 'open', title: 'Buka Al Quran' },
                    { action: 'dismiss', title: 'Tutup' },
                ],
            });
        }, delay);
    });
}

// ── Schedule hadist harian jam 07:00 ──
function _scheduleHadistNotif({ title, body, time = '07:00' }) {
    _clearTimerGroup('hadist');

    const [h, m] = time.split(':').map(Number);
    const fire   = new Date();
    fire.setHours(h, m, 0, 0);
    if (fire.getTime() <= Date.now()) {
        fire.setDate(fire.getDate() + 1); // besok
    }

    const delay = fire.getTime() - Date.now();
    _swTimers['hadist_daily'] = setTimeout(() => {
        self.registration.showNotification(title || '📜 Hadist Hari Ini', {
            body: body || 'Buka Al Quran untuk membaca hadist pilihan hari ini.',
            ...NOTIF_CONFIG.hadist,
            data: { url: '/', type: 'hadist' },
            actions: [
                { action: 'open', title: 'Baca Hadist' },
                { action: 'dismiss', title: 'Tutup' },
            ],
        });
        // Reschedule besok
        _scheduleHadistNotif({ title, body, time });
    }, delay);
}

// ── Reminder baca Quran N menit setelah waktu shalat ──
function _scheduleQuranReminder({ timings, delayMinutes = 10 }) {
    if (!timings) return;
    _clearTimerGroup('quran');

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now     = Date.now();

    prayers.forEach(key => {
        if (!timings[key]) return;
        const [h, m] = timings[key].split(':').map(Number);
        const fire   = new Date();
        fire.setHours(h, m + delayMinutes, 0, 0);
        const delay  = fire.getTime() - now;

        if (delay <= 0) return;

        const id = `quran_${key}`;
        _swTimers[id] = setTimeout(() => {
            self.registration.showNotification('📖 Sempurnakan dengan Membaca Al Quran', {
                body:    'Manfaatkan waktu setelah shalat untuk tadabbur Al Quran.',
                ...NOTIF_CONFIG.quran,
                data: { url: '/', type: 'quran' },
                actions: [
                    { action: 'open', title: 'Buka Al Quran' },
                    { action: 'dismiss', title: 'Nanti' },
                ],
            });
        }, delay);
    });
}

// ── Helpers ──
function _clearTimerGroup(prefix) {
    Object.keys(_swTimers).forEach(id => {
        if (id.startsWith(prefix)) {
            clearTimeout(_swTimers[id]);
            delete _swTimers[id];
        }
    });
}

function _clearAllTimers() {
    Object.values(_swTimers).forEach(id => clearTimeout(id));
    Object.keys(_swTimers).forEach(k => delete _swTimers[k]);
}

// ── Notification click handler ──
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                // Fokus ke tab yang sudah buka, atau buka baru
                const existing = windowClients.find(c => c.url.includes(APP_ORIGIN));
                if (existing) return existing.focus();
                return clients.openWindow(url);
            })
    );
});
