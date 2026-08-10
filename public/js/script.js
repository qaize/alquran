// ── NProgress config ──
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
const info = document.querySelector(".info");

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

// ── Debounce helper ──
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ── Trigger search: hanya dipanggil dari tombol Cari atau Enter ──
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

// ── Clear button ──
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

// ── Tombol Cari ──
searchButton.addEventListener("click", () => triggerSearch());

// ── Enter langsung cari ──
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

/*  ─────────────────────────────────────────────
    DROPDOWN SUGGESTION  (debounce 300ms, client-side filter dari cache)
    ───────────────────────────────────────────── */
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

// ── Filter & map helper (single source of truth) ──
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

    // Cache sudah ada — filter langsung, tidak re-fetch
    if (rawSurahListCache !== null) {
        return Promise.resolve(filterAndMapSurah(rawSurahListCache));
    }

    // Deduplication: gunakan satu promise in-flight
    if (!allDataSurahPromise) {
        allDataSurahPromise = new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    const responses = JSON.parse(xhttp.responseText);
                    rawSurahListCache = Array.isArray(responses) ? responses : responses.data;
                    isDataLoaded = true;
                    if (typeof trackApiCall === 'function') trackApiCall('surat_list');
                    resolve(filterAndMapSurah(rawSurahListCache));
                } else if (xhttp.readyState === 4) {
                    reject("Gagal memuat data surah");
                }
            };
            xhttp.open("GET", urlAllSurah);
            xhttp.send();
        });

        allDataSurahPromise
            .then(() => { allDataSurahPromise = null; })
            .catch(() => { allDataSurahPromise = null; });
    }
    return allDataSurahPromise;
}

