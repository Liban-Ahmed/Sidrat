/**
 * Adab (Manners) Unit — Curriculum Content
 *
 * Teaching children Islamic manners and etiquette.
 * All hadith references verified against sunnah.com.
 * All Quran verses verified against quran.com.
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

export const adabUnit: CurriculumUnit = {
  id: 'adab-01',
  title: 'Beautiful Manners',
  description: 'Learn the Islamic manners that make you a better person',
  category: 'adab',
  order: 1,
  icon: 'heart',
  lessonIds: ['adab-01-01', 'adab-01-02', 'adab-01-03'],
};

export const adabLessons: CurriculumLesson[] = [
  // ─── Lesson 1: Saying Bismillah & Alhamdulillah ───────────────
  {
    id: 'adab-01-01',
    title: 'Saying Bismillah & Alhamdulillah',
    description: 'Learn the two phrases every Muslim says every day',
    category: 'adab',
    difficulty: 'beginner',
    durationMinutes: 6,
    xpReward: 25,
    order: 1,
    unitId: 'adab-01',
    minAgeGroup: 'toddler',
    tags: ['adab', 'bismillah', 'alhamdulillah', 'dhikr', 'gratitude'],

    hook: {
      type: 'hook',
      prompt:
        'What are the special words you say before eating? And what do you say when something wonderful happens? These two phrases are like superpowers for Muslims!',
      narration:
        'Do you know the special words we say before eating? And the words we say when something wonderful happens? These two phrases are like superpowers for every Muslim!',
      illustration: 'adab-bismillah',
    },

    teach: [
      {
        type: 'teach',
        title: 'Bismillah — In the Name of Allah',
        body: '**Bismillah** (بِسْمِ اللَّهِ) means "In the Name of Allah."\n\nWe say it **before** starting anything:\n• Before eating and drinking\n• Before entering our home\n• Before starting any task\n• Before reading the Quran\n• Before making wudu\n\nWhen you say Bismillah, you are asking for Allah\'s blessing and remembering Him!',
        narration:
          'Bismillah means In the Name of Allah. We say it before eating, before entering our home, before starting any task. When you say Bismillah, you remember Allah and ask for His blessing.',
        arabic: {
          text: 'بِسْمِ اللَّهِ',
          transliteration: 'Bismillāh',
          translation: 'In the Name of Allah',
        },
        keyTerms: [
          {
            term: 'Bismillah',
            definition: 'In the Name of Allah — said before starting any action',
          },
        ],
        illustration: 'adab-bismillah-eating',
      },
      {
        type: 'teach',
        title: 'Alhamdulillah — All Praise is Due to Allah',
        body: '**Alhamdulillah** (الْحَمْدُ لِلَّهِ) means "All praise is due to Allah."\n\nWe say it **after** good things happen:\n• After eating and drinking\n• After sneezing\n• When something good happens\n• When waking up\n• As gratitude throughout the day\n\nThe Prophet ﷺ said: When you sneeze, say "Alhamdulillah." (Sahih al-Bukhari 6224)\n\nAllah promises: **"Remember Me; I will remember you."** When you say these words, Allah remembers YOU!',
        narration:
          'Alhamdulillah means All praise is due to Allah. We say it after eating, after sneezing, when good things happen. Allah promises: Remember Me and I will remember you. How amazing is that!',
        arabic: {
          text: 'فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا لِى وَلَا تَكْفُرُونِ',
          transliteration: 'Fadhkurūnī adhkurkum washkurū lī wa lā takfurūn',
          translation:
            'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
          quranRef: { surah: 2, ayah: 152, globalAyahNumbers: [159] },
        },
        keyTerms: [
          {
            term: 'Alhamdulillah',
            definition: 'All praise is due to Allah — said after good things happen',
          },
          {
            term: 'Dhikr',
            definition: 'Remembrance of Allah — saying words that keep Allah in your heart',
          },
        ],
        illustration: 'adab-alhamdulillah',
      },
    ],

    practice: [
      {
        id: 'ad-01-01-p1',
        type: 'quiz',
        question: 'What do you say BEFORE eating?',
        options: ['Alhamdulillah', 'Bismillah', 'Ameen', 'Subhanallah'],
        correctIndex: 1,
        points: 10,
        explanation: 'We say Bismillah (In the Name of Allah) before eating!',
      },
      {
        id: 'ad-01-01-p2',
        type: 'quiz',
        question: 'What do you say AFTER sneezing?',
        options: ['Bismillah', 'Astaghfirullah', 'Alhamdulillah', 'Allahu Akbar'],
        correctIndex: 2,
        points: 10,
        explanation:
          'We say Alhamdulillah after sneezing! Then others reply "Yarhamukallah" (May Allah have mercy on you). (Sahih al-Bukhari 6224)',
      },
      {
        id: 'ad-01-01-p3',
        type: 'matching',
        instruction: 'Match each phrase with when you say it:',
        pairs: [
          { left: 'Bismillah', right: 'Before eating' },
          { left: 'Alhamdulillah', right: 'After sneezing' },
          { left: 'Remember Me', right: 'I will remember you (Quran 2:152)' },
        ],
        points: 15,
        explanation: 'Bismillah is said BEFORE actions, Alhamdulillah is said AFTER blessings!',
      },
      {
        id: 'ad-01-01-p4',
        type: 'true-false',
        statement: 'You should only say Bismillah before eating, not before other activities.',
        correctAnswer: false,
        points: 10,
        explanation:
          'We say Bismillah before ALL activities — eating, entering the home, starting tasks, reading Quran, and much more!',
      },
    ],

    reward: {
      message:
        'Excellent! Now remember to say Bismillah before everything and Alhamdulillah after every blessing! ⭐',
      funFact:
        'If you forget to say Bismillah before eating, you can say: "Bismillahi fi awwalihi wa akhirihi" — In the Name of Allah, at its beginning and end! (Sunan Abu Dawud 3767)',
      bonusDua: {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismillahir-Rahmanir-Raheem',
        translation:
          'In the Name of Allah, the Most Merciful, the Especially Merciful — the full version of Bismillah!',
      },
    },
  },

  // ─── Lesson 2: Being Kind to Parents ───────────────────────────
  {
    id: 'adab-01-02',
    title: 'Being Kind to Parents',
    description: 'Learn why parents are so important in Islam',
    category: 'adab',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 30,
    order: 2,
    unitId: 'adab-01',
    minAgeGroup: 'toddler',
    tags: ['adab', 'parents', 'birr-al-walidayn', 'kindness', 'family'],

    hook: {
      type: 'hook',
      prompt:
        'Who are the people who love you the most in the whole world? Who feeds you, takes care of you, and stays up when you are sick? Allah has something very special to say about them!',
      narration:
        'Who loves you the most in the whole world? Who takes care of you every single day? Your parents! And Allah has something very special to say about how we should treat them.',
      illustration: 'adab-parents',
    },

    teach: [
      {
        type: 'teach',
        title: 'Don\'t Even Say "Uff"!',
        body: 'Allah puts kindness to parents RIGHT AFTER worshiping Him — that\'s how important it is!\n\nIn the Quran, Allah tells us: don\'t even say **"uff"** (a small sound of annoyance) to your parents. Don\'t yell at them. Speak to them with **kindness and respect**.\n\nAllah also teaches us a beautiful du\'a to make for our parents: **"My Lord, have mercy upon them as they brought me up when I was small."**',
        narration:
          'Allah puts kindness to parents right after worshiping Him. That is how important it is! He tells us not to even say uff to our parents. And He teaches us a beautiful prayer for them.',
        arabic: {
          text: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَـٰنًا',
          transliteration: 'Wa qaḍā Rabbuka allā taʿbudū illā iyyāhu wa bil-wālidayni iḥsānā',
          translation:
            'And your Lord has decreed that you worship none but Him, and that you be dutiful to parents.',
          quranRef: { surah: 17, ayah: 23, globalAyahNumbers: [2052] },
        },
        keyTerms: [
          {
            term: 'Birr al-Walidayn',
            definition: 'Kindness and dutifulness to parents — one of the greatest deeds in Islam',
          },
        ],
        illustration: 'adab-no-uff',
      },
      {
        type: 'teach',
        title: 'Your Mother, Your Mother, Your Mother',
        body: 'A man came to the Prophet ﷺ and asked: "Who deserves my best treatment?" The Prophet ﷺ answered: **"Your mother."** The man asked again: "Then who?" He said: **"Your mother."** The man asked a third time: "Then who?" He said: **"Your mother."** Only then did he say: **"Then your father."** (Sahih al-Bukhari 5971)\n\nAllah reminds us: **"His mother carried him in weakness upon weakness."** (Quran 31:14) Your mother went through so much to bring you into the world — be thankful to her!',
        narration:
          'A man asked the Prophet: who deserves my best treatment? The Prophet said: Your mother. The man asked again, and again, and the Prophet said: Your mother three times! Then he said: your father. Our mothers sacrificed so much for us.',
        arabic: {
          text: 'رَبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا',
          transliteration: 'Rabbi-rḥamhumā kamā rabbayānī ṣaghīrā',
          translation: 'My Lord, have mercy upon them as they brought me up when I was small.',
          quranRef: { surah: 17, ayah: 24, globalAyahNumbers: [2053] },
        },
        illustration: 'adab-mother',
      },
    ],

    practice: [
      {
        id: 'ad-01-02-p1',
        type: 'quiz',
        question: 'In the Quran, kindness to parents comes right after which command?',
        options: ['Giving charity', 'Fasting', 'Worshiping Allah alone', 'Reading Quran'],
        correctIndex: 2,
        points: 10,
        explanation:
          'Allah puts worshiping Him first, and kindness to parents immediately after — it is THAT important! (Quran 17:23)',
      },
      {
        id: 'ad-01-02-p2',
        type: 'quiz',
        question:
          'When the man asked the Prophet ﷺ "Who deserves my best treatment?", how many times did he say "Your mother"?',
        options: ['Once', 'Twice', 'Three times', 'Four times'],
        correctIndex: 2,
        points: 10,
        explanation:
          'The Prophet ﷺ said "Your mother" three times before saying "Your father." This shows the special status of mothers! (Sahih al-Bukhari 5971)',
      },
      {
        id: 'ad-01-02-p3',
        type: 'true-false',
        statement: 'It is okay to say "uff" to your parents if you are having a bad day.',
        correctAnswer: false,
        points: 10,
        explanation:
          'Allah tells us not to even say "uff" (a small sound of annoyance) to our parents. We should always speak to them with kindness! (Quran 17:23)',
      },
      {
        id: 'ad-01-02-p4',
        type: 'fill-blank',
        sentence: 'My Lord, have mercy upon them as they brought me up when I was ___.',
        acceptedAnswers: ['small', 'little', 'young'],
        points: 10,
        hint: "This du'a from Quran 17:24 asks Allah to be merciful to our parents.",
        explanation:
          "This beautiful du'a asks Allah to have mercy on our parents, just as they took care of us when we were small. Make this du'a often!",
      },
    ],

    reward: {
      message:
        'Mashallah! Remember — being kind to your parents is one of the greatest deeds in Islam! 💚',
      funFact:
        'The Prophet ﷺ said: "The father is the middle gate of Paradise." (Jami\' at-Tirmidhi 1900). Being good to your parents is one of the best ways to earn Jannah!',
      bonusDua: {
        arabic: 'رَبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا',
        transliteration: 'Rabbi-rḥamhumā kamā rabbayānī ṣaghīrā',
        translation:
          'My Lord, have mercy upon them as they brought me up when I was small. (Quran 17:24)',
      },
    },
  },

  // ─── Lesson 3: Good Manners with Friends ───────────────────────
  {
    id: 'adab-01-03',
    title: 'Good Manners with Friends',
    description: 'Learn how Islam teaches us to treat our friends',
    category: 'adab',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 30,
    order: 3,
    unitId: 'adab-01',
    minAgeGroup: 'toddler',
    tags: ['adab', 'friends', 'salam', 'charity', 'smiling', 'kindness'],

    hook: {
      type: 'hook',
      prompt:
        'Did you know that just SMILING at someone is charity in Islam? And that saying "Assalamu Alaikum" can help you get to Jannah? Being a good friend is a big deal!',
      narration:
        'Did you know that just smiling at someone is charity? And that saying Assalamu Alaikum can help you get to Jannah? Let us learn the Islamic way to be an amazing friend!',
      illustration: 'adab-friends',
    },

    teach: [
      {
        type: 'teach',
        title: 'Smiling is Charity!',
        body: 'The Prophet ﷺ said: **"Your smiling in the face of your brother is charity."** (Jami\' at-Tirmidhi 1956)\n\nYou don\'t need money to give charity — just smile! Islam teaches us to be warm and welcoming to everyone.\n\nThe Prophet ﷺ also said: **"Spread the salam (greeting of peace) among yourselves"** — and that this is one of the ways to truly love one another and enter Paradise! (Sahih Muslim 54)',
        narration:
          'The Prophet said: Smiling at someone is charity! You do not need money to give, just smile! He also said: Spread the salam among yourselves. Saying Assalamu Alaikum helps us love one another.',
        arabic: {
          text: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
          transliteration: 'Tabassumuka fī wajhi akhīka laka ṣadaqah',
          translation: 'Your smiling in the face of your brother is charity.',
        },
        keyTerms: [
          {
            term: 'Sadaqah',
            definition: 'Charity — includes smiling, kind words, and good deeds, not just money!',
          },
          {
            term: 'Salam',
            definition: '"Peace" — the Islamic greeting: Assalamu Alaikum (Peace be upon you)',
          },
        ],
        illustration: 'adab-smiling',
      },
      {
        type: 'teach',
        title: "Don't Mock or Call Names",
        body: 'Allah gives a clear command in the Quran: **Do not make fun of others, do not insult each other, and do not call people mean names.**\n\nYou never know — the person you mock might be better than you in Allah\'s eyes!\n\nThe Prophet ﷺ also taught us the **six rights of a Muslim**: greet each other with salam, accept invitations, give sincere advice, say "Yarhamukallah" when they sneeze, visit them when sick, and attend their funeral. (Sahih Muslim 2162)',
        narration:
          "Allah tells us: do not make fun of others and do not call each other mean names. You never know, the person you mock might be better than you in Allah's eyes. The Prophet taught us to always be kind and respectful.",
        arabic: {
          text: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ',
          transliteration: 'Yā ayyuhal-ladhīna āmanū lā yaskhar qawmun min qawm',
          translation: 'O you who believe, let not a people ridicule another people.',
          quranRef: { surah: 49, ayah: 11, globalAyahNumbers: [4623] },
        },
        keyTerms: [
          {
            term: 'Gheebah',
            definition:
              'Backbiting — talking badly about someone behind their back. Islam forbids this.',
          },
        ],
        illustration: 'adab-no-mocking',
      },
    ],

    practice: [
      {
        id: 'ad-01-03-p1',
        type: 'quiz',
        question: 'According to the Prophet ﷺ, what is a form of charity?',
        options: [
          'Only giving money',
          'Smiling at someone',
          'Being the strongest',
          'Having the most toys',
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          'The Prophet ﷺ said: "Your smiling in the face of your brother is charity." (Jami\' at-Tirmidhi 1956)',
      },
      {
        id: 'ad-01-03-p2',
        type: 'true-false',
        statement: 'It is okay to make fun of someone as long as they do not hear you.',
        correctAnswer: false,
        points: 10,
        explanation:
          'Allah forbids making fun of others — whether they hear you or not! (Quran 49:11)',
      },
      {
        id: 'ad-01-03-p3',
        type: 'ordering',
        instruction: 'Put these good manners in the order you would do them when meeting a friend:',
        correctOrder: [
          'Say "Assalamu Alaikum"',
          'Smile at them',
          'Ask how they are doing',
          'Share something with them',
        ],
        points: 15,
        hint: 'Start with the Islamic greeting!',
        explanation:
          'When meeting a friend, greet them with salam, smile, show you care, and share!',
      },
      {
        id: 'ad-01-03-p4',
        type: 'matching',
        instruction: 'Match each Islamic teaching about friendship:',
        pairs: [
          { left: 'Smiling', right: 'Is charity' },
          { left: 'Spreading salam', right: 'Leads to love and Jannah' },
          { left: 'Mocking others', right: 'Is forbidden in the Quran' },
        ],
        points: 15,
        explanation:
          'Islam teaches us to be kind, greet with peace, and never mock or bully others.',
      },
    ],

    reward: {
      message: 'Wonderful! Now go spread salam, smile, and be the best friend you can be! 🌟',
      funFact:
        'The Prophet ﷺ said: "You will not enter Paradise until you believe, and you will not believe until you love one another. Shall I not tell you something that will help you love each other? Spread the salam!" (Sahih Muslim 54)',
      bonusDua: {
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
        transliteration: 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh',
        translation:
          'Peace be upon you, and the mercy of Allah, and His blessings — the full salam greeting!',
      },
    },
  },
];
