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

// insiasi home
loadPagingSurah(currentIndex, totalData);

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
            const nextSurah = document.getElementById("surah-next");
            const prevSurah = document.getElementById("surah-prev");
            if (nomorSurah == 1) {
                prevSurah.style.display = "none";
            }
            if (nomorSurah == 114) {
                nextSurah.style.display = "none";
            }
            prevSurah.addEventListener("click", () => {
                loadSurahDetails(nomorSurah - 1);
            });
            nextSurah.addEventListener("click", () => {
                loadSurahDetails(nomorSurah + 1);
            });
            // remove body
            mainBody.innerHTML = "";

            // Set ayat
            componentDetailSurah(data).then((surah) => {
                mainBody.appendChild(surah);

                const hideDetailButton =
                    document.getElementById("hide-detail-button");

                const showAllTerjemah = document.getElementById(
                    "show-all-terjemahan-button"
                );

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

                // intiate terjemahan
                initiateTerjemah(data.ayat);

                // Toggle Terjemahan
                let condition = true;
                showAllTerjemah.addEventListener("click", () => {
                    showHideAllTerjemah(data.ayat, condition);
                    condition = !condition;
                });

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
                            `isi-ayat${nomorAyat}`
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
    <h2>${surah.nama_latin} (${surah.nama}) </h2>
    <h3>${surah.arti}</h3>
    <div class='scroll-navigation'>
    <button id="surah-prev">Previous</button>
    <div><label for ='scroll-input'>jump to ayat :</label>
    <input id='scroll-input' maxlength="3" type="number" value="1"></div>
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
        <a id="show-all-terjemahan-button"> <i class="fa-solid fa-eye"></i> </a>
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
                <span class="arabic">${ayat.ar}</span>
            </div>
            <div class="ayat-action">
                <a id="toggleTerjemahan${
                    ayat.nomor
                }" class="show-hide-terjemahan">Lihat terjemahan</a>
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

// Toggle Terjemahan

function showHideAllTerjemah(listAyat, condition) {
    return new Promise((resolve) => {
        listAyat.forEach((ayat) => {
            const terjemah = document.getElementById(`terjemahan${ayat.nomor}`);
            const terjemahAction = document.getElementById(
                `toggleTerjemahan${ayat.nomor}`
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
            const ayatSurah = document.getElementById(`isi-ayat${ayat.nomor}`);

            // function add terjemahan in ayat
            ComponentTerjemahan(ayat).then((element) => {
                ayatSurah.appendChild(element);

                const toggleTerjemahan = document.getElementById(
                    `toggleTerjemahan${ayat.nomor}`
                );

                const bodyTerjemahan = document.getElementById(
                    `terjemahan${ayat.nomor}`
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
        const terjemah = document.createElement("div");
        // terjemah.setAttribute("id", "terjemahan-ayat");
        terjemah.innerHTML = `
        <div id="terjemahan${ayat.nomor}" class="terjemahan-ayat">
            <p class="tulisan-latin">${ayat.tr}</p>
            <p class="terjemahan">artinya :  "${ayat.idn}"</p>
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
