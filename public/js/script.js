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

function Surah(nomor, nama_latin, arti) {
    this.nomor = nomor;
    this.nama_latin = nama_latin;
    this.arti = arti;
}

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchSurah = searchInput.value;
        page = 1;
        currentIndex = 0;
        mainBody.innerHTML = "";
        loadPagingSurah(currentIndex, page * offset);
    }
});

document.addEventListener("click", function (event) {
    if (event.target !== searchInput) {
        searchButton.style.borderRightColor = "#dddddd";
        searchButton.style.borderTopColor = "#dddddd";
        searchButton.style.borderLeftColor = "#dddddd";
        searchButton.style.borderBottomRightRadius = "10px";
        searchInput.style.borderBottomLeftRadius = "10px";
        searchInput.style.borderBottom = "2px solid #dddddd";
        searchInput.blur();
    }
});

searchInput.addEventListener("focus", () => {
    searchInput.style.borderBottom = "2px solid rgb(142, 239, 239)";
});

searchButton.addEventListener("click", () => {
    searchSurah = searchInput.value;
    page = 1;
    currentIndex = 0;
    mainBody.innerHTML = "";
    loadPagingSurah(currentIndex, page * offset);
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

// fetch semua surah atau cari
function loadAllSurah() {
    const urlAllSurah = "https://equran.id/api/v2/surat";

    if (rawSurahListCache !== null) {
        const filtered = rawSurahListCache
            .filter((element) => {
                const nameLower = element.namaLatin.toLowerCase();
                const artiLower = element.arti.toLowerCase();
                return (
                    nameLower.includes(searchSurah.toLowerCase()) ||
                    artiLower.includes(searchSurah.toLowerCase()) ||
                    element.nomor == searchSurah
                );
            })
            .map(
                (element) =>
                    new Surah(element.nomor, element.namaLatin, element.arti),
            );
        return Promise.resolve(filtered);
    }

    if (!allDataSurahPromise) {
        allDataSurahPromise = new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status === 200) {
                    const responses = JSON.parse(xhttp.responseText);
                    const surahList = Array.isArray(responses)
                        ? responses
                        : responses.data;

                    rawSurahListCache = surahList;
                    isDataLoaded = true;

                    const filtered = surahList
                        .filter((element) => {
                            const nameLower = element.namaLatin.toLowerCase();
                            const artiLower = element.arti.toLowerCase();
                            return (
                                nameLower.includes(searchSurah.toLowerCase()) ||
                                artiLower.includes(searchSurah.toLowerCase()) ||
                                element.nomor == searchSurah
                            );
                        })
                        .map(
                            (element) =>
                                new Surah(
                                    element.nomor,
                                    element.namaLatin,
                                    element.arti,
                                ),
                        );

                    resolve(filtered);
                } else if (xhttp.readyState == 4) {
                    reject("Gagal memuat data surah");
                }
            };
            xhttp.open("GET", urlAllSurah);
            xhttp.send();
        });

        allDataSurahPromise
            .then(() => {
                allDataSurahPromise = null;
            })
            .catch(() => {
                allDataSurahPromise = null;
            });
    }
    return allDataSurahPromise;
}

// kartu surah
function surahCard(surah) {
    const card = document.createElement("div");
    card.classList.add("surah-card");

    const favClass =
        typeof isFavorite === "function" && isFavorite(surah.nomor)
            ? "favorited"
            : "";
    const favTitle = favClass
        ? __("remove_favorite", "Hapus dari favorit")
        : __("add_favorite", "Tambah ke favorit");

    card.innerHTML = `
  <div class="card-nomor">${numberToArabic(surah.nomor)}</div>
  <div class="card-info">
    <h3 class="card-name">${surah.nama_latin}</h3>
    <p class="card-arti">${surah.arti}</p>
  </div>
  <div class="card-actions">
    <button id="button${surah.nomor}" class="btn-read">
      <i class="fa-solid fa-book-open"></i> ${__("read_btn", "Baca")}
    </button>
    <button id="star-${surah.nomor}" class="btn-star ${favClass}" title="${favTitle}"
      onclick="toggleFavorite(${surah.nomor}, '${surah.nama_latin.replace(/'/g, "\\'")}', '${surah.arti.replace(/'/g, "\\'")}')">
      <i class="fa-solid fa-star"></i>
    </button>
  </div>
  `;
    return card;
}

// muat daftar surah dengan paginasi
function loadPagingSurah(currentIndex, totalData) {
    showLoadingScreen();
    loadAllSurah()
        .then((allData) => {
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

                    const buttonDetail = document.getElementById(
                        `button${data[currentIndex].nomor}`,
                    );

                    (function (index) {
                        buttonDetail.addEventListener("click", () => {
                            loadSurahDetails(index);
                        });
                    })(data[currentIndex].nomor);
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
            console.error(error);
        });
}

