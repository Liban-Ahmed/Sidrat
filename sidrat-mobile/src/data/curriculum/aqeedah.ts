/**
 * Aqeedah Unit — Curriculum Content
 *
 * Teaching children the foundations of Islamic belief.
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

export const aqeedahUnit: CurriculumUnit = {
  id: 'aqeedah-01',
  title: 'Knowing Allah',
  description: 'Learn about Allah — the Creator of everything',
  category: 'aqeedah',
  order: 1,
  icon: 'star',
  lessonIds: ['aqeedah-01-01', 'aqeedah-01-02', 'aqeedah-01-03'],
};

export const aqeedahLessons: CurriculumLesson[] = [
  {
    id: 'aqeedah-01-01',
    title: 'Who is Allah?',
    description: 'Learn about the One who created everything around us',
    category: 'aqeedah',
    difficulty: 'beginner',
    durationMinutes: 5,
    xpReward: 25,
    order: 1,
    unitId: 'aqeedah-01',
    minAgeGroup: 'toddler',
    tags: ['aqeedah', 'allah', 'tawheed'],

    hook: {
      type: 'hook',
      prompt:
        'Look around you — the sun, the moon, the trees, the animals. Who made all of these amazing things?',
      narration:
        'Look around you. The sun, the moon, the stars, and the trees. Who created all of these beautiful things? Let us find out!',
      illustration: 'aqeedah-creation',
    },

    teach: [
      {
        type: 'teach',
        title: 'Allah Created Everything',
        body: 'Everything you see was made by **Allah**. He created the sky, the mountains, the oceans, and every single person.\n\nAllah is the Creator of everything. Nothing exists except that He created it.',
        narration:
          'Allah made everything! The sky, the mountains, the oceans, and every person. Allah is the Creator of all things.',
        illustration: 'aqeedah-creation-2',
      },
      {
        type: 'teach',
        title: 'Allah is One',
        body: 'There is **only one** Allah. He has no partners and no one is like Him.\n\nWe say **La ilaha illAllah** — there is no god but Allah. This is called **Tawheed**, the most important thing in Islam!',
        narration:
          'There is only one Allah. He has no partners. We say La ilaha illa Allah. There is no god but Allah. This is called Tawheed.',
        arabic: {
          text: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
          transliteration: 'La ilaha illAllah',
          translation: 'There is no god but Allah',
        },
        keyTerms: [
          { term: 'Tawheed', definition: 'The belief that Allah is One, with no partners' },
        ],
        illustration: 'aqeedah-tawheed',
      },
    ],

    practice: [
      {
        id: 'aq-01-01-p1',
        type: 'quiz',
        question: 'Who created the sun, moon, and stars?',
        options: ['People', 'Allah', 'Animals', 'Nobody'],
        correctIndex: 1,
        points: 10,
        explanation: 'Allah created everything — the sun, moon, stars, and all of creation!',
      },
      {
        id: 'aq-01-01-p2',
        type: 'true-false',
        statement: 'There is only one Allah.',
        correctAnswer: true,
        points: 10,
        explanation: 'Correct! Allah is One. This is called Tawheed.',
      },
      {
        id: 'aq-01-01-p3',
        type: 'fill-blank',
        sentence: 'La ilaha illa ___.',
        acceptedAnswers: ['Allah', 'allah', 'اللَّهُ'],
        points: 10,
        hint: 'Who is the One true God?',
        explanation: 'La ilaha illAllah — There is no god but Allah!',
      },
      {
        id: 'aq-01-01-p4',
        type: 'tap-word',
        instruction: 'Tap the words in the correct order to build the sentence:',
        words: ['is', 'the', 'Allah', 'of', 'Creator', 'everything'],
        correctSentence: ['Allah', 'is', 'the', 'Creator', 'of', 'everything'],
        points: 10,
        hint: 'The sentence starts with the name of our Creator.',
        explanation:
          'Allah is the Creator of everything — the heavens, the earth, and all that exists!',
      },
    ],

    reward: {
      message: 'Mashallah! You learned about the most important thing — knowing Allah! ⭐',
      funFact:
        'Allah has 99 beautiful names! Each name tells us something amazing about Him. Can you learn them all?',
      bonusDua: {
        arabic: 'سُبْحَانَ اللَّهِ',
        transliteration: 'SubhanAllah',
        translation: 'Glory be to Allah — say this when you see something beautiful in creation!',
      },
    },

    // ── Age-Adaptive Variants ──
    ageVariants: {
      toddler: {
        durationMinutes: 3,
        hook: {
          type: 'hook',
          prompt: 'Who made the pretty flowers and the bright sun? 🌸☀️',
          narration: 'Who made the flowers? Who made the sun? Let us find out together!',
          illustration: 'aqeedah-creation',
        },
        teach: [
          {
            type: 'teach',
            title: 'Allah Made Everything!',
            body: '**Allah** made the sun! ☀️\n**Allah** made the moon! 🌙\n**Allah** made YOU! 🤗\n\nAllah made everything!',
            narration:
              'Allah made the sun. Allah made the moon. Allah made you! Allah made everything!',
            illustration: 'aqeedah-creation-2',
          },
        ],
        practice: [
          {
            id: 'aq-01-01-t-p1',
            type: 'quiz',
            question: 'Who made the sun? ☀️',
            options: ['Allah', 'Nobody'],
            correctIndex: 0,
            points: 10,
            explanation: 'Yes! Allah made the sun!',
          },
          {
            id: 'aq-01-01-t-p2',
            type: 'true-false',
            statement: 'Allah made everything.',
            correctAnswer: true,
            points: 10,
            explanation: 'That is right! Allah made everything!',
          },
        ],
        reward: {
          message: 'Yay! Allah made everything, and He made YOU special! ⭐',
          funFact: 'Allah loves you very much! Say SubhanAllah!',
          bonusDua: {
            arabic: 'سُبْحَانَ اللَّهِ',
            transliteration: 'SubhanAllah',
            translation: 'Wow, Allah is amazing!',
          },
        },
      },

      middle: {
        durationMinutes: 7,
        teach: [
          {
            type: 'teach',
            title: 'Allah — The Creator of All',
            body: 'Everything in the universe was created by **Allah** (سبحانه وتعالى). From the vast galaxies to the tiniest atoms, nothing came into existence without His will.\n\nAllah says in the Quran: **"Allah is the Creator of all things, and He is, over all things, Disposer of affairs."** (Quran 39:62)',
            narration:
              'Allah created everything in the universe. From the galaxies to the tiniest atoms. Allah says in Surah Az-Zumar: Allah is the Creator of all things.',
            arabic: {
              text: 'اللَّهُ خَالِقُ كُلِّ شَيْءٍ ۖ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ وَكِيلٌ',
              transliteration: 'Allahu khaliqu kulli shay-in wa huwa ala kulli shay-in wakeel',
              translation:
                'Allah is the Creator of all things, and He is the Disposer of all affairs',
              quranRef: { surah: 39, ayah: 62 },
            },
            illustration: 'aqeedah-creation-2',
          },
          {
            type: 'teach',
            title: 'Tawheed — Oneness of Allah',
            body: 'The foundation of Islam is **Tawheed** — the belief that Allah is absolutely **One**.\n\n- **Tawheed ar-Rububiyyah:** Allah alone is the Lord, Creator, and Sustainer.\n- **Tawheed al-Uluhiyyah:** Only Allah deserves to be worshipped.\n\nWe declare this in the **Shahadah**: لَا إِلَٰهَ إِلَّا اللَّهُ',
            narration:
              'The foundation of Islam is Tawheed, the belief that Allah is One. Tawheed ar-Rububiyyah means Allah alone is the Creator. Tawheed al-Uluhiyyah means only Allah deserves worship.',
            arabic: {
              text: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
              transliteration: 'La ilaha illAllah',
              translation: 'There is no god but Allah',
            },
            keyTerms: [
              { term: 'Tawheed', definition: 'The belief that Allah is One, with no partners' },
              { term: 'Tawheed ar-Rububiyyah', definition: 'Allah is the sole Lord and Creator' },
              { term: 'Tawheed al-Uluhiyyah', definition: 'Only Allah deserves worship' },
              { term: 'Shahadah', definition: 'The declaration of faith in Islam' },
            ],
            illustration: 'aqeedah-tawheed',
          },
        ],
        practice: [
          {
            id: 'aq-01-01-m-p1',
            type: 'quiz',
            question: 'What is the Quran verse that states Allah is the Creator of all things?',
            options: [
              'Surah Al-Fatiha 1:1',
              'Surah Az-Zumar 39:62',
              'Surah Al-Baqarah 2:255',
              'Surah Al-Ikhlas 112:1',
            ],
            correctIndex: 1,
            points: 10,
            explanation: 'Surah Az-Zumar 39:62 — "Allah is the Creator of all things."',
          },
          {
            id: 'aq-01-01-m-p2',
            type: 'matching',
            instruction: 'Match each type of Tawheed with its meaning:',
            pairs: [
              { left: 'Tawheed ar-Rububiyyah', right: 'Allah is the sole Creator and Lord' },
              { left: 'Tawheed al-Uluhiyyah', right: 'Only Allah deserves worship' },
              { left: 'Shahadah', right: 'The declaration of faith' },
            ],
            points: 15,
            explanation: 'These are the foundational categories of Tawheed in Islamic theology.',
          },
          {
            id: 'aq-01-01-m-p3',
            type: 'true-false',
            statement:
              'Tawheed means believing that there are many gods, but Allah is the greatest.',
            correctAnswer: false,
            points: 10,
            explanation: 'Tawheed means Allah is the ONLY God. There are no other gods at all.',
          },
          {
            id: 'aq-01-01-m-p4',
            type: 'fill-blank',
            sentence: 'The two categories of Tawheed are Tawheed ar-Rububiyyah and Tawheed al-___.',
            acceptedAnswers: ['Uluhiyyah', 'uluhiyyah'],
            points: 10,
            hint: 'It relates to worship (ibadah).',
            explanation: 'Tawheed al-Uluhiyyah means that only Allah deserves to be worshipped.',
          },
        ],
      },

      preteen: {
        durationMinutes: 10,
        hook: {
          type: 'hook',
          prompt:
            'Everything in the universe follows precise laws — gravity, orbits, DNA. Could all of this have come from nothing, or does it point to a Creator?',
          narration:
            'The universe operates on precise, complex laws. Gravity, planetary orbits, the genetic code. Does this point to random chance, or to a wise Creator? Let us explore the Islamic perspective.',
          illustration: 'aqeedah-creation',
        },
        teach: [
          {
            type: 'teach',
            title: 'The Fitrah Argument',
            body: 'Islam teaches that every human being is born with **fitrah** — a natural inclination to recognize Allah.\n\nThe Prophet ﷺ said: **"Every child is born upon the fitrah."** (Bukhari & Muslim)\n\nThis innate awareness of a Creator is why civilizations throughout history have believed in a higher power. It is our original programming.',
            narration:
              'Islam teaches that every person is born with fitrah, a natural disposition to recognize God. The Prophet, peace be upon him, said every child is born upon the fitrah. This explains why humans across all cultures have recognized a Creator.',
            keyTerms: [
              { term: 'Fitrah', definition: 'The innate human disposition to recognize Allah' },
            ],
            illustration: 'aqeedah-creation-2',
          },
          {
            type: 'teach',
            title: 'Categories of Tawheed',
            body: "Islamic scholars categorize Tawheed into three types:\n\n1. **Tawheed ar-Rububiyyah** (Lordship) — Allah alone creates, sustains, and governs all. Even the Quraysh accepted this.\n\n2. **Tawheed al-Uluhiyyah** (Worship) — Only Allah deserves worship. This is what the Prophets primarily called to.\n\n3. **Tawheed al-Asma was-Sifat** (Names & Attributes) — Allah's names and attributes are unique and perfect. We affirm them without likening them to creation.\n\nThe Shahadah encapsulates all three: لَا إِلَٰهَ إِلَّا اللَّهُ",
            narration:
              "Scholars categorize Tawheed into three types. Rububiyyah: Allah alone is Lord and Creator. Uluhiyyah: only Allah deserves worship. Al-Asma was-Sifat: Allah's names and attributes are unique. The Shahadah encompasses all three.",
            arabic: {
              text: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
              transliteration: 'La ilaha illAllah',
              translation: 'There is no deity worthy of worship except Allah',
            },
            keyTerms: [
              {
                term: 'Tawheed ar-Rububiyyah',
                definition: 'Oneness of Lordship — Allah is the sole Creator and Sustainer',
              },
              {
                term: 'Tawheed al-Uluhiyyah',
                definition: 'Oneness of Worship — only Allah is worshipped',
              },
              {
                term: 'Tawheed al-Asma was-Sifat',
                definition: 'Oneness of Names & Attributes — unique to Allah',
              },
            ],
            illustration: 'aqeedah-tawheed',
          },
          {
            type: 'teach',
            title: 'Evidence from the Quran',
            body: 'Allah provides rational evidence for His existence in the Quran:\n\n**"Were they created by nothing, or were they the creators [of themselves]?"** (At-Tur 52:35)\n\nThis simple argument is profound: something cannot come from nothing, and nothing can create itself. Therefore, there must be an uncaused Creator — Allah.',
            narration:
              'Allah asks in Surah At-Tur: Were they created by nothing, or did they create themselves? This is a powerful logical argument. Something cannot come from nothing, and nothing creates itself. There must be an uncaused Creator.',
            arabic: {
              text: 'أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ',
              transliteration: 'Am khuliqoo min ghayri shay-in am humul-khaliqoon',
              translation:
                'Were they created by nothing, or were they the creators [of themselves]?',
              quranRef: { surah: 52, ayah: 35 },
            },
            illustration: 'aqeedah-evidence',
          },
        ],
        practice: [
          {
            id: 'aq-01-01-pt-p1',
            type: 'quiz',
            question: 'What is "fitrah" in Islamic theology?',
            options: [
              'A type of charity',
              'The innate human disposition to recognize Allah',
              'A prayer performed at dawn',
              'The Islamic calendar',
            ],
            correctIndex: 1,
            points: 10,
            explanation:
              'Fitrah is the natural inclination every person is born with to recognize their Creator.',
          },
          {
            id: 'aq-01-01-pt-p2',
            type: 'matching',
            instruction: 'Match each category of Tawheed with its meaning:',
            pairs: [
              { left: 'Rububiyyah', right: 'Oneness of Lordship & Creation' },
              { left: 'Uluhiyyah', right: 'Oneness of Worship' },
              { left: 'Al-Asma was-Sifat', right: 'Oneness of Names & Attributes' },
            ],
            points: 15,
            explanation: "The three categories of Tawheed cover all aspects of Allah's Oneness.",
          },
          {
            id: 'aq-01-01-pt-p3',
            type: 'quiz',
            question:
              'Which surah contains the argument: "Were they created by nothing, or were they the creators of themselves?"',
            options: ['Al-Baqarah', 'At-Tur', 'Al-Ikhlas', 'An-Nisa'],
            correctIndex: 1,
            points: 10,
            explanation: 'This powerful cosmological argument is found in Surah At-Tur (52:35).',
          },
          {
            id: 'aq-01-01-pt-p4',
            type: 'true-false',
            statement:
              'The Quraysh of Makkah denied Tawheed ar-Rububiyyah (that Allah is the Creator).',
            correctAnswer: false,
            points: 10,
            explanation:
              'The Quraysh accepted Allah as Creator (Rububiyyah) but rejected Tawheed al-Uluhiyyah — they worshipped idols alongside Allah.',
          },
          {
            id: 'aq-01-01-pt-p5',
            type: 'ordering',
            instruction: 'Put the logical argument from Surah At-Tur in order:',
            correctOrder: [
              'Something cannot come from nothing',
              'Nothing can create itself',
              'Therefore there must be an uncaused Creator',
              'That Creator is Allah',
            ],
            points: 15,
            explanation: 'This logical chain demonstrates the necessity of a Creator — Allah.',
          },
        ],
        reward: {
          message: 'Excellent work! You explored the intellectual foundations of Tawheed. 🌟',
          funFact:
            'Imam Abu Hanifah once debated atheists using the analogy of a ship: "If a ship cannot sail itself without a captain, how can this vast universe exist without a Creator?"',
          bonusDua: {
            arabic: 'رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ',
            transliteration: 'Rabbana ma khalaqta hadha batilan subhanak',
            translation: 'Our Lord, You did not create this in vain. Exalted are You! (3:191)',
          },
        },
      },
    },
  },

  {
    id: 'aqeedah-01-02',
    title: 'The Names of Allah',
    description: 'Discover the beautiful names of Allah',
    category: 'aqeedah',
    difficulty: 'beginner',
    durationMinutes: 6,
    xpReward: 30,
    order: 2,
    unitId: 'aqeedah-01',
    minAgeGroup: 'toddler',
    tags: ['aqeedah', 'names-of-allah', 'asma-ul-husna'],

    hook: {
      type: 'hook',
      prompt:
        'Your name means something special, right? Well, Allah has 99 beautiful names, and each one tells us something amazing about Him!',
      narration:
        'Did you know Allah has 99 beautiful names? Each name tells us something wonderful about Him. Let us learn some of them!',
      illustration: 'aqeedah-names',
    },

    teach: [
      {
        type: 'teach',
        title: 'Ar-Rahman & Ar-Raheem',
        body: "**Ar-Rahman** means The Most Merciful. Allah's mercy covers everything in the world.\n\n**Ar-Raheem** means The Especially Merciful. This is Allah's special mercy for those who believe.",
        narration:
          'Ar-Rahman means The Most Merciful. Allah is kind to everyone and everything. Ar-Raheem means He has a special mercy for believers.',
        arabic: {
          text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          transliteration: 'Bismillahir-Rahmanir-Raheem',
          translation: 'In the name of Allah, the Most Merciful, the Especially Merciful',
        },
        illustration: 'aqeedah-rahman',
      },
      {
        type: 'teach',
        title: 'Al-Khaliq & As-Sami',
        body: '**Al-Khaliq** means The Creator. Allah made everything from nothing!\n\n**As-Sami** means The All-Hearing. Allah hears every prayer, even the ones you whisper in your heart.',
        narration:
          'Al-Khaliq means The Creator. Allah made everything. As-Sami means The All-Hearing. Allah hears every prayer, even the quiet ones.',
        keyTerms: [
          { term: 'Al-Khaliq', definition: 'The Creator' },
          { term: 'As-Sami', definition: 'The All-Hearing' },
        ],
        illustration: 'aqeedah-creator',
      },
    ],

    practice: [
      {
        id: 'aq-01-02-p1',
        type: 'matching',
        instruction: 'Match each name of Allah with its meaning:',
        pairs: [
          { left: 'Ar-Rahman', right: 'The Most Merciful' },
          { left: 'Al-Khaliq', right: 'The Creator' },
          { left: 'As-Sami', right: 'The All-Hearing' },
        ],
        points: 15,
        explanation: 'Great matching! Each name of Allah teaches us something beautiful about Him.',
      },
      {
        id: 'aq-01-02-p2',
        type: 'quiz',
        question: 'What does Ar-Rahman mean?',
        options: ['The Creator', 'The All-Knowing', 'The Most Merciful', 'The King'],
        correctIndex: 2,
        points: 10,
      },
      {
        id: 'aq-01-02-p3',
        type: 'true-false',
        statement: 'Allah can hear us even when we pray quietly in our hearts.',
        correctAnswer: true,
        points: 10,
        explanation: 'Yes! Allah is As-Sami (The All-Hearing). He hears everything!',
      },
    ],

    reward: {
      message: 'Mashallah! You learned some beautiful names of Allah! 🌙',
      funFact:
        'The Prophet ﷺ said: "Allah has 99 names. Whoever learns them will enter Paradise!" (Bukhari)',
    },
  },

  {
    id: 'aqeedah-01-03',
    title: 'Allah Sees Everything',
    description: 'Learn that Allah is always watching over us',
    category: 'aqeedah',
    difficulty: 'beginner',
    durationMinutes: 5,
    xpReward: 25,
    order: 3,
    unitId: 'aqeedah-01',
    minAgeGroup: 'toddler',
    tags: ['aqeedah', 'al-baseer', 'taqwa'],

    hook: {
      type: 'hook',
      prompt:
        'Have you ever done something good when nobody was watching? Guess what — Someone was always watching! Who could it be?',
      narration:
        'Have you ever done something good when no one was watching? Someone was always watching. Let us find out who!',
      illustration: 'aqeedah-watching',
    },

    teach: [
      {
        type: 'teach',
        title: 'Al-Baseer & Al-Aleem',
        body: '**Al-Baseer** means The All-Seeing. Allah sees everything — even a tiny black ant on a dark rock at night!\n\n**Al-Aleem** means The All-Knowing. Allah knows what is in our hearts and minds.',
        narration:
          'Al-Baseer means The All-Seeing. Allah sees everything, even a tiny ant in the dark! Al-Aleem means The All-Knowing. Allah knows what is in our hearts.',
        keyTerms: [
          { term: 'Al-Baseer', definition: 'The All-Seeing' },
          { term: 'Al-Aleem', definition: 'The All-Knowing' },
        ],
        illustration: 'aqeedah-allseeing',
      },
      {
        type: 'teach',
        title: 'Being Good Always',
        body: 'Because Allah always sees us, we try to be good even when no one else is watching. This is called **Ihsan** — doing our best because we know Allah sees us.\n\nWhen we do good, Allah is happy with us!',
        narration:
          'Because Allah sees us always, we try to be good even when no one is looking. This is called ihsan — doing our best for Allah.',
        keyTerms: [
          { term: 'Ihsan', definition: 'Excellence — doing your best knowing Allah sees you' },
        ],
        illustration: 'aqeedah-ihsan',
      },
    ],

    practice: [
      {
        id: 'aq-01-03-p1',
        type: 'quiz',
        question: 'What does Al-Baseer mean?',
        options: ['The All-Hearing', 'The All-Seeing', 'The Creator', 'The Merciful'],
        correctIndex: 1,
        points: 10,
      },
      {
        id: 'aq-01-03-p2',
        type: 'quiz',
        question: 'What is Ihsan?',
        options: [
          'A type of food',
          'Doing your best because you know Allah sees you',
          'A prayer time',
          'A holiday',
        ],
        correctIndex: 1,
        points: 10,
        explanation: 'Ihsan means excellence — doing our best because we know Allah is watching!',
      },
      {
        id: 'aq-01-03-p3',
        type: 'true-false',
        statement: 'It is okay to be unkind when nobody is watching because no one will know.',
        correctAnswer: false,
        points: 10,
        explanation: 'Allah always sees us! We should be kind even when no person is watching.',
      },
    ],

    reward: {
      message: 'You completed the Knowing Allah unit! May Allah be pleased with you! ✨',
      funFact:
        'The Prophet ﷺ described Ihsan as: "Worship Allah as if you see Him, and if you cannot see Him, know that He sees you."',
      bonusDua: {
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
        translation: 'O Allah, You are the Pardoner and You love to pardon, so pardon me',
      },
    },
  },
];
