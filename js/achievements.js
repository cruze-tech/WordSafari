/**
 * 🏆 Word Safari - Achievement System
 * Manages badges, tracking, notifications
 */

export class AchievementManager {
    constructor() {
        this.storageKey = 'wordSafari_achievements';
        this.schemaVersion = 2;
        this.achievements = [
            {
                id: 'safari_starter',
                name: 'Safari Starter',
                description: 'Complete your first game',
                icon: '🦁',
                condition: (stats) => stats.gamesPlayed >= 1,
                unlocked: false
            },
            {
                id: 'vocabulary_master',
                name: 'Vocabulary Master',
                description: 'Score 500+ points in one game',
                icon: '📚',
                condition: (stats) => stats.highScore >= 500,
                unlocked: false
            },
            {
                id: 'perfect_round',
                name: 'Perfect Round',
                description: 'Complete a level without mistakes',
                icon: '🎯',
                condition: (stats) => stats.perfectRounds >= 1,
                unlocked: false
            },
            {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Complete level in under 30 seconds',
                icon: '⚡',
                condition: (stats) => stats.fastestLevel <= 30,
                unlocked: false
            },
            {
                id: 'biome_explorer',
                name: 'Biome Explorer',
                description: 'Discover animals from all biomes',
                icon: '🌍',
                condition: (stats) => stats.biomesVisited >= 6,
                unlocked: false
            },
            {
                id: 'spelling_champion',
                name: 'Spelling Champion',
                description: 'Spell 20 words correctly',
                icon: '🐝',
                condition: (stats) => stats.wordsSpelled >= 20,
                unlocked: false
            },
            {
                id: 'daily_warrior',
                name: 'Daily Warrior',
                description: 'Complete 7 daily quests',
                icon: '⏱️',
                condition: (stats) => stats.dailyQuestsCompleted >= 7,
                unlocked: false
            },
            {
                id: 'dedication',
                name: 'Dedication',
                description: 'Play 7 days in a row',
                icon: '🔥',
                condition: (stats) => stats.dayStreak >= 7,
                unlocked: false
            },
            {
                id: 'animal_collector',
                name: 'Animal Collector',
                description: 'Discover 21 different animals',
                icon: '🦒',
                condition: (stats) => stats.animalsDiscovered >= 21,
                unlocked: false
            },
            {
                id: 'animal_expert',
                name: 'Animal Expert',
                description: 'Discover all 42 animals',
                icon: '🏆',
                condition: (stats) => stats.animalsDiscovered >= 42,
                unlocked: false
            },
            {
                id: 'combo_king',
                name: 'Combo King',
                description: 'Achieve a 5x combo streak',
                icon: '🌟',
                condition: (stats) => stats.maxCombo >= 5,
                unlocked: false
            },
            {
                id: 'level_10',
                name: 'Rising Star',
                description: 'Reach player level 10',
                icon: '⭐',
                condition: (stats) => stats.playerLevel >= 10,
                unlocked: false
            },
            {
                id: 'level_25',
                name: 'Safari Legend',
                description: 'Reach player level 25',
                icon: '👑',
                condition: (stats) => stats.playerLevel >= 25,
                unlocked: false
            },
            {
                id: 'quick_learner',
                name: 'Quick Learner',
                description: 'Complete 5 levels in one session',
                icon: '🚀',
                condition: (stats) => stats.levelsInSession >= 5,
                unlocked: false
            },
            {
                id: 'word_wizard',
                name: 'Word Wizard',
                description: 'Learn 50 vocabulary words',
                icon: '🧙',
                condition: (stats) => stats.vocabularyLearned >= 50,
                unlocked: false
            },
            {
                id: 'fact_finder',
                name: 'Fact Finder',
                description: 'Read 10 animal fact cards',
                icon: '📖',
                condition: (stats) => stats.factsRead >= 10,
                unlocked: false
            },
            {
                id: 'no_mistakes',
                name: 'Perfectionist',
                description: 'Complete 3 perfect rounds',
                icon: '💎',
                condition: (stats) => stats.perfectRounds >= 3,
                unlocked: false
            },
            {
                id: 'persistent',
                name: 'Persistent Player',
                description: 'Play 50 total games',
                icon: '🎮',
                condition: (stats) => stats.gamesPlayed >= 50,
                unlocked: false
            },
            {
                id: 'score_1000',
                name: 'Score Master',
                description: 'Score 1000+ points in one game',
                icon: '💯',
                condition: (stats) => stats.highScore >= 1000,
                unlocked: false
            },
            {
                id: 'daily_streak_30',
                name: 'Unstoppable',
                description: 'Maintain a 30-day streak',
                icon: '🔥',
                condition: (stats) => stats.dayStreak >= 30,
                unlocked: false
            }
        ];

        this.loadProgress();
    }

    safeParse(raw) {
        if (!raw || typeof raw !== 'string') return null;
        try {
            return JSON.parse(raw);
        } catch (error) {
            console.warn('Achievement data is corrupted, falling back to defaults.');
            return null;
        }
    }

    normalizeSavedData(savedData) {
        if (!savedData) return [];
        if (Array.isArray(savedData)) return savedData;
        if (Array.isArray(savedData.achievements)) return savedData.achievements;
        return [];
    }

    loadProgress() {
        const raw = localStorage.getItem(this.storageKey);
        const saved = this.safeParse(raw);
        const savedData = this.normalizeSavedData(saved);

        this.achievements.forEach(achievement => {
            const savedAch = savedData.find(a => a.id === achievement.id);
            if (savedAch) {
                achievement.unlocked = Boolean(savedAch.unlocked);
            }
        });

        this.saveProgress();
    }

    saveProgress() {
        const data = {
            schemaVersion: this.schemaVersion,
            achievements: this.achievements.map(a => ({
                id: a.id,
                unlocked: a.unlocked
            }))
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    checkAchievements(stats) {
        const newlyUnlocked = [];

        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(stats)) {
                achievement.unlocked = true;
                newlyUnlocked.push(achievement);
            }
        });

        if (newlyUnlocked.length > 0) {
            this.saveProgress();
            return newlyUnlocked;
        }

        return [];
    }

    getAchievements() {
        return this.achievements;
    }

    getUnlockedCount() {
        return this.achievements.filter(a => a.unlocked).length;
    }

    getTotalCount() {
        return this.achievements.length;
    }

    showNotification(achievement) {
        const toast = document.getElementById('achievement-toast');
        const nameEl = document.getElementById('toast-name');
        
        if (toast && nameEl) {
            nameEl.textContent = achievement.name;
            toast.classList.remove('hidden');
            
            // Play sound if available
            const audio = document.getElementById('audio-achievement');
            if (audio) audio.play().catch(() => {});

            // Hide after 4 seconds
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 4000);
        }
    }

    renderGrid() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        grid.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <span class="achievement-icon">${achievement.icon}</span>
                <h4 class="achievement-name">${achievement.name}</h4>
                <p class="achievement-desc">${achievement.description}</p>
                ${achievement.unlocked ? '<div class="achievement-progress">✓ Unlocked</div>' : ''}
            </div>
        `).join('');
    }
}

// Export singleton instance
export const achievementManager = new AchievementManager();
