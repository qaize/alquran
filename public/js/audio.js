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
    });
    __audioObj.addEventListener('pause', () => {
        __audioPlaying = false;
        setAudioBtnState(btnEl, 'paused');
        updateMiniPlayerState('paused');
        // Tetap tampilkan highlight saat pause (biar user tahu posisi)
    });
    __audioObj.addEventListener('ended', () => {
        __audioPlaying = false;
        setAudioBtnState(btnEl, 'idle');
        updateMiniPlayerState('ended');
        clearPlayingHighlight();
        // Capture durasi sebelum __audioObj di-null-kan oleh stopAudio/autoNextAyat
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
    });
    __audioObj.addEventListener('timeupdate', () => {
        const bar = document.getElementById('mini-player-progress-bar');
        if (bar && __audioObj.duration) {
            bar.style.width = (__audioObj.currentTime / __audioObj.duration * 100) + '%';
        }
    });

    __audioObj.load();
}

function isAutoPlay() {
    const s = getSettings();
    return s.autoPlay === true; // default false
}

function autoNextAyat(nomorSurah, nomorAyat) {
    if (!isAutoPlay()) {
        // Tidak auto-play — update state tombol jadi play, tapi tetap tampilkan player
        updateMiniPlayerState('ended');
        return;
    }
    const nextBtn = document.getElementById(`audio-btn-${nomorAyat + 1}`);
    if (nextBtn) {
        setTimeout(() => playAyatAudio(nomorSurah, nomorAyat + 1, nextBtn), 400);
    } else {
        hideMiniPlayer();
    }
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
            <div class="mini-player-progress"><div class="mini-player-bar" id="mini-player-progress-bar"></div></div>
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
    }

    const key = getQoriKey();
    document.getElementById('mini-player-title').textContent =
        `${t('surah_word') || 'Surah'} ${nomorSurah} · ${t('ayat_ref') || 'Ayat'} ${nomorAyat}`;
    document.getElementById('mini-player-qori').textContent  = QORI_LABELS[key] || key;
    document.getElementById('mini-player-progress-bar').style.width = '0%';

    updateAutoPlayBtn();
    requestAnimationFrame(() => player.classList.add('visible'));
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