// inisiasi halaman utama
loadPagingSurah(currentIndex, totalData);

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
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// tampilkan detail surah
function loadSurahDetails(nomorSurah) {
    fetchDetailInformasiSurah(nomorSurah)
        .then((data) => {
            titleSurah.innerHTML = "";
            info.style.display = "none";

            titleSurah.appendChild(componentTitleSurah(data));
            const jumpTo = document.getElementById("scroll-input");
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

                document.dispatchEvent(new Event("ayat-rendered"));

                data.ayat.forEach((ayat) => {
                    const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
                    const el = document.getElementById(`isi-ayat${nomorAyat}`);
                    if (!el) return;
                    el.addEventListener("dblclick", () => {
                        if (typeof saveLastRead === "function") {
                            saveLastRead(
                                nomorSurah,
                                data.namaLatin ?? data.nama_latin,
                                nomorAyat,
                            );
                        }
                        el.style.outline = "2px solid var(--gold)";
                        setTimeout(() => (el.style.outline = ""), 800);
                    });
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

                // Tombol tampilkan/sembunyikan terjemahan
                let translationVisible = false;

                const toggleTranslationBtn = document.getElementById(
                    "toggle-translation-btn",
                );
                if (toggleTranslationBtn) {
                    toggleTranslationBtn.addEventListener("click", () => {
                        translationVisible = !translationVisible;

                        if (translationVisible) {
                            toggleTranslationBtn.innerHTML = `
                                <i class="fa-solid fa-eye"></i>
                                <span>${__("show_translation", "Tampilkan Terjemahan")}</span>
                            `;
                            toggleTranslationBtn.classList.add("active");
                        } else {
                            toggleTranslationBtn.innerHTML = `
                                <i class="fa-solid fa-eye-slash"></i>
                                <span>${__("hide_translation", "Sembunyikan Terjemahan")}</span>
                            `;
                            toggleTranslationBtn.classList.remove("active");
                        }

                        data.ayat.forEach((ayat) => {
                            const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
                            const actionRow = document.querySelector(
                                `#isi-ayat${nomorAyat} .ayat-action`,
                            );
                            const terjemahanBlock = document.getElementById(
                                `terjemahan${nomorAyat}`,
                            );
                            if (actionRow)
                                actionRow.style.display = translationVisible
                                    ? "block"
                                    : "none";
                            if (terjemahanBlock)
                                terjemahanBlock.style.display =
                                    translationVisible ? "block" : "none";
                        });
                    });
                }

                let condition = true;
                if (showAllTerjemah) {
                    showAllTerjemah.addEventListener("click", () => {
                        showHideAllTerjemah(data.ayat, condition);
                        condition = !condition;
                    });
                }

                let totalAyat = data.ayat.length;
                jumpTo.max = totalAyat;

                jumpTo.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        const nomorAyat = jumpTo.value;
                        if (nomorAyat > totalAyat || nomorAyat <= 0) {
                            alert(
                                __(
                                    "ayat_not_found",
                                    "Ayat yang Anda masukkan tidak tersedia!",
                                ),
                            );
                        }
                        const elementToJump = document.getElementById(
                            `isi-ayat${nomorAyat}`,
                        );
                        if (!elementToJump) return;
                        elementToJump.style.backgroundColor = "#f1f9f9";
                        elementToJump.scrollIntoView();
                        elementToJump.addEventListener("mouseout", () => {
                            elementToJump.style.backgroundColor = null;
                        });
                    }
                });
            });

            pagination.style.display = "none";
        })
        .catch((error) => {
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
      <button id="toggle-translation-btn" class="btn-toggle-translation"
        title="${__("hide_translation", "Sembunyikan Terjemahan")}">
        <i class="fa-solid fa-eye-slash"></i>
        <span>${__("hide_translation", "Sembunyikan Terjemahan")}</span>
      </button>
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
        <div id="isi-ayat${nomorAyat}" class="isi-ayat">
            <div class="ayat-nav">
                <span class="arabic">${teksArab}</span>
            </div>
            <div class="ayat-action" style="display:none;">
                <a id="toggleTerjemahan${nomorAyat}" class="show-hide-terjemahan">
                    ${__("see_translation", "Lihat terjemahan")}
                </a>
            </div>
        </div>
        <div class="nomor-ayat">
            <div class="urutan-ayat">
                <span>${numberToArabic(nomorAyat)}</span>
            </div>
            <button class="btn-bookmark-ayat"
                id="bookmark-btn-${nomorAyat}"
                title="${__("save_bookmark", "Simpan bookmark ayat ini")}"
                onclick="toggleBookmarkAyat(${surah.nomor}, '${(surah.namaLatin ?? surah.nama_latin).replace(/'/g, "\\'")}', ${nomorAyat})">
                <i class="fa-solid fa-bookmark"></i>
            </button>
        </div>
        </div>
        `;
        });

        ayat.innerHTML = isiAyat;
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

function initiateTerjemah(listAyat) {
    return new Promise((resolve, reject) => {
        listAyat.forEach((ayat) => {
            const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
            const ayatSurah = document.getElementById(`isi-ayat${nomorAyat}`);

            ComponentTerjemahan(ayat).then((element) => {
                ayatSurah.appendChild(element);

                const toggleTerjemahan = document.getElementById(
                    `toggleTerjemahan${nomorAyat}`,
                );
                const bodyTerjemahan = document.getElementById(
                    `terjemahan${nomorAyat}`,
                );

                let show = true;
                toggleTerjemahan.addEventListener("click", () => {
                    if (show) {
                        bodyTerjemahan.style.display = "block";
                        toggleTerjemahan.innerHTML = __(
                            "hide_translation_s",
                            "Sembunyikan terjemahan",
                        );
                        show = false;
                    } else {
                        bodyTerjemahan.style.display = "none";
                        toggleTerjemahan.innerHTML = __(
                            "see_translation",
                            "Lihat terjemahan",
                        );
                        show = true;
                    }
                });
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
