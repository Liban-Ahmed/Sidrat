/**
 * Salah Unit — Curriculum Content
 *
 * Teaching children the foundations of prayer (salah).
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

export const salahUnit: CurriculumUnit = {
    id: 'salah-01',
    title: 'Learning Salah',
    description: 'Discover the gift of prayer — talking to Allah',
    category: 'salah',
    order: 1,
    icon: 'person-outline',
    lessonIds: ['salah-01-01', 'salah-01-02', 'salah-01-03', 'salah-01-04'],
};

export const salahLessons: CurriculumLesson[] = [
    // ── Lesson 1: Why Do We Pray? ───────────────────────────────

    {
        id: 'salah-01-01',
        title: 'Why Do We Pray?',
        description: 'Learn about the importance of salah in Islam',
        category: 'salah',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 25,
        order: 1,
        unitId: 'salah-01',
        minAgeGroup: 'toddler',
        tags: ['salah', 'prayer', 'fard'],

        hook: {
            type: 'hook',
            prompt: 'Imagine you could talk to the King of all kings, anytime you want. Would you? Well, that is exactly what salah is — talking to Allah!',
            narration: 'Imagine you could talk to the King of all kings, anytime you want. That is exactly what salah is. It is our special time to talk to Allah!',
            illustration: 'salah-prayer',
        },

        teach: [
            {
                type: 'teach',
                title: 'Salah — Our Gift from Allah',
                body: '**Salah** is the Islamic prayer. It is the second pillar of Islam and the most important act of worship after believing in Allah.\n\nAllah gave us salah as a **gift** during the Night Journey (Isra & Mi\'raj). The Prophet Muhammad ﷺ traveled to the heavens and received this gift directly from Allah!',
                narration: 'Salah is our Islamic prayer. It is the second pillar of Islam. Allah gave us salah as a gift during the Night Journey, when the Prophet Muhammad, peace be upon him, traveled to the heavens.',
                keyTerms: [
                    { term: 'Salah', definition: 'The Islamic prayer — our conversation with Allah' },
                    { term: 'Fard', definition: 'Something required — salah is fard for every Muslim' },
                ],
                illustration: 'salah-gift',
            },
            {
                type: 'teach',
                title: 'Five Prayers Every Day',
                body: 'Muslims pray **five times** every day:\n\n1. **Fajr** — at dawn, before the sun rises\n2. **Dhuhr** — in the early afternoon\n3. **Asr** — in the late afternoon\n4. **Maghrib** — just after sunset\n5. **Isha** — at night\n\nEach prayer is a chance to pause, remember Allah, and feel peace.',
                narration: 'Muslims pray five times every day. Fajr at dawn. Dhuhr in the afternoon. Asr in the late afternoon. Maghrib after sunset. And Isha at night. Each prayer is a chance to remember Allah.',
                keyTerms: [
                    { term: 'Fajr', definition: 'The dawn prayer' },
                    { term: 'Maghrib', definition: 'The sunset prayer' },
                ],
                illustration: 'salah-five-times',
            },
        ],

        practice: [
            {
                id: 'sal-01-01-p1',
                type: 'quiz',
                question: 'How many times do Muslims pray each day?',
                options: ['3 times', '4 times', '5 times', '7 times'],
                correctIndex: 2,
                points: 10,
                explanation: 'Muslims pray 5 times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
            },
            {
                id: 'sal-01-01-p2',
                type: 'true-false',
                statement: 'Salah is the second pillar of Islam.',
                correctAnswer: true,
                points: 10,
                explanation: 'Correct! The five pillars are: Shahada, Salah, Zakat, Fasting, and Hajj.',
            },
            {
                id: 'sal-01-01-p3',
                type: 'ordering',
                instruction: 'Put the five daily prayers in order from earliest to latest:',
                correctOrder: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
                points: 15,
                explanation: 'The five prayers go from dawn (Fajr) all the way to night (Isha).',
            },
            {
                id: 'sal-01-01-p4',
                type: 'tap-word',
                instruction: 'Build the sentence about salah:',
                words: ['pray', 'Muslims', 'times', 'five', 'a', 'day'],
                correctSentence: ['Muslims', 'pray', 'five', 'times', 'a', 'day'],
                points: 10,
                hint: 'The sentence starts with "Muslims".',
                explanation: 'Muslims pray five times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha!',
            },
        ],

        reward: {
            message: 'Mashallah! You learned about the beautiful gift of salah! 🕌',
            funFact: 'The Prophet ﷺ said: "The first thing a person will be asked about on the Day of Judgment is their prayer." (Tirmidhi)',
            bonusDua: {
                arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي',
                transliteration: "Rabbij'alni muqeemas-salati wa min dhurriyyati",
                translation: 'My Lord, make me and my children among those who establish prayer (Quran 14:40)',
            },
        },
    },

    // ── Lesson 2: Getting Ready to Pray ─────────────────────────

    {
        id: 'salah-01-02',
        title: 'Getting Ready to Pray',
        description: 'Learn about wudu, clean clothes, and facing the Qibla',
        category: 'salah',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 25,
        order: 2,
        unitId: 'salah-01',
        minAgeGroup: 'toddler',
        tags: ['salah', 'wudu', 'qibla', 'preparation'],

        hook: {
            type: 'hook',
            prompt: 'Before visiting someone important, you get ready — you wash up, wear clean clothes, and bring your best manners. What do you think we do before talking to Allah?',
            narration: 'Before we pray, we need to get ready. Just like when you visit someone important. Let us learn how to prepare for salah!',
            illustration: 'salah-prepare',
        },

        teach: [
            {
                type: 'teach',
                title: 'Step 1: Make Wudu',
                body: 'Before praying, we make **wudu** (ablution). This means washing our hands, mouth, nose, face, arms, head, and feet with clean water.\n\nWudu helps us feel **clean and fresh** before standing in front of Allah. You already learned wudu — great job!',
                narration: 'Before praying, we make wudu. We wash our hands, face, arms, and feet. Wudu helps us feel clean before standing in front of Allah.',
                illustration: 'salah-wudu',
            },
            {
                type: 'teach',
                title: 'Step 2: Face the Qibla',
                body: 'When we pray, we all face the same direction — toward the **Ka\'bah** in Makkah, Saudi Arabia. This direction is called the **Qibla**.\n\nMuslims all over the world face the Qibla when they pray. It reminds us that we are all one community!',
                narration: 'When we pray, we face the Qibla. That is the direction of the Kabah in Makkah. Muslims all over the world face the same direction when praying.',
                arabic: {
                    text: 'فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ',
                    transliteration: 'Fa walli wajhaka shatral-masjidil-haram',
                    translation: 'So turn your face toward the Sacred Mosque (Quran 2:144)',
                },
                keyTerms: [
                    { term: 'Qibla', definition: 'The direction of the Ka\'bah in Makkah' },
                    { term: "Ka'bah", definition: 'The sacred house of Allah in Makkah' },
                ],
                illustration: 'salah-qibla',
            },
        ],

        practice: [
            {
                id: 'sal-01-02-p1',
                type: 'quiz',
                question: 'What direction do Muslims face when praying?',
                options: ['North', 'Toward the Qibla (Ka\'bah)', 'East', 'Any direction'],
                correctIndex: 1,
                points: 10,
                explanation: 'We face the Qibla — the direction of the Ka\'bah in Makkah.',
            },
            {
                id: 'sal-01-02-p2',
                type: 'ordering',
                instruction: 'What do you do to get ready for salah?',
                correctOrder: ['Make Wudu', 'Wear clean clothes', 'Find the Qibla', 'Make the intention (niyyah)'],
                points: 15,
                explanation: 'First make wudu, then get dressed properly, find the qibla, and make your intention to pray.',
            },
            {
                id: 'sal-01-02-p3',
                type: 'true-false',
                statement: 'You can pray without making wudu first.',
                correctAnswer: false,
                points: 10,
                explanation: 'Wudu is required before prayer. We must be in a state of purity to stand before Allah.',
            },
        ],

        reward: {
            message: 'Excellent! Now you know how to get ready for salah! 🧼',
            funFact: 'The Ka\'bah was originally built by Prophet Ibrahim (Abraham) and his son Ismail, peace be upon them both!',
        },
    },

    // ── Lesson 3: The Steps of Salah ────────────────────────────

    {
        id: 'salah-01-03',
        title: 'The Steps of Salah',
        description: 'Learn the physical movements of prayer',
        category: 'salah',
        difficulty: 'beginner',
        durationMinutes: 6,
        xpReward: 30,
        order: 3,
        unitId: 'salah-01',
        minAgeGroup: 'early',
        tags: ['salah', 'ruku', 'sujud', 'movements'],

        hook: {
            type: 'hook',
            prompt: 'Salah has special movements — standing, bowing, and putting your forehead on the ground. Each movement has a beautiful meaning. Ready to learn them?',
            narration: 'Salah has special movements. Standing, bowing, and prostrating. Each movement brings us closer to Allah. Let us learn them together!',
            illustration: 'salah-movements',
        },

        teach: [
            {
                type: 'teach',
                title: 'Standing (Qiyam) & Takbeer',
                body: 'We begin salah by standing and raising our hands to our ears while saying **"Allahu Akbar"** (Allah is the Greatest). This is called the **Takbeer**.\n\nWhile standing, we recite **Surah Al-Fatiha**, the opening chapter of the Quran.',
                narration: 'We begin by standing and raising our hands while saying Allahu Akbar. This is the Takbeer. While standing, we recite Surah Al-Fatiha.',
                arabic: {
                    text: 'اللَّهُ أَكْبَرُ',
                    transliteration: 'Allahu Akbar',
                    translation: 'Allah is the Greatest',
                },
                keyTerms: [
                    { term: 'Qiyam', definition: 'Standing upright in prayer' },
                    { term: 'Takbeer', definition: 'Saying "Allahu Akbar"' },
                ],
                illustration: 'salah-qiyam',
            },
            {
                type: 'teach',
                title: 'Bowing (Ruku) & Prostrating (Sujud)',
                body: '**Ruku** (bowing): We bow with our hands on our knees and say **"Subhana Rabbiyal-Adheem"** (Glory to my Lord, the Magnificent).\n\n**Sujud** (prostration): We place our forehead, nose, palms, knees, and toes on the ground and say **"Subhana Rabbiyal-A\'la"** (Glory to my Lord, the Most High).\n\nSujud is the closest we are to Allah!',
                narration: 'In Ruku, we bow and say Subhana Rabbiyal Adheem. In Sujud, we put our forehead on the ground and say Subhana Rabbiyal Ala. Sujud is when we are closest to Allah!',
                arabic: {
                    text: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
                    transliteration: "Subhana Rabbiyal-A'la",
                    translation: 'Glory to my Lord, the Most High',
                },
                keyTerms: [
                    { term: 'Ruku', definition: 'Bowing in prayer' },
                    { term: 'Sujud', definition: 'Prostration — forehead on the ground' },
                ],
                illustration: 'salah-sujud',
            },
        ],

        practice: [
            {
                id: 'sal-01-03-p1',
                type: 'matching',
                instruction: 'Match each prayer position with what we say:',
                pairs: [
                    { left: 'Standing (Qiyam)', right: 'Surah Al-Fatiha' },
                    { left: 'Beginning (Takbeer)', right: 'Allahu Akbar' },
                    { left: 'Bowing (Ruku)', right: 'Subhana Rabbiyal-Adheem' },
                    { left: 'Prostration (Sujud)', right: "Subhana Rabbiyal-A'la" },
                ],
                points: 20,
                explanation: 'Each position in salah has words we say to glorify and praise Allah.',
            },
            {
                id: 'sal-01-03-p2',
                type: 'ordering',
                instruction: 'Put the prayer movements in the correct order:',
                correctOrder: ['Takbeer (Allahu Akbar)', 'Qiyam (Standing)', 'Ruku (Bowing)', 'Standing back up', 'Sujud (Prostration)'],
                points: 15,
                explanation: 'This is the order of one raka\'ah (unit) of prayer.',
            },
            {
                id: 'sal-01-03-p3',
                type: 'quiz',
                question: 'When are we closest to Allah during salah?',
                options: ['While standing', 'While bowing', 'During sujud (prostration)', 'While sitting'],
                correctIndex: 2,
                points: 10,
                explanation: 'The Prophet ﷺ said: "The closest a servant is to his Lord is during prostration." (Muslim)',
            },
        ],

        reward: {
            message: 'SubhanAllah! You learned the beautiful movements of salah! 🤲',
            funFact: 'A Muslim who prays 5 times a day prostrates about 34 times! That is 34 times being closest to Allah every single day!',
            bonusDua: {
                arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
                transliteration: 'Subhana Rabbiyal-Adheem',
                translation: 'Glory to my Lord, the Magnificent — said during bowing',
            },
        },
    },

    // ── Lesson 4: What We Say in Salah ──────────────────────────

    {
        id: 'salah-01-04',
        title: 'What We Say in Salah',
        description: 'Learn Al-Fatiha and the words of prayer',
        category: 'salah',
        difficulty: 'beginner',
        durationMinutes: 7,
        xpReward: 35,
        order: 4,
        unitId: 'salah-01',
        minAgeGroup: 'early',
        tags: ['salah', 'fatiha', 'tashahhud', 'recitation'],

        hook: {
            type: 'hook',
            prompt: 'Every salah begins with a very special surah. It is so important that the Prophet ﷺ said your prayer is not complete without it. Do you know which surah it is?',
            narration: 'Every prayer begins with a very special surah. It is called Al-Fatiha, the Opening. Let us learn about it!',
            illustration: 'salah-fatiha',
        },

        teach: [
            {
                type: 'teach',
                title: 'Surah Al-Fatiha — The Opening',
                body: 'Surah Al-Fatiha is the **first chapter** of the Quran. We recite it in **every raka\'ah** of every prayer.\n\nIt begins with praising Allah, then asking Him for guidance:\n\n*"Guide us to the straight path."*\n\nThe Prophet ﷺ said: "There is no prayer for the one who does not recite the Opening of the Book."',
                narration: 'Surah Al-Fatiha is the first chapter of the Quran. We say it in every unit of prayer. It is a beautiful conversation between us and Allah.',
                arabic: {
                    text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
                    transliteration: 'Ihdinas-siratal-mustaqeem',
                    translation: 'Guide us to the straight path',
                },
                keyTerms: [
                    { term: 'Al-Fatiha', definition: 'The Opening — first surah of the Quran' },
                    { term: "Raka'ah", definition: 'One unit of prayer' },
                ],
                illustration: 'salah-recite',
            },
            {
                type: 'teach',
                title: 'Ending the Prayer — Tashahhud & Salam',
                body: 'At the end of the prayer, we sit and recite the **Tashahhud** — a testimony of faith.\n\nThen we end the prayer by turning our head to the right and then the left, saying:\n\n**"Assalamu Alaikum wa Rahmatullah"**\n(Peace and mercy of Allah be upon you)\n\nThis is how we send peace to the angels and everyone around us!',
                narration: 'At the end of the prayer, we recite the Tashahhud. Then we turn to the right and left saying Assalamu Alaikum wa Rahmatullah. We are sending peace to everyone around us!',
                arabic: {
                    text: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
                    transliteration: 'Assalamu Alaikum wa Rahmatullah',
                    translation: 'Peace and mercy of Allah be upon you',
                },
                keyTerms: [
                    { term: 'Tashahhud', definition: 'The testimony of faith recited while sitting in prayer' },
                    { term: 'Salam', definition: 'The greeting of peace that ends the prayer' },
                ],
                illustration: 'salah-salam',
            },
        ],

        practice: [
            {
                id: 'sal-01-04-p1',
                type: 'quiz',
                question: 'Which surah MUST be recited in every raka\'ah of prayer?',
                options: ['Surah Al-Ikhlas', 'Surah Al-Fatiha', 'Surah Al-Falaq', 'Surah An-Nas'],
                correctIndex: 1,
                points: 10,
                explanation: 'Surah Al-Fatiha must be recited in every raka\'ah. The Prophet ﷺ said prayer is not valid without it.',
            },
            {
                id: 'sal-01-04-p2',
                type: 'fill-blank',
                sentence: 'We end the prayer by saying Assalamu ___ wa Rahmatullah.',
                acceptedAnswers: ['Alaikum', 'alaikum', 'alaykum', 'Alaykum'],
                points: 10,
                hint: 'It means "upon you"',
                explanation: 'Assalamu Alaikum wa Rahmatullah — Peace and mercy of Allah be upon you!',
            },
            {
                id: 'sal-01-04-p3',
                type: 'true-false',
                statement: 'Surah Al-Fatiha is the last surah in the Quran.',
                correctAnswer: false,
                points: 10,
                explanation: 'Al-Fatiha is the FIRST surah (chapter) of the Quran. The last surah is An-Nas.',
            },
        ],

        reward: {
            message: 'Alhamdulillah! You now know the key words of salah! 📖',
            funFact: 'When you recite Al-Fatiha in prayer, Allah responds to you after every verse! It is truly a conversation between you and your Creator.',
            bonusDua: {
                arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
                transliteration: 'Rabbana taqabbal minna innaka antas-Samee\'ul-Aleem',
                translation: 'Our Lord, accept from us. You are the All-Hearing, All-Knowing (Quran 2:127)',
            },
        },
    },
];
