/* audio.js — Audio murottal equran.id + mini player */

/* ──────────────────────────────────────────────
   AUDIO MUROTTAL — equran.id per ayat + mini player
   Qori keys: "01"=Al-Juhany "02"=Al-Qasim "03"=As-Sudais
              "04"=Al-Dossari "05"=Misyari "06"=Yasser
   ────────────────────────────────────────────── */

// Map qori setting value → equran.id audio key
const QORI_MAP = {
    '01': '01', 'ar.aljuhany':            '01',
    '02': '02', 'ar.alqasim':             '02',
    '03': '03', 'ar.abdurrahmaansudais':  '03',
    '04': '04', 'ar.aldossari':           '04',
    '05': '05', 'ar.alafasy':             '05',
    '06': '06', 'ar.yasserdosari':        '06',
};

const QORI_LABELS = {
    '01': 'Abdullah Al-Juhany',
    '02': 'Abdul Muhsin Al-Qasim',
    '03': 'Abdurrahman As-Sudais',
    '04': 'Ibrahim Al-Dossari',
    '05': 'Misyari Rasyid Al-Afasy',
    '06': 'Yasser Al-Dosari',
};

// Cache audio URLs per surah (sudah ada di surahDetailCache di script.js)
// Ambil dari data ayat yang sudah di-fetch

let __audioObj     = null;
let __audioAyat    = null; // { surah, ayat, btn }
let __audioPlaying = false;
let __audioData    = null; // array ayat dari surah aktif, berisi field .audio

function getQoriKey() {
    const setting = window.__activeQori || '05';
    return QORI_MAP[setting] || '05';
}

function getAudioUrlFromAyat(ayatData) {
    const key = getQoriKey();
    if (ayatData && ayatData.audio && ayatData.audio[key]) {
        return ayatData.audio[key];
    }
    return null;
}

