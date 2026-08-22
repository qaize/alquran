// -- NProgress config --
if (typeof NProgress !== 'undefined') {
    NProgress.configure({
        minimum: 0.15,
        speed: 300,
        trickleSpeed: 200,
        showSpinner: false,
    });
}

// Helper wrapper: start + done NProgress
function npStart() { if (typeof NProgress !== 'undefined') NProgress.start(); }
function npDone()  { if (typeof NProgress !== 'undefined') NProgress.done();  }

const mainBody = document.getElementById("main-body");
const surahDetail = document.getElementById("surah_detail");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const pagination = document.getElementById("pagination");
const titleSurah = document.getElementById("title-detail-surah");

let partialSurah = [];
let allDataSurahPromise = null;
let isDataLoaded = false;
let searchSurah = "";
// Cache raw list surah (tanpa filter) agar tidak re-fetch saat search berubah
let rawSurahListCache = null;

let nomorSurah = 0;

const offset = 12;
let page = 1;
let totalPage = 0;
let currentIndex = 0;
let overflow = 0;
let totalData = page * offset;

// Helper: ambil terjemahan dari sistem i18n (_script.blade.php)
// Fallback ke string Indonesia jika t() belum tersedia
function __(key, fallback) {
    return typeof t === "function" ? t(key) : fallback;
}

function Surah(nomor, nama_latin, arti, nama, tempatTurun, jumlahAyat) {
    this.nomor = nomor;
    this.nama_latin = nama_latin;
    this.arti = arti;
    this.nama = nama || '';
    this.tempatTurun = tempatTurun || '';
    this.jumlahAyat = jumlahAyat || 0;
}

// -- Debounce helper --
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// -- Trigger search: hanya dipanggil dari tombol Cari atau Enter --
function triggerSearch(query) {
    closeSuggestion();
    searchSurah = (query !== undefined ? query : searchInput.value).trim();
    searchInput.value = searchSurah;
    page = 1;
    currentIndex = 0;
    mainBody.innerHTML = "";
    updateClearButton();
    loadPagingSurah(currentIndex, page * offset);
}

// -- Clear button --
const clearButton = document.getElementById("search-clear");
function updateClearButton() {
    if (clearButton) {
        clearButton.style.display = searchInput.value.length > 0 ? "flex" : "none";
    }
}

if (clearButton) {
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        updateClearButton();
        closeSuggestion();
        triggerSearch("");
        searchInput.focus();
    });
}

// -- Tombol Cari --
searchButton.addEventListener("click", () => triggerSearch());

// -- Enter langsung cari --
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const active = suggestionEl.querySelector(".suggestion-item.active");
        if (active) {
            triggerSearch(active.dataset.value);
        } else {
            triggerSearch();
        }
        return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); moveSuggestion(1);  return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); moveSuggestion(-1); return; }
    if (e.key === "Escape")    { closeSuggestion(); return; }
});

// Update clear button realtime tanpa debounce
searchInput.addEventListener("input", updateClearButton);

/*  ---------------------------------------------
    DROPDOWN SUGGESTION  (debounce 300ms, client-side filter dari cache)
    --------------------------------------------- */
const suggestionEl = document.getElementById("search-suggestion");

function renderSuggestion(items) {
    suggestionEl.innerHTML = "";
    if (!items.length) { closeSuggestion(); return; }

    // Header: jumlah hasil
    const header = document.createElement("div");
    header.className = "suggestion-header";
    header.innerHTML = `<span class="sug-count">${items.length > 8 ? '8+' : items.length}</span> hasil`;
    suggestionEl.appendChild(header);

    items.forEach((s) => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.dataset.value = s.namaLatin;

        const q = searchInput.value.trim();
        item.innerHTML = `
            <span class="sug-nomor">${s.nomor}</span>
            <span class="sug-body">
                <span class="sug-name">${highlightMatch(s.namaLatin, q)}</span>
                <span class="sug-arti">${highlightMatch(s.arti, q)}</span>
            </span>
            <span class="sug-arab">${s.nama}</span>
        `;

        item.addEventListener("mousedown", (e) => {
            // mousedown sebelum blur agar tidak close duluan
            e.preventDefault();
            triggerSearch(s.namaLatin);
        });

        suggestionEl.appendChild(item);
    });

    suggestionEl.classList.add("open");
}

function closeSuggestion() {
    suggestionEl.classList.remove("open");
    suggestionEl.innerHTML = "";
}

