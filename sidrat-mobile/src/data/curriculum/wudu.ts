/**
 * Wudu Unit — Curriculum Content
 *
 * A complete 5-lesson unit teaching children about wudu.
 * Each lesson uses the 4-phase structure: Hook → Teach → Practice → Reward
 */

import type { CurriculumLesson, CurriculumUnit } from '../../types/curriculum';

// ── Unit Definition ────────────────────────────────────────────

export const wuduUnit: CurriculumUnit = {
  id: 'wudu-01',
  title: 'Learning Wudu',
  description: 'Learn the beautiful way Muslims purify themselves before prayer',
  category: 'wudu',
  order: 1,
  icon: 'water-outline',
  lessonIds: ['wudu-01-01', 'wudu-01-02', 'wudu-01-03', 'wudu-01-04', 'wudu-01-05'],
};

// ── Lessons ────────────────────────────────────────────────────

export const wuduLessons: CurriculumLesson[] = [
  {
    id: 'wudu-01-01',
    title: 'What is Wudu?',
    description: 'Discover the special way Muslims get clean before talking to Allah',
    category: 'wudu',
    difficulty: 'beginner',
    durationMinutes: 5,
    xpReward: 25,
    order: 1,
    unitId: 'wudu-01',
    minAgeGroup: 'toddler',
    tags: ['wudu', 'purity', 'introduction'],

    hook: {
      type: 'hook',
      prompt:
        'What do you do before eating dinner? You wash your hands! But did you know Muslims have a special way of washing before they pray?',
      narration: 'Before we talk to Allah in prayer, we do something special. It is called wudu!',
      illustration: 'wudu-intro',
    },

    teach: [
      {
        type: 'teach',
        title: 'What is Wudu?',
        body: 'Wudu is a special way of cleaning ourselves before we pray to Allah. It is not just about being clean on the outside — it also helps us feel clean and peaceful on the inside.\n\nThe word "wudu" comes from an Arabic word that means beauty and cleanliness.',
        narration:
          'Wudu is a special way to clean ourselves before we pray. It makes us feel fresh and ready to talk to Allah! The word wudu means beauty and cleanliness.',
        keyTerms: [
          { term: 'Wudu', definition: 'The special Islamic washing before prayer' },
          { term: 'Tahara', definition: 'Cleanliness and purity in Islam' },
        ],
        illustration: 'wudu-what',
      },
      {
        type: 'teach',
        title: 'Why Do We Make Wudu?',
        body: 'Allah tells us in the Quran to wash ourselves before prayer. The Prophet Muhammad ﷺ said that cleanliness is half of faith!\n\nWhen we make wudu, we are showing respect to Allah before standing in front of Him.',
        narration:
          'We make wudu because Allah told us to. The Prophet Muhammad said that cleanliness is half of faith! When we do wudu, we show respect to Allah.',
        arabic: {
          text: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
          transliteration: 'At-tuhuru shatrul iman',
          translation: 'Cleanliness is half of faith',
        },
        illustration: 'wudu-why',
      },
    ],

    practice: [
      {
        id: 'wudu-01-01-p1',
        type: 'quiz',
        question: 'What is wudu?',
        options: [
          'A type of food',
          'The special washing before prayer',
          'A bedtime story',
          'A kind of exercise',
        ],
        correctIndex: 1,
        points: 10,
        hint: 'Think about what we do before we pray...',
        explanation: 'Wudu is the special washing we do before prayer to be clean for Allah!',
      },
      {
        id: 'wudu-01-01-p2',
        type: 'true-false',
        statement: 'The Prophet ﷺ said cleanliness is half of faith.',
        correctAnswer: true,
        points: 10,
        explanation: 'Yes! This famous hadith teaches us how important being clean is in Islam.',
      },
      {
        id: 'wudu-01-01-p3',
        type: 'quiz',
        question: 'Why do we make wudu?',
        options: [
          'To waste water',
          'To show respect to Allah before prayer',
          'Because we are dirty',
          'To play with water',
        ],
        correctIndex: 1,
        points: 10,
        explanation: 'We make wudu to show respect to Allah and prepare ourselves for prayer.',
      },
      {
        id: 'wudu-01-01-p4',
        type: 'tap-word',
        instruction: 'Build the sentence about wudu:',
        words: ['half', 'is', 'of', 'Cleanliness', 'faith'],
        correctSentence: ['Cleanliness', 'is', 'half', 'of', 'faith'],
        points: 10,
        hint: 'This famous hadith starts with the word "Cleanliness".',
        explanation: 'The Prophet ﷺ said: "Cleanliness is half of faith." (Sahih Muslim)',
      },
    ],

    reward: {
      message: 'Mashallah! You learned what wudu is! 🌟',
      funFact: 'Did you know? Every drop of water in wudu washes away small mistakes. SubhanAllah!',
      bonusDua: {
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah — say this before starting wudu!',
      },
    },
  },

  {
    id: 'wudu-01-02',
    title: 'Steps of Wudu — Hands & Mouth',
    description: 'Learn the first steps of wudu: washing hands and rinsing the mouth',
    category: 'wudu',
    difficulty: 'beginner',
    durationMinutes: 6,
    xpReward: 30,
    order: 2,
    unitId: 'wudu-01',
    minAgeGroup: 'toddler',
    tags: ['wudu', 'steps', 'hands', 'mouth'],

    hook: {
      type: 'hook',
      prompt:
        "Can you count to three? Great! In wudu, we wash each part of our body three times. Let's learn the first steps!",
      narration: 'Can you count to three? In wudu we wash each part three times. Let us start!',
      illustration: 'wudu-hands',
    },

    teach: [
      {
        type: 'teach',
        title: 'Say Bismillah',
        body: 'Before we start wudu, we say **Bismillah** (In the name of Allah). This reminds us that we are doing wudu for Allah.\n\nThen we wash our hands up to our wrists, three times. Start with the right hand!',
        narration:
          'First we say Bismillah. Then we wash our hands three times. We start with the right hand.',
        arabic: {
          text: 'بِسْمِ اللَّهِ',
          transliteration: 'Bismillah',
          translation: 'In the name of Allah',
        },
        illustration: 'wudu-step-hands',
      },
      {
        type: 'teach',
        title: 'Rinse the Mouth',
        body: 'Next, we take water in our right hand and rinse our mouth three times. Swish the water around and spit it out.\n\nThis is called **Madmadah**.',
        narration:
          'After washing our hands, we rinse our mouth three times. We take water in our right hand, swish it around, and spit it out.',
        keyTerms: [{ term: 'Madmadah', definition: 'Rinsing the mouth during wudu' }],
        illustration: 'wudu-step-mouth',
      },
      {
        type: 'teach',
        title: 'Rinse the Nose',
        body: 'Then we sniff a little water into our nose and blow it out, three times. This is called **Istinshaq**.\n\nUse your right hand to take water and your left hand to clean your nose.',
        narration:
          'Then we gently put water in our nose and blow it out three times. Use the right hand for water and the left hand to clean.',
        keyTerms: [{ term: 'Istinshaq', definition: 'Sniffing water into the nose during wudu' }],
        illustration: 'wudu-step-nose',
      },
    ],

    practice: [
      {
        id: 'wudu-01-02-p1',
        type: 'ordering',
        instruction: 'Put these first steps of wudu in the correct order:',
        correctOrder: ['Say Bismillah', 'Wash hands (3x)', 'Rinse mouth (3x)', 'Rinse nose (3x)'],
        points: 15,
        hint: 'What do we say first before starting anything?',
        explanation:
          'The correct order is: Bismillah, then hands, mouth, and nose — each three times!',
      },
      {
        id: 'wudu-01-02-p2',
        type: 'quiz',
        question: 'How many times do we wash each part in wudu?',
        options: ['1 time', '2 times', '3 times', '5 times'],
        correctIndex: 2,
        points: 10,
        explanation:
          'We wash each part three times in wudu, following the Sunnah of the Prophet ﷺ.',
      },
      {
        id: 'wudu-01-02-p3',
        type: 'fill-blank',
        sentence: 'Before starting wudu, we say ___.',
        acceptedAnswers: ['Bismillah', 'bismillah', 'بِسْمِ اللَّهِ'],
        points: 10,
        hint: 'We say this before starting anything important...',
        explanation: 'We always say Bismillah before starting wudu!',
      },
    ],

    reward: {
      message: 'Great job! You learned the first three steps of wudu! 💧',
      funFact:
        'The Prophet ﷺ never wasted water during wudu. He used about 1 mudd (roughly 750ml) — less than a small bottle!',
    },
  },

  {
    id: 'wudu-01-03',
    title: 'Steps of Wudu — Face & Arms',
    description: 'Continue learning wudu: washing the face and arms',
    category: 'wudu',
    difficulty: 'beginner',
    durationMinutes: 6,
    xpReward: 30,
    order: 3,
    unitId: 'wudu-01',
    minAgeGroup: 'toddler',
    tags: ['wudu', 'steps', 'face', 'arms'],

    hook: {
      type: 'hook',
      prompt:
        'You already learned three steps of wudu — amazing! Now imagine water gently washing your face like a refreshing breeze. Ready to learn more?',
      narration: 'You already know three steps. Now let us learn about washing the face and arms!',
      illustration: 'wudu-face',
    },

    teach: [
      {
        type: 'teach',
        title: 'Wash the Face',
        body: 'After rinsing the nose, we wash our face three times. The face area is from the forehead (where hair grows) down to the chin, and from ear to ear.\n\nUse both hands to gently splash water all over your face.',
        narration:
          'Now we wash our face three times. From the forehead to the chin, and from ear to ear. Use both hands to splash water on your face.',
        illustration: 'wudu-step-face',
      },
      {
        type: 'teach',
        title: 'Wash the Arms',
        body: 'Next, we wash our arms from the fingertips up to and including the elbows, three times.\n\n**Important:** Start with the right arm, then the left arm. Make sure water reaches every part, including between the fingers!',
        narration:
          'Next we wash our arms. Start with the right arm, then the left. Wash from the fingertips to the elbows, three times each.',
        illustration: 'wudu-step-arms',
      },
    ],

    practice: [
      {
        id: 'wudu-01-03-p1',
        type: 'quiz',
        question: 'When washing the face in wudu, which area do we wash?',
        options: [
          'Just the cheeks',
          'From forehead to chin, ear to ear',
          'Only the nose',
          'Just the eyes',
        ],
        correctIndex: 1,
        points: 10,
        explanation: 'We wash the whole face: from the forehead to the chin, and from ear to ear.',
      },
      {
        id: 'wudu-01-03-p2',
        type: 'quiz',
        question: 'Which arm do we wash first in wudu?',
        options: ['Left arm', 'Right arm', 'Both at the same time', 'It does not matter'],
        correctIndex: 1,
        points: 10,
        hint: 'The Prophet ﷺ always started with the right side.',
        explanation: 'We always start with the right arm, following the Sunnah!',
      },
      {
        id: 'wudu-01-03-p3',
        type: 'true-false',
        statement: 'In wudu, we wash our arms up to and including the elbows.',
        correctAnswer: true,
        points: 10,
        explanation:
          'Correct! We wash from fingertips to elbows, making sure to include the elbows.',
      },
      {
        id: 'wudu-01-03-p4',
        type: 'ordering',
        instruction: 'Put ALL the steps we learned so far in order:',
        correctOrder: [
          'Say Bismillah',
          'Wash hands',
          'Rinse mouth',
          'Rinse nose',
          'Wash face',
          'Wash right arm',
          'Wash left arm',
        ],
        points: 20,
        explanation: 'Excellent! You remembered all the steps in order!',
      },
    ],

    reward: {
      message: "Mashallah! You're already halfway through wudu! 🌊",
      funFact:
        'On the Day of Judgment, the Prophet ﷺ will recognize his ummah by the shining marks of wudu on their faces and arms!',
    },
  },

  {
    id: 'wudu-01-04',
    title: 'Steps of Wudu — Head & Feet',
    description: 'Complete the wudu steps: wiping the head and washing the feet',
    category: 'wudu',
    difficulty: 'beginner',
    durationMinutes: 6,
    xpReward: 30,
    order: 4,
    unitId: 'wudu-01',
    minAgeGroup: 'toddler',
    tags: ['wudu', 'steps', 'head', 'feet'],

    hook: {
      type: 'hook',
      prompt:
        "You're almost done learning all the steps of wudu! Just two more parts to go. Can you guess what they are?",
      narration: 'Almost done! Just two more steps. Let us finish learning wudu!',
      illustration: 'wudu-head',
    },

    teach: [
      {
        type: 'teach',
        title: 'Wipe the Head',
        body: "This step is special — we don't wash, we **wipe**! Wet your hands and wipe from the front of your head to the back, then back to the front.\n\nThis is called **Masah**. We only do it one time, not three!",
        narration:
          'This step is different. We wipe our head with wet hands, not wash it. Front to back, then back to front. We do this only one time!',
        keyTerms: [{ term: 'Masah', definition: 'Wiping (the head) with wet hands during wudu' }],
        illustration: 'wudu-step-head',
      },
      {
        type: 'teach',
        title: 'Wipe the Ears',
        body: 'With the same wet hands, we wipe our ears. Use your index fingers inside the ears and your thumbs behind them.\n\nThe ears are wiped just once, together with the head.',
        narration:
          'Then we wipe our ears. Put your pointing fingers inside your ears and your thumbs behind them. We do this once.',
        illustration: 'wudu-step-ears',
      },
      {
        type: 'teach',
        title: 'Wash the Feet',
        body: 'Finally, we wash our feet up to and including the ankles, three times each.\n\n**Remember:** Right foot first, then left! Make sure to wash between the toes too.',
        narration:
          'Last step! Wash your feet three times each. Right foot first, then left. Do not forget between the toes!',
        illustration: 'wudu-step-feet',
      },
    ],

    practice: [
      {
        id: 'wudu-01-04-p1',
        type: 'quiz',
        question: 'How many times do we wipe our head in wudu?',
        options: ['1 time', '2 times', '3 times', '4 times'],
        correctIndex: 0,
        points: 10,
        hint: 'The head is different from other parts...',
        explanation:
          'The head is wiped only once, unlike other parts which are washed three times!',
      },
      {
        id: 'wudu-01-04-p2',
        type: 'true-false',
        statement: 'We wash our head with lots of water in wudu.',
        correctAnswer: false,
        points: 10,
        explanation:
          "We wipe (masah) our head with wet hands — we don't wash it with flowing water.",
      },
      {
        id: 'wudu-01-04-p3',
        type: 'ordering',
        instruction: 'Put ALL the wudu steps in the correct order:',
        correctOrder: [
          'Say Bismillah',
          'Wash hands',
          'Rinse mouth',
          'Rinse nose',
          'Wash face',
          'Wash arms (right then left)',
          'Wipe head',
          'Wipe ears',
          'Wash feet (right then left)',
        ],
        points: 25,
        explanation: 'You know all the steps of wudu! Mashallah!',
      },
    ],

    reward: {
      message: 'SubhanAllah! You now know ALL the steps of wudu! 🎉',
      funFact:
        'Prophet Muhammad ﷺ never wasted water. He would use just a small amount, teaching us to care for nature too!',
      bonusDua: {
        arabic:
          'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration:
          'Ash-hadu an la ilaha illallahu wahdahu la sharika lahu, wa ash-hadu anna Muhammadan abduhu wa rasuluh',
        translation:
          'I bear witness that there is no god but Allah alone with no partner, and I bear witness that Muhammad is His servant and messenger — Say this after wudu!',
      },
    },
  },

  {
    id: 'wudu-01-05',
    title: 'Wudu Review & Mastery',
    description: 'Test your knowledge of wudu and earn your Wudu Master badge!',
    category: 'wudu',
    difficulty: 'beginner',
    durationMinutes: 5,
    xpReward: 40,
    order: 5,
    unitId: 'wudu-01',
    minAgeGroup: 'toddler',
    tags: ['wudu', 'review', 'mastery'],

    hook: {
      type: 'hook',
      prompt:
        "You've learned all about wudu! Now it's time to prove what you know and become a Wudu Master!",
      narration: 'Time to show what you know! Answer the questions and become a Wudu Master!',
      illustration: 'wudu-master',
    },

    teach: [
      {
        type: 'teach',
        title: 'Quick Review',
        body: "Let's quickly remember all the steps of wudu:\n\n1. Say **Bismillah**\n2. Wash **hands** (3x)\n3. Rinse **mouth** (3x)\n4. Rinse **nose** (3x)\n5. Wash **face** (3x)\n6. Wash **arms** to elbows (3x, right first)\n7. Wipe **head** (1x)\n8. Wipe **ears** (1x)\n9. Wash **feet** to ankles (3x, right first)\n10. Say the **du'a** after wudu",
        narration:
          'Let us review! Remember Bismillah, then hands, mouth, nose, face, arms, head, ears, and feet. Then say the dua after wudu!',
        illustration: 'wudu-review',
      },
    ],

    practice: [
      {
        id: 'wudu-01-05-p1',
        type: 'quiz',
        question: 'What do we say before starting wudu?',
        options: ['Alhamdulillah', 'SubhanAllah', 'Bismillah', 'Allahu Akbar'],
        correctIndex: 2,
        points: 10,
      },
      {
        id: 'wudu-01-05-p2',
        type: 'quiz',
        question: 'Which part do we wipe instead of wash?',
        options: ['Face', 'Arms', 'Head', 'Feet'],
        correctIndex: 2,
        points: 10,
      },
      {
        id: 'wudu-01-05-p3',
        type: 'true-false',
        statement: 'We always start with the right side in wudu.',
        correctAnswer: true,
        points: 10,
      },
      {
        id: 'wudu-01-05-p4',
        type: 'matching',
        instruction: 'Match each step with the correct action:',
        pairs: [
          { left: 'Madmadah', right: 'Rinse the mouth' },
          { left: 'Istinshaq', right: 'Rinse the nose' },
          { left: 'Masah', right: 'Wipe the head' },
        ],
        points: 15,
      },
      {
        id: 'wudu-01-05-p5',
        type: 'ordering',
        instruction: 'Final challenge! Put ALL steps in order:',
        correctOrder: [
          'Bismillah',
          'Hands',
          'Mouth',
          'Nose',
          'Face',
          'Arms',
          'Head & Ears',
          'Feet',
          "Du'a",
        ],
        points: 25,
      },
    ],

    reward: {
      message: '🏆 You are now a Wudu Master! The angels are smiling at you!',
      funFact:
        'Amazing job! You completed the Wudu unit. On the Day of Judgment, the parts washed in wudu will shine with light!',
      bonusDua: {
        arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
        transliteration: "Allahumma-j'alni minat-tawwabina waj'alni minal-mutatahirin",
        translation:
          'O Allah, make me among those who repent and make me among those who purify themselves',
      },
    },
  },
];
