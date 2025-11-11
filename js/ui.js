/**
 * 🎨 Word Safari: Enhanced UI Management
 */

import { gameManager, spellingBeeManager, dailyQuestManager } from './game.js';
import { playSound, toggleMute } from './audio.js';
import { achievementManager } from './achievements.js';
import { progressionManager } from './progression.js';

/* ========================================
   UI MANAGER CLASS
   ======================================== */
class UIManager {
    constructor() {
        this.currentScreen = 'start';
        this.screens = ['start', 'game', 'spelling', 'daily', 'end'];
        this.initializeEventListeners();
        this.updateStatsDisplay();
    }

    initializeEventListeners() {
        // Start screen buttons
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

        document.getElementById('btn-achievements')?.addEventListener('click', () => {
            playSound('click');
            this.showAchievements();
        });

        document.getElementById('btn-instructions')?.addEventListener('click', () => {
            playSound('click');
            this.showInstructions();
        });

        // Difficulty selector
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                playSound('click');
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const difficulty = btn.dataset.difficulty;
                progressionManager.setDifficulty(difficulty);
            });
        });

        // Sound toggle
        document.getElementById('sound-toggle')?.addEventListener('click', () => {
            playSound('click');
            toggleMute();
        });

        // Achievements modal
        document.getElementById('achievements-close')?.addEventListener('click', () => {
            playSound('click');
            this.hideAchievements();
        });

        // Instructions modal
        document.getElementById('modal-close')?.addEventListener('click', () => {
            playSound('click');
            this.hideInstructions();
        });

        document.getElementById('btn-start-instructions')?.addEventListener('click', () => {
            playSound('click');
            this.hideInstructions();
            this.startGame();
        });

        // Game screen
        document.getElementById('btn-pause')?.addEventListener('click', () => {
            playSound('click');
            this.showPauseMenu();
        });

        // Pause menu
        document.getElementById('btn-resume')?.addEventListener('click', () => {
            playSound('click');
            this.hidePauseMenu();
            gameManager.resumeGame();
        });

        document.getElementById('btn-restart')?.addEventListener('click', () => {
            playSound('click');
            this.hidePauseMenu();
            this.startGame();
        });

        document.getElementById('btn-quit')?.addEventListener('click', () => {
            playSound('click');
            this.hidePauseMenu();
            this.showScreen('start');
            this.updateStatsDisplay();
        });

        // Animal fact card
        document.getElementById('fact-close')?.addEventListener('click', () => {
            playSound('click');
            document.getElementById('fact-modal').classList.remove('active');
        });

        document.getElementById('btn-fact-close')?.addEventListener('click', () => {
            playSound('click');
            document.getElementById('fact-modal').classList.remove('active');
        });

        // Spelling bee
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
            this.updateStatsDisplay();
        });

        document.getElementById('spelling-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                playSound('click');
                spellingBeeManager.checkSpelling();
            }
        });

        // Daily quest
        document.getElementById('btn-back-daily')?.addEventListener('click', () => {
            playSound('click');
            dailyQuestManager.resetQuest();
            this.showScreen('start');
            this.updateStatsDisplay();
        });

        // End screen
        document.getElementById('btn-play-again')?.addEventListener('click', () => {
            playSound('click');
            this.startGame();
        });

        document.getElementById('btn-menu')?.addEventListener('click', () => {
            playSound('click');
            this.showScreen('start');
            this.updateStatsDisplay();
        });

        // Modal click outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    playSound('click');
                    modal.classList.remove('active');
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentScreen === 'game' && gameManager.isPlaying) {
                    this.showPauseMenu();
                } else {
                    document.querySelectorAll('.modal.active').forEach(modal => {
                        modal.classList.remove('active');
                    });
                }
            }
            if (e.key.toLowerCase() === 'm') toggleMute();
        });
    }

    updateStatsDisplay() {
        const stats = progressionManager.getStats();
        
        document.getElementById('stat-high-score').textContent = stats.highScore;
        document.getElementById('stat-animals').textContent = stats.animalsDiscovered;
        document.getElementById('stat-streak').textContent = stats.dayStreak;
        document.getElementById('stat-level').textContent = stats.playerLevel;
    }

    showScreen(name) {
        this.screens.forEach(s => {
            const el = document.getElementById(`${s}-screen`);
            if (el) el.classList.remove('active');
        });

        const target = document.getElementById(`${name}-screen`);
        if (target) {
            target.classList.add('active');
            this.currentScreen = name;
        }

        if (name === 'start') {
            this.updateStatsDisplay();
        }
    }

    startGame() {
        this.showScreen('game');
        gameManager.startGame();
    }

    showPauseMenu() {
        gameManager.pauseGame();
        document.getElementById('pause-modal').classList.add('active');
    }

    hidePauseMenu() {
        document.getElementById('pause-modal').classList.remove('active');
    }

    showSpellingBee() {
        this.showScreen('spelling');
        spellingBeeManager.startSpellingBee();
    }

    showDailyQuest() {
        this.showScreen('daily');
        dailyQuestManager.startDailyQuest();
    }

    showAchievements() {
        achievementManager.renderGrid();
        document.getElementById('achievements-modal').classList.add('active');
    }

    hideAchievements() {
        document.getElementById('achievements-modal').classList.remove('active');
    }

    showEndScreen(score, level, stars, xpEarned, newAchievements = []) {
        this.showScreen('end');
        
        document.getElementById('end-score').textContent = score;
        document.getElementById('end-level').textContent = level;
        document.getElementById('end-stars').textContent = '⭐'.repeat(stars);
        document.getElementById('end-xp').textContent = `+${xpEarned} XP`;

        const msg = this.getEndMessage(stars);
        document.getElementById('end-message').innerHTML = `<p>${msg}</p>`;

        // Display newly unlocked achievements
        const unlockedContainer = document.getElementById('unlocked-achievements');
        if (newAchievements.length > 0) {
            unlockedContainer.innerHTML = newAchievements.map(ach => `
                <div class="unlocked-achievement">
                    <div class="unlocked-achievement-icon">${ach.icon}</div>
                    <div class="unlocked-achievement-info">
                        <div class="unlocked-achievement-name">${ach.name}</div>
                        <div class="unlocked-achievement-desc">${ach.description}</div>
                    </div>
                </div>
            `).join('');
            
            // Show notifications
            newAchievements.forEach((ach, index) => {
                setTimeout(() => achievementManager.showNotification(ach), index * 1000);
            });
        } else {
            unlockedContainer.innerHTML = '';
        }
    }

    getEndMessage(stars) {
        if (stars === 3) return '🎉 Outstanding! You\'re a Safari Master! 🦁';
        if (stars === 2) return '👏 Great job! Keep exploring! 🦒';
        return '🌟 Good effort! Practice makes perfect! 🐘';
    }

    showInstructions() {
        document.getElementById('instructions-modal')?.classList.add('active');
    }

    hideInstructions() {
        document.getElementById('instructions-modal')?.classList.remove('active');
    }

    isMobile() {
        return window.innerWidth <= 768;
    }

    updateLayout() {
        if (this.isMobile()) document.body.classList.add('mobile');
        else document.body.classList.remove('mobile');
    }
}

/* ========================================
   INITIALIZE UI MANAGER
   ======================================== */
const uiManager = new UIManager();
window.uiManager = uiManager;

window.addEventListener('resize', () => uiManager.updateLayout());
window.addEventListener('load', () => {
    uiManager.updateLayout();
    uiManager.updateStatsDisplay();
});

// Prevent default behaviors
document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'SVG') e.preventDefault();
});

document.addEventListener('contextmenu', e => {
    if (e.target.closest('.animal-card') || e.target.closest('.game-area')) e.preventDefault();
});

export { uiManager };