function moveSuggestion(dir) {
    const items = Array.from(suggestionEl.querySelectorAll(".suggestion-item"));
    if (!items.length) return;
    const cur = suggestionEl.querySelector(".suggestion-item.active");
    let idx = cur ? items.indexOf(cur) + dir : (dir === 1 ? 0 : items.length - 1);
    idx = (idx + items.length) % items.length;
    items.forEach(i => i.classList.remove("active"));
    items[idx].classList.add("active");
    items[idx].scrollIntoView({ block: "nearest" });
    // Preview teks di input (tidak trigger search)
    searchInput.value = items[idx].dataset.value;
    updateClearButton();
}

const showSuggestions = debounce((q) => {
    if (!q || q.length < 1) { closeSuggestion(); return; }

    const getList = rawSurahListCache
        ? Promise.resolve(rawSurahListCache)
        : fetch("https://equran.id/api/v2/surat")
            .then(r => r.json())
            .then(r => {
                rawSurahListCache = Array.isArray(r) ? r : r.data;
                isDataLoaded = true;
                return rawSurahListCache;
            });

    getList.then((list) => {
        const lower = q.toLowerCase();
        const matches = list
            .filter(s =>
                s.namaLatin.toLowerCase().includes(lower) ||
                s.arti.toLowerCase().includes(lower) ||
                String(s.nomor) === q
            )
            .slice(0, 8); // max 8 item di dropdown
        renderSuggestion(matches);
    });
}, 300);

searchInput.addEventListener("input", (e) => {
    showSuggestions(e.target.value.trim());
});

searchInput.addEventListener("focus", (e) => {
    if (e.target.value.trim()) showSuggestions(e.target.value.trim());
});

// Tutup saat klik di luar
document.addEventListener("mousedown", (e) => {
    const container = document.querySelector(".search-container");
    if (container && !container.contains(e.target)) {
        closeSuggestion();
    }
});

prevButton.addEventListener("click", () => {
    if (page > 1) {
        page--;
        currentIndex = currentIndex - offset;
    }
    loadPagingSurah(currentIndex, page * offset);
});

nextButton.addEventListener("click", () => {
    if (totalPage > page) {
        page++;
        currentIndex = currentIndex + offset;
        loadPagingSurah(currentIndex, page * offset);
    }
    if (totalPage == page) {
        loadPagingSurah(currentIndex, currentIndex + overflow);
    }
});

/*
    Halaman Utama
*/

// -- Filter & map helper (single source of truth) --
function filterAndMapSurah(list) {
    const q = searchSurah.toLowerCase();
    return list
        .filter((el) => {
            if (!q) return true;
            return (
                el.namaLatin.toLowerCase().includes(q) ||
                el.arti.toLowerCase().includes(q) ||
                String(el.nomor) === q
            );
        })
        .map((el) => new Surah(el.nomor, el.namaLatin, el.arti, el.nama, el.tempatTurun, el.jumlahAyat));
}

// fetch semua surah atau cari
function loadAllSurah() {
    const urlAllSurah = "https://equran.id/api/v2/surat";

    // Cache sudah ada � filter langsung, tidak re-fetch
    if (rawSurahListCache !== null) {
        return Promise.resolve(filterAndMapSurah(rawSurahListCache));
    }

    // Deduplication: gunakan satu promise in-flight
    if (!allDataSurahPromise) {
        allDataSurahPromise = fetch(urlAllSurah)
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuat data surah: ' + response.status);
                return response.json();
            })
            .then(responses => {
                rawSurahListCache = Array.isArray(responses) ? responses : responses.data;
                isDataLoaded = true;
                if (typeof trackApiCall === 'function') trackApiCall('surat_list');
                return filterAndMapSurah(rawSurahListCache);
            })
            .finally(() => {
                allDataSurahPromise = null;
            });
    }
    return allDataSurahPromise;
}

// -- Highlight teks yang match query pencarian --
function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// counter untuk stagger animasi kartu
let _cardAnimIndex = 0;

