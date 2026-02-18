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
            prompt: 'Look around you — the sun, the moon, the trees, the animals. Who made all of these amazing things?',
            narration: 'Look around you. The sun, the moon, the stars, and the trees. Who created all of these beautiful things? Let us find out!',
            illustration: 'aqeedah-creation',
        },

        teach: [
            {
                type: 'teach',
                title: 'Allah Created Everything',
                body: 'Everything you see was made by **Allah**. He created the sky, the mountains, the oceans, and every single person.\n\nAllah is the Creator of everything. Nothing exists except that He created it.',
                narration: 'Allah made everything! The sky, the mountains, the oceans, and every person. Allah is the Creator of all things.',
                illustration: 'aqeedah-creation-2',
            },
            {
                type: 'teach',
                title: 'Allah is One',
                body: 'There is **only one** Allah. He has no partners and no one is like Him.\n\nWe say **La ilaha illAllah** — there is no god but Allah. This is called **Tawheed**, the most important thing in Islam!',
                narration: 'There is only one Allah. He has no partners. We say La ilaha illa Allah. There is no god but Allah. This is called Tawheed.',
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
        ],

        reward: {
            message: 'Mashallah! You learned about the most important thing — knowing Allah! ⭐',
            funFact: 'Allah has 99 beautiful names! Each name tells us something amazing about Him. Can you learn them all?',
            bonusDua: {
                arabic: 'سُبْحَانَ اللَّهِ',
                transliteration: 'SubhanAllah',
                translation: 'Glory be to Allah — say this when you see something beautiful in creation!',
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
            prompt: 'Your name means something special, right? Well, Allah has 99 beautiful names, and each one tells us something amazing about Him!',
            narration: 'Did you know Allah has 99 beautiful names? Each name tells us something wonderful about Him. Let us learn some of them!',
            illustration: 'aqeedah-names',
        },

        teach: [
            {
                type: 'teach',
                title: 'Ar-Rahman & Ar-Raheem',
                body: '**Ar-Rahman** means The Most Merciful. Allah\'s mercy covers everything in the world.\n\n**Ar-Raheem** means The Especially Merciful. This is Allah\'s special mercy for those who believe.',
                narration: 'Ar-Rahman means The Most Merciful. Allah is kind to everyone and everything. Ar-Raheem means He has a special mercy for believers.',
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
                narration: 'Al-Khaliq means The Creator. Allah made everything. As-Sami means The All-Hearing. Allah hears every prayer, even the quiet ones.',
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
            funFact: 'The Prophet ﷺ said: "Allah has 99 names. Whoever learns them will enter Paradise!" (Bukhari)',
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
            prompt: 'Have you ever done something good when nobody was watching? Guess what — Someone was always watching! Who could it be?',
            narration: 'Have you ever done something good when no one was watching? Someone was always watching. Let us find out who!',
            illustration: 'aqeedah-watching',
        },

        teach: [
            {
                type: 'teach',
                title: 'Al-Baseer & Al-Aleem',
                body: '**Al-Baseer** means The All-Seeing. Allah sees everything — even a tiny black ant on a dark rock at night!\n\n**Al-Aleem** means The All-Knowing. Allah knows what is in our hearts and minds.',
                narration: 'Al-Baseer means The All-Seeing. Allah sees everything, even a tiny ant in the dark! Al-Aleem means The All-Knowing. Allah knows what is in our hearts.',
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
                narration: 'Because Allah sees us always, we try to be good even when no one is looking. This is called ihsan — doing our best for Allah.',
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
            funFact: 'The Prophet ﷺ described Ihsan as: "Worship Allah as if you see Him, and if you cannot see Him, know that He sees you."',
            bonusDua: {
                arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
                transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
                translation: 'O Allah, You are the Pardoner and You love to pardon, so pardon me',
            },
        },
    },
];