// ── Highlight teks yang match query pencarian ──
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

    // Animate.css — fadeInUp dengan stagger delay
    card.classList.add("animate__animated", "animate__fadeInUp");
    const delay = Math.min(_cardAnimIndex * 50, 400); // max 400ms agar tidak terlalu lama
    card.style.animationDelay = delay + "ms";
    card.style.animationDuration = "0.4s";
    _cardAnimIndex++;

    const favClass =
        (function() {
            try {
                const favs = JSON.parse(localStorage.getItem('quran_favorites')) || [];
                return favs.some(f => f.nomor === surah.nomor);
            } catch(e) { return false; }
        })()
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
    <button id="star-${surah.nomor}" class="btn-star ${favClass}" title="${favTitle}"
      onclick="event.stopPropagation(); toggleFavorite(${surah.nomor}, '${surah.nama_latin.replace(/'/g, "\\'")}', '${surah.arti.replace(/'/g, "\\'")}')">
      <i class="fa-solid fa-star"></i>
    </button>
  </div>
  `;
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
            info.style.display = "block";
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

// ── Handle tombol Back browser ──
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
        info.style.display = "block";
        pagination.style.display = "block";
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
    // Simpan state ke browser history agar tombol Back bekerja
    if (pushHistory) {
        history.pushState({ view: 'detail', nomor: nomorSurah }, '', `#surah-${nomorSurah}`);
    }
    npStart();
    fetchDetailInformasiSurah(nomorSurah)
        .then((data) => {
            titleSurah.innerHTML = "";
            info.style.display = "none";

            titleSurah.appendChild(componentTitleSurah(data));
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

                initiateTerjemah(data.ayat);

                // Query scroll-input fresh setelah DOM siap
                const jumpInput = document.getElementById("scroll-input");
                if (jumpInput) {
                    const totalAyat = data.ayat.length;
                    jumpInput.max         = totalAyat;
                    jumpInput.value       = "";
                    jumpInput.placeholder = `1 - ${totalAyat}`;

                    // Clone → hapus listener lama yang menumpuk tiap buka surah
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

                // ── Progress bar: pakai IntersectionObserver (efisien & akurat) ──
                const totalAyatCount = data.ayat.length;
                let maxSeenAyat = 0;

                const progressObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const ayatNum = parseInt(entry.target.dataset.ayat);
                            if (ayatNum > maxSeenAyat) {
                                maxSeenAyat = ayatNum;
                                const pct = Math.round(maxSeenAyat / totalAyatCount * 100);
                                const fill  = document.getElementById('surah-progress-fill');
                                const pctEl = document.getElementById('progress-pct');
                                if (fill)  fill.style.width = pct + '%';
                                if (pctEl) pctEl.textContent = pct + '%';
                            }
                        }
                    });
                }, { threshold: 0.3 });

                // Observe semua ayat
                for (let i = 1; i <= totalAyatCount; i++) {
                    const el = document.getElementById(`isi-ayat${i}`);
                    if (el) progressObserver.observe(el);
                }

                // Cleanup saat ganti surah
                document.addEventListener('ayat-rendered', () => {
                    progressObserver.disconnect();
                }, { once: true });

                // ── Bottom nav wiring ──
                const prevBotBtn = document.getElementById('surah-prev-bottom');
                const nextBotBtn = document.getElementById('surah-next-bottom');
                if (prevBotBtn) {
                    if (!data.suratSebelumnya || nomorSurah == 1) {
                        prevBotBtn.style.visibility = 'hidden';
                    } else {
                        prevBotBtn.addEventListener('click', () => {
                            loadSurahDetails(data.suratSebelumnya.nomor);
                            document.documentElement.scrollIntoView({ behavior: 'smooth' });
                        });
                    }
                }
                if (nextBotBtn) {
                    if (!data.suratSelanjutnya || nomorSurah == 114) {
                        nextBotBtn.style.visibility = 'hidden';
                    } else {
                        nextBotBtn.addEventListener('click', () => {
                            loadSurahDetails(data.suratSelanjutnya.nomor);
                            document.documentElement.scrollIntoView({ behavior: 'smooth' });
                        });
                    }
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

// komponen judul surah
function componentTitleSurah(surah) {
    const title = document.createElement("div");
    title.classList.add("title-Surah");

    title.innerHTML = `
    <h2>${surah.namaLatin ?? surah.nama_latin} (${surah.nama})</h2>
    <h3>${surah.arti}</h3>
    <div class='scroll-navigation'>
      <button id="surah-prev">${__("prev_surah", "Surah Sebelumnya")}</button>
      <div class="jump-group">
        <label for='scroll-input'>${__("jump_to_ayat", "Lompat ke ayat:")}</label>
        <input id='scroll-input' maxlength="3" type="number" value="1">
      </div>
      <button id="surah-next">${__("next_surah", "Surah Selanjutnya")}</button>
    </div>
    `;

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
        let isiAyat = "";
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
            <div class="ayat-btns">
                <button class="btn-audio-ayat btn-hover-only"
                    id="audio-btn-${nomorAyat}"
                    title="${__("play_audio", "Putar murottal ayat ini")}"
                    onclick="playAyatAudio(${surah.nomor}, ${nomorAyat}, this)">
                    <i class="fa-solid fa-play"></i>
                </button>
                <button class="btn-bookmark-ayat"
                    id="bookmark-btn-${nomorAyat}"
                    title="${__("save_bookmark", "Simpan bookmark ayat ini")}"
                    onclick="toggleBookmarkAyat(${surah.nomor}, '${(surah.namaLatin ?? surah.nama_latin).replace(/'/g, "\\'")}', ${nomorAyat})">
                    <i class="fa-solid fa-bookmark"></i>
                </button>
                <button class="btn-lastread-ayat btn-hover-only"
                    id="lastread-btn-${nomorAyat}"
                    title="${__("save_lastread", "Simpan terakhir dibaca")}"
                    onclick="showSaveLastReadSlide(${surah.nomor}, '${(surah.namaLatin ?? surah.nama_latin).replace(/'/g, "\\'")}', ${nomorAyat})">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                </button>
                <button class="btn-asbab-ayat btn-hover-only"
                    id="asbab-btn-${nomorAyat}"
                    title="Asbabun Nuzul"
                    data-surah="${surah.nomor}"
                    data-ayat="${nomorAyat}"
                    onclick="openAsbabunNuzul(${surah.nomor}, ${nomorAyat})">
                    <i class="fa-solid fa-scroll"></i>
                </button>
                <button class="btn-tafsir-ayat btn-hover-only"
                    id="tafsir-btn-${nomorAyat}"
                    title="Tafsir"
                    onclick="openTafsir(${surah.nomor}, ${nomorAyat})">
                    <i class="fa-solid fa-book"></i>
                </button>
                <button class="btn-copy-ayat btn-hover-only"
                    id="copy-btn-${nomorAyat}"
                    title="${__("copy_ayat", "Salin ayat")}"
                    onclick="copyAyat(${surah.nomor}, ${nomorAyat}, '${(surah.namaLatin ?? surah.nama_latin).replace(/'/g, "\\'")}', this)">
                    <i class="fa-regular fa-copy"></i>
                </button>
            </div>
        </div>
        </div>
        `;
        });

        ayat.innerHTML = isiAyat;
        detailSurah.appendChild(ayat);

        // ── Progress indicator ──
        const progress = document.createElement('div');
        progress.className = 'surah-progress-bar-wrap';
        progress.innerHTML = `
            <div class="surah-progress-info">
                <span class="surah-progress-label">
                    <i class="fa-solid fa-book-open"></i>
                    <span id="progress-text">${surah.ayat.length} ${__('ayat_word','ayat')}</span>
                </span>
                <span class="surah-progress-pct" id="progress-pct">0%</span>
            </div>
            <div class="surah-progress-track">
                <div class="surah-progress-fill" id="surah-progress-fill" style="width:0%"></div>
            </div>
        `;
        detailSurah.insertBefore(progress, ayat);

        // ── Bottom navigation prev/next ──
        const bottomNav = document.createElement('div');
        bottomNav.className = 'surah-bottom-nav';
        bottomNav.id = 'surah-bottom-nav';
        bottomNav.innerHTML = `
            <button class="surah-bottom-btn" id="surah-prev-bottom">
                <i class="fa-solid fa-chevron-left"></i>
                <span>${__('prev_surah','Surah Sebelumnya')}</span>
            </button>
            <div class="surah-bottom-info">
                <span class="surah-bottom-name">${surah.namaLatin ?? surah.nama_latin}</span>
                <span class="surah-bottom-count">${surah.ayat.length} ${__('ayat_word','ayat')}</span>
            </div>
            <button class="surah-bottom-btn surah-bottom-next" id="surah-next-bottom">
                <span>${__('next_surah','Surah Selanjutnya')}</span>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;
        detailSurah.appendChild(bottomNav);

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

function initiateTerjemah(listAyat) {
    return new Promise((resolve, reject) => {
        listAyat.forEach((ayat) => {
            const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
            const ayatSurah = document.getElementById(`isi-ayat${nomorAyat}`);

            ComponentTerjemahan(ayat).then((element) => {
                ayatSurah.appendChild(element);
                // Ikuti setting showTranslation (default: tampil)
                const bodyTerjemahan = document.getElementById(`terjemahan${nomorAyat}`);
                if (bodyTerjemahan) {
                    bodyTerjemahan.style.display = (window.__showTranslation !== false) ? "block" : "none";
                }
            });
        });
        resolve();
    });
}

function ComponentTerjemahan(ayat) {
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
        `;
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
    const arabicNumeral = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(number)
        .split("")
        .map((digit) => arabicNumeral[parseInt(digit)])
        .join("");
}
