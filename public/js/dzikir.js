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
            {
                arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
                latin: "Allāhumma innī a'ūdzu bika minal-hammi wal-hazan, wa a'ūdzu bika minal-'ajzi wal-kasal, wa a'ūdzu bika minal-jubni wal-bukhl, wa a'ūdzu bika min ghalabatid-dayni wa qahrir-rijāl.",
                arti: 'Ya Allah, aku berlindung kepada-Mu dari kesusahan dan kesedihan, aku berlindung dari kelemahan dan kemalasan, aku berlindung dari sifat pengecut dan kikir, dan aku berlindung dari lilitan hutang dan tekanan orang.',
                arti_en: 'O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from miserliness and cowardice, and from being overcome by debt and overpowered by men.',
                faedah: 'Doa menghilangkan kesedihan dan kegalauan.',
                count: 1, sumber: 'HR. Bukhari no. 6369',
            },
            {
                arab: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
                latin: "Allāhummaghfir lī warhamnī wahdinī wa 'āfinī warzuqnī.",
                arti: 'Ya Allah, ampunilah aku, sayangilah aku, tunjukilah aku, sehatkanlah aku, dan berilah aku rezeki.',
                arti_en: 'O Allah, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.',
                faedah: 'Doa ringkas penuh makna yang mencakup semua hajat.',
                count: 1, sumber: 'HR. Muslim no. 2697',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
                latin: "Allāhumma innī zhalamtu nafsī zhulman katsīrā, wa lā yaghfirudz-dzunūba illā anta, faghfir lī maghfiratan min 'indika, warhamnī innaka antal-ghafūrur-rahīm.",
                arti: 'Ya Allah, aku telah banyak menzalimi diriku, dan tidak ada yang dapat mengampuni dosa kecuali Engkau. Ampunilah aku dengan ampunan dari sisi-Mu, dan sayangilah aku. Sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang.',
                arti_en: 'O Allah, I have greatly wronged myself and no one forgives sins but You. So grant me forgiveness and have mercy on me. Surely You are the Forgiving, the Merciful.',
                faedah: 'Doa yang diajarkan Abu Bakar Ash-Shiddiq untuk dibaca dalam shalat.',
                count: 1, sumber: 'HR. Bukhari no. 834',
            },
            {
                arab: 'اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
                latin: "Allāhumma ashlih lī dīniyal-ladzī huwa 'ishmatu amrī, wa ashlih lī dunyāyal-latī fīhā ma'āsyī, wa ashlih lī ākhiratiyal-latī fīhā ma'ādī, waj'alil-hayāta ziyādatan lī fī kulli khair, waj'alil-mawta rāhatan lī min kulli syarr.",
                arti: 'Ya Allah, perbaikilah agamaku yang merupakan penjaga urusanku. Perbaikilah duniaku yang di dalamnya ada kehidupanku. Perbaikilah akhiratku yang ke sana aku kembali. Jadikanlah hidup sebagai tambahan kebaikan bagiku, dan jadikanlah kematian sebagai istirahat bagiku dari segala keburukan.',
                arti_en: 'O Allah, set right for me my religion which is the safeguard of my affairs. Set right for me my worldly life which contains my livelihood. Set right for me my Hereafter to which I have to return. Make life an addition to every good for me and make death a rest for me from every evil.',
                faedah: 'Doa komprehensif untuk kebaikan dunia, agama, dan akhirat.',
                count: 1, sumber: 'HR. Muslim no. 2720',
            },
            {
                arab: 'اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا',
                latin: "Allāhumma āti nafsī taqwāhā, wa zakkihā anta khayru man zakkāhā, anta waliyyuhā wa mawlāhā.",
                arti: 'Ya Allah, berikanlah ketakwaan kepada jiwaku, dan sucikanlah ia, Engkau adalah sebaik-baik yang menyucikannya. Engkau adalah pelindung dan tuannya.',
                arti_en: 'O Allah, grant my soul its piety and purify it, for You are the Best to purify it. You are its Guardian and Protector.',
                faedah: 'Doa memohon kesucian jiwa dan ketakwaan.',
                count: 1, sumber: 'HR. Muslim no. 2722',
            },
            {
                arab: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
                latin: "Rabbisyrah lī shadrī wa yassir lī amrī wahlul 'uqdatan min lisānī yafqahū qawlī.",
                arti: 'Ya Rabb-ku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku agar mereka mengerti perkataanku.',
                arti_en: 'My Lord, expand my breast, ease my task for me, and remove the impediment from my speech so they may understand what I say.',
                faedah: 'Doa Nabi Musa a.s. — dibaca saat akan berbicara penting atau presentasi.',
                count: 1, sumber: 'QS. Thaha: 25-28',
            },
            {
                arab: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ',
                latin: "Hasbunallāhu wa ni'mal-wakīl.",
                arti: 'Cukuplah Allah sebagai penolong kami dan Dia adalah sebaik-baik pelindung.',
                arti_en: 'Allah is sufficient for us and He is the Best Guardian.',
                faedah: 'Dibaca saat menghadapi kesulitan dan tekanan.',
                count: 1, sumber: 'QS. Ali Imran: 173',
            },
            {
                arab: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
                latin: "Lā ilāha illā anta subhānaka innī kuntu minazh-zhālimīn.",
                arti: 'Tidak ada Tuhan selain Engkau. Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zalim.',
                arti_en: 'None has the right to be worshipped except You, glory be to You, truly I was of the wrongdoers.',
                faedah: 'Doa Nabi Yunus a.s. dalam perut ikan. Doa yang mustajab saat dalam kesulitan.',
                count: 1, sumber: 'QS. Al-Anbiya: 87',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
                latin: "Allāhumma innī as'aluka 'ilman nāfi'ā, wa rizqan thayyibā, wa 'amalan mutaqabbalā.",
                arti: 'Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.',
                arti_en: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
                faedah: 'Doa setelah sholat Subuh.',
                count: 1, sumber: 'HR. Ibnu Majah no. 925',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا',
                latin: "Allāhumma innī a'ūdzu bika min 'ilmin lā yanfa', wa min qalbin lā yakhsya', wa min nafsin lā tasyba', wa min da'watin lā yustajābu lahā.",
                arti: 'Ya Allah, aku berlindung kepada-Mu dari ilmu yang tidak bermanfaat, dari hati yang tidak khusyuk, dari jiwa yang tidak pernah puas, dan dari doa yang tidak dikabulkan.',
                arti_en: 'O Allah, I seek refuge in You from knowledge that does not benefit, from a heart that does not humble itself, from a soul that is never satisfied, and from a supplication that is not answered.',
                faedah: 'Doa Nabi ﷺ — berlindung dari empat perkara yang merugikan.',
                count: 1, sumber: 'HR. Muslim no. 2722',
            },
        ],
    },
    safar: {
        id: 'safar',
        icon: 'fa-road',
        label_id: 'Perjalanan',
        label_en: 'Travel Duas',
        color: '#16a085',
        items: [
            {
                arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
                latin: "Subhānal-ladzī sakhkhara lanā hādzā wa mā kunnā lahū muqrinīn, wa innā ilā rabbinā lamunqalibūn.",
                arti: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami, padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Rabb kami.',
                arti_en: 'Glory be to Him who has subjected this to us, and we could never have it by our efforts, and verily to our Lord we certainly are to return.',
                faedah: 'Doa naik kendaraan.',
                count: 1, sumber: 'QS. Az-Zukhruf: 13-14',
            },
            {
                arab: 'اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ',
                latin: "Allāhumma hawwin 'alaynā safaranā hādzā wathwi 'annā bu'dah, allāhumma antas-shāhibu fis-safari wal-khalīfatu fil-ahl.",
                arti: 'Ya Allah, mudahkanlah perjalanan kami ini dan dekatkanlah jauhnya jarak. Ya Allah, Engkau adalah teman setia dalam perjalanan dan pengganti (penjaga) bagi keluarga.',
                arti_en: 'O Allah, make this journey easy for us and shorten the distance. O Allah, You are the companion on the journey and the guardian of the family.',
                faedah: 'Doa saat memulai perjalanan jauh.',
                count: 1, sumber: 'HR. Muslim no. 1342',
            },
            {
                arab: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى',
                latin: "Allāhumma innā nas'aluka fī safarinā hādzal-birra wat-taqwā, wa minal-'amali mā tardhā.",
                arti: 'Ya Allah, kami memohon kepada-Mu dalam perjalanan ini kebaikan dan ketakwaan, serta amal yang Engkau ridhai.',
                arti_en: 'O Allah, we ask You in this journey for goodness and piety, and deeds that are pleasing to You.',
                faedah: 'Doa safar yang diajarkan Nabi ﷺ.',
                count: 1, sumber: 'HR. Muslim no. 1342',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ',
                latin: "Allāhumma innī a'ūdzu bika min wa'tsā'is-safari, wa ka'ābatil-manzhar, wa sū'il-munqalabi fil-māli wal-ahl.",
                arti: 'Ya Allah, aku berlindung kepada-Mu dari kesukaran perjalanan, dari pemandangan yang menyedihkan, dan dari hal-hal buruk saat pulang dalam urusan harta dan keluarga.',
                arti_en: 'O Allah, I seek Your protection against the hardships of travel, against finding a distressing scene on return, and against a miserable fate in wealth and family.',
                faedah: 'Doa berlindung dari kesukaran saat bepergian.',
                count: 1, sumber: 'HR. Bukhari no. 1823',
            },
            {
                arab: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
                latin: "Allāhumma bārik lanā fīmā razaqtanā wa qinā 'adzāban-nār.",
                arti: 'Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan jagalah kami dari azab neraka.',
                arti_en: 'O Allah, bless what You have provided us and protect us from the punishment of the Fire.',
                faedah: 'Doa saat singgah di suatu tempat.',
                count: 1, sumber: 'HR. Ibnu Sunni',
            },
            {
                arab: 'اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا مَرِيئًا مَرِيعًا نَافِعًا غَيْرَ ضَارٍّ عَاجِلًا غَيْرَ آجِلٍ',
                latin: "Allāhummasqinā ghaytsam mughītsan marī'an marī'an nāfi'an ghayra dhārrin 'ājilan ghayra ājil.",
                arti: 'Ya Allah, turunkanlah hujan kepada kami yang lebat, menyegarkan, merata, bermanfaat, tidak membahayakan, segera tidak tertunda.',
                arti_en: 'O Allah, grant us rain that is beneficial, wholesome, productive, useful, not harmful, soon and not delayed.',
                faedah: 'Doa memohon hujan.',
                count: 1, sumber: 'HR. Abu Dawud no. 1169',
            },
            {
                arab: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
                latin: "Allāhumma shayyiban nāfi'ā.",
                arti: 'Ya Allah, jadikanlah hujan ini hujan yang bermanfaat.',
                arti_en: 'O Allah, make it a beneficial rain.',
                faedah: 'Doa saat turun hujan.',
                count: 1, sumber: 'HR. Bukhari no. 1032',
            },
            {
                arab: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
                latin: "A'ūdzu bikalimātillāhit-tāmmāti min syarri mā khalaq.",
                arti: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang Dia ciptakan.',
                arti_en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
                faedah: 'Dibaca saat singgah di suatu tempat — tidak ada sesuatu yang mencelakakannya.',
                count: 3, sumber: 'HR. Muslim no. 2708',
            },
        ],
    },
    masjid: {
        id: 'masjid',
        icon: 'fa-mosque',
        label_id: 'Masjid & Sholat',
        label_en: 'Mosque & Prayer',
        color: '#27ae60',
        items: [
            {
                arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
                latin: "Allāhummaftah lī abwāba rahmatik.",
                arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
                arti_en: 'O Allah, open for me the gates of Your mercy.',
                faedah: 'Doa masuk masjid — membaca shalawat terlebih dahulu kemudian doa ini.',
                count: 1, sumber: 'HR. Muslim no. 713',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
                latin: "Allāhumma innī as'aluka min fadhlик.",
                arti: 'Ya Allah, sesungguhnya aku memohon kepada-Mu karunia-Mu.',
                arti_en: 'O Allah, I ask You from Your bounty.',
                faedah: 'Doa keluar masjid.',
                count: 1, sumber: 'HR. Muslim no. 713',
            },
            {
                arab: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
                latin: "Allāhummaghfir lī dzanbī waftah lī abwāba rahmatik.",
                arti: 'Ya Allah, ampunilah dosaku dan bukakanlah bagiku pintu-pintu rahmat-Mu.',
                arti_en: 'O Allah, forgive me my sins and open the gates of Your mercy for me.',
                faedah: 'Doa masuk masjid (versi lengkap).',
                count: 1, sumber: 'HR. Tirmidzi no. 314',
            },
            {
                arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّيْطَانِ الرَّجِيمِ',
                latin: "Allāhumma innī a'ūdzu bika minasy-syaythānir-rajīm.",
                arti: 'Ya Allah, aku berlindung kepada-Mu dari setan yang terkutuk.',
                arti_en: 'O Allah, I seek refuge in You from the accursed Satan.',
                faedah: 'Dibaca sebelum adzan dikumandangkan.',
                count: 1, sumber: 'HR. Muslim no. 389',
            },
            {
                arab: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
                latin: "Allāhumma rabba hādzihid-da'watit-tāmmati wash-shalātil-qā'imah, āti muhammadanil-wasīlata wal-fadhīlata wab'atshu maqāman mahmūdanil-ladzī wa'adtah.",
                arti: 'Ya Allah, Rabb seruan yang sempurna ini dan shalat yang didirikan, berikanlah kepada Muhammad wasilah dan keutamaan, dan bangkitkanlah ia pada kedudukan terpuji yang telah Engkau janjikan.',
                arti_en: 'O Allah, Lord of this perfect call and of the established prayer, grant Muhammad the intercession and the privilege, and raise him to the praised station which You have promised him.',
                faedah: 'Doa sesudah adzan — dijamin mendapat syafaat Nabi ﷺ di hari kiamat.',
                count: 1, sumber: 'HR. Bukhari no. 614',
            },
            {
                arab: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَفِي سَمْعِي نُورًا، وَفِي بَصَرِي نُورًا، وَمِنْ فَوْقِي نُورًا، وَمِنْ تَحْتِي نُورًا، وَعَنْ يَمِينِي نُورًا، وَعَنْ شِمَالِي نُورًا، وَمِنْ أَمَامِي نُورًا، وَمِنْ خَلْفِي نُورًا، وَاجْعَلْ لِي نُورًا',
                latin: "Allāhummaj'al fī qalbī nūrā, wa fī lisānī nūrā, wa fī sam'ī nūrā, wa fī basharī nūrā, wa min fawqī nūrā, wa min tahtī nūrā, wa 'an yamīnī nūrā, wa 'an syimālī nūrā, wa min amāmī nūrā, wa min khalfī nūrā, waj'al lī nūrā.",
                arti: 'Ya Allah, jadikanlah cahaya di hatiku, di lidahku, di pendengaranku, di penglihatanku, di atasku, di bawahku, di kananku, di kiriku, di depanku, di belakangku, dan jadikanlah cahaya bagiku.',
                arti_en: 'O Allah, put light in my heart, and light in my tongue, light in my hearing, light in my sight, light behind me, light in front of me, light on my right, light on my left, light above me and light below me.',
                faedah: 'Doa Nabi ﷺ menuju masjid untuk sholat.',
                count: 1, sumber: 'HR. Muslim no. 763',
            },
            {
                arab: 'اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
                latin: "Allāhummaghfir lī wa liwālidayya wa lil-mu'minīna wal-mu'mināt.",
                arti: 'Ya Allah, ampunilah aku, kedua orang tuaku, dan seluruh orang-orang mukmin laki-laki dan perempuan.',
                arti_en: 'O Allah, forgive me, my parents, and all the believing men and women.',
                faedah: 'Doa untuk diri sendiri, orang tua, dan kaum muslimin.',
                count: 1, sumber: 'QS. Nuh: 28',
            },
        ],
    },
};

