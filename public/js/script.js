const urlAllSurah = "https://quran-api.santrikoding.com/api/surah";
const mainBody = document.getElementById("main-body");
const surahDetail = document.getElementById("surah_detail");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const pagination = document.getElementById("pagination");

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
        loadPagingSurah(currentIndex, page * offset);
    }
});

searchButton.addEventListener("click", () => {
    searchSurah = searchInput.value;
    isDataLoaded = false;
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

function loadAllSurah() {
    if (!isDataLoaded) {
        allDataSurahPromise = new Promise((resolve, reject) => {
            const allDataSurah = new Array();
            const dataError = "not found";
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status === 200) {
                    const responses = JSON.parse(xhttp.responseText);

                    // Filter
                    responses.forEach((element) => {
                        let searchNamaSurah = element.nama_latin.toLowerCase();
                        let searchArtiSurah = element.arti.toLowerCase();
                        let searchNomor = element.nomor;
                        if (
                            searchNamaSurah.includes(
                                searchSurah.toLowerCase()
                            ) ||
                            searchArtiSurah.includes(
                                searchSurah.toLowerCase()
                            ) ||
                            searchNomor == searchSurah
                        ) {
                            allDataSurah.push(
                                new Surah(
                                    element.nomor,
                                    element.nama_latin,
                                    element.arti
                                )
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

function loadPagingSurah(currentIndex, totalData) {
    loadAllSurah()
        .then((allData) => {
            // Initiate Data
            mainBody.innerHTML = "";
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

            // Show Data
            for (currentIndex - 1; currentIndex < totalData; currentIndex++) {
                if (typeof data[currentIndex] === "undefined") {
                    break;
                }
                mainBody.appendChild(surahCard(data[currentIndex]));

                const buttonDetail = document.getElementById(
                    `button${data[currentIndex].nomor}`
                );

                (function (index) {
                    buttonDetail.addEventListener("click", () => {
                        loadSurahDetails(index);
                    });
                })(data[currentIndex].nomor);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function surahCard(surah) {
    const card = document.createElement("div");
    card.classList.add("surah-card");

    card.innerHTML = `
  <p>${numberToArabic(surah.nomor)}</p>
  <div class="title">
  <h3>${surah.nama_latin}</h3>
  <p>${surah.arti}</p>
  </div>
  <button id="button${surah.nomor}" class="buttons">Read</button>
  `;
    return card;
}

loadPagingSurah(currentIndex, totalData);

function loadSurahDetails(nomorSurah) {
    fetchFromUrl(nomorSurah)
        .then((data) => {
            mainBody.innerHTML = "";
            mainBody.appendChild(detailSurahPage(data));

            // intiate terjemahaan
            data.ayat.forEach((ayat) => {
                const ayatSurah = document.getElementById(
                    `isiAyat${ayat.nomor}`
                );
                intiateTerjemaahan(ayat).then((element) => {
                    ayatSurah.appendChild(element);

                    const button = document.getElementById(
                        `actionTerjemaah${ayat.nomor}`
                    );

                    const showTerjamaah = document.getElementById(
                        `terjemahaan${ayat.nomor}`
                    );

                    showTerjamaah.style.display = "none";
                    let show = true;
                    button.addEventListener("click", () => {
                        if (show) {
                            showTerjamaah.style.display = "block";
                            button.innerHTML = "Hide Terjemaahan";
                            show = false;
                        } else {
                            showTerjamaah.style.display = "none";
                            button.innerHTML = "Show Terjemaahan";
                            show = true;
                        }
                    });
                });
            });
            pagination.style.display = "none";
        })
        .catch((error) => {
            console.log(error);
        });
}

function fetchFromUrl(nomor) {
    return new Promise((resolve, reject) => {
        fetch(`https://quran-api.santrikoding.com/api/surah/${nomor}`)
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function numberToArabic(number) {
    const arabicNumeral = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(number)
        .split("")
        .map((digit) => arabicNumeral[parseInt(digit)])
        .join("");
}

function detailSurahPage(surah) {
    const detailSurah = document.createElement("div");

    const ayat = document.createElement("div");
    ayat.classList.add("ayat");
    let isiAyat = "";
    surah.ayat.forEach((ayat) => {
        isiAyat += `
        <div class="barisSurah">
        <div id="isiAyat${ayat.nomor}" class="isi-ayat">
            <div class="ayat-nav">
                <h1 class="tulisan-arab">${ayat.ar}</h1>
            </div>
            <div class="ayat-action">
                <button id="actionTerjemaah${
                    ayat.nomor
                }" class="show-hide-terjemahaan">show terjemahaan</button>
            </div>
        </div>
        <div class="nomor-ayat">
            <div class="urutan-ayat">
                <span >${numberToArabic(ayat.nomor)} </span>
            </div>
        </div>

        </div>

        `;
    });

    ayat.innerHTML = isiAyat;

    detailSurah.classList.add("detailSurah");

    detailSurah.innerHTML = `
    <div class="detail">
        <h2>${surah.nama_latin} (${surah.nama}) </h2>
        <h3>${surah.arti}</h3>
        <p>Jumlah Ayat :${surah.jumlah_ayat}</p>
        <p>Tempat Turun : ${surah.tempat_turun}</p>
    <div class="deskripsi">
        <label>Deskripsi : </label>
        <p id="label${surah.nomor}">${surah.deskripsi}</p>
    </div>
    </div>
    `;

    detailSurah.appendChild(ayat);

    return detailSurah;
}

function intiateTerjemaahan(ayat) {
    return new Promise((resolve, reject) => {
        const terjemah = document.createElement("div");
        // terjemah.classList.add("terjemahan-ayat");
        terjemah.setAttribute("id", "terjemahan-ayat");
        // Check if ayat.nomor is defined and not an empty string before setting the id
        terjemah.innerHTML = `
        <div id="terjemahaan${ayat.nomor}">
            <p class="tulisan-latin">${ayat.tr}</p>
            <p class="terjemahaan"> ${ayat.idn}</p>
        </div>
        `;
        resolve(terjemah);
    });
}