/* ── Highlight ayat yang sedang diputar ── */
function highlightPlayingAyat(nomorAyat) {
    // Hapus highlight sebelumnya
    clearPlayingHighlight();

    const el = document.getElementById(`isi-ayat${nomorAyat}`);
    if (!el) return;

    el.classList.add('ayat-playing');

    // Auto-scroll ke ayat, dengan offset sedikit dari atas
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearPlayingHighlight() {
    document.querySelectorAll('.ayat-playing').forEach(el => {
        el.classList.remove('ayat-playing');
    });
}
function setActiveAyatData(ayatArray) {
    // Dipanggil dari loadSurahDetails setelah data ayat tersedia
    __audioData = ayatArray;
}

function getAyatData(nomorAyat) {
    if (!__audioData) return null;
    return __audioData.find(a => (a.nomorAyat ?? a.nomor) === nomorAyat) || null;
}

function playAyatAudio(nomorSurah, nomorAyat, btnEl) {
    // Toggle pause/resume jika ayat sama diklik lagi
    if (__audioObj && __audioAyat &&
        __audioAyat.surah === nomorSurah && __audioAyat.ayat === nomorAyat) {
        __audioPlaying ? __audioObj.pause() : __audioObj.play();
        return;
    }

    // Cari URL dari data ayat yang sudah di-cache
    const ayatData = getAyatData(nomorAyat);
    const url = ayatData ? getAudioUrlFromAyat(ayatData) : null;

    if (!url) {
        showToast({ type: 'error', message: t('audio_error') || 'URL audio tidak tersedia', duration: 2500 });
        return;
    }

    stopAudio();

    __audioObj    = new Audio(url);
    __audioObj.preload = 'auto';
    __audioAyat   = { surah: nomorSurah, ayat: nomorAyat, btn: btnEl };
    __audioPlaying = false;

    setAudioBtnState(btnEl, 'loading');
    showMiniPlayer(nomorSurah, nomorAyat);

    __audioObj.addEventListener('canplay', () => {
        __audioObj.play();
    });
    __audioObj.addEventListener('play', () => {
        __audioPlaying = true;
        setAudioBtnState(btnEl, 'playing');
        updateMiniPlayerState('playing');
        highlightPlayingAyat(nomorAyat);
        _updateMediaSession(nomorSurah, nomorAyat);
        _requestWakeLock();
    });
    __audioObj.addEventListener('pause', () => {
        __audioPlaying = false;
        setAudioBtnState(btnEl, 'paused');
        updateMiniPlayerState('paused');
        _releaseWakeLock();
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    });
    __audioObj.addEventListener('ended', () => {
        __audioPlaying = false;
        setAudioBtnState(btnEl, 'idle');
        updateMiniPlayerState('ended');
        clearPlayingHighlight();
        const playedDuration = __audioObj ? (__audioObj.duration || 0) : 0;
        if (typeof trackAudio === 'function' && playedDuration > 0) {
            trackAudio(playedDuration);
        }
        autoNextAyat(nomorSurah, nomorAyat);
    });
    __audioObj.addEventListener('error', (e) => {
        const err = __audioObj.error;
        if (err && (err.code === MediaError.MEDIA_ERR_DECODE ||
                    err.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED)) {
            setAudioBtnState(btnEl, 'idle');
            hideMiniPlayer();
            showToast({ type: 'error', message: t('audio_error') || 'Gagal memuat audio', duration: 3000 });
        }
        _releaseWakeLock();
    });
    __audioObj.addEventListener('timeupdate', () => {
        const bar = document.getElementById('mini-player-progress-bar');
        if (bar && __audioObj.duration) {
            bar.style.width = (__audioObj.currentTime / __audioObj.duration * 100) + '%';
        }
    });

    __audioObj.load();
}

/* ── Wake Lock: cegah layar/browser di-suspend saat audio jalan ── */
let __wakeLock = null;

async function _requestWakeLock() {
    // Screen Wake Lock API — cegah layar mati saat audio aktif
    if ('wakeLock' in navigator) {
        try {
            __wakeLock = await navigator.wakeLock.request('screen');
        } catch (e) {
            // Tidak semua browser/device support, abaikan error
        }
    }
}

function _releaseWakeLock() {
    if (__wakeLock) {
        __wakeLock.release().catch(() => {});
        __wakeLock = null;
    }
}

// Re-acquire wake lock kalau tab jadi visible lagi (user unlock layar)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && __audioPlaying) {
        _requestWakeLock();
    }
});

/* ── MediaSession API: kontrol audio di lock screen Android/iOS ── */
function _updateMediaSession(nomorSurah, nomorAyat) {
    if (!('mediaSession' in navigator)) return;

    const qoriKey   = getQoriKey();
    const qoriLabel = QORI_LABELS[qoriKey] || 'Qori';

    // Set metadata — muncul di lock screen dan notification
    navigator.mediaSession.metadata = new MediaMetadata({
        title:  `Surah ${nomorSurah} · Ayat ${nomorAyat}`,
        artist: qoriLabel,
        album:  'Al Quran Digital',
        artwork: [
            { src: '/img/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/img/quran.png',    sizes: '512x512', type: 'image/png' },
        ],
    });

    // Handler tombol di lock screen / headset
    navigator.mediaSession.setActionHandler('play', () => {
        if (__audioObj) __audioObj.play();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
        if (__audioObj) __audioObj.pause();
    });
    navigator.mediaSession.setActionHandler('stop', () => {
        stopAudio();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (!__audioAyat) return;
        const prev = __audioAyat.ayat - 1;
        if (prev < 1) return;
        const btn = document.getElementById(`audio-btn-${prev}`);
        if (btn) playAyatAudio(__audioAyat.surah, prev, btn);
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (!__audioAyat) return;
        const next = __audioAyat.ayat + 1;
        const btn  = document.getElementById(`audio-btn-${next}`);
        if (btn) playAyatAudio(__audioAyat.surah, next, btn);
    });

    navigator.mediaSession.playbackState = 'playing';
}