// kartu surah
function surahCard(surah) {
    const card = document.createElement("div");
    card.classList.add("surah-card");

    // Animate.css � fadeInUp dengan stagger delay
    card.classList.add("animate__animated", "animate__fadeInUp");
    const delay = Math.min(_cardAnimIndex * 50, 400); // max 400ms agar tidak terlalu lama
    card.style.animationDelay = delay + "ms";
    card.style.animationDuration = "0.4s";
    _cardAnimIndex++;

    const favClass =
        (typeof isFavorite === 'function' && isFavorite(surah.nomor))
            ? "favorited"
            : "";
    const favTitle = favClass
        ? __("remove_favorite", "Hapus dari favorit")
        : __("add_favorite", "Tambah ke favorit");

    card.innerHTML = `
  <div class="card-nomor">${numberToArabic(surah.nomor)}</div>
  <div class="card-info">
    <h3 class="card-name">${highlightMatch(surah.nama_latin, searchSurah)}</h3>
    <p class="card-arti">${highlightMatch(surah.arti, searchSurah)}</p>
    <span class="card-meta"><i class="fa-solid fa-location-dot"></i> ${surah.tempatTurun} &bull; ${surah.jumlahAyat} ayat</span>
  </div>
  <div class="card-arab">${surah.nama}</div>
  <div class="card-actions">
    <button id="star-${surah.nomor}" class="btn-star ${favClass}" title="${favTitle}">
      <i class="fa-solid fa-star"></i>
    </button>
  </div>
  `;

    // Bind star button via addEventListener � tidak pakai inline onclick
    const starBtn = card.querySelector(`#star-${surah.nomor}`);
    if (starBtn) {
        starBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(surah.nomor, surah.nama_latin, surah.arti);
        });
    }

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        loadSurahDetails(surah.nomor);
    });
    return card;
}

// muat daftar surah dengan paginasi
function loadPagingSurah(currentIndex, totalData) {
    _cardAnimIndex = 0; // reset stagger setiap load halaman baru
    npStart();
    showLoadingScreen();
    loadAllSurah()
        .then((allData) => {
            npDone();
            hideLoadingScreen();
            titleSurah.innerHTML = "";
            mainBody.innerHTML = "";


            // Tampilkan kembali widget hadist harian
            const hdWidget = document.getElementById('hadist-daily-widget');
            if (hdWidget) hdWidget.style.display = '';
            const data = allData;
            totalPage = Math.ceil(data.length / offset);
            overflow = data.length % offset;

            if (totalPage > 1) {
                pagination.style.display = "block";
            } else {
                pagination.style.display = "none";
            }

            if (totalPage == page) {
                nextButton.style.display = "none";
            } else {
                nextButton.style.display = "inline-block";
            }

            if (page > 1) {
                prevButton.style.display = "inline-block";
            } else {
                prevButton.style.display = "none";
            }

            if (data.length == 1) {
                loadSurahDetails(data[0].nomor);
            } else if (data.length == 0) {
                const notFound = document.createElement("h1");
                notFound.classList.add("data-empty");
                notFound.innerHTML = __(
                    "data_not_found",
                    "Data tidak ditemukan",
                );
                mainBody.appendChild(notFound);
            } else {
                for (
                    currentIndex - 1;
                    currentIndex < totalData;
                    currentIndex++
                ) {
                    if (typeof data[currentIndex] === "undefined") {
                        break;
                    }
                    mainBody.appendChild(surahCard(data[currentIndex]));
                }

                if (typeof isFavorite === "function") {
                    data.forEach((surah) => {
                        if (isFavorite(surah.nomor)) {
                            const starBtn = document.getElementById(
                                `star-${surah.nomor}`,
                            );
                            if (starBtn) {
                                starBtn.classList.add("favorited");
                                starBtn.title = __(
                                    "remove_favorite",
                                    "Hapus dari favorit",
                                );
                            }
                        }
                    });
                }
            }
        })
        .catch((error) => {
            npDone();
            console.error(error);
        });
}

// inisiasi halaman utama
// Set initial history state agar back dari detail bisa kembali ke list
history.replaceState({ view: 'list' }, '', window.location.href);
loadPagingSurah(currentIndex, totalData);
// ── Klik logo (desktop sidebar & mobile topbar) → kembali ke menu utama ──
function goHome() {
    searchSurah = "";
    searchInput.value = "";
    updateClearButton();
    page = 1;
    currentIndex = 0;
    titleSurah.innerHTML = "";
    mainBody.innerHTML = "";
    pagination.style.display = "block";
    _titleNavCollapsed = true;
    history.pushState({ view: 'list' }, '', window.location.pathname);
    loadPagingSurah(currentIndex, page * offset);
}

document.getElementById('sidebar-logo')?.addEventListener('click', goHome);
document.getElementById('mobile-logo')?.addEventListener('click', goHome);

