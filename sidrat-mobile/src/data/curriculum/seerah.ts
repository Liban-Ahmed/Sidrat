/**
 * Seerah Unit — Curriculum Content
 *
 * Teaching children about the life of Prophet Muhammad ﷺ.
 * All hadith references verified against sunnah.com.
 * All Quran verses verified against quran.com.
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

export const seerahUnit: CurriculumUnit = {
  id: 'seerah-01',
  title: "The Prophet's Life ﷺ",
  description: 'Learn about the life and character of Prophet Muhammad ﷺ',
  category: 'seerah',
  order: 1,
  icon: 'moon',
  lessonIds: ['seerah-01-01', 'seerah-01-02', 'seerah-01-03'],
};

export const seerahLessons: CurriculumLesson[] = [
  // ─── Lesson 1: Prophet Muhammad ﷺ — The Best Example ───────────
  {
    id: 'seerah-01-01',
    title: 'Prophet Muhammad ﷺ — The Best Example',
    description: 'Learn about the Prophet ﷺ and why he is our greatest role model',
    category: 'seerah',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 30,
    order: 1,
    unitId: 'seerah-01',
    minAgeGroup: 'toddler',
    tags: ['seerah', 'prophet', 'character', 'al-amin'],

    hook: {
      type: 'hook',
      prompt:
        'Imagine someone so kind, so honest, and so brave that everyone — even his enemies — called him "The Trustworthy." Who do you think that could be?',
      narration:
        'Imagine someone so kind and honest that everyone called him The Trustworthy. Even people who disagreed with him said he never lied. Who is this amazing person? Let us find out!',
      illustration: 'seerah-prophet-example',
    },

    teach: [
      {
        type: 'teach',
        title: 'The Greatest Character',
        body: "Prophet Muhammad ﷺ was the kindest, most truthful, and most generous person who ever lived.\n\nEven before he became a prophet, the people of Makkah called him **Al-Amin** (The Trustworthy) and **As-Sadiq** (The Truthful). Everyone trusted him!\n\nAllah Himself praises the Prophet's character in the Quran:",
        narration:
          'Prophet Muhammad, peace be upon him, was the kindest and most truthful person ever. The people of Makkah called him Al-Amin, which means The Trustworthy. Even Allah praises his character in the Quran.',
        arabic: {
          text: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
          transliteration: 'Wa innaka la-ʿalā khuluqin ʿaẓīm',
          translation: 'And indeed, you are of a great moral character.',
          quranRef: { surah: 68, ayah: 4 },
        },
        keyTerms: [
          { term: 'Al-Amin', definition: 'The Trustworthy — a title given to the Prophet ﷺ' },
          { term: 'As-Sadiq', definition: 'The Truthful — another title of the Prophet ﷺ' },
        ],
        illustration: 'seerah-al-amin',
      },
      {
        type: 'teach',
        title: 'Our Perfect Role Model',
        body: 'Allah tells us in the Quran that Prophet Muhammad ﷺ is the best example for us to follow.\n\nHis wife Aisha (may Allah be pleased with her) described him beautifully. When asked about the Prophet\'s character, she said: **"His character was the Quran."** (Sahih Muslim 746a)\n\nThis means the Prophet ﷺ didn\'t just read the Quran — he LIVED it!',
        narration:
          'Allah tells us the Prophet is our best example. His wife Aisha described him by saying: His character was the Quran. That means he lived every good quality the Quran teaches.',
        arabic: {
          text: 'لَّقَدْ كَانَ لَكُمْ فِى رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌ',
          transliteration: 'Laqad kāna lakum fī Rasūlillāhi uswatun ḥasanah',
          translation:
            'There has certainly been for you in the Messenger of Allah an excellent example.',
          quranRef: { surah: 33, ayah: 21 },
        },
        keyTerms: [
          {
            term: 'Uswatun Hasanah',
            definition: 'An excellent example — how the Quran describes the Prophet ﷺ',
          },
        ],
        illustration: 'seerah-role-model',
      },
    ],

    practice: [
      {
        id: 'sr-01-01-p1',
        type: 'quiz',
        question: 'What did the people of Makkah call Prophet Muhammad ﷺ?',
        options: ['The Strong', 'The Trustworthy (Al-Amin)', 'The Rich', 'The King'],
        correctIndex: 1,
        points: 10,
        explanation:
          'The people of Makkah called him Al-Amin, meaning The Trustworthy, because he never lied!',
      },
      {
        id: 'sr-01-01-p2',
        type: 'true-false',
        statement: "Even the Prophet's enemies said he never lied.",
        correctAnswer: true,
        points: 10,
        explanation:
          'True! Even Abu Sufyan, who was not yet Muslim, admitted to the Roman Emperor that Muhammad never lied. (Sahih al-Bukhari 7)',
      },
      {
        id: 'sr-01-01-p3',
        type: 'fill-blank',
        sentence: 'Aisha said: "His character was the ___."',
        acceptedAnswers: ['Quran', 'quran', 'القرآن'],
        points: 10,
        hint: 'What is the holy book of Islam?',
        explanation:
          "Aisha said the Prophet's character was the Quran — he lived every good quality it teaches! (Sahih Muslim 746a)",
      },
      {
        id: 'sr-01-01-p4',
        type: 'matching',
        instruction: "Match the Prophet's titles with their meanings:",
        pairs: [
          { left: 'Al-Amin', right: 'The Trustworthy' },
          { left: 'As-Sadiq', right: 'The Truthful' },
          { left: 'Uswatun Hasanah', right: 'An Excellent Example' },
        ],
        points: 15,
        explanation: 'These titles show us the beautiful character of Prophet Muhammad ﷺ.',
      },
    ],

    reward: {
      message:
        'Mashallah! You learned about our beloved Prophet ﷺ — the best example for all of us! ⭐',
      funFact:
        'The Prophet ﷺ received the first revelation at the age of 40, in a cave called Hira. The very first word revealed was "Iqra" — meaning "Read!"',
      bonusDua: {
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        transliteration: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
        translation:
          'O Allah, send blessings upon Muhammad and upon the family of Muhammad — say this often!',
      },
    },
  },

  // ─── Lesson 2: The Night Journey (Isra & Mi'raj) ──────────────
  {
    id: 'seerah-01-02',
    title: "The Night Journey (Isra & Mi'raj)",
    description: 'Discover the miraculous journey from Makkah to the heavens',
    category: 'seerah',
    difficulty: 'beginner',
    durationMinutes: 8,
    xpReward: 35,
    order: 2,
    unitId: 'seerah-01',
    minAgeGroup: 'toddler',
    tags: ['seerah', 'isra', 'miraj', 'night-journey', 'prayer'],

    hook: {
      type: 'hook',
      prompt:
        'What if you could travel from one city to another, fly up through the sky, past the stars, and meet amazing prophets — all in one night? This really happened to Prophet Muhammad ﷺ!',
      narration:
        'What if you could fly past the stars and meet amazing prophets, all in one night? This really happened to Prophet Muhammad, peace be upon him! Let us learn about his incredible journey.',
      illustration: 'seerah-night-journey',
    },

    teach: [
      {
        type: 'teach',
        title: 'The Journey Begins',
        body: 'One night, Allah took Prophet Muhammad ﷺ on an incredible two-part journey:\n\n**Part 1 — Al-Isra (The Night Journey):** The Prophet ﷺ traveled from Masjid al-Haram in Makkah to Masjid al-Aqsa in Jerusalem, riding a heavenly creature called **al-Buraq**.\n\nAllah describes this journey in the Quran, beginning with the word **"Subhan"** (Glory be) — showing how miraculous and magnificent it was!',
        narration:
          'One night, Allah took the Prophet on an amazing journey. First, he traveled from Makkah to Jerusalem on a heavenly creature called al-Buraq. This is called al-Isra, the Night Journey.',
        arabic: {
          text: 'سُبْحَـٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا مِّنَ ٱلْمَسْجِدِ ٱلْحَرَامِ إِلَى ٱلْمَسْجِدِ ٱلْأَقْصَا',
          transliteration:
            'Subḥānal-ladhī asrā bi-ʿabdihī laylan minal-Masjidil-Ḥarāmi ilal-Masjidil-Aqṣā',
          translation:
            'Glory be to the One Who took His servant by night from the Sacred Mosque to the Farthest Mosque.',
          quranRef: { surah: 17, ayah: 1 },
        },
        keyTerms: [
          {
            term: 'Al-Isra',
            definition: 'The Night Journey — from Makkah to Jerusalem',
          },
          {
            term: 'Al-Buraq',
            definition: 'The heavenly creature the Prophet ﷺ rode on the Night Journey',
          },
        ],
        illustration: 'seerah-isra',
      },
      {
        type: 'teach',
        title: 'Rising Through the Heavens',
        body: "**Part 2 — Al-Mi'raj (The Ascension):** From Jerusalem, the Prophet ﷺ ascended through **seven heavens**! In each heaven, he met a different prophet:\n\n• 1st Heaven — Prophet Adam\n• 2nd Heaven — Prophets Isa (Jesus) & Yahya (John)\n• 3rd Heaven — Prophet Yusuf (Joseph)\n• 4th Heaven — Prophet Idris (Enoch)\n• 5th Heaven — Prophet Harun (Aaron)\n• 6th Heaven — Prophet Musa (Moses)\n• 7th Heaven — Prophet Ibrahim (Abraham)\n\nHe reached the highest point — **Sidrat al-Muntaha** — a place even Angel Jibreel could not pass! (Sahih al-Bukhari 3887, Sahih Muslim 162a)",
        narration:
          'From Jerusalem, the Prophet rose up through seven heavens! He met Prophet Adam, then Isa and Yahya, then Yusuf, then Idris, then Harun, then Musa, and finally Ibrahim. He went higher than any creation has ever reached!',
        keyTerms: [
          {
            term: "Al-Mi'raj",
            definition: 'The Ascension — the journey up through the seven heavens',
          },
          {
            term: 'Sidrat al-Muntaha',
            definition:
              'The Lote Tree of the Utmost Boundary — the highest point the Prophet ﷺ reached',
          },
        ],
        illustration: 'seerah-miraj',
      },
      {
        type: 'teach',
        title: 'The Gift of Prayer',
        body: "During this journey, Allah gave the Muslim ummah the most precious gift — **the five daily prayers (salah)**.\n\nOriginally, 50 prayers were prescribed. Prophet Musa (Moses) advised Muhammad ﷺ to go back and ask for a reduction. The Prophet ﷺ went back and forth until the prayers were reduced to **5**, but with the **reward of 50**!\n\nThat's why we pray 5 times a day — it's a gift from this miraculous night!",
        narration:
          'During this journey, Allah gave us the five daily prayers. It was first fifty prayers, but it was reduced to five, with the reward of fifty. Prayer is a gift from this amazing night!',
        keyTerms: [
          {
            term: 'Salah',
            definition: 'The five daily prayers — a gift given during the Night Journey',
          },
        ],
        illustration: 'seerah-gift-prayer',
      },
    ],

    practice: [
      {
        id: 'sr-01-02-p1',
        type: 'quiz',
        question: 'What was the heavenly creature the Prophet ﷺ rode called?',
        options: ['Al-Isra', 'Al-Buraq', 'Al-Aqsa', "Al-Mi'raj"],
        correctIndex: 1,
        points: 10,
        explanation:
          'Al-Buraq was the heavenly creature that carried the Prophet ﷺ from Makkah to Jerusalem.',
      },
      {
        id: 'sr-01-02-p2',
        type: 'ordering',
        instruction: 'Put these events of the Night Journey in the correct order:',
        correctOrder: [
          'Traveled from Makkah to Jerusalem',
          'Rose through the seven heavens',
          'Met prophets in each heaven',
          'Reached Sidrat al-Muntaha',
          'Received the gift of five daily prayers',
        ],
        points: 15,
        hint: 'The journey started on earth and went up to the highest point.',
        explanation:
          "The Prophet ﷺ first traveled to Jerusalem (Isra), then ascended through the heavens (Mi'raj), meeting prophets and receiving the gift of prayer.",
      },
      {
        id: 'sr-01-02-p3',
        type: 'quiz',
        question: 'How many daily prayers did Allah give to the Muslim ummah?',
        options: ['50', '10', '5', '3'],
        correctIndex: 2,
        points: 10,
        explanation:
          'The prayers were reduced from 50 to 5, but we still get the reward of 50! What a generous gift from Allah.',
      },
      {
        id: 'sr-01-02-p4',
        type: 'matching',
        instruction: 'Match each prophet with the heaven where Muhammad ﷺ met them:',
        pairs: [
          { left: 'Adam', right: '1st Heaven' },
          { left: 'Musa (Moses)', right: '6th Heaven' },
          { left: 'Ibrahim (Abraham)', right: '7th Heaven' },
        ],
        points: 15,
        explanation:
          'The Prophet ﷺ met different prophets in each of the seven heavens during his ascension.',
      },
    ],

    reward: {
      message:
        'Amazing! You learned about the miraculous Night Journey — one of the greatest events in all of history! 🌙',
      funFact:
        'When the Prophet ﷺ told people about the Night Journey, Abu Bakr believed him immediately without any doubt. That\'s why Abu Bakr earned the title "As-Siddiq" (The Truthful Confirmer)!',
      bonusDua: {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliteration: 'SubhanAllahi wa bihamdihi',
        translation: 'Glory be to Allah and all praise is due to Him.',
      },
    },
  },

  // ─── Lesson 3: Kindness of the Prophet ﷺ ──────────────────────
  {
    id: 'seerah-01-03',
    title: 'Kindness of the Prophet ﷺ',
    description: "Discover beautiful stories of the Prophet's mercy and kindness",
    category: 'seerah',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 30,
    order: 3,
    unitId: 'seerah-01',
    minAgeGroup: 'toddler',
    tags: ['seerah', 'kindness', 'mercy', 'rahmah', 'children', 'animals'],

    hook: {
      type: 'hook',
      prompt:
        'What would you do if someone was mean to you? Would you be mean back? The Prophet ﷺ showed us something much more beautiful...',
      narration:
        'What would you do if someone was mean to you? Would you be mean back? The Prophet, peace be upon him, showed us something much better. Let us learn about his kindness!',
      illustration: 'seerah-kindness',
    },

    teach: [
      {
        type: 'teach',
        title: 'A Mercy to All the Worlds',
        body: "Allah sent Prophet Muhammad ﷺ as a **mercy** — not just to Muslims, not just to humans, but to **all of creation**!\n\nHe was kind to children, to the elderly, to animals, and even to people who were unkind to him. Let's learn some real stories about his kindness.",
        narration:
          'Allah sent the Prophet as a mercy to all of creation. He was kind to children, to animals, and even to people who were mean to him.',
        arabic: {
          text: 'وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةً لِّلْعَـٰلَمِينَ',
          transliteration: 'Wa mā arsalnāka illā raḥmatan lil-ʿālamīn',
          translation: 'And We have not sent you except as a mercy to the worlds.',
          quranRef: { surah: 21, ayah: 107 },
        },
        keyTerms: [
          {
            term: 'Rahmah',
            definition: 'Mercy — the Prophet ﷺ was sent as a mercy to all creation',
          },
        ],
        illustration: 'seerah-mercy',
      },
      {
        type: 'teach',
        title: 'Kind to Children',
        body: "The Prophet ﷺ loved children and was so gentle with them:\n\n**Story 1:** He used to carry his little granddaughter **Umamah** during prayer! When he bowed down, he would gently put her down, and when he stood up, he would pick her up again. (Sahih al-Bukhari 516)\n\n**Story 2:** Once, his grandson **Hasan** climbed on his back while he was prostrating in prayer. The Prophet ﷺ made his prostration longer so the child could get down on his own. He didn't rush or push him away! (Sunan An-Nasai 1141)",
        narration:
          'The Prophet loved children so much! He would carry his granddaughter Umamah even during prayer. Once his grandson climbed on his back during prostration, and the Prophet waited patiently until the child climbed down. He never got angry.',
        illustration: 'seerah-kind-children',
      },
      {
        type: 'teach',
        title: 'Patient and Forgiving',
        body: '**Story 3:** A young boy named **Anas ibn Malik** served the Prophet ﷺ for **10 whole years**. In all that time, the Prophet ﷺ **never once said "uff"** (a sound of annoyance) to him. He never said, "Why did you do that?" or "Why didn\'t you do that?" (Sahih al-Bukhari 6038)\n\n**Story 4:** The Prophet ﷺ taught that kindness is not just for people — it\'s for **all creatures**! He told the story of a woman who gave water to a thirsty dog on a hot day, and **Allah forgave her** because of that single act of kindness. (Sahih al-Bukhari 3321)',
        narration:
          'Anas served the Prophet for ten years, and the Prophet never once complained or said a single annoyed word to him. The Prophet also taught us to be kind to animals. He said a woman was forgiven by Allah just because she gave water to a thirsty dog!',
        keyTerms: [
          {
            term: 'Sabr',
            definition: 'Patience — the Prophet ﷺ showed incredible patience with everyone',
          },
        ],
        illustration: 'seerah-patience',
      },
    ],

    practice: [
      {
        id: 'sr-01-03-p1',
        type: 'quiz',
        question: 'How does the Quran describe Prophet Muhammad ﷺ?',
        options: [
          'A mercy to the worlds',
          'A king of the people',
          'The strongest person',
          'A rich man',
        ],
        correctIndex: 0,
        points: 10,
        explanation:
          'Allah describes the Prophet ﷺ as "a mercy to the worlds" — to all of creation! (Quran 21:107)',
      },
      {
        id: 'sr-01-03-p2',
        type: 'true-false',
        statement:
          'The Prophet ﷺ said "uff" to Anas many times during the 10 years Anas served him.',
        correctAnswer: false,
        points: 10,
        explanation:
          'The Prophet ﷺ NEVER said "uff" to Anas in the entire 10 years! That shows incredible patience. (Sahih al-Bukhari 6038)',
      },
      {
        id: 'sr-01-03-p3',
        type: 'quiz',
        question: 'What did the Prophet ﷺ do when his granddaughter climbed on him during prayer?',
        options: [
          'He stopped praying',
          'He gently carried her throughout the prayer',
          'He asked someone else to hold her',
          'He got upset',
        ],
        correctIndex: 1,
        points: 10,
        explanation:
          'The Prophet ﷺ lovingly carried Umamah during prayer — picking her up when he stood and putting her down when he bowed. (Sahih al-Bukhari 516)',
      },
      {
        id: 'sr-01-03-p4',
        type: 'tap-word',
        instruction: 'Tap the words in order to complete this verse:',
        words: ['mercy', 'sent', 'except', 'you', 'We', 'not', 'as', 'a', 'have'],
        correctSentence: ['We', 'have', 'not', 'sent', 'you', 'except', 'as', 'a', 'mercy'],
        points: 15,
        hint: 'This is from Quran 21:107 about the Prophet ﷺ.',
        explanation:
          '"We have not sent you except as a mercy" — Allah describes the Prophet ﷺ as a mercy to all the worlds!',
      },
    ],

    reward: {
      message:
        'Mashallah! You learned about the beautiful kindness of the Prophet ﷺ. Be kind like him! 💚',
      funFact:
        "When the people of Ta'if hurt the Prophet ﷺ by throwing stones at him, an angel offered to crush them. But the Prophet ﷺ said no — he hoped their children would become believers. That is true mercy! (Sahih al-Bukhari 3231)",
      bonusDua: {
        arabic: 'اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ',
        transliteration: 'Allahumma-hdini li-ahsanil-akhlaq',
        translation: 'O Allah, guide me to the best of manners.',
      },
    },
  },
];