/* ── State ── */
let _dzikirActiveKat = 'pagi';
let _dzikirCounters  = {};
function _dzikirKey(katId, idx) { return `${katId}_${idx}`; }

/* ══════════════════════════════════════════
   PANEL — grid kategori + sub-modal doa
   ══════════════════════════════════════════ */
function openDzikirPanel() {
    let overlay = document.getElementById('dzikir-panel-overlay');
    if (overlay) {
        overlay.classList.add('open');
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
                        <p>${lang === 'en' ? 'Select a category' : 'Pilih kategori'}</p>
                    </div>
                </div>
                <button class="dzikir-panel-close" id="dzikir-panel-close" title="Tutup">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="dzikir-panel-body" id="dzikir-panel-body">
                <div class="dzikir-cat-grid" id="dzikir-cat-grid"></div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Render grid kategori
    const grid = overlay.querySelector('#dzikir-cat-grid');
    Object.values(DZIKIR_DATA).forEach(kat => {
        const card = document.createElement('button');
        card.className = 'dzikir-cat-card';
        card.dataset.kat = kat.id;
        card.style.setProperty('--dz-color', kat.color);
        const label = lang === 'en' ? kat.label_en : kat.label_id;
        card.innerHTML = `
            <div class="dcc-icon"><i class="fa-solid ${kat.icon}"></i></div>
            <div class="dcc-info">
                <span class="dcc-label">${label}</span>
                <span class="dcc-count">${kat.items.length} ${lang === 'en' ? 'duas' : 'doa'}</span>
            </div>
            <i class="fa-solid fa-chevron-left dcc-arrow"></i>
        `;
        card.addEventListener('click', () => _openDzikirSubModal(kat.id));
        grid.appendChild(card);
    });

    // Close
    overlay.querySelector('#dzikir-panel-close').addEventListener('click', () => {
        overlay.classList.remove('open');
    });
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
    });

    history.pushState({ panel: 'dzikir' }, '');
    window.addEventListener('popstate', function _dzPopstate() {
        if (!overlay.classList.contains('open')) {
            window.removeEventListener('popstate', _dzPopstate);
            return;
        }
        // Tutup sub-modal dulu kalau terbuka
        const sub = document.getElementById('dzikir-sub-overlay');
        if (sub && sub.classList.contains('open')) {
            sub.classList.remove('open');
        } else {
            overlay.classList.remove('open');
        }
        window.removeEventListener('popstate', _dzPopstate);
    });

    requestAnimationFrame(() => overlay.classList.add('open'));
}

