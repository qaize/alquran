/* prayer-time.js — Waktu Shalat
   API: api.aladhan.com/v1/timings (by coordinates)
   Reverse geocode: api.bigdatacloud.net (free, no key)
   Method: 11 (SIHAT — Indonesia)
   ─────────────────────────────────────────────── */

const PT_CACHE_KEY  = 'quran_prayer_times';
const PT_LOC_KEY    = 'quran_prayer_location';
const PT_API        = 'https://api.aladhan.com/v1/timings';
const PT_QIBLA_API  = 'https://api.aladhan.com/v1/qibla';
const PT_GEO_API    = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const PT_METHOD     = 11; // Kementerian Agama RI / SIHAT

const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PRAYER_ICONS = {
    Fajr:    'fa-star-and-crescent',
    Dhuhr:   'fa-sun',
    Asr:     'fa-cloud-sun',
    Maghrib: 'fa-cloud-sun-rain',
    Isha:    'fa-moon',
};

// State
let _ptTimings    = null;
let _ptLocation   = null;
let _ptCountdown  = null;
let _ptNextPrayer = null;
let _ptQibla      = null;  // degrees from North

/* ── Helpers ── */
function _ptTimeToMs(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60 + m) * 60 * 1000;
}

function _ptNowMs() {
    const now = new Date();
    return (now.getHours() * 60 + now.getMinutes()) * 60 * 1000 + now.getSeconds() * 1000;
}