// -- Handle tombol Back browser --
window.addEventListener('popstate', (e) => {
    const state = e.state;
    if (!state || state.view === 'list') {
        // Kembali ke halaman list
        searchSurah = "";
        searchInput.value = "";
        updateClearButton();
        page = 1;
        currentIndex = 0;
        titleSurah.innerHTML = "";
        mainBody.innerHTML = "";

        pagination.style.display = "block";
        _titleNavCollapsed = true; // reset state navigasi saat kembali ke list
        loadPagingSurah(currentIndex, page * offset);
    } else if (state.view === 'detail' && state.nomor) {
        // Navigasi antar surah via back/forward
        loadSurahDetails(state.nomor, false);
    }
});

/*
    Detail Surah
*/

// cache detail surah di memori
const surahDetailCache = new Map();

// ambil detail surah dari API dengan cache
function fetchDetailInformasiSurah(nomor) {
    if (surahDetailCache.has(nomor)) {
        return Promise.resolve(surahDetailCache.get(nomor));
    }
    return new Promise((resolve, reject) => {
        fetch(`https://equran.id/api/v2/surat/${nomor}`)
            .then((response) => response.json())
            .then((response) => {
                const data =
                    response.data !== undefined ? response.data : response;
                surahDetailCache.set(nomor, data);
                if (typeof trackApiCall === 'function') trackApiCall('surat_detail');
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// tampilkan detail surah
function loadSurahDetails(nomorSurah, pushHistory = true) {
    // Dismiss keyboard mobile — blur semua input aktif
    if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
    }
    // Simpan state ke browser history agar tombol Back bekerja
    if (pushHistory) {
        history.pushState({ view: 'detail', nomor: nomorSurah }, '', `#surah-${nomorSurah}`);
    }
    npStart();
    fetchDetailInformasiSurah(nomorSurah)
        .then((data) => {
            titleSurah.innerHTML = "";


            // Sembunyikan widget hadist harian saat baca surah
            const hdWidget = document.getElementById('hadist-daily-widget');
            if (hdWidget) hdWidget.style.display = 'none';

            titleSurah.appendChild(componentTitleSurah(data));

            // -- Sync tombol terjemahan di navbar --
            const transToggleBtn = document.getElementById('surah-trans-toggle');
            if (transToggleBtn) {
                transToggleBtn.addEventListener('click', () => {
                    const cur = typeof getSettings === 'function' ? getSettings() : {};
                    cur.showTranslation = !(cur.showTranslation !== false);
                    if (typeof saveSettings === 'function') saveSettings(cur);
                    if (typeof applySettings === 'function') applySettings(cur);

                    // Update tampilan tombol
                    const isOn = cur.showTranslation;
                    transToggleBtn.classList.toggle('active', isOn);
                    transToggleBtn.querySelector('i').className = `fa-solid ${isOn ? 'fa-eye' : 'fa-eye-slash'}`;
                    transToggleBtn.querySelector('span').textContent = isOn
                        ? __('trans_visible', 'Terjemahan')
                        : __('trans_hidden', 'Terjemahan');

                    // Sync dengan toggle di settings panel
                    const settingsToggle = document.getElementById('show-translation-toggle');
                    if (settingsToggle) settingsToggle.checked = isOn;
                });
            }

            const nextSurah = document.getElementById("surah-next");
            const prevSurah = document.getElementById("surah-prev");

            const suratSebelumnya = data.suratSebelumnya;
            const suratSelanjutnya = data.suratSelanjutnya;

            if (!suratSebelumnya || nomorSurah == 1) {
                prevSurah.style.display = "none";
            } else {
                prevSurah.style.display = "inline-block";
            }
            if (!suratSelanjutnya || nomorSurah == 114) {
                nextSurah.style.display = "none";
            } else {
                nextSurah.style.display = "inline-block";
            }

            prevSurah.addEventListener("click", () => {
                const prevNomor = suratSebelumnya
                    ? suratSebelumnya.nomor
                    : nomorSurah - 1;
                loadSurahDetails(prevNomor);
            });
            nextSurah.addEventListener("click", () => {
                const nextNomor = suratSelanjutnya
                    ? suratSelanjutnya.nomor
                    : nomorSurah + 1;
                loadSurahDetails(nextNomor);
            });

            mainBody.innerHTML = "";

            componentDetailSurah(data).then((surah) => {
                mainBody.appendChild(surah);

                // Expose ayat data (dengan field .audio) ke audio module
                if (typeof setActiveAyatData === 'function') {
                    setActiveAyatData(data.ayat);
                }

                document.dispatchEvent(
                    new CustomEvent("ayat-rendered", {
                        detail: { nomorSurah: data.nomor },
                    }),
                );

                data.ayat.forEach((ayat) => {
                    const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
                    const el = document.getElementById(`isi-ayat${nomorAyat}`);
                    if (!el) return;

                    // Desktop: double click
                    el.addEventListener("dblclick", () => {
                        if (typeof saveToCategory === "function") {
                            saveToCategory(
                                "default",
                                nomorSurah,
                                data.namaLatin ?? data.nama_latin,
                                nomorAyat,
                            );
                        }
                        el.classList.add('ayat-jump-highlight');
                        setTimeout(() => el.classList.remove('ayat-jump-highlight'), 2000);
                    });

                    // Mobile: long press 2 detik
                    let _pressTimer = null;
                    let _pressStarted = false;

                    el.addEventListener("touchstart", (e) => {
                        _pressStarted = true;
                        el.classList.add('ayat-longpress-pending');
                        _pressTimer = setTimeout(() => {
                            if (!_pressStarted) return;
                            el.classList.remove('ayat-longpress-pending');
                            el.classList.add('ayat-jump-highlight');
                            setTimeout(() => el.classList.remove('ayat-jump-highlight'), 2000);
                            if (typeof showSaveLastReadSlide === "function") {
                                showSaveLastReadSlide(
                                    nomorSurah,
                                    data.namaLatin ?? data.nama_latin,
                                    nomorAyat,
                                );
                            }
                        }, 2000);
                    }, { passive: true });

                    const cancelPress = () => {
                        _pressStarted = false;
                        clearTimeout(_pressTimer);
                        el.classList.remove('ayat-longpress-pending');
                    };
                    el.addEventListener("touchend",    cancelPress, { passive: true });
                    el.addEventListener("touchmove",   cancelPress, { passive: true });
                    el.addEventListener("touchcancel", cancelPress, { passive: true });
                });

                const hideDetailButton =
                    document.getElementById("hide-detail-button");
                const showAllTerjemah = document.getElementById(
                    "show-all-terjemahan-button",
                );
                const surahInformation = document.querySelector(".detail");
                const ayatContainer = document.querySelector(".ayat");

                ayatContainer.classList.add("ayat-fullwidth");
                const detailSurahEl = ayatContainer.closest(".detailSurah");
                if (detailSurahEl)
                    detailSurahEl.classList.add("fullwidth-mode");

                let showDetail = false;
                if (hideDetailButton) {
                    hideDetailButton.addEventListener("click", () => {
                        if (showDetail) {
                            hideDetailButton.innerHTML = `<span> >> </span>`;
                            surahInformation.style.display = "none";
                            ayatContainer.classList.add("ayat-fullwidth");
                            if (detailSurahEl)
                                detailSurahEl.classList.add("fullwidth-mode");
                            showDetail = false;
                        } else {
                            hideDetailButton.innerHTML = `<span> << </span>`;
                            ayatContainer.classList.remove("ayat-fullwidth");
                            if (detailSurahEl)
                                detailSurahEl.classList.remove(
                                    "fullwidth-mode",
                                );
                            surahInformation.style.display = "block";
                            showDetail = true;
                        }
                    });
                }

                initiateTerjemah(data.ayat, data.nomor, data.namaLatin ?? data.nama_latin);

                // Query scroll-input fresh setelah DOM siap
                const jumpInput = document.getElementById("scroll-input");
                if (jumpInput) {
                    const totalAyat = data.ayat.length;
                    jumpInput.max         = totalAyat;
                    jumpInput.value       = "";
                    jumpInput.placeholder = `1 - ${totalAyat}`;

                    // Clone ? hapus listener lama yang menumpuk tiap buka surah
                    const freshInput = jumpInput.cloneNode(true);
                    jumpInput.parentNode.replaceChild(freshInput, jumpInput);

                    freshInput.addEventListener("keydown", (e) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        const nomorAyat = parseInt(freshInput.value);
                        if (!nomorAyat || nomorAyat < 1 || nomorAyat > totalAyat) {
                            if (typeof showToast === 'function') {
                                showToast({ type: 'warning', message: __('ayat_not_found', 'Nomor ayat tidak tersedia!'), duration: 2500 });
                            }
                            return;
                        }
                        const el = document.getElementById(`isi-ayat${nomorAyat}`);
                        if (!el) return;
                        // Langsung scroll
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Smooth pulse highlight
                        el.classList.add('ayat-jump-highlight');
                        setTimeout(() => el.classList.remove('ayat-jump-highlight'), 2000);
                        // Toast kecil
                        if (typeof showToast === 'function') {
                            showToast({
                                type: 'info',
                                icon: 'fa-arrow-down',
                                label: null,
                                message: `${__('ayat_ref','Ayat')} ${nomorAyat}`,
                                duration: 1800,
                            });
                        }
                    });
                }


            });

            pagination.style.display = "none";
            npDone();
        })
        .catch((error) => {
            npDone();
            console.error(error);
        });
}

// -- State collapse nav surah � persisten antar navigasi --
let _titleNavCollapsed = true;
let _titleNavHintShown = false; // hint hanya muncul sekali

// komponen judul surah
function componentTitleSurah(surah) {
    const title = document.createElement("div");
    title.classList.add("title-Surah");

    title.innerHTML = `
    <div class="title-surah-header">
        <div class="title-surah-header-inner">
            <span class="title-surah-name">${surah.namaLatin ?? surah.nama_latin}</span>
            <span class="title-surah-arab">${surah.nama}</span>
        </div>
        <button class="title-surah-collapse-btn" id="title-collapse-btn" title="Sembunyikan">
            <i class="fa-solid fa-chevron-up"></i>
        </button>
    </div>
    <div class="title-surah-body" id="title-surah-body">
        <p class="title-surah-arti">${surah.arti}</p>
        <div class="scroll-navigation">
          <button id="surah-prev"><i class="fa-solid fa-chevron-left"></i> ${__("prev_surah", "Sebelumnya")}</button>
          <div class="jump-group">
            <label for="scroll-input">${__("jump_to_ayat", "Lompat ke:")}</label>
            <input id="scroll-input" maxlength="3" type="number">
          </div>
          <button id="surah-next">${__("next_surah", "Selanjutnya")} <i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div class="surah-trans-toggle-wrap">
          <button id="surah-trans-toggle" class="surah-trans-btn ${window.__showTranslation !== false ? 'active' : ''}">
            <i class="fa-solid ${window.__showTranslation !== false ? 'fa-eye' : 'fa-eye-slash'}"></i>
            <span>${window.__showTranslation !== false ? __('trans_visible','Terjemahan') : __('trans_hidden','Terjemahan')}</span>
          </button>
        </div>
    </div>
    `;

    // Collapse/expand logic
    const collapseBtn = title.querySelector('#title-collapse-btn');
    const body        = title.querySelector('#title-surah-body');

    // -- Terapkan state sebelumnya (collapsed/expanded) --
    console.log('[TitleNav] _titleNavCollapsed =', _titleNavCollapsed);
    if (_titleNavCollapsed) {
        body.classList.add('collapsed');
        body.style.maxHeight = '0px';
        collapseBtn.classList.add('is-collapsed');
        collapseBtn.title = 'Tampilkan detail';
    } else {
        // Paksa expanded tanpa animasi: matikan transition sementara
        body.style.transition = 'none';
        body.classList.remove('collapsed');
        body.style.maxHeight = 'none';
        collapseBtn.classList.remove('is-collapsed');
        collapseBtn.title = 'Sembunyikan detail';
        // Kembalikan transition setelah paint
        requestAnimationFrame(() => {
            body.style.transition = '';
        });
    }

    // -- Tooltip hint: hanya tampil sekali (pertama kali collapsed) --
    if (_titleNavCollapsed && !_titleNavHintShown) {
        _titleNavHintShown = true;
        const hint = document.createElement('div');
        hint.className = 'title-collapse-hint';
        hint.textContent = 'Tap untuk buka detail';
        collapseBtn.appendChild(hint);

        setTimeout(() => hint.classList.add('hint-show'), 800);
        setTimeout(() => {
            hint.classList.remove('hint-show');
            setTimeout(() => hint.remove(), 400);
        }, 3500);
    }

    collapseBtn.addEventListener('click', () => {
        // Hapus hint kalau masih ada saat diklik
        collapseBtn.querySelector('.title-collapse-hint')?.remove();

        const isCollapsed = body.classList.contains('collapsed');
        if (isCollapsed) {
            body.classList.remove('collapsed');
            body.style.maxHeight = '600px';
            body.addEventListener('transitionend', () => {
                if (!body.classList.contains('collapsed')) {
                    body.style.maxHeight = 'none';
                }
            }, { once: true });
            collapseBtn.classList.remove('is-collapsed');
            collapseBtn.title = 'Sembunyikan detail';
            _titleNavCollapsed = false; // simpan state: expanded
        } else {
            body.style.maxHeight = body.scrollHeight + 'px';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    body.classList.add('collapsed');
                    body.style.maxHeight = '0px';
                });
            });
            collapseBtn.classList.add('is-collapsed');
            collapseBtn.title = 'Tampilkan detail';
            _titleNavCollapsed = true; // simpan state: collapsed
        }
    });

    return title;
}

