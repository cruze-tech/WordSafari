// 🎮 Word Safari: Main Game Logic Module
// Handles gameplay mechanics, scoring, and level progression

import { animals, vocabularyClues, getAnimalsByAttribute, getRandomAnimals } from './data/words.js';
import { playSound, speak } from './audio.js';

/* ========================================
   GAME MANAGER CLASS
   ======================================== */
class GameManager {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.timeRemaining = 60;
        this.currentClue = null;
        this.correctAnimals = [];
        this.spawnedAnimals = [];
        this.gameInterval = null;
        this.timerInterval = null;
        this.isPlaying = false;
        this.biome = 'savanna';
        
        // Update clue display
        document.getElementById('clue-word').textContent = randomClue.clue;
        
        // Speak the clue
        speak(`Find the animal that is ${randomClue.clue}`);
    }
    
    /* ========================================
       ANIMAL SPAWNING
       ======================================== */
    spawnAnimals() {
        const gameArea = document.getElementById('game-area');
        this.clearAnimals();
        
        // 🦁 Spawn 5 animals: some correct, some wrong
        const numCorrect = Math.min(2, this.correctAnimals.length);
        const correctToSpawn = this.correctAnimals.slice(0, numCorrect);
        
        // Get wrong animals (not matching the clue)
        const wrongAnimals = getRandomAnimals(3, this.biome).filter(a => 
            !this.correctAnimals.some(ca => ca.id === a.id)
        );
        
        const allAnimals = [...correctToSpawn, ...wrongAnimals].sort(() => Math.random() - 0.5);
        
        allAnimals.forEach((animal, index) => {
            const animalElement = this.createAnimalElement(animal);
            animalElement.style.left = `${15 + (index * 18)}%`;
            animalElement.style.top = `${40 + Math.random() * 30}%`;
            animalElement.style.animationDelay = `${index * 0.3}s`;
            gameArea.appendChild(animalElement);
            this.spawnedAnimals.push({ element: animalElement, animal });
        });
    }
    
    createAnimalElement(animal) {
        const container = document.createElement('div');
        container.className = 'animal-card';
        container.dataset.animalId = animal.id;
        container.innerHTML = animal.svg;
        
        const label = document.createElement('div');
        label.className = 'animal-label';
        label.textContent = animal.name;
        container.appendChild(label);
        
        // 🖱️ Add click handler
        container.addEventListener('click', () => this.handleAnimalClick(animal, container));
        
        return container;
    }
    
    clearAnimals() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = '';
        this.spawnedAnimals = [];
    }
    
    /* ========================================
       CLICK HANDLING
       ======================================== */
    handleAnimalClick(animal, element) {
        if (!this.isPlaying) return;
        
        // Check if clicked animal matches the clue
        const isCorrect = this.correctAnimals.some(ca => ca.id === animal.id);
        
        if (isCorrect) {
            // ✅ Correct answer!
            this.score += 10 * this.level;
            playSound('correct');
            this.showFeedback(true, element);
            element.classList.add('pulse');
            
            // Remove the clicked animal
            setTimeout(() => {
                element.remove();
                this.spawnedAnimals = this.spawnedAnimals.filter(sa => sa.element !== element);
                
                // Check if all correct animals found
                const remainingCorrect = this.spawnedAnimals.filter(sa => 
                    this.correctAnimals.some(ca => ca.id === sa.animal.id)
                );
                
                if (remainingCorrect.length === 0) {
                    this.nextRound();
                }
            }, 800);
        } else {
            // ❌ Wrong answer
            playSound('wrong');
            this.showFeedback(false, element);
            element.classList.add('shake');
            setTimeout(() => element.classList.remove('shake'), 500);
        }
        
        this.updateHUD();
        this.updateProgress();
    }
    
    /* ========================================
       FEEDBACK & UI
       ======================================== */
    showFeedback(isCorrect, element) {
        const rect = element.getBoundingClientRect();
        const feedback = document.createElement('div');
        feedback.className = `feedback-popup ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.textContent = isCorrect ? '🎉 Correct!' : '❌ Try Again';
        feedback.style.left = `${rect.left + rect.width / 2}px`;
        feedback.style.top = `${rect.top}px`;
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 1500);
    }
    
    updateHUD() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('timer').textContent = this.timeRemaining;
        
        // Update progress bar
        const progress = (this.score % 100) / 100 * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    }
    
    /* ========================================
       TIMER & PROGRESSION
       ======================================== */
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.isPlaying) return;
            
            this.timeRemaining--;
            this.updateHUD();
            
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    nextRound() {
        this.score += 20; // Bonus for completing round
        
        // Level up every 100 points
        if (this.score >= this.level * 100) {
            this.levelUp();
        }
        
        // Generate new clue and spawn new animals
        setTimeout(() => {
            this.generateClue();
            this.spawnAnimals();
        }, 1000);
    }
    
    levelUp() {
        this.level++;
        this.timeRemaining += 15; // Bonus time
        
        // Change biome every 3 levels
        if (this.level === 4) this.biome = 'forest';
        if (this.level === 7) this.biome = 'river';
        
        speak(`Level ${this.level}! New biome unlocked!`);
        playSound('correct');
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        playSound('ambient', false);
        
        // Calculate stars (1-3 based on score)
        const stars = this.calculateStars();
        
        // Save progress
        this.saveProgress();
        
        // Show end screen
        window.uiManager.showEndScreen(this.score, this.level, stars);
    }
    
    calculateStars() {
        if (this.score >= 500) return 3;
        if (this.score >= 250) return 2;
        return 1;
    }
    
    pauseGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        playSound('ambient', false);
    }
    
    resumeGame() {
        this.isPlaying = true;
        this.startTimer();
        playSound('ambient', true);
    }
    
    /* ========================================
       PROGRESS PERSISTENCE
       ======================================== */
    loadProgress() {
        const saved = localStorage.getItem('wordSafariProgress');
        return saved ? JSON.parse(saved) : {
            totalScore: 0,
            highScore: 0,
            maxLevel: 1,
            gamesPlayed: 0,
            achievements: []
        };
    }
    
    saveProgress() {
        this.progress.gamesPlayed++;
        this.progress.totalScore += this.score;
        this.progress.highScore = Math.max(this.progress.highScore, this.score);
        this.progress.maxLevel = Math.max(this.progress.maxLevel, this.level);
        
        localStorage.setItem('wordSafariProgress', JSON.stringify(this.progress));
    }
    
    updateProgress() {
        // Real-time progress updates
        localStorage.setItem('wordSafariProgress', JSON.stringify(this.progress));
    }
}

/* ========================================
   SPELLING BEE MANAGER
   ======================================== */
class SpellingBeeManager {
    constructor() {
        this.currentWord = null;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.wordQueue = [];
    }
    
    startSpellingBee() {
        this.resetStats();
        this.loadWords();
        this.nextWord();
    }
    
    resetStats() {
        this.correctCount = 0;
        this.wrongCount = 0;
        this.updateStats();
    }
    
    loadWords() {
        // Get words from data module
        import('./data/words.js').then(module => {
            const { spellingWords } = module;
            this.wordQueue = [...spellingWords.easy, ...spellingWords.medium, ...spellingWords.hard]
                .sort(() => Math.random() - 0.5);
        });
    }
    
    nextWord() {
        if (this.wordQueue.length === 0) {
            this.loadWords();
        }
        
        this.currentWord = this.wordQueue.pop();
        document.getElementById('spelling-hint').textContent = this.currentWord.hint;
        document.getElementById('spelling-input').value = '';
        document.getElementById('spelling-feedback').textContent = '';
        document.getElementById('spelling-feedback').className = 'spelling-feedback';
    }
    
    checkSpelling() {
        const input = document.getElementById('spelling-input').value.trim().toLowerCase();
        const feedback = document.getElementById('spelling-feedback');
        
        if (input === this.currentWord.word.toLowerCase()) {
            // ✅ Correct!
            this.correctCount++;
            feedback.textContent = `🎉 Correct! "${this.currentWord.word}" is spelled right!`;
            feedback.className = 'spelling-feedback correct';
            playSound('correct');
            
            setTimeout(() => this.nextWord(), 2000);
        } else {
            // ❌ Wrong
            this.wrongCount++;
            feedback.textContent = `❌ Oops! Try again or skip to see the answer.`;
            feedback.className = 'spelling-feedback wrong';
            playSound('wrong');
        }
        
        this.updateStats();
    }
    
    skipWord() {
        const feedback = document.getElementById('spelling-feedback');
        feedback.textContent = `The correct spelling is: ${this.currentWord.word}`;
        feedback.className = 'spelling-feedback';
        
        setTimeout(() => this.nextWord(), 2000);
    }
    
    playWordAudio() {
        speak(this.currentWord.word);
    }
    
    updateStats() {
        document.getElementById('spelling-correct').textContent = this.correctCount;
        document.getElementById('spelling-wrong').textContent = this.wrongCount;
    }
}

/* ========================================
   DAILY QUEST MANAGER
   ======================================== */
class DailyQuestManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.timeRemaining = 30;
        this.timerInterval = null;
    }
    
    startDailyQuest() {
        this.resetQuest();
        this.loadQuestions();
        this.showQuestion();
        this.startTimer();
    }
    
    resetQuest() {
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.timeRemaining = 30;
        clearInterval(this.timerInterval);
    }
    
    loadQuestions() {
        import('./data/words.js').then(module => {
            const { getRandomDailyQuestions } = module;
            this.questions = getRandomDailyQuestions(5);
        });
    }
    
    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endQuest();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        document.querySelector('.question-text').textContent = question.question;
        
        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => this.checkAnswer(index));
            optionsContainer.appendChild(btn);
        });
        
        this.updateProgress();
    }
    
    checkAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll('.answer-btn');
        
        buttons.forEach(btn => btn.style.pointerEvents = 'none');
        
        if (selectedIndex === question.correct) {
            buttons[selectedIndex].classList.add('correct');
            this.correctAnswers++;
            playSound('correct');
        } else {
            buttons[selectedIndex].classList.add('wrong');
            buttons[question.correct].classList.add('correct');
            playSound('wrong');
        }
        
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showQuestion();
        }, 1500);
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('daily-timer').textContent = this.timeRemaining;
            
            if (this.timeRemaining <= 0) {
                this.endQuest();
            }
        }, 1000);
    }
    
    updateProgress() {
        document.getElementById('daily-current').textContent = this.currentQuestionIndex + 1;
        document.getElementById('daily-total').textContent = this.questions.length;
    }
    
    endQuest() {
        clearInterval(this.timerInterval);
        const score = this.correctAnswers * 20;
        alert(`Daily Quest Complete!\nYou got ${this.correctAnswers}/${this.questions.length} correct!\nScore: ${score}`);
        window.uiManager.showScreen('start');
    }
}

/* ========================================
   EXPORT & INITIALIZE
   ======================================== */
export const gameManager = new GameManager();
export const spellingBeeManager = new SpellingBeeManager();
export const dailyQuestManager = new DailyQuestManager(); Progress tracking
        this.progress = this.loadProgress();
    }
    
    /* ========================================
       GAME INITIALIZATION
       ======================================== */
    startGame() {
        this.resetGame();
        this.isPlaying = true;
        this.generateClue();
        this.spawnAnimals();
        this.startTimer();
        this.updateHUD();
        
        playSound('ambient', true); // Start background music
    }
    
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.timeRemaining = 60;
        this.isPlaying = true;
        this.clearAnimals();
    }
    
    /* ========================================
       CLUE GENERATION
       ======================================== */
    generateClue() {
        // 🎯 Select random vocabulary clue based on current level
        const availableClues = vocabularyClues.filter(c => {
            if (this.level <= 2) return c.difficulty === 'easy';
            if (this.level <= 5) return c.difficulty === 'medium';
            return c.difficulty === 'hard';
        });
        
        const randomClue = availableClues[Math.floor(Math.random() * availableClues.length)];
        this.currentClue = randomClue;
        
        // Find all animals matching this attribute
        this.correctAnimals = getAnimalsByAttribute(randomClue.attribute);
        
        //