function _openDzikirSubModal(katId) {
    const kat  = DZIKIR_DATA[katId];
    if (!kat)  return;
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'id';

    // Buat sub-overlay kalau belum ada
    let sub = document.getElementById('dzikir-sub-overlay');
    if (!sub) {
        sub = document.createElement('div');
        sub.id        = 'dzikir-sub-overlay';
        sub.className = 'dzikir-sub-overlay';
        document.body.appendChild(sub);
        sub.addEventListener('click', e => {
            if (e.target === sub) sub.classList.remove('open');
        });
    }

    _dzikirActiveKat = katId;
    _dzikirCounters  = {};

    const label = lang === 'en' ? kat.label_en : kat.label_id;
    sub.innerHTML = `
        <div class="dzikir-sub-panel" style="--dz-color:${kat.color}">
            <div class="dzikir-sub-header">
                <button class="dzikir-sub-back" id="dzikir-sub-back" title="Kembali">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
                <div class="dzikir-sub-title">
                    <i class="fa-solid ${kat.icon}"></i>
                    <span>${label}</span>
                </div>
                <button class="dzikir-panel-close" id="dzikir-sub-close" title="Tutup">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="dzikir-sub-body" id="dzikir-sub-body"></div>
        </div>
    `;

    sub.querySelector('#dzikir-sub-back').addEventListener('click', () => sub.classList.remove('open'));
    sub.querySelector('#dzikir-sub-close').addEventListener('click', () => {
        sub.classList.remove('open');
        const mainOverlay = document.getElementById('dzikir-panel-overlay');
        if (mainOverlay) mainOverlay.classList.remove('open');
    });

    _renderDzikirBody();
    requestAnimationFrame(() => sub.classList.add('open'));
}

function _renderDzikirBody() {
    const body = document.getElementById('dzikir-sub-body');
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
