/* dzikir.js — Dzikir & Doa Harian
   Modal panel — pola sama seperti hadist.js
   ─────────────────────────────────────────── */

const DZIKIR_DATA = {
    pagi: {
        id: 'pagi',
        icon: 'fa-sun',
        label_id: 'Dzikir Pagi',
        label_en: 'Morning Dhikr',
        color: '#c9893c',
        items: [
            {
                arab: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
                latin: "Ashbahnā wa ashbahal-mulku lillāh, walhamdulillāh, lā ilāha illallāhu wahdahū lā syarīka lah, lahul-mulku walahul-hamd, wahuwa 'alā kulli syai'in qadīr.",
                arti: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah. Segala puji bagi Allah, tidak ada ilah yang berhak disembah kecuali Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya pujian. Dan Dia Mahakuasa atas segala sesuatu.',
                arti_en: 'We have entered the morning and the whole dominion belongs to Allah. Praise be to Allah, none has the right to be worshipped except Allah alone. To Him belongs the dominion and all praise. He is Able to do all things.',
                faedah: 'Barangsiapa membacanya, ia akan mendapat perlindungan dari berbagai macam gangguan.',
                count: 1, sumber: 'HR. Muslim no. 2723',
            },
            {
                arab: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
                latin: "Allāhumma bika ashbahnā, wa bika amsainā, wa bika nahyā, wa bika namūtu, wa ilaykan-nusyūr.",
                arti: 'Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat-Mu kami memasuki waktu petang. Dengan kehendak-Mu kami hidup dan kami mati. Dan kepada-Mu kebangkitan.',
                arti_en: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening. By Your leave we live and die and unto You is our resurrection.',
                faedah: 'Dibaca 1x di waktu pagi.',
                count: 1, sumber: 'HR. Abu Dawud no. 5068',
            },
            {
                arab: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
                latin: "Allāhumma anta rabbī, lā ilāha illā anta, khalaqtanī wa anā 'abduk, wa anā 'alā 'ahdika wa wa'dika mastatha'tu, a'ūdzu bika min syarri mā shana'tu, abū'u laka bini'matika 'alayya, wa abū'u bidzanbī, faghfirlī fa'innahū lā yaghfirudz-dzunūba illā ant.",
                arti: 'Ya Allah, Engkau adalah Rabb-ku, tidak ada ilah yang berhak disembah kecuali Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berlindung kepada-Mu dari keburukan apa yang kuperbuat. Aku mengakui nikmat-Mu atasku, maka ampunilah aku.',
                arti_en: 'O Allah, You are my Lord. You created me and I am Your servant. I seek refuge in You from the evil of which I have committed. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me.',
                faedah: 'Sayyidul Istighfar — Barangsiapa membacanya di pagi hari dengan penuh keyakinan lalu meninggal di hari itu, ia termasuk penghuni surga.',
                count: 1, sumber: 'HR. Bukhari no. 6306',
            },
            {
                arab: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
                latin: 'Subhānallāhi wa bihamdih.',
                arti: 'Maha Suci Allah dan segala puji bagi-Nya.',
                arti_en: 'Glory and praise be to Allah.',
                faedah: 'Dibaca 100x di pagi hari. Dosa-dosanya diampuni meskipun sebanyak buih di lautan.',
                count: 100, sumber: 'HR. Muslim no. 2691',
            },
            {
                arab: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
                latin: "Lā ilāha illallāhu wahdahū lā syarīka lah, lahul-mulku walahul-hamd, wahuwa 'alā kulli syai'in qadīr.",
                arti: 'Tidak ada ilah yang berhak disembah kecuali Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya pujian. Dia Mahakuasa atas segala sesuatu.',
                arti_en: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs sovereignty and all praise. He is Able to do all things.',
                faedah: 'Dibaca 10x setelah Subuh. Pahalanya seperti memerdekakan 4 orang dari keturunan Nabi Ismail.',
                count: 10, sumber: 'HR. Ahmad no. 17301',
            },
            {
                arab: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
                latin: "Hasbiyallāhu lā ilāha illā huwa 'alayhi tawakkaltu wa huwa rabbul-'arsyil-'azhīm.",
                arti: 'Cukuplah Allah bagiku, tidak ada ilah yang berhak disembah kecuali Dia. Kepada-Nya aku bertawakal, dan Dia adalah Rabb Arsy yang agung.',
                arti_en: 'Allah is sufficient for me. None has the right to be worshipped except Him. I place my trust in Him, and He is the Lord of the Magnificent Throne.',
                faedah: 'Dibaca 7x di pagi dan petang. Allah akan mencukupkan kebutuhannya.',
                count: 7, sumber: 'HR. Abu Dawud no. 5081',
            },
        ],
    },
    petang: {
        id: 'petang',
        icon: 'fa-cloud-sun',
        label_id: 'Dzikir Petang',
        label_en: 'Evening Dhikr',
        color: '#8e44ad',
        items: [
            {
                arab: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
                latin: "Amsainā wa amsal-mulku lillāh, walhamdulillāh, lā ilāha illallāhu wahdahū lā syarīka lah, lahul-mulku walahul-hamd, wahuwa 'alā kulli syai'in qadīr.",
                arti: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah. Segala puji bagi Allah, tidak ada ilah yang berhak disembah kecuali Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya pujian.',
                arti_en: 'We have entered the evening and the whole dominion belongs to Allah. Praise be to Allah, none has the right to be worshipped except Allah alone. To Him belongs the dominion and all praise.',
                faedah: 'Dibaca 1x di waktu petang.',
                count: 1, sumber: 'HR. Muslim no. 2723',
            },
            {
                arab: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
                latin: "Allāhumma bika amsainā, wa bika ashbahnā, wa bika nahyā, wa bika namūtu, wa ilaykal-mashīr.",
                arti: 'Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu petang, dan dengan rahmat-Mu kami memasuki waktu pagi. Dengan kehendak-Mu kami hidup dan kami mati. Dan kepada-Mu tempat kembali.',
                arti_en: 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning. By Your leave we live and die, and unto You is our return.',
                faedah: 'Dibaca 1x di waktu petang.',
                count: 1, sumber: 'HR. Tirmidzi no. 3391',
            },
            {
                arab: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
                latin: "A'ūdzu bikalimātillāhit-tāmmāti min syarri mā khalaq.",
                arti: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang diciptakan-Nya.',
                arti_en: 'I seek refuge in the perfect words of Allah from the evil of that which He has created.',
                faedah: 'Dibaca 3x di petang hari. Tidak ada sesuatu pun yang membahayakannya malam itu.',
                count: 3, sumber: 'HR. Muslim no. 2709',
            },
            {
                arab: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
                latin: "Bismillāhil-ladzī lā yadhurru ma'asmihi syai'un fil-ardhi wa lā fis-samā'i wahuwa-ssami'ul-'alīm.",
                arti: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun yang membahayakan di bumi maupun di langit. Dan Dia Maha Mendengar lagi Maha Mengetahui.',
                arti_en: 'In the Name of Allah, with Whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
                faedah: 'Dibaca 3x. Tidak ada sesuatu yang tiba-tiba menimpanya.',
                count: 3, sumber: 'HR. Abu Dawud no. 5088',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
                latin: "Allāhumma innī as'alukal-'afwa wal-'āfiyata fid-dunyā wal-ākhirah.",
                arti: 'Ya Allah, sesungguhnya aku memohon kepada-Mu maaf dan keselamatan di dunia dan akhirat.',
                arti_en: 'O Allah, I ask You for pardon and well-being in this life and the next.',
                faedah: 'Doa memohon maaf dan keselamatan yang menyeluruh.',
                count: 1, sumber: 'HR. Ibnu Majah no. 3871',
            },
        ],
    },
    setelah_sholat: {
        id: 'setelah_sholat',
        icon: 'fa-mosque',
        label_id: 'Setelah Sholat',
        label_en: 'After Prayer',
        color: '#27ae60',
        items: [
            {
                arab: 'أَسْتَغْفِرُ اللهَ',
                latin: 'Astaghfirullāh.',
                arti: 'Aku memohon ampun kepada Allah.',
                arti_en: 'I seek forgiveness from Allah.',
                faedah: 'Dibaca 3x setelah salam.',
                count: 3, sumber: 'HR. Muslim no. 591',
            },
            {
                arab: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
                latin: "Allāhumma antas-salāmu wa minkas-salāmu, tabārakta yā dzal-jalāli wal-ikrām.",
                arti: 'Ya Allah, Engkau adalah As-Salam dan dari-Mu keselamatan. Maha Suci Engkau, wahai Yang Maha Mulia dan Maha Dermawan.',
                arti_en: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of Majesty and Honour.',
                faedah: 'Dibaca 1x setelah istighfar 3x.',
                count: 1, sumber: 'HR. Muslim no. 591',
            },
            {
                arab: 'سُبْحَانَ اللهِ',
                latin: 'Subhānallāh.',
                arti: 'Maha Suci Allah.',
                arti_en: 'Glory be to Allah.',
                faedah: 'Tasbih — dibaca 33x setelah sholat.',
                count: 33, sumber: 'HR. Muslim no. 595',
            },
            {
                arab: 'الْحَمْدُ لِلَّهِ',
                latin: 'Alhamdulillāh.',
                arti: 'Segala puji bagi Allah.',
                arti_en: 'Praise be to Allah.',
                faedah: 'Tahmid — dibaca 33x setelah sholat.',
                count: 33, sumber: 'HR. Muslim no. 595',
            },
            {
                arab: 'اللهُ أَكْبَرُ',
                latin: 'Allāhu Akbar.',
                arti: 'Allah Maha Besar.',
                arti_en: 'Allah is the Greatest.',
                faedah: 'Takbir — dibaca 33x setelah sholat.',
                count: 33, sumber: 'HR. Muslim no. 595',
            },
            {
                arab: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
                latin: "Lā ilāha illallāhu wahdahū lā syarīka lah, lahul-mulku walahul-hamd, wahuwa 'alā kulli syai'in qadīr.",
                arti: 'Tidak ada ilah yang berhak disembah kecuali Allah semata. Milik-Nya kerajaan dan bagi-Nya pujian. Dia Mahakuasa atas segala sesuatu.',
                arti_en: 'None has the right to be worshipped except Allah alone. To Him belongs dominion and all praise. He is Able to do all things.',
                faedah: 'Penutup tasbih 33+33+33. Dosa-dosanya diampuni meskipun sebanyak buih lautan.',
                count: 1, sumber: 'HR. Muslim no. 597',
            },
            {
                arab: 'آيَةُ الْكُرْسِيِّ — اللهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
                latin: "Āyatul Kursī (QS. Al-Baqarah: 255)",
                arti: 'Ayat Kursi — barangsiapa membacanya setelah setiap sholat fardhu, tidak ada yang menghalanginya masuk surga kecuali kematian.',
                arti_en: 'Verse of the Throne — nothing prevents a person from entering Paradise but death if they recite it after every obligatory prayer.',
                faedah: 'Dibaca 1x setelah setiap sholat fardhu.',
                count: 1, sumber: 'HR. Nasai no. 9928',
            },
        ],
    },
    tidur: {
        id: 'tidur',
        icon: 'fa-moon',
        label_id: 'Tidur & Bangun',
        label_en: 'Sleep & Wake',
        color: '#2980b9',
        items: [
            {
                arab: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
                latin: "Bismikallāhumma amūtu wa ahyā.",
                arti: 'Dengan nama-Mu ya Allah, aku mati (tidur) dan aku hidup (bangun).',
                arti_en: 'In Your name, O Allah, I die and I live.',
                faedah: 'Doa sebelum tidur.',
                count: 1, sumber: 'HR. Bukhari no. 6312',
            },
            {
                arab: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
                latin: "Allāhumma qinī 'adzābaka yawma tab'atsu 'ibādak.",
                arti: 'Ya Allah, jagalah aku dari azab-Mu pada hari Engkau membangkitkan hamba-hamba-Mu.',
                arti_en: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
                faedah: 'Dibaca 3x sebelum tidur.',
                count: 3, sumber: 'HR. Abu Dawud no. 5045',
            },
            {
                arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
                latin: "Alhamdulillāhil-ladzī ahyānā ba'da mā amātanā wa ilayhin-nusyūr.",
                arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya tempat kembali.',
                arti_en: 'Praise be to Allah who gave us life after having caused our death, and to Him is our return.',
                faedah: 'Doa bangun tidur.',
                count: 1, sumber: 'HR. Bukhari no. 6312',
            },
            {
                arab: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
                latin: "Subhānakallāhumma wa bihamdika, lā ilāha illā anta, astaghfiruka wa atūbu ilayk.",
                arti: 'Maha Suci Engkau ya Allah, dan segala puji bagi-Mu. Tidak ada ilah yang berhak disembah kecuali Engkau. Aku memohon ampun dan bertaubat kepada-Mu.',
                arti_en: 'Glory and praise be to You, O Allah. None has the right to be worshipped except You. I seek Your forgiveness and repent to You.',
                faedah: 'Kaffaratul majlis — dibaca sebelum bangkit dari tempat tidur.',
                count: 1, sumber: 'HR. Tirmidzi no. 3434',
            },
        ],
    },
    harian: {
        id: 'harian',
        icon: 'fa-hands',
        label_id: 'Doa Harian',
        label_en: 'Daily Duas',
        color: '#c0392b',
        items: [
            {
                arab: 'بِسْمِ اللهِ',
                latin: "Bismillāh.",
                arti: 'Dengan nama Allah.',
                arti_en: 'In the name of Allah.',
                faedah: 'Dibaca sebelum makan.',
                count: 1, sumber: 'HR. Abu Dawud no. 3767',
            },
            {
                arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
                latin: "Alhamdulillāhil-ladzī ath'amanā wa saqānā wa ja'alanā muslimīn.",
                arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang Muslim.',
                arti_en: 'Praise be to Allah who has fed us and given us drink and made us Muslims.',
                faedah: 'Doa selesai makan.',
                count: 1, sumber: 'HR. Abu Dawud no. 3850',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
                latin: "Allāhumma innī a'ūdzu bika minal-khubutsi wal-khabā'its.",
                arti: 'Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan.',
                arti_en: 'O Allah, I seek refuge in You from male and female evil spirits.',
                faedah: 'Doa masuk kamar mandi.',
                count: 1, sumber: 'HR. Bukhari no. 142',
            },
            {
                arab: 'بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
                latin: "Bismillāhi, tawakkaltu 'alallāhi, wa lā hawla wa lā quwwata illā billāh.",
                arti: 'Dengan nama Allah. Aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.',
                arti_en: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
                faedah: 'Doa keluar rumah. Akan dijaga, diberi petunjuk dan dicukupkan kebutuhannya.',
                count: 1, sumber: 'HR. Abu Dawud no. 5095',
            },
            {
                arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                latin: "Rabbanā ātinā fid-dunyā hasanatan wa fil-ākhirati hasanatan wa qinā 'adzāban-nār.",
                arti: 'Ya Rabb kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, serta selamatkanlah kami dari azab neraka.',
                arti_en: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.',
                faedah: 'Doa sapu jagat — doa paling sering dibaca Rasulullah ﷺ.',
                count: 1, sumber: 'QS. Al-Baqarah: 201',
            },
            {
                arab: 'رَبِّ زِدْنِي عِلْمًا',
                latin: "Rabbī zidnī 'ilmā.",
                arti: 'Ya Rabb-ku, tambahkanlah ilmuku.',
                arti_en: 'My Lord, increase me in knowledge.',
                faedah: 'Doa memohon ilmu.',
                count: 1, sumber: 'QS. Thaha: 114',
            },
        ],
    },
};

