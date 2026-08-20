/* service-worker.js — Al Quran Digital PWA
   Scheduling: setInterval heartbeat setiap menit (bukan setTimeout)
   Persistent state: IndexedDB (agar tidak hilang saat SW restart)
   ──────────────────────────────────────────────────────────────────── */

const SW_VERSION   = 'v1.1.0';
const CACHE_NAME   = `alquran-${SW_VERSION}`;
const CACHE_STATIC = `alquran-static-${SW_VERSION}`;
const APP_ORIGIN   = self.location.origin;

const STATIC_ASSETS = [
    '/',
    '/img/quran.png',
    '/img/icon-192.png',
    '/manifest.json',
];

/* ══════════════════════════════════════════
   CACHE — Install / Activate / Fetch
   ══════════════════════════════════════════ */

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

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

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET') return;
    if (url.protocol === 'chrome-extension:') return;

    const isApiCall = [
        'aladhan', 'equran', 'hadis-api', 'bigdatacloud',
        'alquran.cloud', 'muslim-api', 'cdn.jsdelivr'
    ].some(h => url.hostname.includes(h));

    if (isApiCall) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        fetch(event.request).then(response => {
            if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_STATIC).then(cache => cache.put(event.request, clone));
            }
            return response;
        }).catch(() =>
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                if (event.request.mode === 'navigate') return caches.match('/');
            })
        )
    );
});

/* ══════════════════════════════════════════
   INDEXEDDB — Persistent schedule state
   ══════════════════════════════════════════ */

const DB_NAME    = 'alquran-notif-db';
const DB_VERSION = 1;
const STORE_NAME = 'schedules';

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e.target.error);
    });
}

async function dbPut(record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(record);
        tx.oncomplete = resolve;
        tx.onerror    = e => reject(e.target.error);
    });
}

async function dbGetAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx   = db.transaction(STORE_NAME, 'readonly');
        const req  = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = e => resolve(e.target.result || []);
        req.onerror   = e => reject(e.target.error);
    });
}

async function dbDelete(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = resolve;
        tx.onerror    = e => reject(e.target.error);
    });
}

async function dbClear() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = resolve;
        tx.onerror    = e => reject(e.target.error);
    });
}

/* ══════════════════════════════════════════
   HEARTBEAT — setInterval setiap menit
   Ini yang menggantikan setTimeout agar tidak
   mati saat SW di-restart browser
   ══════════════════════════════════════════ */

// Simpan interval id
let _heartbeatInterval = null;

function startHeartbeat() {
    if (_heartbeatInterval) return; // sudah berjalan
    _heartbeatInterval = setInterval(() => {
        _checkAndFireNotifications();
    }, 60 * 1000); // setiap menit

    // Langsung cek sekali saat start
    _checkAndFireNotifications();
}

async function _checkAndFireNotifications() {
    const now      = new Date();
    const nowHHMM  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

    let schedules = [];
    try {
        schedules = await dbGetAll();
    } catch(e) {
        return;
    }

    for (const schedule of schedules) {
        // Skip kalau sudah fired hari ini
        if (schedule.firedDate === todayStr) continue;

        // Cek apakah waktunya sekarang (HH:MM match)
        if (schedule.time !== nowHHMM) continue;

        // Pastikan ini hari yang benar (untuk prayer — hari ini saja)
        // Untuk hadist — setiap hari
        try {
            await _fireNotification(schedule);
            // Tandai sudah fired hari ini
            await dbPut({ ...schedule, firedDate: todayStr });
        } catch(e) {
            console.warn('[SW] Failed to fire notification:', e);
        }
    }
}

async function _fireNotification(schedule) {
    const opts = {
        icon:    '/img/icon-192.png',
        badge:   '/img/icon-192.png',
        vibrate: [200, 100, 200],
        tag:     schedule.id,
        renotify: true,
        requireInteraction: false,
        data: { url: '/', type: schedule.type, id: schedule.id },
        actions: schedule.actions || [
            { action: 'open',    title: '📖 Buka Al Quran' },
            { action: 'dismiss', title: 'Tutup' },
        ],
    };

    // Kirim dulu ke tab aktif supaya bisa tampil in-app banner
    const allClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
    });

    const hasActiveTab = allClients.some(c => c.visibilityState === 'visible');

    // Selalu kirim pesan ke client untuk in-app banner
    allClients.forEach(client => {
        client.postMessage({
            type:     'SHOW_IN_APP_NOTIF',
            payload:  {
                title: schedule.title,
                body:  schedule.body,
                notifType: schedule.type,
            },
        });
    });

    // Juga tampilkan native notification (muncul di luar app / notif center)
    // Bahkan saat tab aktif — karena kita kirim keduanya
    await self.registration.showNotification(schedule.title, {
        body: schedule.body,
        ...opts,
    });
}

