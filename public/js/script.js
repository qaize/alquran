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
    const urlAllSurah = "https://quran-api.santrikoding.com/api/surah";
    if (!isDataLoaded) {
        allDataSurahPromise = new Promise((resolve, reject) => {
            const allDataSurah = new Array();
            const dataError = "not found";
            // Initiate Ajax
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

// card element surah
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
                        `button${data[currentIndex].nomor}`
                    );

                    (function (index) {
                        buttonDetail.addEventListener("click", () => {
                            loadSurahDetails(index);
                        });
                    })(data[currentIndex].nomor);
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

/*
    Detail Surah

*/

// fetch detail surah from api
function fetchDetailInformasiSurah(nomor) {
    return new Promise((resolve, reject) => {
        fetch(`https://quran-api.santrikoding.com/api/surah/${nomor}`)
            .then((response) => response.json())
            .then((data) => {
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
            mainBody.innerHTML = "";

            // Set ayat
            componentDetailSurah(data).then((surah) => {
                mainBody.appendChild(surah);

                const hideDetailButton =
                    document.getElementById("hide-detail-button");
                const surahInformation = document.querySelector(".detail");
                const ayat = document.querySelector(".ayat");

                let showDetail = true;
                hideDetailButton.addEventListener("click", () => {
                    if (showDetail) {
                        hideDetailButton.innerHTML = `
                        <span> >> </span>

                        `;
                        surahInformation.style.display = "none";
                        ayat.style.width = "100%";
                        showDetail = false;
                    } else {
                        hideDetailButton.innerHTML = `
                        <span> << </span>

                        `;
                        ayat.style.width = "60%";
                        surahInformation.style.display = "block";
                        showDetail = true;
                    }
                });

                // intiate terjemahaan
                data.ayat.forEach((ayat) => {
                    const ayatSurah = document.getElementById(
                        `isi-ayat${ayat.nomor}`
                    );

                    // function add terhemahaan in ayat
                    ComponentTerjemaahan(ayat).then((element) => {
                        ayatSurah.appendChild(element);

                        const toggleTerjemahaan = document.getElementById(
                            `toggleTerjemaahan${ayat.nomor}`
                        );

                        const bodyTerjemahaan = document.getElementById(
                            `terjemahaan${ayat.nomor}`
                        );

                        let show = true;
                        toggleTerjemahaan.addEventListener("click", () => {
                            if (show) {
                                bodyTerjemahaan.style.display = "block";
                                toggleTerjemahaan.innerHTML =
                                    "Sembunyikan Terjemaahan";
                                show = false;
                            } else {
                                bodyTerjemahaan.style.display = "none";
                                toggleTerjemahaan.innerHTML =
                                    "Lihat Terjemaahan";
                                show = true;
                            }
                        });
                    });
                });

                // Navigate to ayat ...
                jumpTo.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        const nomorAyat = jumpTo.value;
                        const elementToJump = document.getElementById(
                            `isi-ayat${nomorAyat}`
                        );

                        elementToJump.scrollIntoView();
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
    <h2>${surah.nama_latin} (${surah.nama}) </h2>
    <h3>${surah.arti}</h3>
    <div class='scroll-navigation'>
    <label for ='scroll-input'>jump to ayat :</label>
    <input id='scroll-input' maxlength="3" type="number" value="1">
    </div>

    `;

    return title;
}

// function detail surah
function componentDetailSurah(surah) {
    return new Promise((resolve, reject) => {
        const detailSurah = document.createElement("div");
        detailSurah.classList.add("detailSurah");

        //info surah
        detailSurah.innerHTML = `
    <div class="detail">
        <p>Jumlah Ayat :${surah.jumlah_ayat}</p>
        <p>Tempat Turun : ${surah.tempat_turun}</p>
    <div class="deskripsi">
        <label>Deskripsi : </label>
        <p id="label${surah.nomor}">${surah.deskripsi}</p>
    </div>
    </div>
    <div class="hide-detail">
        <a id="hide-detail-button"> <span><<</span> </a>
        <a id="show-all-terjemaahan-button"> <i class="fa-solid fa-eye"></i> </a>
    </div>
    `;

        // map ayat surah
        const ayat = document.createElement("div");
        ayat.classList.add("ayat");
        let isiAyat = "";
        surah.ayat.forEach((ayat) => {
            isiAyat += `
        <div class="barisSurah">
        <div id="isi-ayat${ayat.nomor}" class="isi-ayat">
            <div class="ayat-nav">
                <h1 class="tulisan-arab">${ayat.ar}</h1>
            </div>
            <div class="ayat-action">
                <a id="toggleTerjemaahan${
                    ayat.nomor
                }" class="show-hide-terjemahaan">Lihat terjemahaan</a>
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

        detailSurah.appendChild(ayat);
        resolve(detailSurah);
    });
}

// Toggle Terjemaahan
function ComponentTerjemaahan(ayat) {
    return new Promise((resolve, reject) => {
        const terjemah = document.createElement("div");
        terjemah.setAttribute("id", "terjemahan-ayat");
        terjemah.innerHTML = `
        <div id="terjemahaan${ayat.nomor}" class="terjemahaan-ayat">
            <p class="tulisan-latin">${ayat.tr}</p>
            <p class="terjemahaan">artinya :  "${ayat.idn}"</p>
        </div>
        `;
        resolve(terjemah);
    });
}

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

// insiasi home
loadPagingSurah(currentIndex, totalData);