function isAutoPlay() {
    const s = getSettings();
    return s.autoPlay === true; // default false
}

function autoNextAyat(nomorSurah, nomorAyat) {
    if (!isAutoPlay()) {
        updateMiniPlayerState('ended');
        return;
    }
    const nextAyat = nomorAyat + 1;
    const nextBtn  = document.getElementById(`audio-btn-${nextAyat}`);

    if (!nextBtn && !__audioData) {
        hideMiniPlayer();
        return;
    }

    // Cek apakah ayat berikutnya ada di data (tidak perlu btn di DOM)
    const nextAyatData = getAyatData(nextAyat);
    if (!nextAyatData) {
        hideMiniPlayer();
        return;
    }

    // Langsung play tanpa setTimeout — setTimeout tidak reliable saat layar mati
    // Kalau btn tidak ada di DOM (layar mati), kita tetap bisa play via data langsung
    playAyatAudio(nomorSurah, nextAyat, nextBtn || null);
}

function stopAudio() {
    if (__audioObj) {
        __audioObj.pause();
        __audioObj.src = '';
        __audioObj = null;
    }
    if (__audioAyat && __audioAyat.btn) setAudioBtnState(__audioAyat.btn, 'idle');
    __audioAyat    = null;
    __audioPlaying = false;
    clearPlayingHighlight();
    hideMiniPlayer();
    _releaseWakeLock();

    // Clear MediaSession state
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.metadata = null;
        ['play','pause','stop','previoustrack','nexttrack'].forEach(action => {
            try { navigator.mediaSession.setActionHandler(action, null); } catch(e) {}
        });
    }
}

function setAudioBtnState(btn, state) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    btn.classList.remove('audio-loading', 'audio-playing', 'audio-paused');
    if (state === 'loading') { icon.className = 'fa-solid fa-spinner fa-spin'; btn.classList.add('audio-loading'); }
    if (state === 'playing') { icon.className = 'fa-solid fa-pause';           btn.classList.add('audio-playing'); }
    if (state === 'paused')  { icon.className = 'fa-solid fa-play';            btn.classList.add('audio-paused');  }
    if (state === 'idle')    { icon.className = 'fa-solid fa-play'; }
}

function showMiniPlayer(nomorSurah, nomorAyat) {
    let player = document.getElementById('mini-audio-player');
    if (!player) {
        player = document.createElement('div');
        player.id = 'mini-audio-player';
        player.className = 'mini-audio-player';
        player.innerHTML = `
            <div class="mini-player-drag-handle" id="mini-player-drag-handle"></div>
            <div class="mini-player-body">
                <div class="mini-player-info">
                    <i class="fa-solid fa-music mini-player-icon"></i>
                    <div class="mini-player-text">
                        <span class="mini-player-title" id="mini-player-title">—</span>
                        <span class="mini-player-qori"  id="mini-player-qori">—</span>
                    </div>
                </div>
                <div class="mini-player-controls">
                    <button class="mini-player-btn" id="mini-player-prev">
                        <i class="fa-solid fa-backward-step"></i>
                    </button>
                    <button class="mini-player-btn mini-player-playpause" id="mini-player-playpause">
                        <i class="fa-solid fa-pause"></i>
                    </button>
                    <button class="mini-player-btn" id="mini-player-next">
                        <i class="fa-solid fa-forward-step"></i>
                    </button>
                    <button class="mini-player-btn mini-player-autoplay" id="mini-player-autoplay"
                        title="Auto-play">
                        <i class="fa-solid fa-list"></i>
                    </button>
                    <button class="mini-player-btn mini-player-stop" id="mini-player-stop">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div class="mini-player-progress">
                <div class="mini-player-bar" id="mini-player-progress-bar"></div>
            </div>
        `;
        document.body.appendChild(player);

        document.getElementById('mini-player-playpause').addEventListener('click', () => {
            if (!__audioObj) return;
            __audioPlaying ? __audioObj.pause() : __audioObj.play();
        });
        document.getElementById('mini-player-stop').addEventListener('click', stopAudio);
        document.getElementById('mini-player-autoplay').addEventListener('click', () => {
            const cur = getSettings();
            cur.autoPlay = !cur.autoPlay;
            saveSettings(cur);
            updateAutoPlayBtn();
        });
        document.getElementById('mini-player-prev').addEventListener('click', () => {
            if (!__audioAyat) return;
            const prev = __audioAyat.ayat - 1;
            const btn  = document.getElementById(`audio-btn-${prev}`);
            if (btn) playAyatAudio(__audioAyat.surah, prev, btn);
        });
        document.getElementById('mini-player-next').addEventListener('click', () => {
            if (!__audioAyat) return;
            const next = __audioAyat.ayat + 1;
            const btn  = document.getElementById(`audio-btn-${next}`);
            if (btn) playAyatAudio(__audioAyat.surah, next, btn);
        });

        // ── Drag to float ──
        initMiniPlayerDrag(player);
    }

    const key = getQoriKey();
    document.getElementById('mini-player-title').textContent =
        `${t('surah_word') || 'Surah'} ${nomorSurah} · ${t('ayat_ref') || 'Ayat'} ${nomorAyat}`;
    document.getElementById('mini-player-qori').textContent  = QORI_LABELS[key] || key;
    document.getElementById('mini-player-progress-bar').style.width = '0%';

    updateAutoPlayBtn();
    requestAnimationFrame(() => player.classList.add('visible'));
}

