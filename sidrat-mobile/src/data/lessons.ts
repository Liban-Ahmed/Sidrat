/**
 * Sample lesson data — ported from Lesson.generateTestLessons()
 * in the iOS app with all content blocks included.
 */

import type { Lesson } from '../types';

export const sampleLessons: Lesson[] = [
    // ── Week 1 — Wudu ──────────────────────────────────────────────
    {
        id: 'w1-l1',
        title: 'What is Wudu?',
        description:
            'Learn about the special way Muslims clean themselves before prayer',
        category: 'wudu',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 1,
        weekNumber: 1,
        content: [
            {
                id: 'w1-l1-s1',
                type: 'story',
                title: 'Why We Make Wudu',
                text: 'Before we pray to Allah, we make ourselves clean. This special cleaning is called Wudu!',
            },
            {
                id: 'w1-l1-q1',
                type: 'quiz',
                question: 'What is Wudu?',
                options: [
                    'A type of food',
                    'Special cleaning before prayer',
                    'A game',
                    'A song',
                ],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 'w1-l2',
        title: 'Why We Make Wudu',
        description: 'Discover why cleanliness is important in Islam',
        category: 'wudu',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 2,
        weekNumber: 1,
        content: [
            {
                id: 'w1-l2-s1',
                type: 'story',
                title: 'Cleanliness in Islam',
                text: 'Islam teaches us to be clean. When we make wudu, we wash away the dust and feel fresh and ready to talk to Allah!',
            },
            {
                id: 'w1-l2-q1',
                type: 'quiz',
                question: 'Why is cleanliness important in Islam?',
                options: [
                    "It isn't important",
                    'To look nice',
                    'Because Allah loves cleanliness',
                    'For fun',
                ],
                correctAnswer: 2,
            },
        ],
    },
    {
        id: 'w1-l3',
        title: 'Steps of Wudu — Part 1',
        description: 'Learn the first steps of making wudu',
        category: 'wudu',
        difficulty: 'beginner',
        durationMinutes: 6,
        xpReward: 25,
        order: 3,
        weekNumber: 1,
        content: [
            {
                id: 'w1-l3-s1',
                type: 'story',
                title: 'Starting Wudu',
                text: 'We start wudu by saying Bismillah and washing our hands three times.',
            },
            {
                id: 'w1-l3-q1',
                type: 'quiz',
                question: 'What do we say before starting wudu?',
                options: ['Alhamdulillah', 'Bismillah', 'SubhanAllah', 'Allahu Akbar'],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 'w1-l4',
        title: 'Steps of Wudu — Part 2',
        description: 'Complete learning all the steps of wudu',
        category: 'wudu',
        difficulty: 'beginner',
        durationMinutes: 6,
        xpReward: 25,
        order: 4,
        weekNumber: 1,
        content: [
            {
                id: 'w1-l4-s1',
                type: 'story',
                title: 'Completing Wudu',
                text: "After washing our face and arms, we wipe our head and wash our feet. Now we're ready to pray!",
            },
            {
                id: 'w1-l4-q1',
                type: 'quiz',
                question: "What's the last body part we wash in wudu?",
                options: ['Face', 'Hands', 'Feet', 'Head'],
                correctAnswer: 2,
            },
        ],
    },
    {
        id: 'w1-l5',
        title: "The Wudu Du'a",
        description: "Learn the beautiful prayer we say after wudu",
        category: 'wudu',
        difficulty: 'beginner',
        durationMinutes: 4,
        xpReward: 15,
        order: 5,
        weekNumber: 1,
        content: [
            {
                id: 'w1-l5-s1',
                type: 'story',
                title: "Du'a After Wudu",
                text: "After finishing wudu, we raise our finger and say a special du'a that Prophet Muhammad \uFDFA taught us.",
            },
            {
                id: 'w1-l5-q1',
                type: 'quiz',
                question: "When do we say the wudu du'a?",
                options: [
                    'Before wudu',
                    'During wudu',
                    'After completing wudu',
                    'Anytime',
                ],
                correctAnswer: 2,
            },
        ],
    },

    // ── Week 2 — Salah ─────────────────────────────────────────────
    {
        id: 'w2-l1',
        title: 'What is Salah?',
        description: 'Learn about the five daily prayers',
        category: 'salah',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 6,
        weekNumber: 2,
        content: [
            {
                id: 'w2-l1-s1',
                type: 'story',
                title: 'Talking to Allah',
                text: 'Salah is our special way of talking to Allah five times every day. It is the most important thing a Muslim does!',
            },
            {
                id: 'w2-l1-q1',
                type: 'quiz',
                question: 'How many times do we pray each day?',
                options: ['3 times', '4 times', '5 times', '7 times'],
                correctAnswer: 2,
            },
        ],
    },
    {
        id: 'w2-l2',
        title: 'Times of Prayer',
        description: 'Discover when we pray throughout the day',
        category: 'salah',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 7,
        weekNumber: 2,
        content: [
            {
                id: 'w2-l2-s1',
                type: 'story',
                title: 'The Five Prayers',
                text: 'Fajr at dawn, Dhuhr at noon, Asr in the afternoon, Maghrib at sunset, and Isha at night.',
            },
            {
                id: 'w2-l2-q1',
                type: 'quiz',
                question: 'Which prayer do we pray at dawn?',
                options: ['Dhuhr', 'Fajr', 'Maghrib', 'Isha'],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 'w2-l3',
        title: 'Preparing for Salah',
        description: 'Get ready to pray the right way',
        category: 'salah',
        difficulty: 'beginner',
        durationMinutes: 6,
        xpReward: 25,
        order: 8,
        weekNumber: 2,
        content: [
            {
                id: 'w2-l3-s1',
                type: 'story',
                title: 'Getting Ready',
                text: 'Before salah, we make wudu, face the Qibla, and make our intention in our heart.',
            },
        ],
    },

    // ── Week 3 — Quran ─────────────────────────────────────────────
    {
        id: 'w3-l1',
        title: 'The Holy Quran',
        description: "Learn about Allah's special book",
        category: 'quran',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 9,
        weekNumber: 3,
        content: [
            {
                id: 'w3-l1-s1',
                type: 'story',
                title: "Allah's Book",
                text: 'The Quran is the word of Allah. It was revealed to Prophet Muhammad \uFDFA through Angel Jibreel.',
            },
        ],
    },
    {
        id: 'w3-l2',
        title: 'Surah Al-Fatihah',
        description: 'Learn the opening chapter of the Quran',
        category: 'quran',
        difficulty: 'beginner',
        durationMinutes: 7,
        xpReward: 30,
        order: 10,
        weekNumber: 3,
        content: [
            {
                id: 'w3-l2-s1',
                type: 'story',
                title: 'The Opening',
                text: 'Al-Fatihah means "The Opening". We recite it in every prayer. It is the most important surah!',
            },
            {
                id: 'w3-l2-a1',
                type: 'audio',
                title: 'Listen and Repeat',
                audioUrl: 'surah_fatihah.mp3',
                text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            },
        ],
    },

    // ── Week 4 — Aqeedah ───────────────────────────────────────────
    {
        id: 'w4-l1',
        title: 'Belief in Allah',
        description: 'Learn about the One who created everything',
        category: 'aqeedah',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 11,
        weekNumber: 4,
        content: [
            {
                id: 'w4-l1-s1',
                type: 'story',
                title: 'Who is Allah?',
                text: 'Allah created everything — the sky, the trees, the animals, and you! He is One, and there is nothing like Him.',
            },
        ],
    },
    {
        id: 'w4-l2',
        title: 'The Prophets',
        description: 'Meet the special messengers of Allah',
        category: 'aqeedah',
        difficulty: 'beginner',
        durationMinutes: 6,
        xpReward: 25,
        order: 12,
        weekNumber: 4,
        content: [
            {
                id: 'w4-l2-s1',
                type: 'story',
                title: "Allah's Messengers",
                text: 'Allah sent prophets to guide people — like Adam, Nuh, Ibrahim, Musa, Isa, and Muhammad \uFDFA.',
            },
        ],
    },

    // ── Week 5 — Adab ──────────────────────────────────────────────
    {
        id: 'w5-l1',
        title: 'Good Manners',
        description: 'Learn how to be kind and respectful',
        category: 'adab',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 13,
        weekNumber: 5,
        content: [
            {
                id: 'w5-l1-s1',
                type: 'story',
                title: 'Being Kind',
                text: 'The Prophet \uFDFA said the best among people are those with the best manners. Being kind makes Allah happy!',
            },
        ],
    },
    {
        id: 'w5-l2',
        title: 'Helping Others',
        description: 'Discover the joy of being helpful',
        category: 'adab',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 14,
        weekNumber: 5,
        content: [
            {
                id: 'w5-l2-s1',
                type: 'story',
                title: 'Helping Hands',
                text: 'When we help others, Allah helps us. Even a smile is charity in Islam!',
            },
        ],
    },

    // ── Week 6 — Du'a ──────────────────────────────────────────────
    {
        id: 'w6-l1',
        title: "What is Du'a?",
        description: 'Learn how to talk to Allah',
        category: 'duaa',
        difficulty: 'beginner',
        durationMinutes: 4,
        xpReward: 15,
        order: 15,
        weekNumber: 6,
        content: [
            {
                id: 'w6-l1-s1',
                type: 'story',
                title: 'Asking Allah',
                text: "Du'a means asking Allah for anything. You can make du'a anytime, anywhere, in any language!",
            },
        ],
    },
    {
        id: 'w6-l2',
        title: "Morning and Evening Du'as",
        description: 'Special prayers for morning and night',
        category: 'duaa',
        difficulty: 'beginner',
        durationMinutes: 6,
        xpReward: 25,
        order: 16,
        weekNumber: 6,
        content: [
            {
                id: 'w6-l2-s1',
                type: 'story',
                title: 'Start and End Your Day',
                text: "The Prophet \uFDFA taught us beautiful du'as for when we wake up and before we sleep.",
            },
        ],
    },

    // ── Week 7 — Seerah ────────────────────────────────────────────
    {
        id: 'w7-l1',
        title: 'Prophet Muhammad \uFDFA',
        description: 'Meet the best person who ever lived',
        category: 'seerah',
        difficulty: 'beginner',
        durationMinutes: 5,
        xpReward: 20,
        order: 17,
        weekNumber: 7,
        content: [
            {
                id: 'w7-l1-s1',
                type: 'story',
                title: 'Our Beloved Prophet',
                text: 'Prophet Muhammad \uFDFA was born in Makkah. He was known as "The Truthful" and "The Trustworthy" even before he became a prophet.',
            },
        ],
    },
    {
        id: 'w7-l2',
        title: 'The Kindness of the Prophet',
        description: 'Stories of how kind the Prophet was',
        category: 'seerah',
        difficulty: 'beginner',
        durationMinutes: 6,
        xpReward: 25,
        order: 18,
        weekNumber: 7,
        content: [
            {
                id: 'w7-l2-s1',
                type: 'story',
                title: 'Kind to Everyone',
                text: 'The Prophet \uFDFA was kind to children, animals, and even people who were unkind to him.',
            },
        ],
    },

    // ── Week 8 — Stories ────────────────────────────────────────────
    {
        id: 'w8-l1',
        title: 'The People of the Elephant',
        description: 'An amazing story from the Quran',
        category: 'stories',
        difficulty: 'beginner',
        durationMinutes: 7,
        xpReward: 30,
        order: 19,
        weekNumber: 8,
        content: [
            {
                id: 'w8-l1-s1',
                type: 'story',
                title: 'Surah Al-Fil',
                text: 'A king named Abraha tried to destroy the Kaabah with a huge army and an elephant. But Allah sent tiny birds that stopped the whole army!',
            },
        ],
    },
    {
        id: 'w8-l2',
        title: 'The Boy and the King',
        description: 'A story of bravery and faith',
        category: 'stories',
        difficulty: 'beginner',
        durationMinutes: 7,
        xpReward: 30,
        order: 20,
        weekNumber: 8,
        content: [
            {
                id: 'w8-l2-s1',
                type: 'story',
                title: 'The Brave Boy',
                text: 'A young boy believed in Allah even when a powerful king tried to stop him. His faith was so strong that it inspired a whole city!',
            },
        ],
    },
];
