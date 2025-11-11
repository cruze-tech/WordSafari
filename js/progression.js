/**
 * ⭐ Word Safari - Progression System
 * Player levels, XP, unlocks, difficulty adaptation
 */

export class ProgressionManager {
    constructor() {
        this.playerLevel = 1;
        this.currentXP = 0;
        this.stats = {
            gamesPlayed: 0,
            highScore: 0,
            animalsDiscovered: 0,
            dayStreak: 0,
            playerLevel: 1,
            totalXP: 0,
            perfectRounds: 0,
            fastestLevel: 999,
            biomesVisited: 0,
            wordsSpelled: 0,
            dailyQuestsCompleted: 0,
            maxCombo: 0,
            levelsInSession: 0,
            vocabularyLearned: 0,
            factsRead: 0,
            discoveredAnimals: new Set(),
            lastPlayDate: null
        };

        this.difficultySettings = {
            adaptive: { timeMultiplier: 1, vocabularyLevel: 'mixed', clueComplexity: 'adaptive' },
            easy: { timeMultiplier: 1.5, vocabularyLevel: 'simple', clueComplexity: 'basic' },
            medium: { timeMultiplier: 1, vocabularyLevel: 'mixed', clueComplexity: 'medium' },
            hard: { timeMultiplier: 0.75, vocabularyLevel: 'advanced', clueComplexity: 'complex' }
        };

        this.currentDifficulty = 'adaptive';
        this.adaptivePerformance = { correct: 0, wrong: 0, avgTime: 0 };

        this.loadProgress();
        this.checkDailyStreak();
    }

    loadProgress() {
        const saved = localStorage.getItem('wordSafari_progression');
        if (saved) {
            const data = JSON.parse(saved);
            this.playerLevel = data.playerLevel || 1;
            this.currentXP = data.currentXP || 0;
            Object.assign(this.stats, data.stats);
            
            // Convert discoveredAnimals back to Set
            if (data.stats.discoveredAnimals) {
                this.stats.discoveredAnimals = new Set(data.stats.discoveredAnimals);
            }
        }
    }

    saveProgress() {
        const data = {
            playerLevel: this.playerLevel,
            currentXP: this.currentXP,
            stats: {
                ...this.stats,
                discoveredAnimals: Array.from(this.stats.discoveredAnimals)
            }
        };
        localStorage.setItem('wordSafari_progression', JSON.stringify(data));
    }

    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastPlay = this.stats.lastPlayDate;