function _ptFormatCountdown(ms) {
    if (ms <= 0) return '00:00:00';
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function _ptGetNextPrayer(timings) {
    const nowMs = _ptNowMs();
    for (const key of PRAYER_KEYS) {
        const timeMs = _ptTimeToMs(timings[key]);
        if (timeMs > nowMs) return { name: key, time: timings[key], timeMs };
    }
    return { name: 'Fajr', time: timings['Fajr'], timeMs: _ptTimeToMs(timings['Fajr']) + 86400000 };
}

function _ptPrayerName(key) {
    const names = {
        id: { Fajr: 'Subuh', Dhuhr: 'Zuhur', Asr: 'Asar', Maghrib: 'Maghrib', Isha: 'Isya' },
        en: { Fajr: 'Fajr',  Dhuhr: 'Dhuhr', Asr: 'Asr',  Maghrib: 'Maghrib', Isha: 'Isha' },
    };
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';
    return (names[lang] || names.id)[key] || key;
}

function _ptCardinal(deg) {
    const dirs = getCurrentLang?.() === 'en'
        ? ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
        : ['U','ULT','TL','TLT','T','TTG','TG','STG','S','SBD','BD','BBD','B','BBL','BL','UBL'];
    return dirs[Math.round(deg / 22.5) % 16];
}

/* ── Fetch qibla direction ── */
function _ptFetchQibla(lat, lng) {
    return fetch(`${PT_QIBLA_API}/${lat}/${lng}`)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(json => {
            if (typeof trackApiCall === 'function') trackApiCall('qibla');
            return json.data.direction;
        });
}

/* ── Geolocation + Reverse geocode ── */
function _ptGetLocation() {
    return new Promise((resolve, reject) => {
        try {
            const cached = JSON.parse(localStorage.getItem(PT_LOC_KEY));
            if (cached && cached.ts && Date.now() - cached.ts < 3600000) return resolve(cached);
        } catch(e) {}

        if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                let city = 'Lokasi Anda', country = '';
                try {
                    const geo = await fetch(`${PT_GEO_API}?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
                    const d   = await geo.json();

                    // Ambil kecamatan dari adminLevel 6 (paling spesifik)
                    const adminLevels = d.localityInfo?.administrative || [];
                    const kecamatan   = adminLevels.find(a => a.adminLevel === 6)?.name;
                    const kabupaten   = adminLevels.find(a => a.adminLevel === 5)?.name;
                    const kotaProvinsi = d.city || d.principalSubdivision || '';

                    // Tampilkan: "Setiabudi, Jakarta Selatan" atau fallback ke city
                    city    = kecamatan
                        ? (kabupaten ? `${kecamatan}, ${kabupaten}` : `${kecamatan}, ${kotaProvinsi}`)
                        : (d.city || d.locality || d.principalSubdivision || 'Lokasi Anda');
                    country = d.countryName || '';

                    if (typeof trackApiCall === 'function') trackApiCall('geocode');
                } catch(e) {}
                const loc = { lat, lng, city, country, ts: Date.now() };
                localStorage.setItem(PT_LOC_KEY, JSON.stringify(loc));
                resolve(loc);
            },
            (err) => reject(err),
            { timeout: 10000, maximumAge: 3600000 }
        );
    });
}

/* ── Fetch prayer times ── */
function _ptFetchTimings(lat, lng) {
    const today = new Date().toISOString().slice(0, 10);
    try {
        const cached = JSON.parse(localStorage.getItem(PT_CACHE_KEY));
        if (cached && cached.date === today && cached.lat === lat && cached.lng === lng)
            return Promise.resolve(cached.timings);
    } catch(e) {}

    return fetch(`${PT_API}?latitude=${lat}&longitude=${lng}&method=${PT_METHOD}`)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(json => {
            const timings = json.data.timings;
            localStorage.setItem(PT_CACHE_KEY, JSON.stringify({ date: today, lat, lng, timings }));
            if (typeof trackApiCall === 'function') trackApiCall('prayer_time');
            return timings;
        });
}

/* ══════════════════════════════════════════
   SIDEBAR WIDGET — compact, satu baris
   ══════════════════════════════════════════ */
function initPrayerWidget() {
    const widget       = document.getElementById('prayer-time-widget');
    const widgetMobile = document.getElementById('prayer-time-widget-mobile');
    if (!widget && !widgetMobile) return;

    const loading = `<div class="ptw-loading"><i class="fa-solid fa-spinner fa-spin"></i></div>`;
    if (widget)       widget.innerHTML       = loading;
    if (widgetMobile) widgetMobile.innerHTML = loading;

    _ptGetLocation()
        .then(loc => { _ptLocation = loc; return _ptFetchTimings(loc.lat, loc.lng); })
        .then(timings => {
            _ptTimings    = timings;
            _ptNextPrayer = _ptGetNextPrayer(timings);
            if (widget)       _renderPrayerWidget(widget);
            if (widgetMobile) _renderPrayerWidgetMobile(widgetMobile);
            _startCountdown(widget, widgetMobile);
            // Fetch qibla di background (non-blocking)
            if (!_ptQibla) {
                _ptFetchQibla(_ptLocation.lat, _ptLocation.lng)
                    .then(deg => { _ptQibla = deg; })
                    .catch(() => {});
            }
        })
        .catch(() => {
            const allowBtn = `
                <button class="ptw-allow-btn" id="ptw-allow-btn">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${t('pt_allow_location')}</span>
                </button>
            `;
            if (widget) {
                widget.innerHTML = allowBtn;
                widget.querySelector('#ptw-allow-btn')?.addEventListener('click', () => {
                    localStorage.removeItem(PT_LOC_KEY);
                    initPrayerWidget();
                });
            }
            if (widgetMobile) {
                widgetMobile.innerHTML = allowBtn.replace('id="ptw-allow-btn"', 'id="ptw-allow-btn-mobile"');
                widgetMobile.querySelector('#ptw-allow-btn-mobile')?.addEventListener('click', () => {
                    localStorage.removeItem(PT_LOC_KEY);
                    initPrayerWidget();
                });
            }
        });
}

function _renderPrayerWidget(widget) {
    if (!_ptNextPrayer || !_ptLocation) return;

    const { name, time } = _ptNextPrayer;
    const icon  = PRAYER_ICONS[name];
    const label = _ptPrayerName(name);

    widget.innerHTML = `
        <button class="ptw-compact" id="ptw-compact" title="${t('pt_title')}">
            <span class="ptw-icon"><i class="fa-solid ${icon}"></i></span>
            <span class="ptw-info">
                <span class="ptw-name">${label}</span>
                <span class="ptw-time-val">${time}</span>
            </span>
            <span class="ptw-cd" id="ptw-countdown">--:--:--</span>
        </button>
        <div class="ptw-loc-pin">
            <i class="fa-solid fa-location-dot"></i>
            <span>${_ptLocation.city}</span>
        </div>
    `;
    widget.querySelector('#ptw-compact').addEventListener('click', openPrayerModal);
    widget.querySelector('.ptw-loc-pin').addEventListener('click', openPrayerModal);
}

function _renderPrayerWidgetMobile(widget) {
    if (!_ptNextPrayer || !_ptLocation) return;

    const { name, time } = _ptNextPrayer;
    const icon  = PRAYER_ICONS[name];
    const label = _ptPrayerName(name);

    widget.innerHTML = `
        <button class="ptw-mobile-bar" id="ptw-mobile-bar" title="${t('pt_title')}">
            <span class="ptw-mobile-prayer">
                <span class="ptw-mobile-icon"><i class="fa-solid ${icon}"></i></span>
                <span class="ptw-mobile-label">${label}</span>
                <span class="ptw-mobile-time">${time}</span>
            </span>
            <span class="ptw-mobile-sep">·</span>
            <span class="ptw-mobile-loc">
                <i class="fa-solid fa-location-dot"></i>
                <span>${_ptLocation.city}</span>
            </span>
            <span class="ptw-cd ptw-cd-mobile" id="ptw-countdown-mobile">--:--:--</span>
        </button>
    `;
    widget.querySelector('#ptw-mobile-bar').addEventListener('click', openPrayerModal);
}

function _startCountdown(widget, widgetMobile) {
    if (_ptCountdown) clearInterval(_ptCountdown);
    _ptCountdown = setInterval(() => {
        const el       = document.getElementById('ptw-countdown');
        const elMobile = document.getElementById('ptw-countdown-mobile');

        if (!el && !elMobile) { clearInterval(_ptCountdown); return; }

        const nowMs = _ptNowMs();
        let diff = _ptNextPrayer.timeMs > 86400000
            ? (_ptNextPrayer.timeMs - 86400000) + (86400000 - nowMs)
            : _ptNextPrayer.timeMs - nowMs;

        if (diff < 0) {
            _ptNextPrayer = _ptGetNextPrayer(_ptTimings);
            if (widget)       _renderPrayerWidget(widget);
            if (widgetMobile) _renderPrayerWidgetMobile(widgetMobile);
            return;
        }
        const cdText = _ptFormatCountdown(diff);
        if (el)       el.textContent       = cdText;
        if (elMobile) elMobile.textContent = cdText;
    }, 1000);
}

/* ══════════════════════════════════════════
   MODAL — semua waktu shalat (centered)
   ══════════════════════════════════════════ */
function openPrayerModal() {
    let modal = document.getElementById('prayer-modal');
    if (modal) {
        modal.classList.add('open');
        if (_ptTimings) _renderPrayerModal(modal);
        return;
    }

    modal = document.createElement('div');
    modal.id        = 'prayer-modal';
    modal.className = 'prayer-modal-overlay';
    modal.innerHTML = `
        <div class="prayer-modal">
            <div class="prayer-modal-header">
                <div class="prayer-modal-title">
                    <i class="fa-solid fa-clock"></i>
                    <div>
                        <h3>${t('pt_title')}</h3>
                        <p id="prayer-modal-location">—</p>
                    </div>
                </div>
                <button class="prayer-modal-close" id="prayer-modal-close" title="${t('close')}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="prayer-modal-body" id="prayer-modal-body">
                <div class="hadist-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>${t('pt_loading')}</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#prayer-modal-close').addEventListener('click', () => {
        modal.classList.remove('open');
        _stopLiveCompass();
    });
    modal.addEventListener('click', e => {
        if (e.target === modal) { modal.classList.remove('open'); _stopLiveCompass(); }
    });

    requestAnimationFrame(() => modal.classList.add('open'));

    // Intercept browser back button
    history.pushState({ panel: 'prayer-time' }, '');
    window.addEventListener('popstate', function _ptPopstate() {
        if (!modal.classList.contains('open')) {
            window.removeEventListener('popstate', _ptPopstate);
            return;
        }
        modal.classList.remove('open');
        window.removeEventListener('popstate', _ptPopstate);
    });

    if (_ptTimings && _ptLocation) {
        _renderPrayerModal(modal);
    } else {
        _ptGetLocation()
            .then(loc => { _ptLocation = loc; return _ptFetchTimings(loc.lat, loc.lng); })
            .then(timings => {
                _ptTimings    = timings;
                _ptNextPrayer = _ptGetNextPrayer(timings);
                _renderPrayerModal(modal);
                const widget = document.getElementById('prayer-time-widget');
                if (widget) { _renderPrayerWidget(widget); _startCountdown(widget); }
            })
            .catch(() => {
                document.getElementById('prayer-modal-body').innerHTML = `
                    <div class="hadist-empty">
                        <i class="fa-solid fa-location-dot"></i>
                        <p>${t('pt_location_error')}</p>
                    </div>
                `;
            });
    }
}

function _renderPrayerModal(modal) {
    const body     = modal.querySelector('#prayer-modal-body');
    const locLabel = modal.querySelector('#prayer-modal-location');
    if (!body || !_ptTimings) return;

    if (locLabel && _ptLocation) {
        locLabel.innerHTML = `
            <i class="fa-solid fa-location-dot" style="color:var(--gold);font-size:10px;"></i>
            ${_ptLocation.city}${_ptLocation.country ? ', ' + _ptLocation.country : ''}
        `;
    }

    const nowMs = _ptNowMs();

    body.innerHTML = `
        <div class="pt-grid">
            ${PRAYER_KEYS.map(key => {
                const timeMs = _ptTimeToMs(_ptTimings[key]);
                const isPast = timeMs < nowMs;
                const isNext = _ptNextPrayer?.name === key;
                const icon   = PRAYER_ICONS[key];
                const label  = _ptPrayerName(key);
                return `
                    <div class="pt-card ${isNext ? 'pt-card-next' : ''} ${isPast ? 'pt-card-past' : ''}">
                        <i class="fa-solid ${icon} pt-card-icon"></i>
                        <span class="pt-card-name">${label}</span>
                        <span class="pt-card-time">${_ptTimings[key]}</span>
                        ${isNext ? `<span class="pt-card-badge">${t('pt_next')}</span>` : ''}
                        ${isNext ? `<span class="pt-card-countdown" id="pm-countdown">--:--:--</span>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        ${_ptQibla !== null ? _renderQiblaSection() : '<div class="pt-qibla-loading"><i class="fa-solid fa-spinner fa-spin"></i></div>'}
    `;

    // If qibla not loaded yet, fetch and update
    if (_ptQibla === null && _ptLocation) {
        _ptFetchQibla(_ptLocation.lat, _ptLocation.lng)
            .then(deg => {
                _ptQibla = deg;
                const qiblaEl = modal.querySelector('.pt-qibla-loading');
                if (qiblaEl) qiblaEl.outerHTML = _renderQiblaSection();
                setTimeout(() => _startLiveCompass(deg), 100);
            })
            .catch(() => {
                const qiblaEl = modal.querySelector('.pt-qibla-loading');
                if (qiblaEl) qiblaEl.remove();
            });
    } else if (_ptQibla !== null) {
        setTimeout(() => _startLiveCompass(_ptQibla), 100);
    }

    _startModalCountdown(modal);
}

function _renderQiblaSection() {
    const deg       = _ptQibla;
    const cardinal  = _ptCardinal(deg);
    const lang      = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';
    const label     = lang === 'en' ? 'Qibla Direction' : 'Arah Kiblat';
    const fromNorth = lang === 'en' ? 'from North' : 'dari Utara';
    const liveLabel = lang === 'en' ? 'Point your phone forward' : 'Arahkan hp ke depan';
    const staticNote = lang === 'en' ? 'Live compass not available' : 'Kompas tidak tersedia';

    const supportsCompass = !!(window.DeviceOrientationEvent);

    return `
        <div class="pt-qibla" id="pt-qibla-wrap">
            <div class="pt-qibla-left">
                <div class="pt-qibla-compass" id="pt-qibla-compass">
                    <div class="pt-compass-ring">
                        <span class="pt-compass-dir pt-dir-n">N</span>
                        <span class="pt-compass-dir pt-dir-e">E</span>
                        <span class="pt-compass-dir pt-dir-s">S</span>
                        <span class="pt-compass-dir pt-dir-w">W</span>
                    </div>
                    <div class="pt-qibla-needle" id="pt-qibla-needle">
                        <i class="fa-solid fa-kaaba"></i>
                    </div>
                </div>
            </div>
            <div class="pt-qibla-right">
                <span class="pt-qibla-title">${label}</span>
                <span class="pt-qibla-deg">${deg.toFixed(1)}° <small>${cardinal}</small></span>
                <span class="pt-qibla-cardinal">${fromNorth}</span>
                <span class="pt-compass-status" id="pt-compass-status">
                    ${supportsCompass
                        ? `<i class="fa-solid fa-compass"></i> ${liveLabel}`
                        : `<i class="fa-solid fa-compass-drafting"></i> ${staticNote}`}
                </span>
            </div>
        </div>
    `;
}

/* ── Live compass dengan DeviceOrientationEvent ── */
let _compassHandler = null;

function _startLiveCompass(qiblaDeg) {
    // Bersihkan handler lama
    _stopLiveCompass();

    if (!window.DeviceOrientationEvent) return;

    const requestPermission = () => {
        const needle = document.getElementById('pt-qibla-needle');
        const status = document.getElementById('pt-compass-status');
        if (!needle) return;

        _compassHandler = (evt) => {
            const needle = document.getElementById('pt-qibla-needle');
            if (!needle) { _stopLiveCompass(); return; }

            // webkitCompassHeading = heading dari North (iOS)
            // alpha = rotation around Z axis (Android, 0 = North saat dikalibrasi)
            let heading = null;
            if (evt.webkitCompassHeading !== undefined && evt.webkitCompassHeading !== null) {
                heading = evt.webkitCompassHeading; // iOS: langsung heading dari North
            } else if (evt.alpha !== null) {
                heading = 360 - evt.alpha; // Android: konversi dari alpha
            }

            if (heading === null) return;

            // Rotasi needle = arah kiblat - heading device
            const needleRot = qiblaDeg - heading;
            needle.style.transform = `rotate(${needleRot}deg)`;

            // Update status jadi aktif
            if (status) {
                const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';
                status.innerHTML = `<i class="fa-solid fa-compass pt-compass-live"></i> ${lang === 'en' ? 'Live compass active' : 'Kompas aktif'}`;
            }
        };

        window.addEventListener('deviceorientation', _compassHandler, true);
    };

    // iOS 13+ butuh permission request
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const status = document.getElementById('pt-compass-status');
        const lang   = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';
        if (status) {
            status.innerHTML = `<button class="pt-compass-allow-btn" id="pt-compass-allow">
                <i class="fa-solid fa-compass"></i>
                ${lang === 'en' ? 'Allow compass' : 'Izinkan kompas'}
            </button>`;
            document.getElementById('pt-compass-allow')?.addEventListener('click', () => {
                DeviceOrientationEvent.requestPermission().then(r => {
                    if (r === 'granted') requestPermission();
                });
            });
        }
    } else {
        requestPermission();
    }
}

function _stopLiveCompass() {
    if (_compassHandler) {
        window.removeEventListener('deviceorientation', _compassHandler, true);
        _compassHandler = null;
    }
}

function _startModalCountdown(modal) {
    const tick = () => {
        const el = modal.querySelector('#pm-countdown');
        if (!el || !modal.classList.contains('open')) return;

        const nowMs    = _ptNowMs();
        const targetMs = _ptNextPrayer?.timeMs;
        if (!targetMs) return;

        let diff = targetMs > 86400000
            ? (targetMs - 86400000) + (86400000 - nowMs)
            : targetMs - nowMs;

        if (diff < 0) {
            _ptNextPrayer = _ptGetNextPrayer(_ptTimings);
            _renderPrayerModal(modal);
            return;
        }
        el.textContent = _ptFormatCountdown(diff);
        setTimeout(tick, 1000);
    };
    setTimeout(tick, 100);
}

/* ── Init ── */
function openPrayerPanel() { openPrayerModal(); } // alias untuk nav btn

function initPrayerTime() {
    initPrayerWidget();

    const navBtn = document.getElementById('nav-prayer-time-btn');
    if (navBtn) {
        navBtn.addEventListener('click', e => {
            e.preventDefault();
            openPrayerModal();
            document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
            document.getElementById('drawer-backdrop')?.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('lang-changed', () => {
        if (_ptTimings && _ptLocation) {
            const widget = document.getElementById('prayer-time-widget');
            if (widget) _renderPrayerWidget(widget);
            const modal = document.getElementById('prayer-modal');
            if (modal?.classList.contains('open')) _renderPrayerModal(modal);
        }
    });
}