// komponen detail surah
function componentDetailSurah(surah) {
    return new Promise((resolve, reject) => {
        const detailSurah = document.createElement("div");
        detailSurah.classList.add("detailSurah");

        detailSurah.innerHTML = `
    <div class="detail" style="display:none;">
        <p>${__("total_ayat", "Jumlah Ayat:")} ${surah.jumlahAyat ?? surah.jumlah_ayat}</p>
        <p>${__("place_revealed", "Tempat Turun:")} ${surah.tempatTurun ?? surah.tempat_turun}</p>
        <div class="deskripsi">
            <label>${__("description", "Deskripsi:")}</label>
            <p id="label${surah.nomor}">${surah.deskripsi}</p>
        </div>
    </div>
    <div class="hide-detail" style="display:none;">
        <a id="hide-detail-button"><span><<</span></a>
        <a id="show-all-terjemahan-button"><i class="fa-solid fa-eye"></i></a>
    </div>
    `;

        const ayat = document.createElement("div");
        ayat.classList.add("ayat");

        // Bismillah ornament � tampil di atas ayat pertama (kecuali At-Taubah nomor 9)
        let isiAyat = surah.nomor !== 9 ? `
        <div class="ayat-bismillah">
            <span class="ayat-bsm-line"></span>
            <span class="ayat-bsm-text">&#xFDFD;</span>
            <span class="ayat-bsm-line"></span>
        </div>` : '';
        surah.ayat.forEach((ayat) => {
            const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
            const teksArab = ayat.teksArab ?? ayat.ar;
            isiAyat += `
        <div class="barisSurah">
        <div id="isi-ayat${nomorAyat}" class="isi-ayat" data-surah="${surah.nomor}" data-ayat="${nomorAyat}">
            <div class="ayat-nav">
                <span class="arabic">${teksArab}</span>
                <span class="ayat-nomor-inline">
                    <div class="urutan-ayat"><span>${numberToArabic(nomorAyat)}</span></div>
                </span>
            </div>
        </div>
        </div>
        `;
        });

        ayat.innerHTML = isiAyat;

        // -- Bind event listeners dilakukan di initiateTerjemah setelah tombol di-render --
        const namaLatin = surah.namaLatin ?? surah.nama_latin;
        detailSurah.appendChild(ayat);


        resolve(detailSurah);
    });
}

