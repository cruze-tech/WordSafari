// 🦁 Word Safari: Vocabulary Data Module
// Contains all word lists, animals, and educational content

/* ========================================
   ANIMAL DATABASE
   ======================================== */
export const animals = [
    {
        id: 1,
        name: 'Giraffe',
        biome: 'savanna',
        attributes: ['tall', 'gentle', 'spotted', 'herbivore'],
        svg: generateAnimalSVG('giraffe'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/giraffe-us.mp3'
    },
    {
        id: 2,
        name: 'Lion',
        biome: 'savanna',
        attributes: ['brave', 'strong', 'fierce', 'carnivore', 'king'],
        svg: generateAnimalSVG('lion'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/lion-us.mp3'
    },
    {
        id: 3,
        name: 'Elephant',
        biome: 'savanna',
        attributes: ['large', 'wise', 'gentle', 'herbivore', 'intelligent'],
        svg: generateAnimalSVG('elephant'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/elephant-us.mp3'
    },
    {
        id: 4,
        name: 'Zebra',
        biome: 'savanna',
        attributes: ['striped', 'fast', 'herbivore', 'social'],
        svg: generateAnimalSVG('zebra'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/zebra-us.mp3'
    },
    {
        id: 5,
        name: 'Monkey',
        biome: 'forest',
        attributes: ['playful', 'clever', 'agile', 'mischievous'],
        svg: generateAnimalSVG('monkey'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/monkey-us.mp3'
    },
    {
        id: 6,
        name: 'Parrot',
        biome: 'forest',
        attributes: ['colorful', 'noisy', 'smart', 'flying'],
        svg: generateAnimalSVG('parrot'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/parrot-us.mp3'
    },
    {
        id: 7,
        name: 'Crocodile',
        biome: 'river',
        attributes: ['dangerous', 'patient', 'carnivore', 'ancient'],
        svg: generateAnimalSVG('crocodile'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/crocodile-us.mp3'
    },
    {
        id: 8,
        name: 'Hippo',
        biome: 'river',
        attributes: ['heavy', 'aquatic', 'herbivore', 'aggressive'],
        svg: generateAnimalSVG('hippo'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/hippopotamus-us.mp3'
    },
    {
        id: 9,
        name: 'Cheetah',
        biome: 'savanna',
        attributes: ['fastest', 'spotted', 'carnivore', 'sleek'],
        svg: generateAnimalSVG('cheetah'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/cheetah-us.mp3'
    },
    {
        id: 10,
        name: 'Rhino',
        biome: 'savanna',
        attributes: ['tough', 'horned', 'herbivore', 'powerful'],
        svg: generateAnimalSVG('rhino'),
        pronunciation: 'https://api.dictionaryapi.dev/media/pronunciations/en/rhinoceros-us.mp3'
    }
];

/* ========================================
   SPELLING BEE WORD LISTS
   ======================================== */
export const spellingWords = {
    easy: [
        { word: 'lion', hint: 'King of the jungle', level: 1 },
        { word: 'tree', hint: 'Plants grow tall', level: 1 },
        { word: 'bird', hint: 'It flies in the sky', level: 1 },
        { word: 'fish', hint: 'Lives in water', level: 1 },
        { word: 'bear', hint: 'Loves honey', level: 1 }
    ],
    medium: [
        { word: 'giraffe', hint: 'Tallest animal', level: 2 },
        { word: 'elephant', hint: 'Never forgets', level: 2 },
        { word: 'monkey', hint: 'Swings from trees', level: 2 },
        { word: 'zebra', hint: 'Black and white stripes', level: 2 },
        { word: 'parrot', hint: 'Colorful bird that talks', level: 2 }
    ],
    hard: [
        { word: 'crocodile', hint: 'Reptile in the river', level: 3 },
        { word: 'hippopotamus', hint: 'Large river mammal', level: 3 },
        { word: 'rhinoceros', hint: 'Has a horn on its nose', level: 3 },
        { word: 'cheetah', hint: 'Fastest land animal', level: 3 },
        { word: 'orangutan', hint: 'Orange ape from forests', level: 3 }
    ]
};

/* ========================================
   DAILY QUEST QUESTIONS
   ======================================== */
export const dailyQuestions = [
    {
        question: 'What is the opposite of "happy"?',
        options: ['Sad', 'Angry', 'Excited', 'Tired'],
        correct: 0,
        category: 'antonyms'
    },
    {
        question: 'Which word means "very big"?',
        options: ['Tiny', 'Huge', 'Small', 'Short'],
        correct: 1,
        category: 'synonyms'
    },
    {
        question: 'A lion is a type of...',
        options: ['Fish', 'Bird', 'Mammal', 'Reptile'],
        correct: 2,
        category: 'classification'
    },
    {
        question: 'What does "brave" mean?',
        options: ['Scared', 'Courageous', 'Lazy', 'Hungry'],
        correct: 1,
        category: 'definitions'
    },
    {
        question: 'Which animal can fly?',
        options: ['Elephant', 'Giraffe', 'Parrot', 'Lion'],
        correct: 2,
        category: 'characteristics'
    },
    {
        question: 'What is a baby lion called?',
        options: ['Cub', 'Kitten', 'Puppy', 'Joey'],
        correct: 0,
        category: 'vocabulary'
    },
    {
        question: 'Which word describes a giraffe\'s neck?',
        options: ['Short', 'Long', 'Wide', 'Thin'],
        correct: 1,
        category: 'adjectives'
    },
    {
        question: 'An animal that eats only plants is...',
        options: ['Carnivore', 'Omnivore', 'Herbivore', 'Predator'],
        correct: 2,
        category: 'vocabulary'
    },
    {
        question: 'What does "fierce" mean?',
        options: ['Gentle', 'Aggressive', 'Friendly', 'Calm'],
        correct: 1,
        category: 'definitions'
    },
    {
        question: 'Which animal has stripes?',
        options: ['Lion', 'Elephant', 'Zebra', 'Hippo'],
        correct: 2,
        category: 'characteristics'
    }
];

/* ========================================
   VOCABULARY CLUES (for Safari Adventure)
   ======================================== */
export const vocabularyClues = [
    { clue: 'tall', attribute: 'tall', difficulty: 'easy' },
    { clue: 'brave', attribute: 'brave', difficulty: 'easy' },
    { clue: 'fast', attribute: 'fast', difficulty: 'easy' },
    { clue: 'spotted', attribute: 'spotted', difficulty: 'medium' },
    { clue: 'striped', attribute: 'striped', difficulty: 'medium' },
    { clue: 'playful', attribute: 'playful', difficulty: 'medium' },
    { clue: 'fierce', attribute: 'fierce', difficulty: 'hard' },
    { clue: 'intelligent', attribute: 'intelligent', difficulty: 'hard' },
    { clue: 'carnivore', attribute: 'carnivore', difficulty: 'hard' }
];

/* ========================================
   SVG GENERATION FUNCTIONS
   ======================================== */
// 🎨 Generate simple SVG representations of animals
function generateAnimalSVG(animalType) {
    const svgs = {
        giraffe: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="30" r="12" fill="#F4A460"/>
            <rect x="45" y="40" width="10" height="40" fill="#F4A460"/>
            <ellipse cx="50" cy="85" rx="18" ry="12" fill="#F4A460"/>
            <circle cx="45" cy="28" r="2" fill="#000"/>
            <circle cx="55" cy="28" r="2" fill="#000"/>
            <circle cx="42" cy="25" r="3" fill="#8B4513"/>
            <circle cx="58" cy="25" r="3" fill="#8B4513"/>
            <circle cx="48" cy="50" r="4" fill="#8B4513"/>
            <circle cx="48" cy="62" r="4" fill="#8B4513"/>
        </svg>`,
        
        lion: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="25" fill="#FFD700"/>
            <circle cx="50" cy="50" r="18" fill="#F4A460"/>
            <circle cx="43" cy="45" r="3" fill="#000"/>
            <circle cx="57" cy="45" r="3" fill="#000"/>
            <path d="M 45 55 Q 50 58 55 55" stroke="#000" fill="none" stroke-width="2"/>
            <circle cx="50" cy="52" r="2" fill="#000"/>
        </svg>`,
        
        elephant: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="55" cy="55" rx="28" ry="25" fill="#808080"/>
            <circle cx="48" cy="45" r="3" fill="#000"/>
            <circle cx="62" cy="45" r="3" fill="#000"/>
            <path d="M 40 55 Q 35 70 30 85" stroke="#808080" fill="none" stroke-width="8"/>
            <ellipse cx="70" cy="50" rx="8" ry="12" fill="#808080"/>
            <ellipse cx="40" cy="50" rx="8" ry="12" fill="#808080"/>
        </svg>`,
        
        zebra: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="60" rx="25" ry="20" fill="#fff"/>
            <circle cx="50" cy="40" r="15" fill="#fff"/>
            <rect x="38" y="38" width="24" height="4" fill="#000"/>
            <rect x="38" y="50" width="24" height="4" fill="#000"/>
            <rect x="38" y="62" width="24" height="4" fill="#000"/>
            <rect x="38" y="70" width="24" height="4" fill="#000"/>
            <circle cx="45" cy="38" r="2" fill="#000"/>
            <circle cx="55" cy="38" r="2" fill="#000"/>
        </svg>`,
        
        monkey: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="20" fill="#8B4513"/>
            <circle cx="50" cy="50" r="15" fill="#D2691E"/>
            <circle cx="35" cy="45" r="6" fill="#D2691E"/>
            <circle cx="65" cy="45" r="6" fill="#D2691E"/>
            <circle cx="45" cy="48" r="2" fill="#000"/>
            <circle cx="55" cy="48" r="2" fill="#000"/>
            <ellipse cx="50" cy="58" rx="8" ry="6" fill="#000"/>
            <path d="M 45 58 Q 50 62 55 58" stroke="#fff" fill="none" stroke-width="2"/>
        </svg>`,
        
        parrot: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="55" rx="18" ry="22" fill="#FF6B6B"/>
            <circle cx="50" cy="40" r="15" fill="#4ECDC4"/>
            <circle cx="45" cy="38" r="3" fill="#000"/>
            <circle cx="55" cy="38" r="3" fill="#000"/>
            <path d="M 50 44 L 48 48 L 52 48 Z" fill="#FFD93D"/>
            <path d="M 35 55 Q 30 60 28 68" stroke="#FF6B6B" fill="none" stroke-width="6"/>
            <path d="M 65 55 Q 70 60 72 68" stroke="#FF6B6B" fill="none" stroke-width="6"/>
        </svg>`,
        
        crocodile: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="55" rx="35" ry="15" fill="#4A7C59"/>
            <ellipse cx="25" cy="55" rx="15" ry="10" fill="#4A7C59"/>
            <circle cx="22" cy="52" r="2" fill="#FFD700"/>
            <rect x="20" y="58" width="10" height="3" fill="#fff"/>
            <rect x="22" y="58" width="2" height="5" fill="#fff"/>
            <rect x="26" y="58" width="2" height="5" fill="#fff"/>
        </svg>`,
        
        hippo: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="60" rx="30" ry="22" fill="#8B7E74"/>
            <ellipse cx="50" cy="42" rx="25" ry="18" fill="#8B7E74"/>
            <circle cx="42" cy="40" r="3" fill="#000"/>
            <circle cx="58" cy="40" r="3" fill="#000"/>
            <ellipse cx="38" cy="35" rx="4" ry="3" fill="#8B7E74"/>
            <ellipse cx="62" cy="35" rx="4" ry="3" fill="#8B7E74"/>
            <ellipse cx="50" cy="50" rx="12" ry="8" fill="#F4A460"/>
        </svg>`,
        
        cheetah: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="55" cy="58" rx="28" ry="18" fill="#F4A460"/>
            <circle cx="42" cy="45" r="12" fill="#F4A460"/>
            <circle cx="40" cy="43" r="2" fill="#000"/>
            <circle cx="44" cy="43" r="2" fill="#000"/>
            <circle cx="50" cy="50" r="3" fill="#8B4513"/>
            <circle cx="60" cy="52" r="3" fill="#8B4513"/>
            <circle cx="52" cy="60" r="3" fill="#8B4513"/>
            <path d="M 70 58 Q 80 55 85 50" stroke="#F4A460" fill="none" stroke-width="4"/>
        </svg>`,
        
        rhino: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="55" cy="60" rx="30" ry="22" fill="#808080"/>
            <circle cx="45" cy="48" r="14" fill="#808080"/>
            <circle cx="42" cy="45" r="2" fill="#000"/>
            <circle cx="48" cy="45" r="2" fill="#000"/>
            <polygon points="45,35 43,45 47,45" fill="#666"/>
            <rect x="35" y="75" width="8" height="15" fill="#808080"/>
            <rect x="55" y="75" width="8" height="15" fill="#808080"/>
        </svg>`
    };
    
    return svgs[animalType] || svgs.lion;
}

/* ========================================
   HELPER FUNCTIONS
   ======================================== */

// Get animals by attribute
export function getAnimalsByAttribute(attribute) {
    return animals.filter(animal => 
        animal.attributes.includes(attribute.toLowerCase())
    );
}

// Get random animals for gameplay
export function getRandomAnimals(count, biome = null) {
    let pool = biome ? animals.filter(a => a.biome === biome) : animals;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Get spelling words by difficulty
export function getSpellingWordsByLevel(level) {
    if (level <= 2) return spellingWords.easy;
    if (level <= 5) return spellingWords.medium;
    return spellingWords.hard;
}

// Get random daily questions
export function getRandomDailyQuestions(count) {
    const shuffled = [...dailyQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}