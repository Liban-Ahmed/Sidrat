/**
 * Curated collection of daily ayahs (Quran verses) for children.
 *
 * Short, meaningful verses with Arabic text, transliteration,
 * translation, and surah reference. Rotates daily.
 */

export interface Ayah {
  id: string;
  /** Arabic text of the verse */
  arabic: string;
  /** Latin-script phonetic rendering */
  transliteration: string;
  /** English meaning */
  translation: string;
  /** Surah name in English */
  surahName: string;
  /** Surah number */
  surahNumber: number;
  /** Ayah number within the surah */
  ayahNumber: number;
  /** Thematic tag for styling/context */
  theme:
    | 'mercy'
    | 'knowledge'
    | 'gratitude'
    | 'patience'
    | 'guidance'
    | 'faith'
    | 'nature'
    | 'prayer';
}

export const dailyAyahs: Ayah[] = [
  {
    id: 'ayah-1',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillāhir-Raḥmānir-Raḥīm',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    surahName: 'Al-Fatihah',
    surahNumber: 1,
    ayahNumber: 1,
    theme: 'mercy',
  },
  {
    id: 'ayah-2',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: "Inna ma'al-'usri yusrā",
    translation: 'Indeed, with hardship comes ease.',
    surahName: 'Ash-Sharh',
    surahNumber: 94,
    ayahNumber: 6,
    theme: 'patience',
  },
  {
    id: 'ayah-3',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    transliteration: "Wa qul rabbi zidnī 'ilmā",
    translation: 'And say: My Lord, increase me in knowledge.',
    surahName: 'Ta-Ha',
    surahNumber: 20,
    ayahNumber: 114,
    theme: 'knowledge',
  },
  {
    id: 'ayah-4',
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    transliteration: "La'in shakartum la'azīdannakum",
    translation: 'If you are grateful, I will surely increase you in favour.',
    surahName: 'Ibrahim',
    surahNumber: 14,
    ayahNumber: 7,
    theme: 'gratitude',
  },
  {
    id: 'ayah-5',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    transliteration: "Wa man yatawakkal 'alallāhi fahuwa ḥasbuh",
    translation: 'And whoever relies upon Allah — then He is sufficient for him.',
    surahName: 'At-Talaq',
    surahNumber: 65,
    ayahNumber: 3,
    theme: 'faith',
  },
  {
    id: 'ayah-6',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    transliteration: 'Fadhkurūnī adhkurkum',
    translation: 'So remember Me; I will remember you.',
    surahName: 'Al-Baqarah',
    surahNumber: 2,
    ayahNumber: 152,
    theme: 'prayer',
  },
  {
    id: 'ayah-7',
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    transliteration: "Wa lasawfa yu'ṭīka rabbuka fatarḍā",
    translation: 'And your Lord is going to give you, and you will be satisfied.',
    surahName: 'Ad-Duha',
    surahNumber: 93,
    ayahNumber: 5,
    theme: 'mercy',
  },
  {
    id: 'ayah-8',
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    transliteration: "Innallāha ma'aṣ-ṣābirīn",
    translation: 'Indeed, Allah is with the patient.',
    surahName: 'Al-Baqarah',
    surahNumber: 2,
    ayahNumber: 153,
    theme: 'patience',
  },
  {
    id: 'ayah-9',
    arabic: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ',
    transliteration: "Huwallāhul-ladhī lā ilāha illā huwa 'ālimul-ghaybi wash-shahādah",
    translation:
      'He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed.',
    surahName: 'Al-Hashr',
    surahNumber: 59,
    ayahNumber: 22,
    theme: 'faith',
  },
  {
    id: 'ayah-10',
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    transliteration: "Wa huwa ma'akum ayna mā kuntum",
    translation: 'And He is with you wherever you are.',
    surahName: 'Al-Hadid',
    surahNumber: 57,
    ayahNumber: 4,
    theme: 'faith',
  },
  {
    id: 'ayah-11',
    arabic: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
    transliteration: 'Wa naḥnu aqrabu ilayhi min ḥablil-warīd',
    translation: 'And We are closer to him than his jugular vein.',
    surahName: 'Qaf',
    surahNumber: 50,
    ayahNumber: 16,
    theme: 'mercy',
  },
  {
    id: 'ayah-12',
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    transliteration: "Innallāha lā yuḍī'u ajral-muḥsinīn",
    translation: 'Indeed, Allah does not allow to be lost the reward of those who do good.',
    surahName: 'Yusuf',
    surahNumber: 12,
    ayahNumber: 90,
    theme: 'guidance',
  },
  {
    id: 'ayah-13',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    transliteration: "Alā bidhikrillāhi taṭma'innul-qulūb",
    translation: 'Verily, in the remembrance of Allah do hearts find rest.',
    surahName: "Ar-Ra'd",
    surahNumber: 13,
    ayahNumber: 28,
    theme: 'prayer',
  },
  {
    id: 'ayah-14',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: "Fa inna ma'al-'usri yusrā",
    translation: 'For indeed, with hardship will be ease.',
    surahName: 'Ash-Sharh',
    surahNumber: 94,
    ayahNumber: 5,
    theme: 'patience',
  },
  {
    id: 'ayah-15',
    arabic: 'وَلِلَّهِ الْمَشْرِقُ وَالْمَغْرِبُ فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ',
    transliteration: 'Wa lillāhil-mashriqu wal-maghribu fa aynamā tuwallū fathamma wajhullāh',
    translation:
      'And to Allah belongs the east and the west. So wherever you turn, there is the Face of Allah.',
    surahName: 'Al-Baqarah',
    surahNumber: 2,
    ayahNumber: 115,
    theme: 'guidance',
  },
  {
    id: 'ayah-16',
    arabic: 'خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ بِالْحَقِّ',
    transliteration: 'Khalaqas-samāwāti wal-arḍa bil-ḥaqq',
    translation: 'He created the heavens and the earth in truth.',
    surahName: 'An-Nahl',
    surahNumber: 16,
    ayahNumber: 3,
    theme: 'nature',
  },
  {
    id: 'ayah-17',
    arabic: 'وَهُوَ الْغَفُورُ الْوَدُودُ',
    transliteration: 'Wa huwal-Ghafūrul-Wadūd',
    translation: 'And He is the Forgiving, the Affectionate.',
    surahName: 'Al-Buruj',
    surahNumber: 85,
    ayahNumber: 14,
    theme: 'mercy',
  },
  {
    id: 'ayah-18',
    arabic: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    transliteration: "Waṣbir fa innallāha lā yuḍī'u ajral-muḥsinīn",
    translation:
      'And be patient, for indeed Allah does not allow to be lost the reward of those who do good.',
    surahName: 'Hud',
    surahNumber: 11,
    ayahNumber: 115,
    theme: 'patience',
  },
  {
    id: 'ayah-19',
    arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    transliteration: "Wa mā khalaqtul-jinna wal-insa illā liya'budūn",
    translation: 'And I did not create the jinn and mankind except to worship Me.',
    surahName: 'Adh-Dhariyat',
    surahNumber: 51,
    ayahNumber: 56,
    theme: 'faith',
  },
  {
    id: 'ayah-20',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
    transliteration: "Yā ayyuhal-ladhīna āmanusta'īnū biṣ-ṣabri waṣ-ṣalāh",
    translation: 'O you who believe, seek help through patience and prayer.',
    surahName: 'Al-Baqarah',
    surahNumber: 2,
    ayahNumber: 153,
    theme: 'prayer',
  },
];

/**
 * Returns the ayah for today, rotating through the collection by day-of-year.
 * Uses a different offset than duas so they don't correlate.
 */
export function getAyahOfTheDay(): Ayah {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  // Offset by 7 so today's ayah and dua feel independent
  return dailyAyahs[(dayOfYear + 7) % dailyAyahs.length]!;
}
