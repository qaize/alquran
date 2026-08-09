/* toast.js — Toastify wrapper terpusat */
/* ──────────────────────────────────────────────
   TOAST HELPER — Toastify wrapper terpusat
   Tipe: 'success' | 'error' | 'info' | 'warning' | 'lastread' | 'bookmark' | 'favorite'
   ────────────────────────────────────────────── */
const TOAST_STYLES = {
    success:  { bg: 'linear-gradient(135deg, #1a6e3c, #27ae60)', icon: 'fa-circle-check'         },
    error:    { bg: 'linear-gradient(135deg, #7b1a1a, #c0392b)', icon: 'fa-circle-xmark'         },
    info:     { bg: 'linear-gradient(135deg, #0d2137, #1e4976)', icon: 'fa-circle-info'          },
    warning:  { bg: 'linear-gradient(135deg, #7a5200, #c9a84c)', icon: 'fa-triangle-exclamation' },
    lastread: { bg: 'linear-gradient(135deg, #0d2137, #163352)', icon: 'fa-clock-rotate-left'   },
    bookmark: { bg: 'linear-gradient(135deg, #0d2137, #1a4a6e)', icon: 'fa-bookmark'             },
    favorite: { bg: 'linear-gradient(135deg, #6b4200, #c9a84c)', icon: 'fa-star'                },
};

function showToast({ icon, label, message, type = 'info', duration = 3000 }) {
    if (typeof Toastify === 'undefined') return;

    const style  = TOAST_STYLES[type] || TOAST_STYLES.info;
    const faIcon = icon || style.icon;

    const node = document.createElement('div');
    node.className = 'tz-toast-inner';
    node.innerHTML = `
        <i class="fa-solid ${faIcon} tz-toast-icon"></i>
        <div class="tz-toast-body">
            ${label ? `<span class="tz-toast-label">${label}</span>` : ''}
            <span class="tz-toast-msg">${message}</span>
        </div>
    `;

    Toastify({
        node,
        duration,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: style.bg,
            border: '1.5px solid rgba(201,168,76,0.4)',
            borderRadius: '12px',
            padding: '10px 16px',
            boxShadow: '0 8px 28px rgba(13,33,55,0.35)',
            minWidth: '240px',
            maxWidth: '320px',
        },
        className: 'tz-toast',
        stopOnFocus: true,
    }).showToast();
}