/* ── State ── */
let _dzikirActiveKat = 'pagi';
let _dzikirCounters  = {};
function _dzikirKey(katId, idx) { return `${katId}_${idx}`; }

/* ══════════════════════════════════════════
   PANEL — pola persis seperti hadist
   ══════════════════════════════════════════ */
function openDzikirPanel() {
    let overlay = document.getElementById('dzikir-panel-overlay');
    if (overlay) {
        overlay.classList.add('open');
        _dzikirCounters = {};
        _renderDzikirBody();
        return;
    }

    overlay = document.createElement('div');
    overlay.id        = 'dzikir-panel-overlay';
    overlay.className = 'dzikir-panel-overlay';

    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';

    overlay.innerHTML = `
        <div class="dzikir-panel">

            <div class="dzikir-panel-header">
                <div class="dzikir-panel-title">
                    <i class="fa-solid fa-hands"></i>
                    <div>
                        <h2>${lang === 'en' ? 'Dhikr & Daily Duas' : 'Dzikir & Doa Harian'}</h2>
                        <p id="dzikir-panel-subtitle">${lang === 'en' ? 'Morning Dhikr' : 'Dzikir Pagi'}</p>
                    </div>
                </div>
                <button class="dzikir-panel-close" id="dzikir-panel-close" title="${typeof t === 'function' ? t('close') : 'Tutup'}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="dzikir-kat-bar" id="dzikir-kat-bar">
                ${Object.values(DZIKIR_DATA).map(k => `
                    <button class="dzikir-kat-btn ${k.id === _dzikirActiveKat ? 'active' : ''}"
                        data-kat="${k.id}"
                        style="--dz-color:${k.color}">
                        <i class="fa-solid ${k.icon}"></i>
                        ${lang === 'en' ? k.label_en : k.label_id}
                    </button>
                `).join('')}
            </div>

            <div class="dzikir-panel-body" id="dzikir-panel-body">
                <div class="dzikir-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    // Close
    overlay.querySelector('#dzikir-panel-close').addEventListener('click', () => {
        overlay.classList.remove('open');
    });
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
    });

    // Kategori tabs
    overlay.querySelector('#dzikir-kat-bar').addEventListener('click', e => {
        const btn = e.target.closest('.dzikir-kat-btn');
        if (!btn) return;
        _dzikirActiveKat = btn.dataset.kat;
        _dzikirCounters  = {};
        overlay.querySelectorAll('.dzikir-kat-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.kat === _dzikirActiveKat)
        );
        const kat = DZIKIR_DATA[_dzikirActiveKat];
        const sub = overlay.querySelector('#dzikir-panel-subtitle');
        if (sub && kat) sub.textContent = lang === 'en' ? kat.label_en : kat.label_id;
        _renderDzikirBody();
    });

    // Back button
    history.pushState({ panel: 'dzikir' }, '');
    window.addEventListener('popstate', function _dzPopstate() {
        if (!overlay.classList.contains('open')) {
            window.removeEventListener('popstate', _dzPopstate);
            return;
        }
        overlay.classList.remove('open');
        window.removeEventListener('popstate', _dzPopstate);
    });

    requestAnimationFrame(() => overlay.classList.add('open'));

    _dzikirCounters = {};
    _renderDzikirBody();

    // Update bahasa
    document.addEventListener('lang-changed', () => {
        if (!overlay.classList.contains('open')) return;
        const l   = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';
        const h2  = overlay.querySelector('.dzikir-panel-title h2');
        const sub = overlay.querySelector('#dzikir-panel-subtitle');
        const kat = DZIKIR_DATA[_dzikirActiveKat];
        if (h2)  h2.textContent  = l === 'en' ? 'Dhikr & Daily Duas' : 'Dzikir & Doa Harian';
        if (sub && kat) sub.textContent = l === 'en' ? kat.label_en : kat.label_id;
        overlay.querySelectorAll('.dzikir-kat-btn').forEach(b => {
            const k = DZIKIR_DATA[b.dataset.kat];
            if (k) b.innerHTML = `<i class="fa-solid ${k.icon}"></i> ${l === 'en' ? k.label_en : k.label_id}`;
        });
        _renderDzikirBody();
    });
}

function _renderDzikirBody() {
    const body = document.getElementById('dzikir-panel-body');
    if (!body) return;
    const kat  = DZIKIR_DATA[_dzikirActiveKat];
    if (!kat)  return;
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';

    body.innerHTML = kat.items.map((item, idx) => {
        const key     = _dzikirKey(kat.id, idx);
        const current = _dzikirCounters[key] ?? 0;
        const done    = current >= item.count;
        const arti    = lang === 'en' ? (item.arti_en || item.arti) : item.arti;

        return `
            <div class="dzikir-item ${done ? 'dzikir-item-done' : ''}" id="dzi-${idx}">

                <div class="dzikir-item-arab" dir="rtl">${item.arab}</div>
                <div class="dzikir-item-latin">${item.latin}</div>

                <div class="dzikir-item-arti">${arti}</div>

                ${item.faedah ? `
                <div class="dzikir-item-faedah">
                    <i class="fa-solid fa-circle-info"></i> ${item.faedah}
                </div>` : ''}

                <div class="dzikir-item-footer">
                    <span class="dzikir-item-sumber">${item.sumber}</span>
                    <div class="dzikir-counter-wrap">
                        ${item.count > 1 ? `<span class="dzikir-counter-lbl" id="dzl-${idx}">${current}/${item.count}x</span>` : ''}
                        <button class="dzikir-counter-btn ${done ? 'done' : ''}"
                            data-idx="${idx}" data-kat="${kat.id}"
                            title="${item.count > 1 ? (lang === 'en' ? 'Tap to count' : 'Ketuk untuk hitung') : (lang === 'en' ? 'Mark done' : 'Tandai selesai')}">
                            ${done
                                ? '<i class="fa-solid fa-circle-check"></i>'
                                : item.count > 1
                                    ? '<i class="fa-solid fa-hand-point-up"></i>'
                                    : '<i class="fa-regular fa-circle"></i>'
                            }
                        </button>
                    </div>
                </div>

            </div>
        `;
    }).join('');

    // Bind counter buttons
    body.querySelectorAll('.dzikir-counter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx   = parseInt(btn.dataset.idx);
            const katId = btn.dataset.kat;
            const key   = _dzikirKey(katId, idx);
            const item  = DZIKIR_DATA[katId].items[idx];

            if (_dzikirCounters[key] === undefined) _dzikirCounters[key] = 0;
            _dzikirCounters[key] = _dzikirCounters[key] >= item.count
                ? 0
                : _dzikirCounters[key] + 1;

            const current = _dzikirCounters[key];
            const done    = current >= item.count;
            const card    = document.getElementById(`dzi-${idx}`);

            if (card) card.classList.toggle('dzikir-item-done', done);
            btn.classList.toggle('done', done);

            if (item.count > 1) {
                const lbl = document.getElementById(`dzl-${idx}`);
                if (lbl) lbl.textContent = `${current}/${item.count}x`;
            }

            btn.innerHTML = done
                ? '<i class="fa-solid fa-circle-check"></i>'
                : item.count > 1
                    ? '<i class="fa-solid fa-hand-point-up"></i>'
                    : '<i class="fa-regular fa-circle"></i>';
        });
    });
}

/* ── Init Ibadah Harian nav group ── */
function initIbadahGroup() {
    const NAV_IBADAH_KEY = 'quran_nav_ibadah_open';
    const trigger = document.getElementById('nav-ibadah-btn');
    const body    = document.getElementById('nav-ibadah-body');
    const arrow   = document.getElementById('nav-ibadah-arrow');
    if (!trigger || !body) return;

    const isOpen = localStorage.getItem(NAV_IBADAH_KEY) === 'true';
    if (isOpen) {
        body.classList.add('open');
        arrow && arrow.classList.add('rotated');
    }

    trigger.addEventListener('click', () => {
        const open = body.classList.toggle('open');
        arrow && arrow.classList.toggle('rotated', open);
        localStorage.setItem(NAV_IBADAH_KEY, open);
    });
}

/* ── Init ── */
function initDzikir() {
    const navBtn = document.getElementById('nav-dzikir-btn');
    if (navBtn) {
        navBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openDzikirPanel();
            document.querySelector('.sidebar-left')?.classList.remove('drawer-open');
            document.getElementById('drawer-backdrop')?.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}
