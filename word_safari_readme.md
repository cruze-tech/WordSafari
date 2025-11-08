# 🦁 Word Safari: The Great Vocabulary Hunt

An educational word-learning safari adventure game for children ages 8-14. Built with vanilla HTML, CSS, and JavaScript.

![Word Safari Banner](https://via.placeholder.com/800x200/FF8C42/FFFFFF?text=Word+Safari:+The+Great+Vocabulary+Hunt)

## 📖 Overview

**Word Safari** is an interactive educational game that teaches English vocabulary, phonics, spelling, and sentence formation through engaging safari-themed gameplay. Players explore different biomes, encounter animals, and complete word challenges to earn points and unlock new levels.

### 🎯 Learning Objectives

- **Vocabulary Building**: Learn descriptive adjectives and animal characteristics
- **Phonics & Pronunciation**: Hear correct word pronunciation using text-to-speech
- **Spelling Practice**: Interactive spelling bee challenges
- **Grammar & Syntax**: Sentence building activities
- **Critical Thinking**: Match words to their meanings and attributes

## 🎮 Game Modes

### 1. Safari Adventure (Main Game)
- Click on animals that match the given vocabulary clue
- Progress through three biomes: Savanna → Forest → River
- Earn points and level up
- Race against the timer

### 2. Spelling Bee
- Listen to word pronunciations
- Type the correct spelling
- Track your progress with correct/wrong counters
- Learn from hints and feedback

### 3. Daily Quest
- Answer 5 vocabulary questions
- Beat the 30-second timer
- Test your knowledge on:
  - Synonyms & Antonyms
  - Word definitions
  - Animal classifications
  - Descriptive adjectives

## 🗂️ Project Structure

```
word-safari/
│
├── index.html                 # Main entry point
├── css/
│   └── style.css             # All styles and animations
├── js/
│   ├── game.js               # Core game logic
│   ├── ui.js                 # UI management and transitions
│   ├── audio.js              # Sound effects and TTS
│   └── data/
│       └── words.js          # Vocabulary database
│
├── assets/                   # (Optional) External assets
│   ├── audio/               # Sound files (MP3/OGG)
│   │   ├── ambient/         # Background music
│   │   ├── effects/         # Sound effects
│   │   └── phonics/         # Word pronunciations
│   └── svg/                 # Additional SVG graphics
│
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs completely client-side!

### Installation

1. **Clone or Download** this repository
   ```bash
   git clone https://github.com/yourusername/word-safari.git
   cd word-safari
   ```

2. **Open in Browser**
   - Simply double-click `index.html`
   - OR use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **Start Playing!**
   - Click "Play Now" to begin Safari Adventure
   - Try "Spelling Bee" for spelling practice
   - Challenge yourself with "Daily Quest"

## 🎨 Features

### ✨ Highlights
- **Zero Dependencies**: Pure vanilla JavaScript, no frameworks
- **Responsive Design**: Works on desktop, tablet, and mobile
- **SVG Graphics**: Scalable, lightweight animal illustrations
- **Text-to-Speech**: Built-in pronunciation using Web Speech API
- **Local Storage**: Saves progress, high scores, and achievements
- **Accessibility**: High contrast, large buttons, keyboard shortcuts

### 🎵 Audio Features
- Background ambient sounds (toggleable)
- Correct/wrong answer feedback
- Word pronunciation
- Mute toggle (M key or 🔊 button)

### 📱 Controls
- **Mouse/Touch**: Click animals and buttons
- **Keyboard**:
  - `ESC` - Pause game / Close modals
  - `M` - Toggle mute
  - `Enter` - Submit spelling answer

## 🎓 Educational Content

### Vocabulary Categories
- **Adjectives**: tall, brave, fierce, gentle, fast, slow, etc.
- **Animal Terms**: carnivore, herbivore, mammal, reptile, etc.
- **Characteristics**: spotted, striped, horned, colorful, etc.

### Difficulty Levels
- **Easy** (Levels 1-2): Basic words, 4-5 letters
- **Medium** (Levels 3-5): Common animals, 6-8 letters
- **Hard** (Levels 6+): Complex vocabulary, 9+ letters

### Animals Featured
- Savanna: Lion, Giraffe, Elephant, Zebra, Cheetah, Rhino
- Forest: Monkey, Parrot
- River: Crocodile, Hippo

## 🔧 Customization

### Adding New Animals

Edit `js/data/words.js`:

```javascript
{
    id: 11,
    name: 'Tiger',
    biome: 'forest',
    attributes: ['striped', 'fierce', 'carnivore'],
    svg: generateAnimalSVG('tiger'),
    pronunciation: 'https://...'
}
```

### Adding New Vocabulary

Add to `vocabularyClues` array:

```javascript
{ clue: 'nocturnal', attribute: 'nocturnal', difficulty: 'hard' }
```

### Styling

Modify CSS variables in `css/style.css`:

```css
:root {
    --color-primary: #FF8C42;
    --color-secondary: #FFD93D;
    --color-accent: #6BCF7F;
}
```

## 📊 Progress Tracking

Player progress is automatically saved to browser localStorage:

- Total score across all games
- High score (personal best)
- Maximum level reached
- Games played counter
- Achievements (future feature)

To reset progress:
```javascript
localStorage.removeItem('wordSafariProgress');
```

## 🌐 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 60+     | ✅ Full |
| Firefox | 55+     | ✅ Full |
| Safari  | 11+     | ✅ Full |
| Edge    | 79+     | ✅ Full |

### Required Features
- ES6+ JavaScript
- CSS Grid & Flexbox
- Web Speech API (for TTS)
- localStorage
- SVG support

## 🎯 Future Enhancements

### Planned Features
- [ ] Multiplayer mode
- [ ] More biomes (Desert, Arctic, Ocean)
- [ ] Achievement badges system
- [ ] Leaderboard
- [ ] Parent/teacher dashboard
- [ ] Export progress reports
- [ ] Additional languages
- [ ] Sentence builder mini-game
- [ ] Voice input for spelling
- [ ] Difficulty selector

### Mobile App
Consider converting to:
- **Progressive Web App (PWA)** - Installable, offline-capable
- **Cordova/Capacitor** - Native iOS/Android apps
- **Unity WebGL** - 3D graphics version

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ES6+ features
- Comment complex logic
- Follow existing naming conventions
- Test on multiple browsers

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Credits

### Assets & Resources
- **SVG Graphics**: Custom-generated inline SVGs
- **Fonts**: Google Fonts (Nunito)
- **Icons**: Unicode emojis
- **Sound Effects**: Browser Web Audio API
- **Pronunciation**: Web Speech API

### Recommended External Resources (Optional)
- **Free SVGs**: [SVGRepo](https://www.svgrepo.com/), [Flaticon](https://www.flaticon.com/)
- **Sound Effects**: [Freesound](https://freesound.org/), [Mixkit](https://mixkit.co/)
- **Pronunciation API**: [Dictionary API](https://dictionaryapi.dev/)

## 📧 Contact & Support

- **Issues**: Report bugs via GitHub Issues
- **Email**: support@wordsafari.edu (example)
- **Website**: https://wordsafari.edu (example)

## 🎮 Educational Use

### For Teachers
- Use in computer labs or on smartboards
- Assign as homework (tracks progress)
- Great for ESL/ELL students
- Differentiated learning (multiple difficulty levels)

### For Parents
- Safe, ad-free gameplay
- Educational standards-aligned
- Progress tracking
- Screen time friendly (timer-based games)

## 📚 Learning Standards Alignment

Aligned with:
- **Common Core**: Language Arts standards for grades 3-6
- **CEFR**: A1-B1 levels for English learners
- **National Curriculum**: Key Stage 2 English (UK)

---

**Made with ❤️ for young learners around the world**

🦁 Happy Safari Learning! 🦒