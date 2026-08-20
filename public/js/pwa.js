/* pwa.js — PWA Manager
   - Service Worker registration
   - Install prompt (Add to Home Screen)
   - Notification permission request
   - Schedule: waktu shalat, hadist harian, reminder Quran
   - In-app notification banner (fallback saat tab aktif)
   ──────────────────────────────────────────────────────── */

const PWA_NOTIF_KEY = 'quran_pwa_notifications';

/* ── Settings notifikasi ── */
function getPwaSettings() {
    try {
        return Object.assign({
            notifPrayer:        true,
            notifHadist:        true,
            notifHadistTime:    '07:00',
            notifQuranReminder: true,
            notifReminderDelay: 10,
        }, JSON.parse(localStorage.getItem(PWA_NOTIF_KEY) || '{}'));
    } catch(e) {
        return { notifPrayer: true, notifHadist: true, notifHadistTime: '07:00', notifQuranReminder: true, notifReminderDelay: 10 };
    }
}

function savePwaSettings(obj) {
    localStorage.setItem(PWA_NOTIF_KEY, JSON.stringify(obj));
}

/* ══════════════════════════════════════════
   SERVICE WORKER REGISTRATION
   ══════════════════════════════════════════ */
let _swRegistration = null;

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });

    // Dengarkan pesan dari SW (in-app banner)
    navigator.serviceWorker.addEventListener('message', event => {
        const { type, payload } = event.data || {};
        if (type === 'SHOW_IN_APP_NOTIF') {
            showInAppNotification(payload.title, payload.body, payload.notifType);
        }
    });

    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then(reg => {
            _swRegistration = reg;
            console.log('[PWA] SW registered:', reg.scope);

            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    }
                });
            });

            navigator.serviceWorker.ready.then(reg => {
                // Mulai heartbeat di SW
                reg.active?.postMessage({ type: 'START_HEARTBEAT' });
                // Jadwalkan notifikasi
                _scheduleAllNotifications();
            });
        })
        .catch(err => console.warn('[PWA] SW registration failed:', err));
}

/* ══════════════════════════════════════════
   INSTALL PROMPT
   ══════════════════════════════════════════ */
let _deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _deferredInstallPrompt = e;
    _showInstallButton();
});

window.addEventListener('appinstalled', () => {
    _deferredInstallPrompt = null;
    _hideInstallButton();
    if (typeof showToast === 'function') {
        showToast({ type: 'success', message: '✓ Al Quran berhasil dipasang!', duration: 3000 });
    }
});

function _showInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.style.display = 'flex';
}
function _hideInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.style.display = 'none';
}
function triggerInstallPrompt() {
    if (!_deferredInstallPrompt) return;
    _deferredInstallPrompt.prompt();
    _deferredInstallPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') _hideInstallButton();
        _deferredInstallPrompt = null;
    });
}

/* ══════════════════════════════════════════
   NOTIFICATION PERMISSION
   ══════════════════════════════════════════ */
function requestNotificationPermission() {
    if (!('Notification' in window)) return Promise.reject('Not supported');
    if (Notification.permission === 'granted') return Promise.resolve('granted');
    return Notification.requestPermission();
}

function isNotificationGranted() {
    return 'Notification' in window && Notification.permission === 'granted';
}

/* ══════════════════════════════════════════
   SCHEDULE — kirim ke SW via postMessage
   ══════════════════════════════════════════ */
function _scheduleAllNotifications() {
    if (!isNotificationGranted()) return;

    navigator.serviceWorker.ready.then(reg => {
        if (!reg.active) return;
        const s = getPwaSettings();
        const timings = _getPrayerTimingsFromCache();

        if (s.notifPrayer && timings) {
            reg.active.postMessage({ type: 'SCHEDULE_PRAYER', payload: timings });
        }

        if (s.notifHadist) {
            reg.active.postMessage({
                type: 'SCHEDULE_HADIST',
                payload: { time: s.notifHadistTime },
            });
        }

        if (s.notifQuranReminder && timings) {
            reg.active.postMessage({
                type: 'SCHEDULE_QURAN_REMINDER',
                payload: { timings, delayMinutes: s.notifReminderDelay },
            });
        }
    });
}

function _getPrayerTimingsFromCache() {
    try {
        const cached = JSON.parse(localStorage.getItem('quran_prayer_times'));
        if (cached && cached.timings) return cached.timings;
    } catch(e) {}
    return null;
}

function rescheduleNotifications() {
    navigator.serviceWorker.ready.then(reg => {
        reg.active?.postMessage({ type: 'CLEAR_SCHEDULES' });
        setTimeout(_scheduleAllNotifications, 300);
    });
}

/* ══════════════════════════════════════════
   IN-APP NOTIFICATION BANNER
   Muncul di dalam halaman (tidak butuh permission)
   juga sebagai fallback saat native notif tidak muncul
   ══════════════════════════════════════════ */

