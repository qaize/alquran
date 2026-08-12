/* pwa.js — PWA Manager
   - Service Worker registration
   - Install prompt (Add to Home Screen)
   - Notification permission request
   - Schedule: waktu shalat, hadist harian, reminder Quran
   ──────────────────────────────────────────────────────── */

const PWA_NOTIF_KEY = 'quran_pwa_notifications';

/* ── Settings untuk notifikasi (user-configurable) ── */
function getPwaSettings() {
    try {
        return Object.assign({
            notifPrayer:        true,   // notif waktu shalat
            notifHadist:        true,   // notif hadist harian
            notifHadistTime:    '07:00',
            notifQuranReminder: true,   // reminder baca Quran setelah shalat
            notifReminderDelay: 10,     // menit setelah shalat
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

    // Auto-reload saat SW baru mengambil alih (setelah activate)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });

    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then(reg => {
            _swRegistration = reg;
            console.log('[PWA] Service Worker registered:', reg.scope);

            // Cek update
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Langsung aktivasi SW baru tanpa tunggu user
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    }
                });
            });

            // Setelah SW aktif, jadwalkan notifikasi
            navigator.serviceWorker.ready.then(() => {
                _scheduleAllNotifications();
            });
        })
        .catch(err => console.warn('[PWA] SW registration failed:', err));
}

function _showUpdateToast() {
    if (typeof showToast === 'function') {
        showToast({
            type: 'info',
            message: 'Update tersedia. Muat ulang untuk memperbarui.',
            duration: 6000,
        });
    }
}

/* ══════════════════════════════════════════
   INSTALL PROMPT (Add to Home Screen)
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
    if (!('Notification' in window)) {
        return Promise.reject('Notifications not supported');
    }
    if (Notification.permission === 'granted') {
        return Promise.resolve('granted');
    }
    return Notification.requestPermission();
}

function isNotificationGranted() {
    return 'Notification' in window && Notification.permission === 'granted';
}

/* ══════════════════════════════════════════
   SCHEDULE NOTIFICATIONS via Service Worker
   ══════════════════════════════════════════ */
function _scheduleAllNotifications() {
    if (!isNotificationGranted()) return;
    if (!_swRegistration?.active) return;

    const s = getPwaSettings();

    // Waktu shalat — ambil dari cache prayer times
    const timings = _getPrayerTimingsFromCache();

    if (s.notifPrayer && timings) {
        _swRegistration.active.postMessage({
            type: 'SCHEDULE_PRAYER',
            payload: timings,
        });
    }

    if (s.notifHadist) {
        _swRegistration.active.postMessage({
            type: 'SCHEDULE_HADIST',
            payload: {
                title: '📜 Hadist Hari Ini',
                body:  'Buka Al Quran Digital untuk membaca hadist pilihan.',
                time:  s.notifHadistTime,
            },
        });
    }

    if (s.notifQuranReminder && timings) {
        _swRegistration.active.postMessage({
            type: 'SCHEDULE_QURAN_REMINDER',
            payload: {
                timings,
                delayMinutes: s.notifReminderDelay,
            },
        });
    }
}

function _getPrayerTimingsFromCache() {
    try {
        const cached = JSON.parse(localStorage.getItem('quran_prayer_times'));
        if (cached && cached.timings) return cached.timings;
    } catch(e) {}
    return null;
}

// Re-schedule setiap kali prayer times di-update
function rescheduleNotifications() {
    if (_swRegistration?.active) {
        _swRegistration.active.postMessage({ type: 'CLEAR_SCHEDULES' });
    }
    setTimeout(_scheduleAllNotifications, 500);
}

/* ══════════════════════════════════════════
   SETTINGS PANEL untuk notifikasi (di settings modal)
   ══════════════════════════════════════════ */
