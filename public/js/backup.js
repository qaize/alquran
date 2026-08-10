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
        showToast({ type: 'success', message: 'Backup berhasil diunduh!', duration: 2500 });
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
                throw new Error('Format file tidak valid');
            }

            // Konfirmasi sebelum overwrite
            const count = Object.keys(payload.data).length;
            const date  = payload.exportedAt
                ? new Date(payload.exportedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—';

            const confirmed = confirm(
                `Import backup dari ${date}?\n\n` +
                `${count} data akan di-restore.\n` +
                `Data yang ada sekarang akan ditimpa.`
            );
            if (!confirmed) return;

            // Restore ke localStorage
            BACKUP_KEYS.forEach(key => {
                if (payload.data[key] !== undefined) {
                    localStorage.setItem(key, payload.data[key]);
                }
            });

            if (typeof showToast === 'function') {
                showToast({ type: 'success', message: 'Backup berhasil di-restore! Halaman akan dimuat ulang.', duration: 2500 });
            }

            // Reload setelah 1.5 detik agar toast sempat terlihat
            setTimeout(() => window.location.reload(), 1500);

        } catch (err) {
            if (typeof showToast === 'function') {
                showToast({ type: 'error', message: 'Gagal membaca file backup: ' + err.message, duration: 3500 });
            } else {
                alert('Gagal membaca file backup: ' + err.message);
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
        { key: 'quran_favorites',           icon: 'fa-star',                label: 'Favorit' },
        { key: 'quran_bookmarks',           icon: 'fa-bookmark',            label: 'Bookmark Ayat' },
        { key: 'quran_bookmarks_hadist',    icon: 'fa-scroll',              label: 'Bookmark Hadist' },
        { key: 'quran_last_read',           icon: 'fa-clock-rotate-left',   label: 'Terakhir Dibaca' },
        { key: 'quran_reading_categories',  icon: 'fa-folder-open',         label: 'Kategori Baca' },
        { key: 'quran_settings',            icon: 'fa-gear',                label: 'Pengaturan' },
        { key: 'quran_tajweed_enabled',     icon: 'fa-wand-magic-sparkles', label: 'Status Tajwid' },
    ];

    return items.map(item => {
        const raw  = localStorage.getItem(item.key);
        let count  = '—';
        if (raw !== null) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) count = `${parsed.length} item`;
                else count = 'Tersimpan';
            } catch { count = 'Tersimpan'; }
        } else {
            count = 'Kosong';
        }
        return `
            <div class="backup-what-row">
                <span class="backup-what-icon"><i class="fa-solid ${item.icon}"></i></span>
                <span class="backup-what-label">${item.label}</span>
                <span class="backup-what-count">${count}</span>
            </div>`;
    }).join('');
}
