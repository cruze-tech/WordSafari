// 🎨 Word Safari: UI Management Module
// Handles screen transitions, menus, modals, and user interactions

import { gameManager, spellingBeeManager, dailyQuestManager } from './game.js';
import { audioManager, playSound, toggleMute } from './audio.js';

/* ========================================
   UI MANAGER CLASS
   ======================================== */
class UIManager {
    constructor() {
        this.currentScreen = 'start';
        this.screens = ['start', 'game', 'spelling', 'daily', 'end'];
        this.initializeEventListeners();
    }
    
    /* ========================================
       EVENT LISTENERS
       ======================================== */
    initializeEventListeners() {
        // 🎮 Start Screen Buttons
        document.getElementById('btn-play')?.addEventListener('click', () => {
            playSound('click');
            this.startGame();
        });
        
        document.getElementById('btn-spelling')?.addEventListener('click', () => {
            playSound('click');
            this.showSpellingBee();
        });
        
        document.getElementById('btn-daily')?.addEventListener('click', () => {
            playSound('click');
            this.showDailyQuest();
        });
        
        document.getElementById('btn-instructions')?.addEventListener('click', () => {
            playSound('click');
            this.showInstructions();
        });
        
        // 🔊 Sound Toggle
        document.getElementById('sound-toggle')?.addEventListener('click', () => {
            playSound('click');
            toggleMute();
        });
        
        // 📖 Instructions Modal
        document.getElementById('modal-close')?.addEventListener('click', () => {
            playSound('click');
            this.hideInstructions();
        });
        
        document.getElementById('btn-start-instructions')?.addEventListener('click', () => {
            playSound('click');
            this.hideInstructions();
            this.startGame();
        });
        
        // ⏸️ Game Screen Controls
        document.getElementById('btn-pause')?.addEventListener('click', () => {
            playSound('click');
            this.pauseGame();
        });
        
        // 📝 Spelling Bee Controls
        document.getElementById('btn-play-word')?.addEventListener('click', () => {
            playSound('click');
            spellingBeeManager.playWordAudio();
        });
        
        document.getElementById('btn-check-spelling')?.addEventListener('click', () => {
            playSound('click');
            spellingBeeManager.checkSpelling();
        });
        
        document.getElementById('btn-spelling-skip')?.addEventListener('click', () => {
            playSound('click');
            spellingBeeManager.skipWord();
        });
        
        document.getElementById('btn-back-spelling')?.addEventListener('click', () => {
            playSound('click');
            this.showScreen('start');
        });
        
        // Enter key for spelling input
        document.getElementById('spelling-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                playSound('click');
                spellingBeeManager.checkSpelling();
            }
        });
        
        // ⏱️ Daily Quest Controls
        document.getElementById('btn-back-daily')?.addEventListener('click', () => {
            playSound('click');
            dailyQuestManager.resetQuest();
            this.showScreen('start');
        });
        
        // 🏆 End Screen Controls
        document.getElementById('btn-play-again')?.addEventListener('click', () => {
            playSound('click');
            this.startGame();
        });
        
        document.getElementById('btn-menu')?.addEventListener('click', () => {
            playSound('click');
            this.showScreen('start');
        });
        
        // 🖱️ Close modal on background click
        document.getElementById('instructions-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'instructions-modal') {
                this.hideInstructions();
            }
        });
    }
    
    /* ========================================
       SCREEN TRANSITIONS
       ======================================== */
    showScreen(screenName) {
        // Hide all screens
        this.screens.forEach(name => {
            const screen = document.getElementById(`${name}-screen`);
            if (screen) screen.classList.remove('active');
        });
        
        // Show requested screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }
    
    /* ========================================
       GAME INITIALIZATION
       ======================================== */
    startGame() {
        this.showScreen('game');
        gameManager.startGame();
    }
    
    pauseGame() {
        gameManager.pauseGame();
        const confirmed = confirm('Game Paused!\n\nPress OK to continue or Cancel to return to menu.');
        
        if (confirmed) {
            gameManager.resumeGame();
        } else {
            this.showScreen('start');
        }
    }
    
    /* ========================================
       SPELLING BEE
       ======================================== */
    showSpellingBee() {
        this.showScreen('spelling');
        spellingBeeManager.startSpellingBee();
    }
    
    /* ========================================
       DAILY QUEST
       ======================================== */
    showDailyQuest() {
        this.showScreen('daily');
        dailyQuestManager.startDailyQuest();
    }
    
    /* ========================================
       END SCREEN
       ======================================== */
    showEndScreen(score, level, stars) {
        this.showScreen('end');
        
        // Update stats
        document.getElementById('end-score').textContent = score;
        document.getElementById('end-level').textContent = level;
        
        // Show stars
        const starText = '⭐'.repeat(stars);
        document.getElementById('end-stars').textContent = starText;
        
        // Update message based on performance
        const message = this.getEndMessage(stars);
        document.getElementById('end-message').innerHTML = `<p>${message}</p>`;
    }
    
    getEndMessage(stars) {
        const messages = {
            3: '🎉 Outstanding! You\'re a Safari Master! 🦁',
            2: '👏 Great job! Keep exploring! 🦒',
            1: '🌟 Good effort! Practice makes perfect! 🐘'
        };
        return messages[stars] || messages[1];
    }
    
    /* ========================================
       MODAL CONTROLS
       ======================================== */
    showInstructions() {
        const modal = document.getElementById('instructions-modal');
        if (modal) modal.classList.add('active');
    }
    
    hideInstructions() {
        const modal = document.getElementById('instructions-modal');
        if (modal) modal.classList.remove('active');
    }
    
    /* ========================================
       NOTIFICATIONS & TOASTS
       ======================================== */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#FF5252' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: fade-in 0.3s ease-out;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fade-in 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    /* ========================================
       LOADING SCREEN
       ======================================== */
    showLoading(show = true) {
        let loader = document.getElementById('loading-overlay');
        
        if (show && !loader) {
            loader = document.createElement('div');
            loader.id = 'loading-overlay';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            loader.innerHTML = '<div style="color: white; font-size: 2rem; font-weight: 700;">🦁 Loading...</div>';
            document.body.appendChild(loader);
        } else if (!show && loader) {
            loader.remove();
        }
    }
    
    /* ========================================
       RESPONSIVE HELPERS
       ======================================== */
    isMobile() {
        return window.innerWidth <= 768;
    }
    
    updateLayout() {
        // Adjust layout based on screen size
        if (this.isMobile()) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
}

/* ========================================
   INITIALIZE UI MANAGER
   ======================================== */
const uiManager = new UIManager();

// Make available globally for game.js
window.uiManager = uiManager;

// Handle window resize
window.addEventListener('resize', () => {
    uiManager.updateLayout();
});

// Initialize layout on load
window.addEventListener('load', () => {
    uiManager.updateLayout();
    console.log('🦁 Word Safari: The Great Vocabulary Hunt - Ready!');
});

/* ========================================
   PREVENT DEFAULT BEHAVIORS
   ======================================== */
// Prevent default drag behavior on images
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'svg') {
        e.preventDefault();
    }
});

// Prevent context menu on game elements
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.animal-card') || e.target.closest('.game-area')) {
        e.preventDefault();
    }
});

/* ========================================
   KEYBOARD SHORTCUTS
   ======================================== */
document.addEventListener('keydown', (e) => {
    // Escape key to pause/close
    if (e.key === 'Escape') {
        if (uiManager.currentScreen === 'game') {
            uiManager.pauseGame();
        } else if (document.getElementById('instructions-modal').classList.contains('active')) {
            uiManager.hideInstructions();
        }
    }
    
    // M key to toggle mute
    if (e.key === 'm' || e.key === 'M') {
        toggleMute();
    }
});

/* ========================================
   EXPORT
   ======================================== */
export { uiManager };