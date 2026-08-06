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

let nomorSurah = 0;

const offset = 12;
let page = 1;
let totalPage = 0;
let currentIndex = 0;
let overflow = 0;
let totalData = page * offset;

function Surah(nomor, nama_latin, arti) {
    this.nomor = nomor;
    this.nama_latin = nama_latin;
    this.arti = arti;
}

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchSurah = searchInput.value;
        isDataLoaded = false;
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
        searchInput.blur(); // Remove focus from the input
    }
});

searchInput.addEventListener("focus", () => {
    searchInput.style.borderBottom = "2px solid rgb(142, 239, 239)";
});

searchButton.addEventListener("click", () => {
    searchSurah = searchInput.value;
    isDataLoaded = false;
    mainBody.innerHTML = "";
    loadPagingSurah(currentIndex, page * offset);
});

prevButton.addEventListener("click", () => {
    if (page > 1) {
        page--;
        currentIndex = currentIndex - offset;
    }
    // loadAllSurah(currentIndex, page * offset);
    loadPagingSurah(currentIndex, page * offset);
});

nextButton.addEventListener("click", () => {
    if (totalPage > page) {
        page++;
        currentIndex = currentIndex + offset;
        // loadAllSurah(currentIndex, page * offset);
        loadPagingSurah(currentIndex, page * offset);
    }
    // perform last page
    if (totalPage == page) {
        loadPagingSurah(currentIndex, currentIndex + overflow);
    }
});

/*
    Home page
*/

// fetch all surah or search
function loadAllSurah() {
    const urlAllSurah = "https://equran.id/api/v2/surat";
    if (!isDataLoaded) {
        allDataSurahPromise = new Promise((resolve, reject) => {
            const allDataSurah = new Array();
            const dataError = "not found";
            // Initiate Ajax
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status === 200) {
                    const responses = JSON.parse(xhttp.responseText);

                    // Filter — support both wrapped { data: [...] } and plain array response
                    const surahList = Array.isArray(responses)
                        ? responses
                        : responses.data;
                    surahList.forEach((element) => {
                        let searchNamaSurah = element.namaLatin.toLowerCase();
                        let searchArtiSurah = element.arti.toLowerCase();
                        let searchNomor = element.nomor;
                        if (
                            searchNamaSurah.includes(
                                searchSurah.toLowerCase(),
                            ) ||
                            searchArtiSurah.includes(
                                searchSurah.toLowerCase(),
                            ) ||
                            searchNomor == searchSurah
                        ) {
                            allDataSurah.push(
                                new Surah(
                                    element.nomor,
                                    element.namaLatin,
                                    element.arti,
                                ),
                            );
                        }
                    });
                    isDataLoaded = true;
                    resolve(allDataSurah);
                    reject(dataError);
                }
            };
            xhttp.open("GET", urlAllSurah);
            xhttp.send();
        });
    }
    return allDataSurahPromise;
}

// card element surah
function surahCard(surah) {
    const card = document.createElement("div");
    card.classList.add("surah-card");

    // Cek apakah sudah difavoritkan (fungsi isFavorite dari _script.blade.php)
    const favClass =
        typeof isFavorite === "function" && isFavorite(surah.nomor)
            ? "favorited"
            : "";
    const favTitle = favClass ? "Hapus dari favorit" : "Tambah ke favorit";

    card.innerHTML = `
  <div class="card-nomor">${numberToArabic(surah.nomor)}</div>
  <div class="card-info">
    <h3 class="card-name">${surah.nama_latin}</h3>
    <p class="card-arti">${surah.arti}</p>
  </div>
  <div class="card-actions">
    <button id="button${surah.nomor}" class="btn-read">
      <i class="fa-solid fa-book-open"></i> Baca
    </button>
    <button id="star-${surah.nomor}" class="btn-star ${favClass}" title="${favTitle}"
      onclick="toggleFavorite(${surah.nomor}, '${surah.nama_latin.replace(/'/g, "\\'")}', '${surah.arti.replace(/'/g, "\\'")}')">
      <i class="fa-solid fa-star"></i>
    </button>
  </div>
  `;
    return card;
}