// Toggle semua terjemahan
function showHideAllTerjemah(listAyat, condition) {
    return new Promise((resolve) => {
        listAyat.forEach((ayat) => {
            const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
            const terjemah = document.getElementById(`terjemahan${nomorAyat}`);
            const terjemahAction = document.getElementById(
                `toggleTerjemahan${nomorAyat}`,
            );

            if (condition) {
                terjemah.style.display = "block";
                terjemahAction.innerHTML = __(
                    "hide_translation_s",
                    "Sembunyikan terjemahan",
                );
            } else {
                terjemah.style.display = "none";
                terjemahAction.innerHTML = __(
                    "see_translation",
                    "Lihat terjemahan",
                );
            }
        });
        resolve();
    });
}

function initiateTerjemah(listAyat, nomorSurah, namaLatin) {
    return new Promise((resolve, reject) => {
        listAyat.forEach((ayat) => {
            const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
            const ayatSurah = document.getElementById(`isi-ayat${nomorAyat}`);

            ComponentTerjemahan(ayat, nomorSurah).then((element) => {
                ayatSurah.appendChild(element);

                // Ikuti setting showTranslation (default: tampil)
                const bodyTerjemahan = document.getElementById(`terjemahan${nomorAyat}`);
                if (bodyTerjemahan) {
                    bodyTerjemahan.style.display = (window.__showTranslation !== false) ? "block" : "none";
                }

                // Bind tombol aksi setelah elemen ada di DOM
                const audioBtn    = document.getElementById(`audio-btn-${nomorAyat}`);
                const bookmarkBtn = document.getElementById(`bookmark-btn-${nomorAyat}`);
                const lastreadBtn = document.getElementById(`lastread-btn-${nomorAyat}`);
                const asbabBtn    = document.getElementById(`asbab-btn-${nomorAyat}`);
                const tafsirBtn   = document.getElementById(`tafsir-btn-${nomorAyat}`);
                const copyBtn     = document.getElementById(`copy-btn-${nomorAyat}`);

                if (audioBtn)    audioBtn.addEventListener('click', () =>
                    playAyatAudio(nomorSurah, nomorAyat, audioBtn));
                if (bookmarkBtn) bookmarkBtn.addEventListener('click', () =>
                    toggleBookmarkAyat(nomorSurah, namaLatin, nomorAyat));
                if (lastreadBtn) lastreadBtn.addEventListener('click', () =>
                    showSaveLastReadSlide(nomorSurah, namaLatin, nomorAyat));
                if (asbabBtn)    asbabBtn.addEventListener('click', () =>
                    openAsbabunNuzul(nomorSurah, nomorAyat));
                if (tafsirBtn)   tafsirBtn.addEventListener('click', () =>
                    openTafsir(nomorSurah, nomorAyat));
                if (copyBtn)     copyBtn.addEventListener('click', () =>
                    copyAyat(nomorSurah, nomorAyat, namaLatin, copyBtn));
            });
        });
        resolve();
    });
}

