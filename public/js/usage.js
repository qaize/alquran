/* usage.js — Data usage tracker
   Menyimpan estimasi penggunaan data ke localStorage.
   ─────────────────────────────────────────────────── */

const USAGE_KEY = 'quran_data_usage';

// Estimasi ukuran response API (bytes)
const API_SIZE_ESTIMATE = {
    surat_list:    45000,  // ~45 KB  — list 114 surah
    surat_detail:  120000, // ~120 KB — 1 surah + ayat lengkap
    tafsir:        80000,  // ~80 KB
    asbab:         15000,  // ~15 KB
    tajweed:       60000,  // ~60 KB — tajweed per surah
    hadist:        5000,   // ~5 KB  — 1 hadist detail
    hadist_list:   25000,  // ~25 KB — list hadist per page
    prayer_time:   3000,   // ~3 KB  — timings 1 hari
    geocode:       2000,   // ~2 KB  — reverse geocode
    qibla:         1000,   // ~1 KB  — qibla direction
};

// Label display untuk setiap tipe API
const API_LABELS = {
    surat_list:   { label: 'Daftar Surah',    icon: 'fa-list',              source: 'equran.id'        },
    surat_detail: { label: 'Detail Surah',    icon: 'fa-book-quran',        source: 'equran.id'        },
    tafsir:       { label: 'Tafsir',          icon: 'fa-book',              source: 'equran.id'        },
    asbab:        { label: 'Asbabun Nuzul',   icon: 'fa-scroll',            source: 'Muslim API'       },
    tajweed:      { label: 'Tajwid Berwarna', icon: 'fa-wand-magic-sparkles', source: 'AlQuran Cloud'  },
    hadist:       { label: 'Detail Hadits',   icon: 'fa-scroll',            source: 'Hadith API'       },
    hadist_list:  { label: 'List Hadits',     icon: 'fa-list',              source: 'Hadith API'       },
    prayer_time:  { label: 'Waktu Shalat',    icon: 'fa-clock',             source: 'AlAdhan API'      },
    geocode:      { label: 'Lokasi',          icon: 'fa-location-dot',      source: 'BigDataCloud'     },
    qibla:        { label: 'Arah Kiblat',     icon: 'fa-kaaba',             source: 'AlAdhan API'      },
};

const AUDIO_BITRATE_KBPS = 64; // equran.id mp3 64kbps

function _loadUsage() {
    try {
        const raw = localStorage.getItem(USAGE_KEY);
        if (raw) {
            const d = JSON.parse(raw);
            // Ensure all breakdown keys exist
            Object.keys(API_SIZE_ESTIMATE).forEach(k => {
                if (d.breakdown[k] === undefined) d.breakdown[k] = 0;
            });
            return d;
        }
    } catch(e) {}
    return {
        apiBytes:      0,
        audioBytes:    0,
        audioDuration: 0,
        apiCalls:      0,
        audioPlays:    0,
        firstUsed:     Date.now(),
        lastUsed:      Date.now(),
        breakdown:     Object.fromEntries(Object.keys(API_SIZE_ESTIMATE).map(k => [k, 0])),
    };
}

function _saveUsage(data) {
    data.lastUsed = Date.now();
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

/* ── Public API ── */

function trackApiCall(type) {
    const data  = _loadUsage();
    const bytes = API_SIZE_ESTIMATE[type] || 5000;
    data.apiBytes  += bytes;
    data.apiCalls  += 1;
    if (data.breakdown[type] !== undefined) {
        data.breakdown[type] += bytes;
    } else {
        data.breakdown[type] = bytes;
    }
    _saveUsage(data);
    _refreshUsageDisplay();
}

function trackAudio(durationSeconds) {
    if (!durationSeconds || durationSeconds <= 0) return;
    const data  = _loadUsage();
    const bytes = Math.round((AUDIO_BITRATE_KBPS * 1000 / 8) * durationSeconds);
    data.audioBytes    += bytes;
    data.audioDuration += durationSeconds;
    data.audioPlays    += 1;
    _saveUsage(data);
    _refreshUsageDisplay();
}

function resetUsage() {
    localStorage.removeItem(USAGE_KEY);
    _refreshUsageDisplay();
}

function getUsage() { return _loadUsage(); }

/* ── Format helpers ── */

function _formatBytes(bytes) {
    if (bytes < 1024)         return bytes + ' B';
    if (bytes < 1024 * 1024)  return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function _formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    if (m === 0) return `${s}d`;
    return `${m}m ${s}d`;
}

function _formatDate(ts) {
    if (!ts) return '—';
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';
    return new Date(ts).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

/* ── UI ── */

function _refreshUsageDisplay() {
    const data  = _loadUsage();
    const total = data.apiBytes + data.audioBytes;
    const text  = total > 0 ? _formatBytes(total) : null;

    const badge = document.getElementById('usage-badge');
    if (badge) { badge.textContent = text || '0 B'; badge.style.display = text ? 'inline-flex' : 'none'; }

    const badgeMobile = document.getElementById('usage-badge-mobile');
    if (badgeMobile) { badgeMobile.textContent = text || '0B'; badgeMobile.style.display = text ? 'inline-flex' : 'none'; }

    const panel = document.getElementById('usage-panel');
    if (panel && panel.classList.contains('open')) _renderUsagePanel(panel);
}

function initUsageTracker() {
    _refreshUsageDisplay();

    function openPanelFrom(triggerBtn) {
        let panel = document.getElementById('usage-panel');
        if (panel) {
            panel.classList.toggle('open');
            if (panel.classList.contains('open')) _renderUsagePanel(panel);
            return;
        }

        panel = document.createElement('div');
        panel.id = 'usage-panel';
        panel.className = 'usage-panel';
        document.body.appendChild(panel);
        _renderUsagePanel(panel);

        document.addEventListener('mousedown', function closePanel(e) {
            const btnFooter = document.getElementById('usage-footer-btn');
            const btnMobile = document.getElementById('usage-footer-btn-mobile');
            if (!panel.contains(e.target) && e.target !== btnFooter && e.target !== btnMobile) {
                panel.classList.remove('open');
                document.removeEventListener('mousedown', closePanel);
            }
        });

        requestAnimationFrame(() => panel.classList.add('open'));
    }

    const btn = document.getElementById('usage-footer-btn');
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); openPanelFrom(btn); });

    const btnMobile = document.getElementById('usage-footer-btn-mobile');
    if (btnMobile) btnMobile.addEventListener('click', (e) => { e.stopPropagation(); openPanelFrom(btnMobile); });
}

