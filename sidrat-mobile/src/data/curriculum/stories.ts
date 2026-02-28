/**
 * Islamic Stories Unit — Curriculum Content
 *
 * Teaching children stories of the prophets from the Quran.
 * All Quran verses verified against quran.com.
 * All hadith references verified against sunnah.com.
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

export const storiesUnit: CurriculumUnit = {
  id: 'stories-01',
  title: 'Stories of the Prophets',
  description: 'Amazing stories from the Quran about prophets and their people',
  category: 'stories',
  order: 1,
  icon: 'book',
  lessonIds: ['stories-01-01', 'stories-01-02', 'stories-01-03'],
};

export const storiesLessons: CurriculumLesson[] = [
  // ─── Lesson 1: Prophet Nuh and the Great Flood ─────────────────
  {
    id: 'stories-01-01',
    title: 'Prophet Nuh and the Great Flood',
    description: 'The story of Prophet Nuh, his Ark, and 950 years of patience',
    category: 'stories',
    difficulty: 'beginner',
    durationMinutes: 8,
    xpReward: 35,
    order: 1,
    unitId: 'stories-01',
    minAgeGroup: 'toddler',
    tags: ['stories', 'nuh', 'noah', 'flood', 'patience', 'ark'],

    hook: {
      type: 'hook',
      prompt:
        "Imagine telling people about something very important — but they won't listen. Would you give up after a week? A month? A year? Prophet Nuh kept trying for NINE HUNDRED AND FIFTY years! Let's hear his amazing story.",
      narration:
        'Imagine telling people something very important but they just would not listen. Would you give up? Prophet Nuh kept trying for nine hundred and fifty years! Let us hear his amazing story.',
      illustration: 'stories-nuh-ark',
    },

    teach: [
      {
        type: 'teach',
        title: '950 Years of Patience',
        body: 'Prophet Nuh (عليه السلام) was sent by Allah to his people who worshiped idols instead of Allah.\n\nHe called them to worship Allah alone for **950 years** — but only a few people believed! The Quran tells us:\n\n**"And We certainly sent Nuh to his people, and he remained among them a thousand years minus fifty years."**\n\nDespite being mocked and rejected, Nuh never gave up. That is true **sabr** (patience)!',
        narration:
          'Prophet Nuh was sent to people who worshiped idols. He called them to worship Allah alone for nine hundred and fifty years. But only a few people believed. He never gave up. That is true patience!',
        arabic: {
          text: 'وَلَقَدْ أَرْسَلْنَا نُوحًا إِلَىٰ قَوْمِهِۦ فَلَبِثَ فِيهِمْ أَلْفَ سَنَةٍ إِلَّا خَمْسِينَ عَامًا',
          transliteration:
            'Wa laqad arsalnā Nūḥan ilā qawmihī falabitha fīhim alfa sanatin illā khamsīna ʿāmā',
          translation:
            'And We certainly sent Nuh to his people, and he remained among them a thousand years minus fifty years.',
          quranRef: { surah: 29, ayah: 14, globalAyahNumbers: [3354] },
        },
        keyTerms: [
          {
            term: 'Sabr',
            definition: 'Patience — Nuh showed the ultimate patience, preaching for 950 years',
          },
        ],
        illustration: 'stories-nuh-preaching',
      },
      {
        type: 'teach',
        title: 'The Great Ark',
        body: 'Allah commanded Nuh to build a great **Ark** (a huge ship). People laughed at him — "Why are you building a boat in the desert?"\n\nBut Nuh obeyed Allah. When the time came, Allah told him: **"Load upon the ship of each creature two mates and your family... and whoever has believed."**\n\nNuh loaded pairs of every animal onto the Ark, along with the believers. Then the rain came — water gushed from everywhere, even the earth! It covered everything, even the mountains.\n\n**But only a few believed with him.** Even Nuh\'s own son refused to come aboard.',
        narration:
          'Allah told Nuh to build a great Ark. People laughed at him, but he obeyed Allah. He loaded pairs of every animal and the believers onto the ship. Then the flood came and covered everything, even the mountains. Allah saved Nuh and the believers on the Ark.',
        arabic: {
          text: 'قُلْنَا ٱحْمِلْ فِيهَا مِن كُلٍّ زَوْجَيْنِ ٱثْنَيْنِ وَأَهْلَكَ إِلَّا مَن سَبَقَ عَلَيْهِ ٱلْقَوْلُ وَمَنْ ءَامَنَ',
          transliteration:
            'Qulnaḥmil fīhā min kullin zawjayni-thnayn wa ahlaka illā man sabaqa ʿalayhil-qawlu wa man āman',
          translation:
            'We said: Load upon the ship of each creature two mates and your family, except those about whom the decree has passed, and whoever has believed.',
          quranRef: { surah: 11, ayah: 40, globalAyahNumbers: [1513] },
        },
        illustration: 'stories-nuh-flood',
      },
      {
        type: 'teach',
        title: "Nuh's Beautiful Du'a",
        body: "After the flood, Nuh made a beautiful du'a that we can all learn:\n\n**\"My Lord, forgive me and my parents and whoever enters my house as a believer, and the believing men and believing women.\"** (Quran 71:28)\n\nNuh's story teaches us:\n• **Patience** — never give up, even if it takes years\n• **Obedience** — follow Allah's command even when people mock you\n• **Faith is a choice** — even a prophet's son can choose to disbelieve\n• **Allah's promise is true** — the believers were saved!",
        narration:
          'After the flood, Nuh made a beautiful prayer asking Allah to forgive the believers. His story teaches us patience, obedience to Allah, and that Allah always keeps His promise.',
        arabic: {
          text: 'رَّبِّ ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِمَن دَخَلَ بَيْتِىَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَٱلْمُؤْمِنَـٰتِ',
          transliteration:
            "Rabbighfir lī wa li-wālidayya wa liman dakhala baytiya mu'minan wa lil-mu'minīna wal-mu'mināt",
          translation:
            'My Lord, forgive me and my parents and whoever enters my house as a believer, and the believing men and believing women.',
          quranRef: { surah: 71, ayah: 28, globalAyahNumbers: [5447] },
        },
        illustration: 'stories-nuh-saved',
      },
    ],

    practice: [
      {
        id: 'st-01-01-p1',
        type: 'quiz',
        question: 'How many years did Prophet Nuh preach to his people?',
        options: ['100 years', '500 years', '950 years', '50 years'],
        correctIndex: 2,
        points: 10,
        explanation: 'Nuh preached for 950 years (a thousand years minus fifty)! (Quran 29:14)',
      },
      {
        id: 'st-01-01-p2',
        type: 'true-false',
        statement: "Most of Prophet Nuh's people believed in his message.",
        correctAnswer: false,
        points: 10,
        explanation:
          'The Quran says "none had believed with him, except a few." Despite 950 years of preaching, only a small number believed. (Quran 11:40)',
      },
      {
        id: 'st-01-01-p3',
        type: 'ordering',
        instruction: "Put the events of Nuh's story in the correct order:",
        correctOrder: [
          'Nuh called his people to worship Allah alone',
          'People rejected and mocked him',
          'Allah told Nuh to build the Ark',
          'Animals and believers boarded the Ark',
          'The great flood came',
          'Allah saved Nuh and the believers',
        ],
        points: 15,
        hint: 'Start with what Nuh was sent to do.',
        explanation:
          'Nuh preached for 950 years, built the Ark when commanded, loaded it with believers and animals, and Allah saved them from the flood.',
      },
      {
        id: 'st-01-01-p4',
        type: 'quiz',
        question: "What is the main lesson from Prophet Nuh's story?",
        options: [
          'Building ships is important',
          'Animals are cute',
          'Have patience and never give up on what is right',
          'Rain is dangerous',
        ],
        correctIndex: 2,
        points: 10,
        explanation:
          "Nuh's story teaches us incredible patience (sabr) — he never gave up, even after 950 years of rejection!",
      },
    ],

    reward: {
      message:
        'Incredible! You learned about one of the most patient prophets ever — Prophet Nuh! 🚢',
      funFact:
        "Surah Nuh (Chapter 71) in the Quran is named entirely after Prophet Nuh. It tells his story of calling his people to Allah and his du'a at the end.",
      bonusDua: {
        arabic: 'رَبِّ ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِلْمُؤْمِنِينَ',
        transliteration: "Rabbighfir lī wa li-wālidayya wa lil-mu'minīn",
        translation:
          "My Lord, forgive me, my parents, and the believers. (From Nuh's du'a, Quran 71:28)",
      },
    },
  },

  // ─── Lesson 2: Prophet Ibrahim — Friend of Allah ───────────────
  {
    id: 'stories-01-02',
    title: 'Prophet Ibrahim — Friend of Allah',
    description: "The story of Ibrahim, the fire, the idols, and the Ka'bah",
    category: 'stories',
    difficulty: 'beginner',
    durationMinutes: 8,
    xpReward: 35,
    order: 2,
    unitId: 'stories-01',
    minAgeGroup: 'toddler',
    tags: ['stories', 'ibrahim', 'abraham', 'khalilullah', 'kaabah', 'tawheed'],

    hook: {
      type: 'hook',
      prompt:
        "What would you do if everyone around you was wrong, and you were the only one who knew the truth? Prophet Ibrahim stood alone against his entire people — and Allah made him His FRIEND! Let's hear how.",
      narration:
        'What would you do if everyone was wrong and you were the only one who knew the truth? Prophet Ibrahim stood alone for the truth, and Allah made him His friend! Let us hear this amazing story.',
      illustration: 'stories-ibrahim',
    },

    teach: [
      {
        type: 'teach',
        title: 'Breaking the Idols',
        body: 'Prophet Ibrahim (عليه السلام) lived among people who worshiped **idols** — statues made of stone and wood. Even his own father made idols!\n\nIbrahim knew this was wrong. One day, when everyone left, he **broke all the idols** except the biggest one. When the people came back angry, Ibrahim said: "Ask the big one — he did it!" Of course, the idol couldn\'t speak or do anything — proving they were powerless!\n\nIbrahim was the bravest person — standing for **Tawheed** (the Oneness of Allah) when everyone was against him.',
        narration:
          'Ibrahim lived among people who worshiped idols. He knew this was wrong. One day he broke all the idols except the biggest one. When people asked what happened, he said: Ask the big one! Of course, the idol could not speak. This proved the idols were powerless!',
        arabic: {
          text: 'فَجَعَلَهُمْ جُذَٰذًا إِلَّا كَبِيرًا لَّهُمْ لَعَلَّهُمْ إِلَيْهِ يَرْجِعُونَ',
          transliteration: 'Fa-jaʿalahum judhādhan illā kabīran lahum laʿallahum ilayhi yarjiʿūn',
          translation:
            'So he made them into fragments, except a large one among them, that they might return to it [and question].',
          quranRef: { surah: 21, ayah: 58, globalAyahNumbers: [2541] },
        },
        keyTerms: [
          {
            term: 'Khalilullah',
            definition: 'Friend of Allah — the special title given to Prophet Ibrahim',
          },
          {
            term: 'Tawheed',
            definition: 'The Oneness of Allah — the truth Ibrahim stood for',
          },
        ],
        illustration: 'stories-ibrahim-idols',
      },
      {
        type: 'teach',
        title: 'The Fire Made Cool',
        body: 'The people were so angry that they built a **huge fire** and threw Ibrahim into it!\n\nBut Allah has power over everything — even fire. Allah commanded:\n\n**"O fire, be coolness and safety upon Ibrahim."**\n\nThe fire did not burn him at all! Allah protected Ibrahim because he trusted Allah completely. This is **Tawakkul** — trusting in Allah no matter what.',
        narration:
          'The people threw Ibrahim into a huge fire. But Allah commanded: O fire, be coolness and safety upon Ibrahim. The fire did not burn him! Allah protected him because Ibrahim trusted Allah completely.',
        arabic: {
          text: 'قُلْنَا يَـٰنَارُ كُونِى بَرْدًا وَسَلَـٰمًا عَلَىٰٓ إِبْرَٰهِيمَ',
          transliteration: 'Qulnā yā nāru kūnī bardan wa salāman ʿalā Ibrāhīm',
          translation: 'We said, "O fire, be coolness and safety upon Ibrahim."',
          quranRef: { surah: 21, ayah: 69, globalAyahNumbers: [2552] },
        },
        keyTerms: [
          {
            term: 'Tawakkul',
            definition: 'Trusting in Allah completely — like Ibrahim did when thrown into the fire',
          },
        ],
        illustration: 'stories-ibrahim-fire',
      },
      {
        type: 'teach',
        title: "Building the Ka'bah",
        body: "Years later, Allah commanded Ibrahim and his son **Ismail** to build the **Ka'bah** in Makkah — the most sacred place on Earth.\n\nAs they built it together, they made this beautiful du'a:\n\n**\"Our Lord, accept this from us. Indeed, You are the All-Hearing, the All-Knowing.\"**\n\nToday, Muslims around the world face the Ka'bah when they pray — the same house that Ibrahim and Ismail built thousands of years ago!\n\nIbrahim was also tested with a dream about sacrificing his son Ismail. Both father and son submitted to Allah's command — and Allah replaced Ismail with a ram from heaven. This is why we celebrate **Eid al-Adha**!",
        narration:
          "Ibrahim and his son Ismail built the Ka'bah together. As they built it, they prayed: Our Lord, accept this from us. Muslims still face the Ka'bah in prayer today! Ibrahim was also tested with sacrificing his son, but Allah replaced Ismail with a ram. That is why we celebrate Eid al-Adha!",
        arabic: {
          text: 'رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ',
          transliteration: 'Rabbanā taqabbal minnā innaka Antas-Samīʿul-ʿAlīm',
          translation:
            'Our Lord, accept this from us. Indeed, You are the All-Hearing, the All-Knowing.',
          quranRef: { surah: 2, ayah: 127, globalAyahNumbers: [134] },
        },
        keyTerms: [
          {
            term: "Ka'bah",
            definition: 'The sacred House of Allah in Makkah, built by Ibrahim and Ismail',
          },
          {
            term: 'Eid al-Adha',
            definition:
              "The Festival of Sacrifice — celebrating Ibrahim and Ismail's obedience to Allah",
          },
        ],
        illustration: 'stories-ibrahim-kaabah',
      },
    ],

    practice: [
      {
        id: 'st-01-02-p1',
        type: 'quiz',
        question: "What is Prophet Ibrahim's special title?",
        options: [
          'Al-Amin (The Trustworthy)',
          'Khalilullah (Friend of Allah)',
          'As-Siddiq (The Truthful)',
          'Al-Farooq (The Distinguisher)',
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          'Ibrahim is called Khalilullah — the Friend of Allah. What an incredible honor!',
      },
      {
        id: 'st-01-02-p2',
        type: 'quiz',
        question: 'What did Allah command the fire to be for Ibrahim?',
        options: [
          'Hotter and bigger',
          'Coolness and safety',
          'A bright light',
          'A wall around him',
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          'Allah said: "O fire, be coolness and safety upon Ibrahim." The fire obeyed Allah! (Quran 21:69)',
      },
      {
        id: 'st-01-02-p3',
        type: 'matching',
        instruction: "Match each part of Ibrahim's story with its lesson:",
        pairs: [
          { left: 'Breaking the idols', right: 'Standing up for the truth (Tawheed)' },
          { left: 'Being thrown in the fire', right: 'Trusting Allah (Tawakkul)' },
          { left: "Building the Ka'bah", right: 'Obedience to Allah' },
        ],
        points: 15,
        explanation: "Every part of Ibrahim's life teaches us important Islamic values!",
      },
      {
        id: 'st-01-02-p4',
        type: 'true-false',
        statement: "Prophet Ibrahim built the Ka'bah by himself without any help.",
        correctAnswer: false,
        points: 10,
        explanation:
          'Ibrahim built the Ka\'bah together with his son Ismail, and they both made du\'a together: "Our Lord, accept this from us." (Quran 2:127)',
      },
    ],

    reward: {
      message:
        "Mashallah! You learned about Ibrahim — the Friend of Allah, the idol-breaker, and the builder of the Ka'bah! 🕋",
      funFact:
        'Ibrahim is mentioned by name 69 times in the Quran — more than any other prophet except Musa (Moses), who is mentioned 136 times!',
      bonusDua: {
        arabic: 'رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ',
        transliteration: 'Rabbanā taqabbal minnā innaka Antas-Samīʿul-ʿAlīm',
        translation:
          "Our Lord, accept this from us. Indeed, You are the All-Hearing, the All-Knowing. (Ibrahim's du'a, Quran 2:127)",
      },
    },
  },

  // ─── Lesson 3: The People of the Elephant (Surah Al-Fil) ──────
  {
    id: 'stories-01-03',
    title: 'The People of the Elephant (Surah Al-Fil)',
    description:
      "How Allah protected the Ka'bah with tiny birds against a mighty army of elephants",
    category: 'stories',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 30,
    order: 3,
    unitId: 'stories-01',
    minAgeGroup: 'toddler',
    tags: ['stories', 'elephant', 'surah-al-fil', 'kaabah', 'protection', 'birds'],

    hook: {
      type: 'hook',
      prompt:
        "What happens when a mighty army with huge elephants tries to destroy Allah's House? Can tiny birds stop an elephant? In this story, Allah shows that size doesn't matter when He protects something!",
      narration:
        "A mighty army with huge elephants tried to destroy Allah's House, the Ka'bah. Can tiny birds stop an elephant? Let us find out how Allah protected His House!",
      illustration: 'stories-elephant',
    },

    teach: [
      {
        type: 'teach',
        title: "Abraha's Army",
        body: "In the year Prophet Muhammad ﷺ was born (about 570 CE), a powerful ruler named **Abraha** built a grand church in Yemen. He wanted the Arabs to come there instead of the Ka'bah in Makkah.\n\nWhen the Arabs still went to the Ka'bah, Abraha became very angry. He gathered a **massive army** with **war elephants** and marched toward Makkah to **destroy the Ka'bah**!\n\nThe people of Makkah were scared — they couldn't fight such a powerful army. Their leader, Abdul-Muttalib (the Prophet's grandfather), said: **\"The Ka'bah has a Lord who will protect it.\"**",
        narration:
          "In the year Prophet Muhammad was born, a ruler named Abraha tried to destroy the Ka'bah. He brought a huge army with war elephants. The people of Makkah could not fight such a big army. But they knew: the Ka'bah has a Lord Who will protect it.",
        keyTerms: [
          {
            term: 'Abraha',
            definition: "The Abyssinian ruler who tried to destroy the Ka'bah with elephants",
          },
          {
            term: 'Aam al-Fil',
            definition: 'The Year of the Elephant — the year Prophet Muhammad ﷺ was born',
          },
        ],
        illustration: 'stories-abraha-army',
      },
      {
        type: 'teach',
        title: 'Allah Sends the Birds',
        body: "When Abraha's army reached Makkah, something miraculous happened. Allah sent **flocks of birds** (called **Ababil**) carrying stones of **baked clay** (sijjil).\n\nThe tiny birds pelted Abraha's mighty army with these stones, destroying them completely! Allah made the army like **eaten straw** — crushed and destroyed.\n\nThe Ka'bah was saved! Tiny birds defeated a massive army of elephants because **Allah's plan always prevails**.",
        narration:
          "When the army reached Makkah, Allah sent flocks of birds carrying stones of baked clay. The tiny birds destroyed the whole army! The Ka'bah was saved. Allah's plan always wins, no matter how big the enemy.",
        illustration: 'stories-ababil-birds',
      },
      {
        type: 'teach',
        title: 'Surah Al-Fil — Learn It!',
        body: "This story is told in **Surah Al-Fil** (The Elephant) — one of the shortest and most powerful surahs in the Quran. It has only **5 verses**:\n\n1. Have you not seen how your Lord dealt with the People of the Elephant?\n2. Did He not make their plan go astray?\n3. And He sent against them birds in flocks,\n4. Striking them with stones of baked clay,\n5. And He made them like eaten straw.\n\nThis event happened in the same year the Prophet ﷺ was born — Allah protected the Ka'bah and then sent the one who would teach the world about it!",
        narration:
          "This story is in Surah Al-Fil, which has only five verses. It tells how Allah sent birds to destroy the army. This happened in the year the Prophet was born. Allah protected the Ka'bah and then sent the Prophet to teach the world.",
        arabic: {
          text: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ',
          transliteration: 'A lam tara kayfa faʿala Rabbuka bi-aṣḥābil-fīl',
          translation: 'Have you not seen how your Lord dealt with the People of the Elephant?',
          quranRef: {
            surah: 105,
            ayah: 1,
            endAyah: 5,
            globalAyahNumbers: [6189, 6190, 6191, 6192, 6193],
          },
        },
        keyTerms: [
          {
            term: 'Ababil',
            definition: "Flocks of birds — sent by Allah to destroy Abraha's army",
          },
          {
            term: 'Sijjil',
            definition: 'Baked clay — the stones the birds carried',
          },
        ],
        illustration: 'stories-surah-fil',
      },
    ],

    practice: [
      {
        id: 'st-01-03-p1',
        type: 'quiz',
        question: "Who tried to destroy the Ka'bah with an army of elephants?",
        options: ['Pharaoh', 'Abu Lahab', 'Abraha', 'Abu Jahl'],
        correctIndex: 2,
        points: 10,
        explanation:
          "Abraha, a ruler from Abyssinia (Ethiopia), tried to destroy the Ka'bah with war elephants.",
      },
      {
        id: 'st-01-03-p2',
        type: 'quiz',
        question: "How did Allah destroy Abraha's army?",
        options: [
          'With a big earthquake',
          'With flocks of birds carrying stones of baked clay',
          'With a strong wind',
          'With a flood',
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          'Allah sent flocks of birds (Ababil) carrying stones of baked clay (sijjil) that destroyed the entire army. (Quran 105:3-4)',
      },
      {
        id: 'st-01-03-p3',
        type: 'ordering',
        instruction: 'Put the verses of Surah Al-Fil in the correct order:',
        correctOrder: [
          'Have you not seen how your Lord dealt with the People of the Elephant?',
          'Did He not make their plan go astray?',
          'And He sent against them birds in flocks,',
          'Striking them with stones of baked clay,',
          'And He made them like eaten straw.',
        ],
        points: 15,
        hint: 'The surah starts with a question about the People of the Elephant.',
        explanation:
          "These are the 5 verses of Surah Al-Fil (105). It's a short but powerful surah to memorize!",
      },
      {
        id: 'st-01-03-p4',
        type: 'true-false',
        statement:
          'The Year of the Elephant is special because Prophet Muhammad ﷺ was born in that year.',
        correctAnswer: true,
        points: 10,
        explanation:
          "Prophet Muhammad ﷺ was born in approximately 570 CE, the same year as the Elephant incident. Allah protected the Ka'bah and sent the Prophet in the same year!",
      },
    ],

    reward: {
      message:
        "Amazing! You learned Surah Al-Fil's story — how tiny birds defeated a mighty army because Allah protects His House! 🐦",
      funFact:
        'Abdul-Muttalib, the Prophet\'s grandfather, was the leader of Makkah during this event. When Abraha took his camels, Abdul-Muttalib asked for his camels back, saying: "I am the lord of the camels, and the Ka\'bah has a Lord Who will protect it."',
      bonusDua: {
        arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        transliteration: 'Ḥasbunallāhu wa niʿmal-wakīl',
        translation:
          'Allah is sufficient for us, and He is the best Disposer of affairs. (Quran 3:173)',
      },
    },
  },
];