function initMiniPlayerDrag(player) {
    const handle = document.getElementById('mini-player-drag-handle');
    if (!handle) return;

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    function onStart(e) {
        // Jika belum floating, convert ke floating dulu
        if (!player.classList.contains('floating')) {
            const rect = player.getBoundingClientRect();
            player.style.left   = rect.left + 'px';
            player.style.top    = rect.top  + 'px';
            player.style.width  = rect.width + 'px';
            player.classList.add('floating');
        }

        isDragging = true;
        player.classList.add('dragging');

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startX    = clientX;
        startY    = clientY;
        startLeft = parseInt(player.style.left) || 0;
        startTop  = parseInt(player.style.top)  || 0;

        e.preventDefault();
    }

    function onMove(e) {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        let newLeft = startLeft + (clientX - startX);
        let newTop  = startTop  + (clientY - startY);

        // Clamp agar tidak keluar viewport
        const pw = player.offsetWidth;
        const ph = player.offsetHeight;
        newLeft = Math.max(0, Math.min(window.innerWidth  - pw, newLeft));
        newTop  = Math.max(0, Math.min(window.innerHeight - ph, newTop));

        player.style.left = newLeft + 'px';
        player.style.top  = newTop  + 'px';
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        player.classList.remove('dragging');
    }

    handle.addEventListener('mousedown',  onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup',   onEnd);
    document.addEventListener('touchend',  onEnd);
}

function updateAutoPlayBtn() {
    const btn = document.getElementById('mini-player-autoplay');
    if (!btn) return;
    const on = isAutoPlay();
    btn.classList.toggle('autoplay-active', on);
    btn.title = on
        ? (t('autoplay_on')  || 'Auto-play: Aktif')
        : (t('autoplay_off') || 'Auto-play: Nonaktif');
}

function hideMiniPlayer() {
    const player = document.getElementById('mini-audio-player');
    if (player) player.classList.remove('visible');
}

function updateMiniPlayerState(state) {
    const ppBtn = document.getElementById('mini-player-playpause');
    if (!ppBtn) return;
    const icon = ppBtn.querySelector('i');
    if (state === 'playing') icon.className = 'fa-solid fa-pause';
    if (state === 'paused')  icon.className = 'fa-solid fa-play';
    if (state === 'ended')   icon.className = 'fa-solid fa-play';
}

document.addEventListener('ayat-rendered', () => stopAudio());