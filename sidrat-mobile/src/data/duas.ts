/**
 * Curated collection of daily duas for children.
 *
 * Each dua includes Arabic text, transliteration, translation,
 * and a source reference. Rotates daily based on day-of-year.
 */

export interface Dua {
  id: string;
  /** Arabic text */
  arabic: string;
  /** Latin-script phonetic rendering */
  transliteration: string;
  /** English meaning */
  translation: string;
  /** Category for theming */
  category:
    | 'morning'
    | 'evening'
    | 'food'
    | 'travel'
    | 'sleep'
    | 'general'
    | 'protection'
    | 'gratitude';
  /** Where the dua comes from */
  source: string;
}

export const dailyDuas: Dua[] = [
  {
    id: 'dua-morning-1',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Aṣbaḥnā wa aṣbaḥal-mulku lillāh',
    translation: 'We have entered a new day and with it all dominion belongs to Allah.',
    category: 'morning',
    source: 'Muslim 2723',
  },
  {
    id: 'dua-sleep-1',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allāhumma amūtu wa aḥyā',
    translation: 'In Your name, O Allah, I die and I live.',
    category: 'sleep',
    source: 'Bukhari 6324',
  },
  {
    id: 'dua-food-1',
    arabic: 'بِسْمِ اللَّهِ وَبَرَكَةِ اللَّهِ',
    transliteration: 'Bismillāhi wa barakatillāh',
    translation: 'In the name of Allah and with the blessings of Allah.',
    category: 'food',
    source: 'Abu Dawud 3767',
  },
  {
    id: 'dua-protection-1',
    arabic:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ',
    transliteration: "Bismillāhil-ladhī lā yaḍurru ma'asmihi shay'un fil-arḍi wa lā fis-samā'",
    translation:
      'In the name of Allah, with Whose name nothing on earth or in the heavens can cause harm.',
    category: 'protection',
    source: 'Abu Dawud 5088',
  },
  {
    id: 'dua-general-1',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: "Rabbi zidnī 'ilmā",
    translation: 'My Lord, increase me in knowledge.',
    category: 'general',
    source: 'Quran 20:114',
  },
  {
    id: 'dua-gratitude-1',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا',
    transliteration: "Allāhumma innī as'aluka 'ilman nāfi'ā",
    translation: 'O Allah, I ask You for beneficial knowledge.',
    category: 'gratitude',
    source: 'Ibn Majah 925',
  },
  {
    id: 'dua-morning-2',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ',
    transliteration: 'Allāhumma bika aṣbaḥnā wa bika amsaynā wa bika naḥyā wa bika namūt',
    translation:
      'O Allah, by You we enter the morning, by You we enter the evening, by You we live and by You we die.',
    category: 'morning',
    source: 'Tirmidhi 3391',
  },
  {
    id: 'dua-travel-1',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
    transliteration: 'Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahū muqrinīn',
    translation:
      'Glory to Him who has subjected this to us, and we could never have it by our efforts.',
    category: 'travel',
    source: 'Quran 43:13',
  },
  {
    id: 'dua-food-2',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ',
    transliteration: "Alḥamdu lillāhil-ladhī aṭ'amanī hādhā wa razaqanīh",
    translation: 'All praise is for Allah who fed me this and provided it for me.',
    category: 'food',
    source: 'Abu Dawud 4023',
  },
  {
    id: 'dua-general-2',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
    transliteration: 'Rabbanā ātinā fid-dunyā ḥasanah wa fil-ākhirati ḥasanah',
    translation: 'Our Lord, give us good in this world and good in the Hereafter.',
    category: 'general',
    source: 'Quran 2:201',
  },
  {
    id: 'dua-evening-1',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: 'Amsaynā wa amsal-mulku lillāh',
    translation: 'We have entered the evening and with it all dominion belongs to Allah.',
    category: 'evening',
    source: 'Muslim 2723',
  },
  {
    id: 'dua-protection-2',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'ūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq",
    translation:
      'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    category: 'protection',
    source: 'Muslim 2708',
  },
  {
    id: 'dua-sleep-2',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allāhumma qinī 'adhābaka yawma tab'athu 'ibādak",
    translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
    category: 'sleep',
    source: 'Abu Dawud 5045',
  },
  {
    id: 'dua-general-3',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbish-raḥ lī ṣadrī wa yassir lī amrī',
    translation: 'My Lord, expand my chest and ease my task for me.',
    category: 'general',
    source: 'Quran 20:25-26',
  },
  {
    id: 'dua-gratitude-2',
    arabic: 'الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ',
    transliteration: "Alḥamdu lillāhi 'alā kulli ḥāl",
    translation: 'All praise is for Allah in every circumstance.',
    category: 'gratitude',
    source: 'Ibn Majah 3803',
  },
  {
    id: 'dua-morning-3',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration: "Allāhumma innī as'alukal-'āfiyata fid-dunyā wal-ākhirah",
    translation: 'O Allah, I ask You for well-being in this world and the next.',
    category: 'morning',
    source: 'Abu Dawud 5074',
  },
  {
    id: 'dua-general-4',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Ḥasbunallāhu wa ni'mal-wakīl",
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
    category: 'general',
    source: 'Quran 3:173',
  },
  {
    id: 'dua-evening-2',
    arabic: 'أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: "A'ūdhu billāhis-samī'il-'alīmi minash-shayṭānir-rajīm",
    translation:
      'I seek refuge in Allah, the All-Hearing, the All-Knowing, from the accursed Shaytan.',
    category: 'evening',
    source: 'Abu Dawud 775',
  },
  {
    id: 'dua-general-5',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allāhumma a'innī 'alā dhikrika wa shukrika wa ḥusni 'ibādatik",
    translation:
      'O Allah, help me to remember You, to be grateful to You, and to worship You well.',
    category: 'general',
    source: 'Abu Dawud 1522',
  },
  {
    id: 'dua-protection-3',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillāhi tawakkaltu 'alallāhi wa lā ḥawla wa lā quwwata illā billāh",
    translation:
      'In the name of Allah, I place my trust in Allah, and there is no power nor might except with Allah.',
    category: 'protection',
    source: 'Abu Dawud 5095',
  },
];

/**
 * Returns the dua for today, rotating through the collection by day-of-year.
 */
export function getDuaOfTheDay(): Dua {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dailyDuas[dayOfYear % dailyDuas.length]!;
}
