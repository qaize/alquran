/* usage.js — Data usage tracker
   Menyimpan estimasi penggunaan data ke localStorage.
   ─────────────────────────────────────────────────── */

const USAGE_KEY = 'quran_data_usage';

// Estimasi ukuran response API berdasarkan endpoint (bytes)
const API_SIZE_ESTIMATE = {
    'surat_list':   45000,   // ~45 KB — semua 114 surah
    'surat_detail': 120000,  // ~120 KB — 1 surah lengkap dengan ayat
    'tafsir':       80000,   // ~80 KB
    'asbab':        15000,   // ~15 KB
    'tajweed':      60000,   // ~60 KB
    'audio':        0,       // dihitung dari durasi
};

// Audio bitrate estimasi: 64 kbps (equran.id pakai mp3 64kbps)
const AUDIO_BITRATE_KBPS = 64;

function _loadUsage() {
    try {
        const raw = localStorage.getItem(USAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
        apiBytes:     0,
        audioBytes:   0,
        audioDuration: 0, // detik
        apiCalls:     0,
        audioPlays:   0,
        firstUsed:    Date.now(),
        lastUsed:     Date.now(),
        breakdown: {
            surat_list:   0,
            surat_detail: 0,
            tafsir:       0,
            asbab:        0,
            tajweed:      0,
        },
    };
}

function _saveUsage(data) {
    data.lastUsed = Date.now();
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

// ── Public API ──

function trackApiCall(type) {
    const data = _loadUsage();
    const bytes = API_SIZE_ESTIMATE[type] || 10000;
    data.apiBytes += bytes;
    data.apiCalls += 1;
    if (data.breakdown[type] !== undefined) {
        data.breakdown[type] += bytes;
    }
    _saveUsage(data);
    _refreshUsageDisplay();
}

function trackAudio(durationSeconds) {
    if (!durationSeconds || durationSeconds <= 0) return;
    const data = _loadUsage();
    // bytes = bitrate(kbps) * 1000 / 8 * seconds
    const bytes = Math.round((AUDIO_BITRATE_KBPS * 1000 / 8) * durationSeconds);
    data.audioBytes   += bytes;
    data.audioDuration += durationSeconds;
    data.audioPlays   += 1;
    _saveUsage(data);
    _refreshUsageDisplay();
}

function resetUsage() {
    localStorage.removeItem(USAGE_KEY);
    _refreshUsageDisplay();
}

function getUsage() {
    return _loadUsage();
}

// ── Format helpers ──

function _formatBytes(bytes) {
    if (bytes < 1024)       return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
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
    return new Date(ts).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

// ── UI ──

function _refreshUsageDisplay() {
    const badge = document.getElementById('usage-badge');
    if (badge) {
        const data = _loadUsage();
        const total = data.apiBytes + data.audioBytes;
        badge.textContent = _formatBytes(total);
        badge.style.display = total > 0 ? 'inline-flex' : 'none';
    }

    // Re-render panel jika sedang terbuka
    const panel = document.getElementById('usage-panel');
    if (panel && panel.classList.contains('open')) {
        _renderUsagePanel(panel);
    }
}

function initUsageTracker() {
    _refreshUsageDisplay();

    const btn = document.getElementById('usage-footer-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        let panel = document.getElementById('usage-panel');
        if (panel) {
            panel.classList.toggle('open');
            return;
        }

        panel = document.createElement('div');
        panel.id = 'usage-panel';
        panel.className = 'usage-panel';
        document.body.appendChild(panel);

        _renderUsagePanel(panel);

        // Tutup saat klik luar
        document.addEventListener('mousedown', function closePanel(e2) {
            if (!panel.contains(e2.target) && e2.target !== btn) {
                panel.classList.remove('open');
                document.removeEventListener('mousedown', closePanel);
            }
        });

        requestAnimationFrame(() => panel.classList.add('open'));
    });
}

function _renderUsagePanel(panel) {
    const data = _loadUsage();
    const total = data.apiBytes + data.audioBytes;

    const apiPct   = total > 0 ? Math.round(data.apiBytes   / total * 100) : 0;
    const audioPct = total > 0 ? Math.round(data.audioBytes / total * 100) : 0;

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
                    <span class="usage-stat-label">Audio Diputar</span>
                    <span class="usage-stat-value">${data.audioPlays}× · ${_formatDuration(data.audioDuration)} · ${_formatBytes(data.audioBytes)}</span>
                </div>
            </div>
        </div>

        <div class="usage-breakdown">
            <div class="usage-breakdown-title">Rincian API</div>
            ${Object.entries(data.breakdown)
                .filter(([,v]) => v > 0)
                .map(([k, v]) => `
                    <div class="usage-breakdown-row">
                        <span>${k.replace('_', ' ')}</span>
                        <span>${_formatBytes(v)}</span>
                    </div>`)
                .join('') || '<div class="usage-breakdown-row"><span>Belum ada data</span><span>—</span></div>'}
        </div>

        <div class="usage-meta">
            <span>Mulai: ${_formatDate(data.firstUsed)}</span>
            <span>Terakhir: ${_formatDate(data.lastUsed)}</span>
        </div>

        <button class="usage-reset-btn" id="usage-reset-btn">
            <i class="fa-solid fa-rotate-left"></i> Reset
        </button>
    `;

    panel.querySelector('#usage-panel-close').addEventListener('click', () => {
        panel.classList.remove('open');
    });

    panel.querySelector('#usage-reset-btn').addEventListener('click', () => {
        if (confirm('Reset semua data usage?')) {
            resetUsage();
            _renderUsagePanel(panel);
        }
    });
}
