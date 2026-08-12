/* backup.js — Export & Import semua data localStorage
   Keys yang di-backup:
   - quran_settings
   - quran_favorites
   - quran_bookmarks
   - quran_last_read
   - quran_reading_categories
   - quran_tajweed_enabled
   - quran_sidebar_right_collapsed
   ─────────────────────────────── */

const BACKUP_KEYS = [
    'quran_settings',
    'quran_favorites',
    'quran_bookmarks',
    'quran_bookmarks_hadist',
    'quran_last_read',
    'quran_reading_categories',
    'quran_tajweed_enabled',
    'quran_sidebar_right_collapsed',
];

const BACKUP_VERSION = 1;

// ── Export ──
function exportBackup() {
    const payload = {
        version:   BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        data: {}
    };

    BACKUP_KEYS.forEach(key => {
        const val = localStorage.getItem(key);
        if (val !== null) payload.data[key] = val;
    });

    const json     = JSON.stringify(payload, null, 2);
    const blob     = new Blob([json], { type: 'application/json' });
    const url      = URL.createObjectURL(blob);
    const date     = new Date().toISOString().slice(0, 10);
    const a        = document.createElement('a');
    a.href         = url;
    a.download     = `alquran-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') {
        showToast({ type: 'success', message: t('backup_exported'), duration: 2500 });
    }
}

// ── Import ──
function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const payload = JSON.parse(e.target.result);

            if (!payload.data || typeof payload.data !== 'object') {
                throw new Error(t('backup_invalid'));
            }

            const count = Object.keys(payload.data).length;
            const date  = payload.exportedAt
                ? new Date(payload.exportedAt).toLocaleDateString(getCurrentLang() === 'en' ? 'en-GB' : 'id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—';

            const confirmed = confirm(
                t('backup_confirm')
                    .replace('{date}', date)
                    .replace('{count}', count)
            );
            if (!confirmed) return;

            BACKUP_KEYS.forEach(key => {
                if (payload.data[key] !== undefined) {
                    localStorage.setItem(key, payload.data[key]);
                }
            });

            if (typeof showToast === 'function') {
                showToast({ type: 'success', message: t('backup_restored'), duration: 2500 });
            }

            setTimeout(() => window.location.reload(), 1500);

        } catch (err) {
            if (typeof showToast === 'function') {
                showToast({ type: 'error', message: t('backup_fail') + err.message, duration: 3500 });
            } else {
                alert(t('backup_fail') + err.message);
            }
        }
    };
    reader.readAsText(file);
}

// ── Init: wire ke tombol di settings panel ──
function initBackupPanel() {
    // Export button
    const exportBtn = document.getElementById('settings-export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportBackup);
    }

    // Import file input
    const fileInput = document.getElementById('settings-backup-file');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            importBackup(e.target.files[0]);
            // Reset input agar file yang sama bisa di-import lagi
            e.target.value = '';
        });
    }
}

function _buildDataSummary() {
    const items = [
        { key: 'quran_favorites',           icon: 'fa-star',                labelKey: 'backup_fav' },
        { key: 'quran_bookmarks',           icon: 'fa-bookmark',            labelKey: 'backup_bm_ayat' },
        { key: 'quran_bookmarks_hadist',    icon: 'fa-scroll',              labelKey: 'backup_bm_hadist' },
        { key: 'quran_last_read',           icon: 'fa-clock-rotate-left',   labelKey: 'backup_last_read' },
        { key: 'quran_reading_categories',  icon: 'fa-folder-open',         labelKey: 'backup_categories' },
        { key: 'quran_settings',            icon: 'fa-gear',                labelKey: 'backup_settings' },
        { key: 'quran_tajweed_enabled',     icon: 'fa-wand-magic-sparkles', labelKey: 'backup_tajweed' },
    ];

    return items.map(item => {
        const raw  = localStorage.getItem(item.key);
        let count  = '—';
        if (raw !== null) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) count = `${parsed.length} item`;
                else count = t('backup_saved');
            } catch { count = t('backup_saved'); }
        } else {
            count = t('backup_empty');
        }
        return `
            <div class="backup-what-row">
                <span class="backup-what-icon"><i class="fa-solid ${item.icon}"></i></span>
                <span class="backup-what-label">${t(item.labelKey)}</span>
                <span class="backup-what-count">${count}</span>
            </div>`;
    }).join('');
}