/* ══════════════════════════════════════════
   MESSAGE HANDLER — dari pwa.js
   ══════════════════════════════════════════ */

self.addEventListener('message', event => {
    const { type, payload } = event.data || {};

    switch (type) {

        case 'SCHEDULE_PRAYER':
            _savePrayerSchedules(payload);
            startHeartbeat();
            break;

        case 'SCHEDULE_HADIST':
            _saveHadistSchedule(payload);
            startHeartbeat();
            break;

        case 'SCHEDULE_QURAN_REMINDER':
            _saveQuranReminderSchedules(payload);
            startHeartbeat();
            break;

        case 'CLEAR_SCHEDULES':
            dbClear();
            break;

        case 'START_HEARTBEAT':
            startHeartbeat();
            break;

        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
    }
});

/* ══════════════════════════════════════════
   SAVE SCHEDULES ke IndexedDB
   ══════════════════════════════════════════ */

const PRAYER_META = {
    Fajr:    { name: 'Subuh',   emoji: '🌅', quote: 'Dirikanlah shalat sesungguhnya shalat mencegah dari perbuatan keji dan mungkar.' },
    Dhuhr:   { name: 'Zuhur',   emoji: '☀️', quote: 'Jagalah shalat-shalatmu, khususnya shalat wustho (Asar).' },
    Asr:     { name: 'Asar',    emoji: '🌤️', quote: 'Sesungguhnya shalat itu diwajibkan atas orang-orang mukmin pada waktu yang telah ditentukan.' },
    Maghrib: { name: 'Maghrib', emoji: '🌇', quote: 'Maka bertasbihlah kepada Allah di petang hari dan di pagi hari.' },
    Isha:    { name: 'Isya',    emoji: '🌙', quote: 'Dan pada sebagian malam, shalat tahajudlah sebagai ibadah tambahan bagimu.' },
};

async function _savePrayerSchedules(timings) {
    if (!timings) return;

    for (const [key, meta] of Object.entries(PRAYER_META)) {
        if (!timings[key]) continue;

        // Normalisasi waktu: "04:32 (WIB)" → "04:32"
        const timeRaw = timings[key].split(' ')[0].substring(0, 5);

        await dbPut({
            id:        `prayer_${key}`,
            type:      'prayer',
            time:      timeRaw,
            title:     `${meta.emoji} Waktu ${meta.name} Telah Tiba`,
            body:      meta.quote,
            firedDate: null,
            actions: [
                { action: 'open',    title: '📖 Buka Al Quran' },
                { action: 'dismiss', title: 'Tutup' },
            ],
        });
    }
}

async function _saveHadistSchedule({ time = '07:00' }) {
    await dbPut({
        id:        'hadist_daily',
        type:      'hadist',
        time,
        title:     '📜 Hadist Hari Ini',
        body:      'Buka Al Quran Digital untuk membaca hadist pilihan hari ini.',
        firedDate: null,
        actions: [
            { action: 'open',    title: '📜 Baca Hadist' },
            { action: 'dismiss', title: 'Tutup' },
        ],
    });
}

async function _saveQuranReminderSchedules({ timings, delayMinutes = 10 }) {
    if (!timings) return;

    for (const [key, meta] of Object.entries(PRAYER_META)) {
        if (!timings[key]) continue;

        const timeRaw = timings[key].split(' ')[0].substring(0, 5);
        const [h, m]  = timeRaw.split(':').map(Number);
        const delayed = new Date();
        delayed.setHours(h, m + delayMinutes, 0, 0);
        const delayedTime = `${String(delayed.getHours()).padStart(2,'0')}:${String(delayed.getMinutes()).padStart(2,'0')}`;

        await dbPut({
            id:        `quran_reminder_${key}`,
            type:      'quran',
            time:      delayedTime,
            title:     '📖 Saatnya Membaca Al Quran',
            body:      `Sempurnakan ibadah setelah shalat ${meta.name} dengan tadabbur Al Quran.`,
            firedDate: null,
            actions: [
                { action: 'open',    title: '📖 Buka Al Quran' },
                { action: 'dismiss', title: 'Nanti' },
            ],
        });
    }
}

/* ══════════════════════════════════════════
   NOTIFICATION CLICK
   ══════════════════════════════════════════ */

self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'dismiss') return;

    const url = event.notification.data?.url || '/';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                // Fokus ke tab yang sudah buka
                const existing = windowClients.find(c =>
                    c.url.startsWith(APP_ORIGIN) && 'focus' in c
                );
                if (existing) return existing.focus();
                return self.clients.openWindow(url);
            })
    );
});

/* ══════════════════════════════════════════
   AUTO-START HEARTBEAT saat SW aktif
   ══════════════════════════════════════════ */
self.addEventListener('activate', () => {
    startHeartbeat();
});
