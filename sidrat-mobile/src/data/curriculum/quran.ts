/**
 * Quran Basics Unit — Curriculum Content
 *
 * Teaching children about the Quran, its importance, and short surahs.
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

export const quranUnit: CurriculumUnit = {
  id: 'quran-01',
  title: 'Quran Basics',
  description: "Discover Allah's Book — the Quran",
  category: 'quran',
  order: 1,
  icon: 'book-outline',
  lessonIds: ['quran-01-01', 'quran-01-02', 'quran-01-03'],
};

export const quranLessons: CurriculumLesson[] = [
  // ── Lesson 1: The Quran — Allah's Book ──────────────────────

  {
    id: 'quran-01-01',
    title: "The Quran — Allah's Book",
    description: 'Learn what the Quran is and why it is so special',
    category: 'quran',
    difficulty: 'beginner',
    durationMinutes: 5,
    xpReward: 25,
    order: 1,
    unitId: 'quran-01',
    minAgeGroup: 'toddler',
    tags: ['quran', 'revelation', 'jibreel'],

    hook: {
      type: 'hook',
      prompt:
        'Imagine getting a letter from the most important person ever — not just any letter, but a perfect guide for your whole life. That is what the Quran is — a message from Allah to all of us!',
      narration:
        'Imagine getting a special message from the most important being ever. The Quran is a message from Allah to all of humanity. Let us learn about this amazing book!',
      illustration: 'quran-book',
    },

    teach: [
      {
        type: 'teach',
        title: 'What is the Quran?',
        body: 'The **Quran** is the holy book of Islam. It is the **word of Allah**, sent down to Prophet Muhammad ﷺ through the angel **Jibreel** (Gabriel).\n\nThe Quran was revealed over **23 years** and contains **114 chapters** called **surahs**.\n\nIt is the most read book in the world! Millions of Muslims recite it every single day.',
        narration:
          'The Quran is the holy book of Islam. It is the word of Allah, sent to Prophet Muhammad through the angel Jibreel. It has 114 chapters called surahs.',
        keyTerms: [
          { term: 'Quran', definition: "Allah's final book, revealed to Prophet Muhammad ﷺ" },
          { term: 'Surah', definition: 'A chapter of the Quran' },
          { term: 'Jibreel', definition: 'The angel who brought the Quran to the Prophet ﷺ' },
        ],
        illustration: 'quran-revelation',
      },
      {
        type: 'teach',
        title: 'Why is the Quran Special?',
        body: 'The Quran is special because:\n\n1. It is **Allah\'s own words** — not written by any human\n2. It has been **perfectly preserved** — not a single letter changed in 1400+ years\n3. It is a **guide for life** — teaching us how to be good, kind, and close to Allah\n4. **Reciting it is worship** — you earn rewards just by reading it!\n\nThe Prophet ﷺ said: *"The best of you are those who learn the Quran and teach it."* (Bukhari)',
        narration:
          "The Quran is special because it is Allah's own words. It has never been changed. It guides us in life. And just reading it earns us rewards from Allah!",
        arabic: {
          text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
          transliteration: "Khairukum man ta'allamal-Qur'ana wa 'allamah",
          translation: 'The best of you are those who learn the Quran and teach it',
        },
        illustration: 'quran-preserved',
      },
    ],

    practice: [
      {
        id: 'qur-01-01-p1',
        type: 'quiz',
        question: 'How many surahs (chapters) are in the Quran?',
        options: ['30', '66', '114', '200'],
        correctIndex: 2,
        points: 10,
        explanation: 'The Quran has 114 surahs, from Al-Fatiha to An-Nas.',
      },
      {
        id: 'qur-01-01-p2',
        type: 'quiz',
        question: 'Which angel brought the Quran to Prophet Muhammad ﷺ?',
        options: ['Mikail', 'Israfeel', 'Jibreel', 'Azrael'],
        correctIndex: 2,
        points: 10,
        explanation: 'Jibreel (Gabriel) is the angel who brought the revelation to the Prophet ﷺ.',
      },
      {
        id: 'qur-01-01-p3',
        type: 'true-false',
        statement: 'The Quran was revealed all at once in one day.',
        correctAnswer: false,
        points: 10,
        explanation:
          'The Quran was revealed over 23 years, little by little, to help people understand and follow it.',
      },
      {
        id: 'qur-01-01-p4',
        type: 'tap-word',
        instruction: 'Build the sentence about the Quran:',
        words: ['Quran', 'is', 'the', 'the', 'word', 'of', 'Allah'],
        correctSentence: ['the', 'Quran', 'is', 'the', 'word', 'of', 'Allah'],
        points: 10,
        hint: 'Start with "the Quran".',
        explanation:
          'The Quran is the word of Allah, revealed to Prophet Muhammad ﷺ through Angel Jibreel.',
      },
    ],

    reward: {
      message: "Mashallah! You learned about Allah's incredible Book! 📖",
      funFact:
        'The Quran has been memorized completely by millions of people, including young children! People who memorize the whole Quran are called "Hafiz".',
      bonusDua: {
        arabic: 'اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي',
        transliteration: "Allahumma-j'alil-Qur'ana rabee'a qalbi",
        translation: 'O Allah, make the Quran the spring (joy) of my heart',
      },
    },
  },

  // ── Lesson 2: Surah Al-Fatiha ───────────────────────────────

  {
    id: 'quran-01-02',
    title: 'Surah Al-Fatiha',
    description: 'Learn the opening chapter of the Quran',
    category: 'quran',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 35,
    order: 2,
    unitId: 'quran-01',
    minAgeGroup: 'toddler',
    tags: ['quran', 'fatiha', 'recitation', 'surah'],

    hook: {
      type: 'hook',
      prompt:
        'There is one surah that every Muslim recites at least 17 times a day! It is the very first surah in the Quran. Do you know its name?',
      narration:
        'There is a surah that Muslims recite at least 17 times every day in their prayers. It is called Surah Al-Fatiha, the Opening. Let us learn it together!',
      illustration: 'quran-fatiha',
    },

    teach: [
      {
        type: 'teach',
        title: 'The Greatest Surah',
        body: '**Surah Al-Fatiha** means "The Opening." It is the first surah of the Quran and has **7 verses**.\n\nThe Prophet ﷺ said it is the **greatest surah** in the Quran! We recite it in every raka\'ah of every prayer.\n\nIt starts with **"Bismillah"** — In the name of Allah.',
        narration:
          'Surah Al-Fatiha means The Opening. It has 7 beautiful verses. The Prophet said it is the greatest surah in the Quran. We recite it in every prayer.',
        arabic: {
          text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          transliteration: 'Bismillahir-Rahmanir-Raheem',
          translation: 'In the name of Allah, the Most Merciful, the Especially Merciful',
          quranRef: { surah: 1, ayah: 1, globalAyahNumbers: [1] },
        },
        keyTerms: [
          { term: 'Al-Fatiha', definition: 'The Opening — the first and greatest surah' },
          { term: 'Bismillah', definition: 'In the name of Allah — how we begin everything' },
        ],
        illustration: 'quran-fatiha-text',
      },
      {
        type: 'teach',
        title: 'What Al-Fatiha Teaches Us',
        body: 'Al-Fatiha is like a beautiful conversation with Allah:\n\n1. We **praise Allah** — "All praise is for Allah, Lord of all worlds"\n2. We remember His **mercy** — "The Most Merciful, the Especially Merciful"\n3. We remember the **Day of Judgment** — "Master of the Day of Judgment"\n4. We ask for **help** — "You alone we worship, You alone we ask for help"\n5. We ask for **guidance** — "Guide us to the straight path"\n\nWhen you recite Al-Fatiha, Allah responds to each verse!',
        narration:
          'Al-Fatiha is a conversation with Allah. We praise Him. We remember His mercy. And we ask Him for guidance to the straight path.',
        arabic: {
          text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
          transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
          translation: 'You alone we worship, and You alone we ask for help',
          quranRef: { surah: 1, ayah: 5, globalAyahNumbers: [5] },
        },
        illustration: 'quran-fatiha-meaning',
      },
    ],

    practice: [
      {
        id: 'qur-01-02-p1',
        type: 'quiz',
        question: 'How many verses does Surah Al-Fatiha have?',
        options: ['3', '5', '7', '10'],
        correctIndex: 2,
        points: 10,
        explanation: 'Surah Al-Fatiha has 7 beautiful verses.',
      },
      {
        id: 'qur-01-02-p2',
        type: 'fill-blank',
        sentence: 'Surah Al-Fatiha begins with ___ — In the name of Allah.',
        acceptedAnswers: ['Bismillah', 'bismillah', 'بسم الله', 'Bismillahir-Rahmanir-Raheem'],
        points: 10,
        hint: 'We say this before starting anything...',
        explanation:
          'Bismillahir-Rahmanir-Raheem — In the name of Allah, the Most Merciful, the Especially Merciful.',
      },
      {
        id: 'qur-01-02-p3',
        type: 'matching',
        instruction: 'Match the Arabic phrase with its meaning:',
        pairs: [
          { left: 'Alhamdulillah', right: 'All praise is for Allah' },
          { left: 'Ar-Rahman', right: 'The Most Merciful' },
          { left: 'Ihdinas-siratal-mustaqeem', right: 'Guide us to the straight path' },
        ],
        points: 15,
        explanation: 'These are key phrases from Surah Al-Fatiha.',
      },
    ],

    reward: {
      message: 'Alhamdulillah! You learned about the greatest surah! 🌟',
      funFact:
        'Al-Fatiha is also called "Umm al-Quran" (Mother of the Quran) and "As-Sab\' al-Mathani" (The Seven Oft-Repeated Verses).',
      bonusDua: {
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinas-siratal-mustaqeem',
        translation: 'Guide us to the straight path — the most important dua we make!',
      },
    },
  },

  // ── Lesson 3: Short Surahs ──────────────────────────────────

  {
    id: 'quran-01-03',
    title: 'The Short Surahs',
    description: 'Learn Al-Ikhlas, Al-Falaq, and An-Nas',
    category: 'quran',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 35,
    order: 3,
    unitId: 'quran-01',
    minAgeGroup: 'toddler',
    tags: ['quran', 'ikhlas', 'falaq', 'nas', 'short-surahs'],

    hook: {
      type: 'hook',
      prompt:
        'Did you know there is a surah so powerful that reciting it is like reading one-third of the entire Quran? It is only 4 verses long! Can you guess which one?',
      narration:
        'There is a surah so powerful that it equals one-third of the Quran! And it is very short. Let us discover these amazing short surahs together!',
      illustration: 'quran-short-surahs',
    },

    teach: [
      {
        type: 'teach',
        title: 'Surah Al-Ikhlas (The Sincerity)',
        body: 'Surah Al-Ikhlas is surah **number 112**. It has only **4 verses** but it teaches the most important concept in Islam: **Tawheed** (the Oneness of Allah).\n\nThe Prophet ﷺ said reciting it is equal to **one-third of the Quran**!\n\n*"Say: He is Allah, the One. Allah, the Self-Sufficient. He neither begets nor is born. And there is none like Him."*',
        narration:
          'Surah Al-Ikhlas has only 4 verses. It teaches us about Tawheed, that Allah is One. The Prophet said reciting it equals one-third of the Quran!',
        arabic: {
          text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ',
          transliteration: 'Qul huwa Allahu ahad. Allahus-Samad.',
          translation: 'Say: He is Allah, the One. Allah, the Self-Sufficient.',
          quranRef: { surah: 112, ayah: 1, endAyah: 2, globalAyahNumbers: [6222, 6223] },
        },
        keyTerms: [
          { term: 'Al-Ikhlas', definition: 'The Sincerity — surah about Allah being One' },
          {
            term: 'As-Samad',
            definition: 'The Self-Sufficient — Allah needs nothing, everything needs Him',
          },
        ],
        illustration: 'quran-ikhlas',
      },
      {
        type: 'teach',
        title: 'Al-Falaq & An-Nas (The Protection Surahs)',
        body: "The last two surahs of the Quran are called **Al-Mu'awwidhatayn** (The Two Protectors).\n\n**Surah Al-Falaq** (113): We ask Allah to protect us from evil, darkness, and jealousy.\n\n**Surah An-Nas** (114): We ask Allah to protect us from whispering thoughts that try to lead us astray.\n\nThe Prophet ﷺ recited them every night before sleeping!",
        narration:
          'The last two surahs are called The Two Protectors. In Al-Falaq, we ask Allah to protect us from evil. In An-Nas, we ask Allah to protect us from bad thoughts. The Prophet recited them every night!',
        arabic: {
          text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
          transliteration: "Qul a'udhu bi Rabbin-Nas",
          translation: 'Say: I seek refuge in the Lord of mankind',
          quranRef: { surah: 114, ayah: 1, globalAyahNumbers: [6231] },
        },
        keyTerms: [
          { term: 'Al-Falaq', definition: 'The Daybreak — seeking protection from evil' },
          { term: 'An-Nas', definition: 'Mankind — seeking protection from whispering evil' },
        ],
        illustration: 'quran-protection',
      },
    ],

    practice: [
      {
        id: 'qur-01-03-p1',
        type: 'quiz',
        question: 'Which surah is equal to one-third of the Quran?',
        options: ['Al-Fatiha', 'Al-Ikhlas', 'Al-Baqarah', 'Al-Falaq'],
        correctIndex: 1,
        points: 10,
        explanation:
          'Surah Al-Ikhlas is equal to one-third of the Quran because it perfectly explains Tawheed!',
      },
      {
        id: 'qur-01-03-p2',
        type: 'matching',
        instruction: 'Match each surah with its theme:',
        pairs: [
          { left: 'Al-Ikhlas', right: 'Allah is One' },
          { left: 'Al-Falaq', right: 'Protection from evil' },
          { left: 'An-Nas', right: 'Protection from whispering' },
        ],
        points: 15,
        explanation: 'These three short surahs teach powerful lessons!',
      },
      {
        id: 'qur-01-03-p3',
        type: 'true-false',
        statement: 'The Prophet ﷺ used to recite Al-Falaq and An-Nas before sleeping.',
        correctAnswer: true,
        points: 10,
        explanation:
          'Yes! The Prophet ﷺ would recite these protection surahs every night before sleeping.',
      },
    ],

    reward: {
      message: "Mashallah! You learned three powerful surahs! You're becoming a Quran reader! 🌙",
      funFact:
        'If you recite Surah Al-Ikhlas 3 times, it equals the reward of reciting the entire Quran once! Try it tonight before you sleep.',
      bonusDua: {
        arabic: 'اللَّهُمَّ عَلِّمْنِي الْقُرْآنَ',
        transliteration: "Allahumma 'allimnil-Qur'an",
        translation: 'O Allah, teach me the Quran',
      },
    },
  },
];
