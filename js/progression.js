/**
 * ⭐ Word Safari - Progression System
 * Player levels, XP, unlocks, difficulty adaptation
 */

const STORAGE_KEY = 'wordSafari_progression';
const DIFFICULTY_KEY = 'wordSafari_difficulty';
const SCHEMA_VERSION = 2;
const VALID_DIFFICULTIES = new Set(['adaptive', 'easy', 'medium', 'hard']);

function safeJsonParse(raw) {
    if (!raw || typeof raw !== 'string') return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.warn('Progress data is corrupted, falling back to defaults.');
        return null;
    }
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function createDefaultStats() {
    return {
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
        learnedAttributes: new Set(),
        lastPlayDate: null
    };
}

export class ProgressionManager {
    constructor() {
        this.playerLevel = 1;
        this.currentXP = 0;
        this.stats = createDefaultStats();

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

    migrateProgressData(saved) {
        const defaults = createDefaultStats();
        const sourceStats = (saved && typeof saved.stats === 'object' && saved.stats) || {};
        const nextStats = { ...defaults, ...sourceStats };

        // Ensure sets are correctly hydrated.
        const discoveredAnimals = Array.isArray(sourceStats.discoveredAnimals)
            ? sourceStats.discoveredAnimals
            : [];
        const learnedAttributes = Array.isArray(sourceStats.learnedAttributes)
            ? sourceStats.learnedAttributes
            : [];

        nextStats.discoveredAnimals = new Set(discoveredAnimals.filter(Boolean));
        nextStats.learnedAttributes = new Set(learnedAttributes.filter(Boolean));

        // Preserve historic numeric progress while introducing set-based tracking.
        nextStats.vocabularyLearned = Math.max(
            toNumber(sourceStats.vocabularyLearned, 0),
            nextStats.learnedAttributes.size
        );

        nextStats.animalsDiscovered = nextStats.discoveredAnimals.size;

        const migrated = {
            schemaVersion: SCHEMA_VERSION,
            playerLevel: Math.max(1, toNumber(saved?.playerLevel, 1)),
            currentXP: Math.max(0, toNumber(saved?.currentXP, 0)),
            currentDifficulty: VALID_DIFFICULTIES.has(saved?.currentDifficulty)
                ? saved.currentDifficulty
                : null,
            stats: nextStats
        };

        return migrated;
    }

    loadProgress() {
        const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEY));

        if (parsed) {
            const migrated = this.migrateProgressData(parsed);
            this.playerLevel = migrated.playerLevel;
            this.currentXP = migrated.currentXP;
            this.stats = migrated.stats;

            if (migrated.currentDifficulty) {
                this.currentDifficulty = migrated.currentDifficulty;
            }
        }

        const persistedDifficulty = localStorage.getItem(DIFFICULTY_KEY);
        if (VALID_DIFFICULTIES.has(persistedDifficulty)) {
            this.currentDifficulty = persistedDifficulty;
        }

        this.stats.playerLevel = this.playerLevel;
        this.stats.animalsDiscovered = this.stats.discoveredAnimals.size;
        this.stats.vocabularyLearned = Math.max(this.stats.vocabularyLearned, this.stats.learnedAttributes.size);

        this.saveProgress();
    }

    saveProgress() {
        const data = {
            schemaVersion: SCHEMA_VERSION,
            playerLevel: this.playerLevel,
            currentXP: this.currentXP,
            currentDifficulty: this.currentDifficulty,
            stats: {
                ...this.stats,
                discoveredAnimals: Array.from(this.stats.discoveredAnimals),
                learnedAttributes: Array.from(this.stats.learnedAttributes),
                animalsDiscovered: this.stats.discoveredAnimals.size,
                vocabularyLearned: Math.max(this.stats.vocabularyLearned, this.stats.learnedAttributes.size)
            }
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem(DIFFICULTY_KEY, this.currentDifficulty);
        } catch (error) {
            console.warn('Unable to save progression data:', error);
        }
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
        // Balanced XP curve: Level 1 = 100 XP, scales up.
        return Math.floor(100 * Math.pow(1.15, level - 1));
    }

    addXP(amount) {
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

        // Unlock new content based on level.
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

        // Calculate XP based on performance.
        let xpEarned = 50;
        xpEarned += score * 0.1;
        xpEarned += (level - 1) * 10;
        if (mistakes === 0) xpEarned += 25;
        if (timeElapsed < 30) xpEarned += 15;

        this.addXP(Math.floor(xpEarned));
        this.saveProgress();

        return { xpEarned: Math.floor(xpEarned) };
    }

    recordAnimalDiscovered(animalId) {
        if (!this.stats.discoveredAnimals.has(animalId)) {
            this.stats.discoveredAnimals.add(animalId);
            this.stats.animalsDiscovered = this.stats.discoveredAnimals.size;
            this.addXP(10);
            this.saveProgress();
            return true;
        }
        return false;
    }

    recordVocabularyLearned(attribute) {
        if (!attribute) return false;
        if (this.stats.learnedAttributes.has(attribute)) return false;

        this.stats.learnedAttributes.add(attribute);
        this.stats.vocabularyLearned = this.stats.learnedAttributes.size;
        this.addXP(2);
        this.saveProgress();
        return true;
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
        const biomeKey = `biome_${biomeName}`;
        if (!this.stats[biomeKey]) {
            this.stats[biomeKey] = true;
            this.stats.biomesVisited++;
            this.saveProgress();
        }
    }

    setDifficulty(difficulty) {
        if (!VALID_DIFFICULTIES.has(difficulty)) return;
        this.currentDifficulty = difficulty;
        this.saveProgress();
    }

    getDifficulty() {
        return this.currentDifficulty;
    }

    getDifficultySettings() {
        if (this.currentDifficulty === 'adaptive') {
            return this.calculateAdaptiveDifficulty();
        }
        return this.difficultySettings[this.currentDifficulty] || this.difficultySettings.adaptive;
    }

    calculateAdaptiveDifficulty() {
        const { correct, wrong } = this.adaptivePerformance;
        const total = correct + wrong;

        if (total < 5) {
            return this.difficultySettings.medium;
        }

        const accuracy = correct / total;

        if (accuracy >= 0.9) {
            return {
                timeMultiplier: 0.85,
                vocabularyLevel: 'advanced',
                clueComplexity: 'complex'
            };
        }

        if (accuracy >= 0.7) {
            return this.difficultySettings.medium;
        }

        return {
            timeMultiplier: 1.3,
            vocabularyLevel: 'simple',
            clueComplexity: 'basic'
        };
    }

    recordPerformance(correct, timeElapsed) {
        if (correct) {
            this.adaptivePerformance.correct++;
        } else {
            this.adaptivePerformance.wrong++;
        }

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
            animalsDiscovered: this.stats.discoveredAnimals.size,
            vocabularyLearned: Math.max(this.stats.vocabularyLearned, this.stats.learnedAttributes.size)
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

// Export singleton instance.
export const progressionManager = new ProgressionManager();