function ComponentTerjemahan(ayat, nomorSurah) {
    return new Promise((resolve, reject) => {
        const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
        const teksLatin = ayat.teksLatin ?? ayat.tr;
        const teksIndonesia = ayat.teksIndonesia ?? ayat.idn;

        const terjemah = document.createElement("div");
        terjemah.innerHTML = `
        <div id="terjemahan${nomorAyat}" class="terjemahan-ayat">
            <p class="tulisan-latin">${teksLatin}</p>
            <p class="terjemahan">${__("translation_suffix", "artinya:")} "${teksIndonesia}"</p>
        </div>
        <div class="ayat-action-bar" id="aab-${nomorAyat}">
            <div class="aab-main">
                <button class="aab-btn btn-bookmark-ayat"
                    id="bookmark-btn-${nomorAyat}"
                    title="${__("save_bookmark", "Bookmark")}">
                    <i class="fa-solid fa-bookmark"></i>
                </button>
                <button class="aab-btn btn-lastread-ayat"
                    id="lastread-btn-${nomorAyat}"
                    title="${__("save_lastread", "Terakhir dibaca")}">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                </button>
                <button class="aab-btn aab-expand-btn"
                    id="aab-expand-${nomorAyat}"
                    title="Lainnya"
                    aria-expanded="false">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <div class="aab-extra" id="aab-extra-${nomorAyat}" aria-hidden="true">
                <button class="aab-btn btn-audio-ayat"
                    id="audio-btn-${nomorAyat}"
                    title="${__("play_audio", "Putar murottal")}">
                    <i class="fa-solid fa-play"></i>
                </button>
                <button class="aab-btn btn-asbab-ayat"
                    id="asbab-btn-${nomorAyat}"
                    title="Asbabun Nuzul"
                    data-surah="${nomorSurah}"
                    data-ayat="${nomorAyat}">
                    <i class="fa-solid fa-scroll"></i>
                </button>
                <button class="aab-btn btn-tafsir-ayat"
                    id="tafsir-btn-${nomorAyat}"
                    title="Tafsir">
                    <i class="fa-solid fa-book"></i>
                </button>
                <button class="aab-btn btn-copy-ayat"
                    id="copy-btn-${nomorAyat}"
                    title="${__("copy_ayat", "Salin")}">
                    <i class="fa-regular fa-copy"></i>
                </button>
            </div>
        </div>
        `;

        // Bind expand toggle
        const expandBtn = terjemah.querySelector(`#aab-expand-${nomorAyat}`);
        const extraEl   = terjemah.querySelector(`#aab-extra-${nomorAyat}`);
        if (expandBtn && extraEl) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = extraEl.classList.contains('aab-extra-open');
                extraEl.classList.toggle('aab-extra-open', !isOpen);
                expandBtn.setAttribute('aria-expanded', String(!isOpen));
                expandBtn.querySelector('i').className = isOpen
                    ? 'fa-solid fa-chevron-right'
                    : 'fa-solid fa-chevron-left';
            });
        }

        resolve(terjemah);
    });
}

// Tampilkan layar loading
function showLoadingScreen() {
    document.getElementById("loading-screen").style.display = "block";
}

// Sembunyikan layar loading
function hideLoadingScreen() {
    document.getElementById("loading-screen").style.display = "none";
}

// Ubah angka ke angka Arab
function numberToArabic(number) {
    const arabicNumeral = ["\u0660", "\u0661", "\u0662", "\u0663", "\u0664", "\u0665", "\u0666", "\u0667", "\u0668", "\u0669"];
    return String(number)
        .split("")
        .map((digit) => arabicNumeral[parseInt(digit)])
        .join("");
}