const NOTIF_ICONS = {
    prayer: '🕌',
    hadist: '📜',
    quran:  '📖',
    info:   'ℹ️',
};

const NOTIF_COLORS = {
    prayer: 'var(--gold)',
    hadist: '#4a90e2',
    quran:  '#27ae60',
    info:   'var(--navy-light)',
};

let _inAppQueue   = [];
let _inAppShowing = false;

function showInAppNotification(title, body, type = 'info') {
    _inAppQueue.push({ title, body, type });
    if (!_inAppShowing) _processInAppQueue();
}

function _processInAppQueue() {
    if (_inAppQueue.length === 0) {
        _inAppShowing = false;
        return;
    }
    _inAppShowing = true;
    const { title, body, type } = _inAppQueue.shift();
    _renderInAppBanner(title, body, type);
}

function _renderInAppBanner(title, body, type) {
    // Hapus banner lama kalau masih ada
    document.querySelectorAll('.in-app-notif-banner').forEach(el => {
        el.classList.remove('in-app-notif-enter');
        el.classList.add('in-app-notif-exit');
        setTimeout(() => el.remove(), 400);
    });

    const icon  = NOTIF_ICONS[type]  || NOTIF_ICONS.info;
    const color = NOTIF_COLORS[type] || NOTIF_COLORS.info;

    const banner = document.createElement('div');
    banner.className = 'in-app-notif-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');
    banner.style.setProperty('--notif-accent', color);

    banner.innerHTML = `
        <div class="in-app-notif-icon">${icon}</div>
        <div class="in-app-notif-content">
            <div class="in-app-notif-title">${_escHtml(title)}</div>
            <div class="in-app-notif-body">${_escHtml(body)}</div>
        </div>
        <button class="in-app-notif-close" aria-label="Tutup notifikasi">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="in-app-notif-progress"></div>
    `;

    document.body.appendChild(banner);

    // Animate masuk
    requestAnimationFrame(() => banner.classList.add('in-app-notif-enter'));

    // Auto-dismiss setelah 6 detik
    const DURATION = 6000;
    const progressEl = banner.querySelector('.in-app-notif-progress');
    if (progressEl) {
        progressEl.style.animationDuration = `${DURATION}ms`;
        progressEl.classList.add('in-app-notif-progress-run');
    }

    const dismissTimer = setTimeout(() => _dismissBanner(banner), DURATION);

    // Tombol close
    banner.querySelector('.in-app-notif-close').addEventListener('click', () => {
        clearTimeout(dismissTimer);
        _dismissBanner(banner);
    });

    // Klik body → buka / fokus app
    banner.querySelector('.in-app-notif-content').addEventListener('click', () => {
        clearTimeout(dismissTimer);
        _dismissBanner(banner);
        // Scroll ke atas atau lakukan aksi sesuai tipe
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function _dismissBanner(banner) {
    if (!banner.parentNode) return;
    banner.classList.remove('in-app-notif-enter');
    banner.classList.add('in-app-notif-exit');
    setTimeout(() => {
        banner.remove();
        // Proses antrian berikutnya
        setTimeout(_processInAppQueue, 200);
    }, 400);
}

function _escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ══════════════════════════════════════════
   SETTINGS PANEL untuk notifikasi
   ══════════════════════════════════════════ */
function renderPwaNotifSettings(container) {
    if (!container) return;
    const s       = getPwaSettings();
    const granted = isNotificationGranted();
    const lang    = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';

    container.innerHTML = `
        <div class="pwa-notif-section">
            ${!granted ? `
                <div class="pwa-notif-banner">
                    <i class="fa-solid fa-bell-slash"></i>
                    <div class="pwa-notif-banner-text">
                        <strong>${lang === 'en' ? 'Enable Notifications' : 'Aktifkan Notifikasi'}</strong>
                        <p>${lang === 'en'
                            ? 'Allow notifications to get prayer time and reminder alerts.'
                            : 'Izinkan notifikasi untuk mendapat pengingat waktu shalat.'}</p>
                    </div>
                    <button class="pwa-notif-allow-btn" id="pwa-allow-notif-btn">
                        ${lang === 'en' ? 'Allow' : 'Izinkan'}
                    </button>
                </div>
            ` : `
                <div class="pwa-notif-granted-badge">
                    <i class="fa-solid fa-circle-check"></i>
                    ${lang === 'en' ? 'Notifications enabled' : 'Notifikasi diaktifkan'}
                </div>
            `}

            <div class="pwa-notif-row ${!granted ? 'pwa-notif-disabled' : ''}">
                <div class="pwa-notif-row-left">
                    <span class="pwa-notif-row-icon">🕌</span>
                    <div>
                        <div class="pwa-notif-label">${lang === 'en' ? 'Prayer Time Alerts' : 'Notif Waktu Shalat'}</div>
                        <div class="pwa-notif-hint">${lang === 'en' ? 'Fajr, Dhuhr, Asr, Maghrib, Isha' : 'Subuh, Zuhur, Asar, Maghrib, Isya'}</div>
                    </div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="pwa-notif-prayer" ${s.notifPrayer ? 'checked' : ''} ${!granted ? 'disabled' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <div class="pwa-notif-row ${!granted ? 'pwa-notif-disabled' : ''}">
                <div class="pwa-notif-row-left">
                    <span class="pwa-notif-row-icon">📜</span>
                    <div>
                        <div class="pwa-notif-label">${lang === 'en' ? 'Daily Hadith' : 'Hadist Harian'}</div>
                        <div class="pwa-notif-hint">${lang === 'en' ? 'Notification time' : 'Jam notifikasi'}</div>
                    </div>
                </div>
                <div class="pwa-notif-right">
                    <input type="time" id="pwa-notif-hadist-time" value="${s.notifHadistTime}"
                        class="pwa-time-input" ${!granted ? 'disabled' : ''}>
                    <label class="toggle-switch">
                        <input type="checkbox" id="pwa-notif-hadist" ${s.notifHadist ? 'checked' : ''} ${!granted ? 'disabled' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="pwa-notif-row ${!granted ? 'pwa-notif-disabled' : ''}">
                <div class="pwa-notif-row-left">
                    <span class="pwa-notif-row-icon">📖</span>
                    <div>
                        <div class="pwa-notif-label">${lang === 'en' ? 'Quran Reminder' : 'Reminder Baca Quran'}</div>
                        <div class="pwa-notif-hint">${lang === 'en' ? 'After each prayer' : 'Setelah tiap shalat'}</div>
                    </div>
                </div>
                <div class="pwa-notif-right">
                    <span class="pwa-delay-label">${s.notifReminderDelay} mnt</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="pwa-notif-quran" ${s.notifQuranReminder ? 'checked' : ''} ${!granted ? 'disabled' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            ${granted ? `
                <button class="pwa-test-notif-btn" id="pwa-test-notif-btn">
                    <i class="fa-solid fa-bell"></i>
                    ${lang === 'en' ? 'Test Notification' : 'Tes Notifikasi'}
                </button>
            ` : ''}
        </div>
    `;

    // Allow button
    container.querySelector('#pwa-allow-notif-btn')?.addEventListener('click', () => {
        requestNotificationPermission().then(result => {
            if (result === 'granted') {
                renderPwaNotifSettings(container);
                rescheduleNotifications();
            }
        });
    });

    // Test notification
    container.querySelector('#pwa-test-notif-btn')?.addEventListener('click', () => {
        showInAppNotification('🕌 Tes Notifikasi', 'Notifikasi berfungsi dengan baik! Kamu akan menerima pengingat waktu shalat.', 'prayer');
        // Juga test native
        if (isNotificationGranted()) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification('🕌 Al Quran Digital', {
                    body:    'Notifikasi berfungsi dengan baik!',
                    icon:    '/img/icon-192.png',
                    badge:   '/img/icon-192.png',
                    vibrate: [200, 100, 200],
                    tag:     'test-notif',
                });
            });
        }
    });

    // Save on change
    const saveAndReschedule = () => {
        savePwaSettings({
            notifPrayer:        container.querySelector('#pwa-notif-prayer')?.checked ?? s.notifPrayer,
            notifHadist:        container.querySelector('#pwa-notif-hadist')?.checked ?? s.notifHadist,
            notifHadistTime:    container.querySelector('#pwa-notif-hadist-time')?.value ?? s.notifHadistTime,
            notifQuranReminder: container.querySelector('#pwa-notif-quran')?.checked ?? s.notifQuranReminder,
            notifReminderDelay: s.notifReminderDelay,
        });
        rescheduleNotifications();
    };

    ['#pwa-notif-prayer', '#pwa-notif-hadist', '#pwa-notif-quran'].forEach(sel => {
        container.querySelector(sel)?.addEventListener('change', saveAndReschedule);
    });
    container.querySelector('#pwa-notif-hadist-time')?.addEventListener('change', saveAndReschedule);
}

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
function initPwa() {
    registerServiceWorker();

    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', triggerInstallPrompt);
        installBtn.style.display = 'none';
    }

    // Hard restart
    const _attachHardRestart = () => {
        const btn = document.getElementById('hard-restart-btn');
        if (!btn || btn._hrAttached) return;
        btn._hrAttached = true;
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Restarting...';
            try {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
                const regs = await navigator.serviceWorker.getRegistrations();
                await Promise.all(regs.map(r => r.unregister()));
            } catch(e) {}
            window.location.reload(true);
        });
    };
    _attachHardRestart();
    new MutationObserver(_attachHardRestart).observe(document.body, {
        childList: true, subtree: true,
    });

    // Re-schedule saat prayer times di-update
    document.addEventListener('prayer-times-updated', rescheduleNotifications);
}