function renderPwaNotifSettings(container) {
    if (!container) return;
    const s = getPwaSettings();
    const granted = isNotificationGranted();
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';

    container.innerHTML = `
        <div class="pwa-notif-section">
            ${!granted ? `
                <div class="pwa-notif-banner">
                    <i class="fa-solid fa-bell-slash"></i>
                    <div>
                        <strong>${lang === 'en' ? 'Enable Notifications' : 'Aktifkan Notifikasi'}</strong>
                        <p>${lang === 'en' ? 'Allow notifications to get prayer time alerts.' : 'Izinkan notifikasi untuk mendapat pengingat waktu shalat.'}</p>
                    </div>
                    <button class="pwa-notif-allow-btn" id="pwa-allow-notif-btn">
                        ${lang === 'en' ? 'Allow' : 'Izinkan'}
                    </button>
                </div>
            ` : ''}

            <div class="pwa-notif-row ${!granted ? 'pwa-notif-disabled' : ''}">
                <label class="pwa-notif-label">
                    <i class="fa-solid fa-clock"></i>
                    ${lang === 'en' ? 'Prayer Time Alerts' : 'Notif Waktu Shalat'}
                </label>
                <label class="toggle-switch">
                    <input type="checkbox" id="pwa-notif-prayer" ${s.notifPrayer ? 'checked' : ''} ${!granted ? 'disabled' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <div class="pwa-notif-row ${!granted ? 'pwa-notif-disabled' : ''}">
                <label class="pwa-notif-label">
                    <i class="fa-solid fa-scroll"></i>
                    ${lang === 'en' ? 'Daily Hadith' : 'Hadist Harian'}
                </label>
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
                <label class="pwa-notif-label">
                    <i class="fa-solid fa-book-quran"></i>
                    ${lang === 'en' ? 'Quran Reminder (after prayer)' : 'Reminder Baca Quran (setelah shalat)'}
                </label>
                <div class="pwa-notif-right">
                    <span class="pwa-delay-label">${s.notifReminderDelay} mnt</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="pwa-notif-quran" ${s.notifQuranReminder ? 'checked' : ''} ${!granted ? 'disabled' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    `;

    // Allow notif button
    const allowBtn = container.querySelector('#pwa-allow-notif-btn');
    if (allowBtn) {
        allowBtn.addEventListener('click', () => {
            requestNotificationPermission().then(result => {
                if (result === 'granted') {
                    renderPwaNotifSettings(container);
                    rescheduleNotifications();
                }
            });
        });
    }

    // Save on toggle/change
    const saveAndReschedule = () => {
        const updated = {
            notifPrayer:        container.querySelector('#pwa-notif-prayer')?.checked ?? s.notifPrayer,
            notifHadist:        container.querySelector('#pwa-notif-hadist')?.checked ?? s.notifHadist,
            notifHadistTime:    container.querySelector('#pwa-notif-hadist-time')?.value ?? s.notifHadistTime,
            notifQuranReminder: container.querySelector('#pwa-notif-quran')?.checked ?? s.notifQuranReminder,
            notifReminderDelay: s.notifReminderDelay,
        };
        savePwaSettings(updated);
        rescheduleNotifications();
    };

    ['#pwa-notif-prayer','#pwa-notif-hadist','#pwa-notif-quran'].forEach(sel => {
        container.querySelector(sel)?.addEventListener('change', saveAndReschedule);
    });
    container.querySelector('#pwa-notif-hadist-time')?.addEventListener('change', saveAndReschedule);
}

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
function initPwa() {
    registerServiceWorker();

    // Install button click
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', triggerInstallPrompt);
        installBtn.style.display = 'none';
    }

    // Hard restart — tombol di settings panel
    // Pakai MutationObserver karena tombol ada di dalam overlay yang di-render belakangan
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

    // Coba langsung dulu
    _attachHardRestart();

    // Pantau DOM untuk tombol yang muncul belakangan (settings overlay)
    new MutationObserver(_attachHardRestart).observe(document.body, {
        childList: true, subtree: true
    });

    // Reschedule saat prayer times di-update
    document.addEventListener('prayer-times-updated', rescheduleNotifications);
}