        if (!lastPlay) {
            this.stats.dayStreak = 1;
        } else {
            const lastDate = new Date(lastPlay);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.toDateString() === yesterday.toDateString()) {
                this.stats.dayStreak++;
            } else if (lastDate.toDateString() !== today) {
                this.stats.dayStreak = 1;
            }
        }

        this.stats.lastPlayDate = today;
        this.saveProgress();
    }

    getXPForLevel(level) {
        // Balanced XP curve: Level 1 = 100 XP, scales up
        return Math.floor(100 * Math.pow(1.15, level - 1));
    }

    addXP(amount, source = 'game') {
        this.currentXP += amount;
        this.stats.totalXP += amount;

        const xpNeeded = this.getXPForLevel(this.playerLevel);
        
        if (this.currentXP >= xpNeeded) {
            this.levelUp();
        }

        this.saveProgress();
        return { xpAdded: amount, currentXP: this.currentXP, xpNeeded };
    }

    levelUp() {
        this.playerLevel++;
        this.stats.playerLevel = this.playerLevel;
        this.currentXP = 0;

        // Unlock new content based on level
        const unlocks = this.checkUnlocks();

        this.saveProgress();
        return { newLevel: this.playerLevel, unlocks };
    }

    checkUnlocks() {
        const unlocks = [];
        
        if (this.playerLevel === 5) unlocks.push('Arctic Biome Unlocked! 🏔️');
        if (this.playerLevel === 10) unlocks.push('Desert Biome Unlocked! 🏜️');
        if (this.playerLevel === 15) unlocks.push('Ocean Biome Unlocked! 🌊');
        if (this.playerLevel === 20) unlocks.push('Hard Difficulty Available! 🔥');
        if (this.playerLevel === 25) unlocks.push('All Achievements Visible! 🏆');

        return unlocks;
    }

    recordGameComplete(score, level, timeElapsed, mistakes) {
        this.stats.gamesPlayed++;
        
        if (score > this.stats.highScore) {
            this.stats.highScore = score;
        }

        if (mistakes === 0) {
            this.stats.perfectRounds++;
        }

        if (timeElapsed < this.stats.fastestLevel) {
            this.stats.fastestLevel = timeElapsed;
        }

        this.stats.levelsInSession++;

        // Calculate XP based on performance
        let xpEarned = 50; // Base XP
        xpEarned += score * 0.1; // Bonus for score
        xpEarned += (level - 1) * 10; // Level bonus
        if (mistakes === 0) xpEarned += 25; // Perfect bonus
        if (timeElapsed < 30) xpEarned += 15; // Speed bonus

        this.addXP(Math.floor(xpEarned));
        this.saveProgress();

        return { xpEarned: Math.floor(xpEarned) };
    }

    recordAnimalDiscovered(animalId) {
        if (!this.stats.discoveredAnimals.has(animalId)) {
            this.stats.discoveredAnimals.add(animalId);
            this.stats.animalsDiscovered = this.stats.discoveredAnimals.size;
            this.addXP(10); // Bonus XP for new discovery
            this.saveProgress();
            return true;
        }
        return false;
    }

    recordSpellingWord(correct) {
        if (correct) {
            this.stats.wordsSpelled++;
            this.addXP(5);
        }
        this.saveProgress();
    }

    recordDailyQuestComplete() {
        this.stats.dailyQuestsCompleted++;
        this.addXP(30);
        this.saveProgress();
    }

    recordCombo(comboCount) {
        if (comboCount > this.stats.maxCombo) {
            this.stats.maxCombo = comboCount;
            this.saveProgress();
        }
    }

    recordFactRead() {
        this.stats.factsRead++;
        this.addXP(3);
        this.saveProgress();
    }

    recordBiomeVisit(biomeName) {
        // Track unique biomes
        const biomeKey = `biome_${biomeName}`;
        if (!this.stats[biomeKey]) {
            this.stats[biomeKey] = true;
            this.stats.biomesVisited++;
            this.saveProgress();
        }
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        localStorage.setItem('wordSafari_difficulty', difficulty);
    }

    getDifficulty() {
        return this.currentDifficulty;
    }

    getDifficultySettings() {
        if (this.currentDifficulty === 'adaptive') {
            return this.calculateAdaptiveDifficulty();
        }
        return this.difficultySettings[this.currentDifficulty];
    }

    calculateAdaptiveDifficulty() {
        const { correct, wrong } = this.adaptivePerformance;
        const total = correct + wrong;

        if (total < 5) {
            return this.difficultySettings.medium; // Default to medium
        }

        const accuracy = correct / total;

        if (accuracy >= 0.9) {
            // Player doing great, increase difficulty
            return {
                timeMultiplier: 0.85,
                vocabularyLevel: 'advanced',
                clueComplexity: 'complex'
            };
        } else if (accuracy >= 0.7) {
            // Balanced performance
            return this.difficultySettings.medium;
        } else {
            // Player struggling, ease up
            return {
                timeMultiplier: 1.3,
                vocabularyLevel: 'simple',
                clueComplexity: 'basic'
            };
        }
    }

    recordPerformance(correct, timeElapsed) {
        if (correct) {
            this.adaptivePerformance.correct++;
        } else {
            this.adaptivePerformance.wrong++;
        }

        // Track average time
        const total = this.adaptivePerformance.correct + this.adaptivePerformance.wrong;
        this.adaptivePerformance.avgTime = 
            ((this.adaptivePerformance.avgTime * (total - 1)) + timeElapsed) / total;
    }

    resetSessionStats() {
        this.stats.levelsInSession = 0;
    }

    getStats() {
        return {
            ...this.stats,
            animalsDiscovered: this.stats.discoveredAnimals.size
        };
    }

    getPlayerLevel() {
        return this.playerLevel;
    }

    getCurrentXP() {
        return this.currentXP;
    }

    getXPProgress() {
        const needed = this.getXPForLevel(this.playerLevel);
        return {
            current: this.currentXP,
            needed,
            percentage: Math.floor((this.currentXP / needed) * 100)
        };
    }
}

// Export singleton instance
export const progressionManager = new ProgressionManager();