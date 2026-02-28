/**
 * Du'a (Supplications) Unit — Curriculum Content
 *
 * Teaching children about du'a and everyday supplications.
 * Includes Arabic text + transliteration + audio references for each du'a.
 * All hadith references verified against sunnah.com.
 * All Quran verses verified against quran.com.
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

export const duaaUnit: CurriculumUnit = {
  id: 'duaa-01',
  title: 'Talking to Allah',
  description: "Learn beautiful du'as for everyday life",
  category: 'duaa',
  order: 1,
  icon: 'hand-left',
  lessonIds: ['duaa-01-01', 'duaa-01-02', 'duaa-01-03'],
};

export const duaaLessons: CurriculumLesson[] = [
  // ─── Lesson 1: What is Du'a? ──────────────────────────────────
  {
    id: 'duaa-01-01',
    title: "What is Du'a?",
    description: "Learn what du'a is and why Allah loves when we talk to Him",
    category: 'duaa',
    difficulty: 'beginner',
    durationMinutes: 6,
    xpReward: 25,
    order: 1,
    unitId: 'duaa-01',
    minAgeGroup: 'toddler',
    tags: ['duaa', 'supplication', 'worship', 'talking-to-allah'],

    hook: {
      type: 'hook',
      prompt:
        "What if you could talk to the most powerful, most loving Being in the entire universe — anytime, anywhere, in any language? Well, you can! That is what du'a is all about!",
      narration:
        "What if you could talk to the most powerful and most loving Being in the universe, anytime and anywhere? You can! That is what du'a is. Let us learn about this amazing gift!",
      illustration: 'duaa-what-is',
    },

    teach: [
      {
        type: 'teach',
        title: "Du'a — Talking to Allah",
        body: "**Du'a** (دُعَاء) means \"calling upon\" Allah. It is when you talk directly to Allah — asking Him for help, thanking Him, or asking for forgiveness.\n\nUnlike salah (prayer), which has specific movements and words, **du'a is personal**. You can make du'a:\n• In any language\n• At any time\n• In any position\n• About anything!\n\nThe Prophet ﷺ said: **\"Du'a IS worship.\"** (Jami' at-Tirmidhi 3372). Making du'a is one of the best things you can do!",
        narration:
          "Du'a means calling upon Allah. It is when you talk directly to Allah. You can make du'a in any language, at any time, about anything. The Prophet said: Du'a IS worship.",
        arabic: {
          text: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
          transliteration: "Ad-du'ā'u huwal-ʿibādah",
          translation: "Du'a IS worship.",
        },
        keyTerms: [
          {
            term: "Du'a",
            definition: 'Calling upon Allah — talking to Him directly, asking for anything',
          },
          {
            term: 'Ibadah',
            definition: "Worship — and du'a is one of the greatest forms of worship",
          },
        ],
        illustration: 'duaa-hands-raised',
      },
      {
        type: 'teach',
        title: 'Allah Promises to Answer!',
        body: 'Here is the most amazing part — **Allah promises to respond** when you call on Him!\n\nAllah says in the Quran: **"Call upon Me; I will respond to you."** (Quran 40:60)\n\nAnd in another beautiful verse, Allah says: **"I am near. I respond to the one who calls upon Me."** (Quran 2:186)\n\nNotice — Allah didn\'t say "Tell them I am near." He said **"I am near"** directly. No middle-man needed between you and Allah!',
        narration:
          "The most amazing part is that Allah promises to respond! He says: Call upon Me and I will respond to you. He also says: I am near. I respond when you call upon Me. Allah hears every du'a!",
        arabic: {
          text: 'وَقَالَ رَبُّكُمُ ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ',
          transliteration: 'Wa qāla Rabbukumud-ʿūnī astajib lakum',
          translation: 'And your Lord says, "Call upon Me; I will respond to you."',
          quranRef: { surah: 40, ayah: 60, globalAyahNumbers: [4193] },
        },
        keyTerms: [
          {
            term: 'Istijabah',
            definition: "Response — Allah promises to respond to every du'a",
          },
        ],
        illustration: 'duaa-allah-responds',
      },
    ],

    practice: [
      {
        id: 'du-01-01-p1',
        type: 'quiz',
        question: "What did the Prophet ﷺ say about du'a?",
        options: [
          "Du'a is only for adults",
          "Du'a IS worship",
          "Du'a must be in Arabic only",
          "Du'a only works on Fridays",
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          "The Prophet ﷺ said: \"Du'a IS worship.\" Making du'a is one of the best acts of worship! (Jami' at-Tirmidhi 3372)",
      },
      {
        id: 'du-01-01-p2',
        type: 'true-false',
        statement: "You can only make du'a in Arabic.",
        correctAnswer: false,
        points: 10,
        explanation:
          "You can make du'a in ANY language! Allah understands all languages. Specific du'as from the Quran and Sunnah are in Arabic, but personal du'as can be in any language.",
      },
      {
        id: 'du-01-01-p3',
        type: 'quiz',
        question: "What does Allah promise when we make du'a? (Quran 40:60)",
        options: [
          'He will think about it',
          'He will respond to us',
          'He might hear us',
          "He only hears loud du'as",
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          'Allah directly promises: "Call upon Me; I will respond to you." (Quran 40:60)',
      },
      {
        id: 'du-01-01-p4',
        type: 'tap-word',
        instruction: "Tap the words to build Allah's promise about du'a:",
        words: ['respond', 'Call', 'I', 'upon', 'you', 'will', 'Me', 'to'],
        correctSentence: ['Call', 'upon', 'Me', 'I', 'will', 'respond', 'to', 'you'],
        points: 15,
        hint: 'This is from Quran 40:60.',
        explanation:
          '"Call upon Me; I will respond to you" — this is Allah\'s direct promise! (Quran 40:60)',
      },
    ],

    reward: {
      message:
        "Mashallah! Now you know that du'a is one of the most powerful things you can do. Talk to Allah — He is always listening! 🤲",
      funFact:
        "The best times for du'a include: the last third of the night, while prostrating in prayer, between the adhan and iqamah, and on Fridays!",
      bonusDua: {
        arabic: 'رَبِّ زِدْنِي عِلْمًا',
        transliteration: 'Rabbi zidnī ʿilmā',
        translation: 'My Lord, increase me in knowledge. (Quran 20:114)',
      },
    },
  },

  // ─── Lesson 2: Morning & Evening Du'as ─────────────────────────
  {
    id: 'duaa-01-02',
    title: "Morning & Evening Du'as",
    description: "Learn the special du'as that protect you day and night",
    category: 'duaa',
    difficulty: 'beginner',
    durationMinutes: 8,
    xpReward: 35,
    order: 2,
    unitId: 'duaa-01',
    minAgeGroup: 'toddler',
    tags: ['duaa', 'morning', 'evening', 'adhkar', 'ayat-al-kursi', 'protection'],

    hook: {
      type: 'hook',
      prompt:
        "What if you had a special shield that protected you all day and all night? Muslims have special words they say every morning and evening that are like a spiritual shield! Let's learn them.",
      narration:
        'What if you had a special shield that protected you every day and every night? Muslims have special words they say every morning and evening. They are like a spiritual shield. Let us learn them!',
      illustration: 'duaa-morning-evening',
    },

    teach: [
      {
        type: 'teach',
        title: 'Ayat al-Kursi — The Greatest Verse',
        body: "**Ayat al-Kursi** (The Verse of the Throne) is the **greatest verse in the entire Quran**! (Sahih Muslim 810)\n\nThe Prophet ﷺ taught us that if you recite Ayat al-Kursi before sleeping, **a guardian from Allah will protect you all night**, and no devil will come near you until morning. (Sahih al-Bukhari 5010)\n\nThis powerful verse tells us about Allah's greatness — He is the Ever-Living, the Self-Sustaining, and His Throne extends over the heavens and the earth!",
        narration:
          'Ayat al-Kursi is the greatest verse in the entire Quran! If you say it before sleeping, a guardian from Allah will protect you all night. Let us learn this amazing verse.',
        arabic: {
          text: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ',
          transliteration:
            "Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm. Lā ta'khudhuhu sinatun wa lā nawm.",
          translation:
            'Allah — there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep.',
          quranRef: { surah: 2, ayah: 255, globalAyahNumbers: [262] },
        },
        keyTerms: [
          {
            term: 'Ayat al-Kursi',
            definition: 'The Verse of the Throne (Quran 2:255) — the greatest verse in the Quran',
          },
          {
            term: 'Al-Hayy',
            definition: "The Ever-Living — one of Allah's beautiful names in this verse",
          },
        ],
        illustration: 'duaa-ayat-kursi',
      },
      {
        type: 'teach',
        title: 'Morning Remembrance',
        body: 'Every morning, Muslims say special words to start the day with Allah\'s remembrance:\n\n**"We have entered the morning and the dominion belongs to Allah. All praise is due to Allah. There is no deity except Allah alone, with no partner. To Him belongs the dominion and all praise, and He is over all things competent."**\n\n(From Sunan Abu Dawud 5071)\n\nThe Prophet ﷺ also taught us to recite the **Three Quls** (Surah Al-Ikhlas, Al-Falaq, and An-Nas) **3 times each** every morning and evening — they will protect you from everything! (Sunan Abu Dawud 5082)',
        narration:
          'Every morning we say special words to remember Allah. We also recite the Three Quls: Surah Al-Ikhlas, Al-Falaq, and An-Nas, three times each. They protect us from everything!',
        arabic: {
          text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
          transliteration: 'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh',
          translation:
            'We have entered the morning and the dominion belongs to Allah, and all praise is due to Allah.',
        },
        keyTerms: [
          {
            term: 'Adhkar',
            definition: 'Remembrances of Allah — special words we say at certain times of day',
          },
          {
            term: 'The Three Quls',
            definition:
              'Surah Al-Ikhlas, Al-Falaq, and An-Nas — recited for morning/evening protection',
          },
        ],
        illustration: 'duaa-morning-dhikr',
      },
      {
        type: 'teach',
        title: 'After-Prayer Remembrance',
        body: 'After every prayer, the Prophet ﷺ taught us to say these three phrases:\n\n• **SubhanAllah** — Glory be to Allah (33 times)\n• **Alhamdulillah** — All praise is due to Allah (33 times)\n• **Allahu Akbar** — Allah is the Greatest (34 times)\n\nThat makes **100 total**! The Prophet ﷺ said whoever does this will have their sins forgiven — even if they were as much as the foam of the sea! (Sahih Muslim 597a)',
        narration:
          'After every prayer, we say SubhanAllah thirty-three times, Alhamdulillah thirty-three times, and Allahu Akbar thirty-four times. That is one hundred. The Prophet said your sins will be forgiven, even if they were as much as the foam of the sea!',
        arabic: {
          text: 'سُبْحَانَ اللَّهِ — الْحَمْدُ لِلَّهِ — اللَّهُ أَكْبَرُ',
          transliteration: 'SubḥānAllāh — Al-ḥamdu lillāh — Allāhu Akbar',
          translation: 'Glory be to Allah — All praise is due to Allah — Allah is the Greatest',
        },
        illustration: 'duaa-tasbih',
      },
    ],

    practice: [
      {
        id: 'du-01-02-p1',
        type: 'quiz',
        question: 'What is the greatest verse in the entire Quran?',
        options: ['Surah Al-Fatiha', 'Ayat al-Kursi (2:255)', 'Surah Al-Ikhlas', 'The last verse'],
        correctIndex: 1,
        points: 10,
        explanation:
          'Ayat al-Kursi (Quran 2:255) is the greatest verse in the Quran. (Sahih Muslim 810)',
      },
      {
        id: 'du-01-02-p2',
        type: 'quiz',
        question: 'What happens if you recite Ayat al-Kursi before sleeping?',
        options: [
          'You will have good dreams',
          'A guardian from Allah protects you all night',
          'You will wake up early',
          'Nothing special happens',
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          'The Prophet ﷺ confirmed that reciting Ayat al-Kursi before sleeping brings a guardian from Allah who protects you until morning. (Sahih al-Bukhari 5010)',
      },
      {
        id: 'du-01-02-p3',
        type: 'matching',
        instruction: 'Match each dhikr with how many times you say it after prayer:',
        pairs: [
          { left: 'SubhanAllah', right: '33 times' },
          { left: 'Alhamdulillah', right: '33 times' },
          { left: 'Allahu Akbar', right: '34 times' },
        ],
        points: 15,
        explanation:
          '33 + 33 + 34 = 100! The Prophet ﷺ said doing this after every prayer leads to forgiveness of sins. (Sahih Muslim 597a)',
      },
      {
        id: 'du-01-02-p4',
        type: 'true-false',
        statement:
          'The Three Quls (Al-Ikhlas, Al-Falaq, An-Nas) should be recited 3 times each every morning and evening.',
        correctAnswer: true,
        points: 10,
        explanation:
          'The Prophet ﷺ said: "Recite them three times in the morning and evening; they will suffice you against everything." (Sunan Abu Dawud 5082)',
      },
    ],

    reward: {
      message:
        "Mashallah! You now know the du'as that protect you morning, evening, and after every prayer! Start using them today! 🌅",
      funFact:
        'The full Ayat al-Kursi describes 9 attributes of Allah in just one verse — no wonder it is the greatest verse in the Quran!',
      bonusDua: {
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: "A'ūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq",
        translation:
          'I seek refuge in the perfect words of Allah from the evil of what He has created. (Sahih Muslim 2708)',
      },
    },
  },

  // ─── Lesson 3: Du'a Before Eating & Sleeping ──────────────────
  {
    id: 'duaa-01-03',
    title: "Du'a Before Eating & Sleeping",
    description: "Learn the daily du'as for meals and bedtime",
    category: 'duaa',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 30,
    order: 3,
    unitId: 'duaa-01',
    minAgeGroup: 'toddler',
    tags: ['duaa', 'eating', 'sleeping', 'waking', 'daily', 'bismillah'],

    hook: {
      type: 'hook',
      prompt:
        'Every time you eat and every time you go to sleep, there are special words the Prophet ﷺ taught us to say. These words turn everyday moments into worship! Ready to learn them?',
      narration:
        'Every time you eat and every time you go to sleep, there are special words to say. These words turn everyday moments into worship! Let us learn them.',
      illustration: 'duaa-eating-sleeping',
    },

    teach: [
      {
        type: 'teach',
        title: "Du'as for Eating",
        body: '**Before Eating:** Say **"Bismillah"** (In the Name of Allah).\n\nThe Prophet ﷺ told a young boy: "O young boy, say Bismillah, eat with your right hand, and eat from what is nearest to you." (Sahih al-Bukhari 5376)\n\n**Forgot?** If you forgot to say Bismillah at the start, say: **"Bismillahi fi awwalihi wa akhirihi"** — "In the Name of Allah, at its beginning and end." (Sunan Abu Dawud 3767)\n\n**After Eating:** Say the du\'a of gratitude to Allah for the food — the Prophet ﷺ said whoever says this du\'a will have their previous sins forgiven! (Jami\' at-Tirmidhi 3458)',
        narration:
          "Before eating, say Bismillah. If you forgot, say Bismillahi fi awwalihi wa akhirihi, which means In the Name of Allah, at its beginning and end. After eating, say the special du'a, and the Prophet said your sins will be forgiven!",
        arabic: {
          text: 'بِسْمِ اللَّهِ',
          transliteration: 'Bismillāh',
          translation: 'In the Name of Allah.',
        },
        keyTerms: [
          {
            term: 'Bismillah',
            definition: 'In the Name of Allah — said before eating and before any action',
          },
        ],
        illustration: 'duaa-before-eating',
      },
      {
        type: 'teach',
        title: "The After-Eating Du'a",
        body: "After finishing your meal, say this beautiful du'a:\n\n**\"All praise is due to Allah Who has fed me this and provided me with it, without any power or effort on my part.\"**\n\nThe Prophet ﷺ said whoever says this after eating will have their previous sins forgiven! (Jami' at-Tirmidhi 3458)\n\nThis du'a reminds us that every meal comes from Allah — we could not have eaten without His provision.",
        narration:
          'After eating, say: All praise is due to Allah Who has fed me this and provided me with it, without any power or effort on my part. The Prophet said whoever says this will have their previous sins forgiven!',
        arabic: {
          text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ',
          transliteration:
            'Al-ḥamdu lillāhil-ladhī aṭʿamanī hādhā wa razaqanīhi min ghayri ḥawlin minnī wa lā quwwah',
          translation:
            'All praise is due to Allah Who has fed me this and provided me with it, without any power or effort on my part.',
        },
        illustration: 'duaa-after-eating',
      },
      {
        type: 'teach',
        title: "Du'as for Sleeping & Waking",
        body: '**Before Sleeping:** The Prophet ﷺ would say:\n**"In Your Name, O Allah, I die and I live."**\n"I die and I live" — because sleep is like a mini-death; our souls are taken by Allah and returned when we wake up.\n\n**Upon Waking Up:** He would say:\n**"All praise is due to Allah Who has given us life after causing us to die, and to Him is the resurrection."** (Sahih al-Bukhari 6324)\n\nEvery morning when you wake up is a blessing from Allah — He gave your soul back!',
        narration:
          'Before sleeping, say: In Your Name O Allah, I die and I live. Sleep is like a mini-death because Allah takes our souls and gives them back when we wake up. In the morning, say: All praise is due to Allah Who has given us life after causing us to die.',
        arabic: {
          text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
          transliteration: 'Bismika Allāhumma amūtu wa aḥyā',
          translation: 'In Your Name, O Allah, I die and I live.',
        },
        keyTerms: [
          {
            term: 'Naum (Sleep)',
            definition:
              'Sleep is like a small death — Allah takes our souls and returns them when we wake',
          },
        ],
        illustration: 'duaa-sleeping',
      },
    ],

    practice: [
      {
        id: 'du-01-03-p1',
        type: 'quiz',
        question: 'What do you say before eating?',
        options: ['Alhamdulillah', 'Allahu Akbar', 'Bismillah', 'SubhanAllah'],
        correctIndex: 2,
        points: 10,
        explanation:
          'We say Bismillah (In the Name of Allah) before eating! (Sahih al-Bukhari 5376)',
      },
      {
        id: 'du-01-03-p2',
        type: 'fill-blank',
        sentence: 'If you forgot to say Bismillah, say: "Bismillahi fi ___ wa akhirihi."',
        acceptedAnswers: ['awwalihi', 'awwalih', 'its beginning'],
        points: 10,
        hint: 'It means "at its beginning and end."',
        explanation:
          'If you forgot, say "Bismillahi fi awwalihi wa akhirihi" — In the Name of Allah, at its beginning and end. (Sunan Abu Dawud 3767)',
      },
      {
        id: 'du-01-03-p3',
        type: 'matching',
        instruction: "Match each du'a with when you say it:",
        pairs: [
          { left: 'Bismillah', right: 'Before eating' },
          { left: 'Bismika Allahumma amutu wa ahya', right: 'Before sleeping' },
          { left: 'Alhamdulillah alladhi ahyana...', right: 'Upon waking up' },
        ],
        points: 15,
        explanation:
          "These daily du'as turn everyday moments — eating, sleeping, waking — into worship!",
      },
      {
        id: 'du-01-03-p4',
        type: 'true-false',
        statement:
          "The Prophet ﷺ said that saying the after-eating du'a leads to forgiveness of previous sins.",
        correctAnswer: true,
        points: 10,
        explanation:
          "The Prophet ﷺ said whoever says the du'a after eating will have their previous sins forgiven. (Jami' at-Tirmidhi 3458)",
      },
    ],

    reward: {
      message:
        "Wonderful! Now you know du'as for eating and sleeping. Try saying them every day — turn your routine into worship! 🌙",
      funFact:
        'The du\'a upon waking up — "Alhamdulillah alladhi ahyana ba\'da ma amatana" — reminds us that every single morning is a gift. Allah returned your soul to you!',
      bonusDua: {
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Al-ḥamdu lillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr',
        translation:
          'All praise is due to Allah Who has given us life after causing us to die, and to Him is the resurrection. (Sahih al-Bukhari 6312)',
      },
    },
  },
];