function _renderUsagePanel(panel) {
    const data  = _loadUsage();
    const total = data.apiBytes + data.audioBytes;
    const apiPct   = total > 0 ? Math.round(data.apiBytes   / total * 100) : 0;
    const audioPct = total > 0 ? Math.round(data.audioBytes / total * 100) : 0;

    // Build breakdown rows — only keys with usage > 0, grouped by source
    const usedEntries = Object.entries(data.breakdown).filter(([, v]) => v > 0);

    // Group by source
    const grouped = {};
    usedEntries.forEach(([key, bytes]) => {
        const meta   = API_LABELS[key] || { label: key, icon: 'fa-wifi', source: 'Other' };
        const source = meta.source;
        if (!grouped[source]) grouped[source] = { bytes: 0, calls: [], icon: meta.icon };
        grouped[source].bytes += bytes;
        grouped[source].calls.push({ key, label: meta.label, icon: meta.icon, bytes });
    });

    const breakdownHTML = Object.entries(grouped).length === 0
        ? `<div class="usage-breakdown-empty">${t('usage_no_data')}</div>`
        : Object.entries(grouped).map(([source, info]) => `
            <div class="usage-source-group">
                <button class="usage-source-trigger" data-source="${source}">
                    <span class="ust-left">
                        <i class="fa-solid ${info.calls[0]?.icon || 'fa-wifi'}"></i>
                        <span>${source}</span>
                    </span>
                    <span class="ust-right">
                        <span class="ust-bytes">${_formatBytes(info.bytes)}</span>
                        <i class="fa-solid fa-chevron-down ust-arrow"></i>
                    </span>
                </button>
                <div class="usage-source-body">
                    ${info.calls.map(c => `
                        <div class="usage-source-row">
                            <span><i class="fa-solid ${c.icon}"></i> ${c.label}</span>
                            <span>${_formatBytes(c.bytes)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

    panel.innerHTML = `
        <div class="usage-panel-header">
            <div class="usage-panel-title">
                <i class="fa-solid fa-chart-pie"></i>
                <span>Data Usage</span>
            </div>
            <button class="usage-panel-close" id="usage-panel-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div class="usage-total-row">
            <span class="usage-total-label">Total</span>
            <span class="usage-total-value">${_formatBytes(total)}</span>
        </div>

        <div class="usage-bar-wrap">
            <div class="usage-bar">
                <div class="usage-bar-api"   style="width:${apiPct}%"   title="API ${apiPct}%"></div>
                <div class="usage-bar-audio" style="width:${audioPct}%" title="Audio ${audioPct}%"></div>
            </div>
            <div class="usage-bar-legend">
                <span class="ubl-api"><span class="ubl-dot"></span>API ${apiPct}%</span>
                <span class="ubl-audio"><span class="ubl-dot"></span>Audio ${audioPct}%</span>
            </div>
        </div>

        <div class="usage-stats">
            <div class="usage-stat">
                <i class="fa-solid fa-wifi"></i>
                <div class="usage-stat-info">
                    <span class="usage-stat-label">API Calls</span>
                    <span class="usage-stat-value">${data.apiCalls}× · ${_formatBytes(data.apiBytes)}</span>
                </div>
            </div>
            <div class="usage-stat">
                <i class="fa-solid fa-headphones"></i>
                <div class="usage-stat-info">
                    <span class="usage-stat-label">${t('usage_audio_played')}</span>
                    <span class="usage-stat-value">${data.audioPlays}× · ${_formatDuration(data.audioDuration)} · ${_formatBytes(data.audioBytes)}</span>
                </div>
            </div>
        </div>

        <div class="usage-breakdown">
            <div class="usage-breakdown-title">${t('usage_api_detail')}</div>
            ${breakdownHTML}
        </div>

        <div class="usage-meta">
            <span>${t('usage_since')} ${_formatDate(data.firstUsed)}</span>
            <span>${t('usage_last')} ${_formatDate(data.lastUsed)}</span>
        </div>

        <button class="usage-reset-btn" id="usage-reset-btn">
            <i class="fa-solid fa-rotate-left"></i> Reset
        </button>
    `;

    panel.querySelector('#usage-panel-close').addEventListener('click', () => panel.classList.remove('open'));

    panel.querySelector('#usage-reset-btn').addEventListener('click', () => {
        if (confirm(t('usage_reset_confirm'))) {
            resetUsage();
            _renderUsagePanel(panel);
        }
    });

    // Accordion toggle per source group
    panel.querySelectorAll('.usage-source-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const group = trigger.closest('.usage-source-group');
            const body  = group.querySelector('.usage-source-body');
            const arrow = trigger.querySelector('.ust-arrow');
            const isOpen = body.classList.toggle('open');
            arrow.style.transform = isOpen ? 'rotate(180deg)' : '';
        });
    });
}