// filtered surah at home
function loadPagingSurah(currentIndex, totalData) {
    showLoadingScreen();
    loadAllSurah()
        .then((allData) => {
            // Initiate Data
            hideLoadingScreen();
            titleSurah.innerHTML = "";
            mainBody.innerHTML = "";
            info.style.display = "block";
            const data = allData;
            totalPage = Math.ceil(data.length / offset);
            overflow = data.length % offset;

            // Pagination state
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

            // If data is found is one, then show detail instead show in list
            if (data.length == 1) {
                loadSurahDetails(data[0].nomor);
            } else if (data.length == 0) {
                const notFound = document.createElement("h1");
                notFound.classList.add("data-empty");
                notFound.innerHTML = "DATA NOT FOUND";
                mainBody.appendChild(notFound);
            }
            // Show list data surah in list
            else {
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

                // Sync state bintang favorit dari localStorage setelah semua kartu dirender
                if (typeof isFavorite === 'function') {
                    data.forEach((surah) => {
                        if (isFavorite(surah.nomor)) {
                            const starBtn = document.getElementById(`star-${surah.nomor}`);
                            if (starBtn) {
                                starBtn.classList.add('favorited');
                                starBtn.title = 'Hapus dari favorit';
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

// insiasi home
loadPagingSurah(currentIndex, totalData);

/*
    Detail Surah

*/

// fetch detail surah from api
function fetchDetailInformasiSurah(nomor) {
    return new Promise((resolve, reject) => {
        fetch(`https://equran.id/api/v2/surat/${nomor}`)
            .then((response) => response.json())
            .then((response) => {
                // Support wrapped { code, message, data: {...} } and plain object
                const data =
                    response.data !== undefined ? response.data : response;
                setTimeout(resolve(data), 1000);
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

            // Set Surah title and its navigation
            titleSurah.appendChild(componentTitleSurah(data));
            const jumpTo = document.getElementById("scroll-input");
            const nextSurah = document.getElementById("surah-next");
            const prevSurah = document.getElementById("surah-prev");

            // Gunakan suratSebelumnya / suratSelanjutnya dari JSON baru,
            // fallback ke nomor ± 1 jika field tidak tersedia
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
            // remove body
            mainBody.innerHTML = "";

            // Set ayat
            componentDetailSurah(data).then((surah) => {
                mainBody.appendChild(surah);

                // Re-apply settings (font size, bg color) ke .ayat yang baru dibuat
                if (typeof applySettings === 'function') {
                    applySettings(getSettings());
                }

                // Sync tombol bookmark yang sudah tersimpan
                document.dispatchEvent(new Event('ayat-rendered'));

                // Double click pada ayat → simpan last read
                data.ayat.forEach((ayat) => {
                    const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
                    const el = document.getElementById(`isi-ayat${nomorAyat}`);
                    if (!el) return;
                    el.addEventListener('dblclick', () => {
                        if (typeof saveLastRead === 'function') {
                            saveLastRead(nomorSurah, data.namaLatin ?? data.nama_latin, nomorAyat);
                        }
                        // Feedback visual singkat
                        el.style.outline = '2px solid var(--gold)';
                        setTimeout(() => el.style.outline = '', 800);
                    });
                });

                const hideDetailButton =
                    document.getElementById("hide-detail-button");

                const showAllTerjemah = document.getElementById(
                    "show-all-terjemahan-button",
                );

                const surahInformation = document.querySelector(".detail");
                const ayatContainer = document.querySelector(".ayat");

                // Default: full-width Arabic-only mode
                ayatContainer.classList.add("ayat-fullwidth");
                // Ubah detailSurah container ke block agar ayat melebar penuh
                const detailSurahEl = ayatContainer.closest(".detailSurah");
                if (detailSurahEl) detailSurahEl.classList.add("fullwidth-mode");

                // Legacy hide-detail button (now hidden but keep wired)
                let showDetail = false;
                if (hideDetailButton) {
                    hideDetailButton.addEventListener("click", () => {
                        if (showDetail) {
                            hideDetailButton.innerHTML = `<span> >> </span>`;
                            surahInformation.style.display = "none";
                            ayatContainer.classList.add("ayat-fullwidth");
                            if (detailSurahEl) detailSurahEl.classList.add("fullwidth-mode");
                            showDetail = false;
                        } else {
                            hideDetailButton.innerHTML = `<span> << </span>`;
                            ayatContainer.classList.remove("ayat-fullwidth");
                            if (detailSurahEl) detailSurahEl.classList.remove("fullwidth-mode");
                            surahInformation.style.display = "block";
                            showDetail = true;
                        }
                    });
                }

                // intiate terjemahan (inserted but hidden by default)
                initiateTerjemah(data.ayat);

                // ── NEW: Show/Hide Translation toggle button ──
                let translationVisible = false; // hidden by default

                const toggleTranslationBtn = document.getElementById(
                    "toggle-translation-btn",
                );
                if (toggleTranslationBtn) {
                    toggleTranslationBtn.addEventListener("click", () => {
                        translationVisible = !translationVisible;

                        // Update button label & icon
                        if (translationVisible) {
                            toggleTranslationBtn.innerHTML = `
                                <i class="fa-solid fa-eye"></i>
                                <span>Show Translation</span>
                            `;
                            toggleTranslationBtn.classList.add("active");
                        } else {
                            toggleTranslationBtn.innerHTML = `
                                <i class="fa-solid fa-eye-slash"></i>
                                <span>Hide Translation</span>
                            `;
                            toggleTranslationBtn.classList.remove("active");
                        }

                        // Show/hide all per-ayat action rows and terjemahan blocks
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

                // Legacy toggle all (show-all-terjemahan-button, still wired)
                let condition = true;
                if (showAllTerjemah) {
                    showAllTerjemah.addEventListener("click", () => {
                        showHideAllTerjemah(data.ayat, condition);
                        condition = !condition;
                    });
                }

                let totalAyat = data.ayat.length;
                jumpTo.max = totalAyat;

                // Navigate to ayat ...
                jumpTo.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        const nomorAyat = jumpTo.value;
                        if (nomorAyat > totalAyat || nomorAyat <= 0) {
                            alert("Ayat yang anda masukan tidak tersedia!");
                        }
                        const elementToJump = document.getElementById(
                            `isi-ayat${nomorAyat}`,
                        );

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

// function title surah
function componentTitleSurah(surah) {
    const title = document.createElement("div");
    title.classList.add("title-Surah");

    title.innerHTML = `
    <h2>${surah.namaLatin ?? surah.nama_latin} (${surah.nama}) </h2>
    <h3>${surah.arti}</h3>
    <div class='scroll-navigation'>
      <button id="surah-prev">Previous</button>
      <div class="jump-group">
        <label for='scroll-input'>jump to ayat :</label>
        <input id='scroll-input' maxlength="3" type="number" value="1">
      </div>
      <button id="toggle-translation-btn" class="btn-toggle-translation" title="Tampilkan / Sembunyikan Terjemahan">
        <i class="fa-solid fa-eye-slash"></i>
        <span>Hide Translation</span>
      </button>
      <button id="surah-next">Next</button>
    </div>
    `;

    return title;
}

// function detail surah
function componentDetailSurah(surah) {
    return new Promise((resolve, reject) => {
        const detailSurah = document.createElement("div");
        detailSurah.classList.add("detailSurah");

        //info surah — hidden by default, full-width Arabic view
        detailSurah.innerHTML = `
    <div class="detail" style="display:none;">
        <p>Jumlah Ayat :${surah.jumlahAyat ?? surah.jumlah_ayat}</p>
        <p>Tempat Turun : ${surah.tempatTurun ?? surah.tempat_turun}</p>
    <div class="deskripsi">
        <label>Deskripsi : </label>
        <p id="label${surah.nomor}">${surah.deskripsi}</p>
    </div>
    </div>
    <div class="hide-detail" style="display:none;">
        <a id="hide-detail-button"> <span><<</span> </a>
        <a id="show-all-terjemahan-button"> <i class="fa-solid fa-eye"></i> </a>
    </div>
    `;

        // map ayat surah
        const ayat = document.createElement("div");
        ayat.classList.add("ayat");
        let isiAyat = "";
        surah.ayat.forEach((ayat) => {
            // Support new API fields (nomorAyat, teksArab) and old fields (nomor, ar)
            const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
            const teksArab = ayat.teksArab ?? ayat.ar;
            isiAyat += `
        <div class="barisSurah">
        <div id="isi-ayat${nomorAyat}" class="isi-ayat">
            <div class="ayat-nav">
                <span class="arabic">${teksArab}</span>
            </div>
            <div class="ayat-action" style="display:none;">
                <a id="toggleTerjemahan${nomorAyat}" class="show-hide-terjemahan">Lihat terjemahan</a>
            </div>
        </div>
        <div class="nomor-ayat">
            <div class="urutan-ayat">
                <span>${numberToArabic(nomorAyat)}</span>
            </div>
            <button class="btn-bookmark-ayat"
                id="bookmark-btn-${nomorAyat}"
                title="Simpan bookmark ayat ini"
                onclick="toggleBookmarkAyat(${surah.nomor}, '${(surah.namaLatin ?? surah.nama_latin).replace(/'/g,"\\'")}', ${nomorAyat})">
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

// Toggle Terjemahan

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
                terjemahAction.innerHTML = "Sembunyikan Terjemahan";
            } else {
                terjemah.style.display = "none";
                terjemahAction.innerHTML = "Lihat Terjemahan";
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

            // function add terjemahan in ayat
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
                        toggleTerjemahan.innerHTML = "Sembunyikan Terjemahan";
                        show = false;
                    } else {
                        bodyTerjemahan.style.display = "none";
                        toggleTerjemahan.innerHTML = "Lihat Terjemahan";
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
        // Support new API fields and old fields as fallback
        const nomorAyat = ayat.nomorAyat ?? ayat.nomor;
        const teksLatin = ayat.teksLatin ?? ayat.tr;
        const teksIndonesia = ayat.teksIndonesia ?? ayat.idn;

        const terjemah = document.createElement("div");
        terjemah.innerHTML = `
        <div id="terjemahan${nomorAyat}" class="terjemahan-ayat">
            <p class="tulisan-latin">${teksLatin}</p>
            <p class="terjemahan">artinya : "${teksIndonesia}"</p>
        </div>
        `;
        resolve(terjemah);
    });
}

// Loading screen
function showLoadingScreen() {
    document.getElementById("loading-screen").style.display = "block";
}

// Function to hide the loading screen
function hideLoadingScreen() {
    document.getElementById("loading-screen").style.display = "none";
}

// FUnction to change number to arabic number
function numberToArabic(number) {
    const arabicNumeral = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(number)
        .split("")
        .map((digit) => arabicNumeral[parseInt(digit)])
        .join("");
}
