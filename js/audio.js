// 🔊 Word Safari: Audio Management Module
// Handles sound effects, background music, and text-to-speech

/* ========================================
   AUDIO MANAGER
   ======================================== */
class AudioManager {
    constructor() {
        this.sounds = {
            ambient: null,
            correct: null,
            wrong: null,
            click: null,
        };
        this.isMuted = false;
        this.volume = 0.5;
        this.speechSynthesis = window.speechSynthesis;
        this.init();
    }

    init() {
        // Try to load audio files, but don't fail if they don't exist
        try {
            this.sounds.ambient = document.getElementById('audio-ambient');
            this.sounds.correct = document.getElementById('audio-correct');
            this.sounds.wrong = document.getElementById('audio-wrong');
            this.sounds.click = document.getElementById('audio-click');

            // Set volumes
            Object.values(this.sounds).forEach(sound => {
                if (sound) sound.volume = this.volume;
            });
        } catch (error) {
            console.log('Audio files not found, using fallback');
        }
    }

    playSound(soundName, loop = false) {
        if (this.isMuted) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            sound.loop = loop;
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = this.volume;
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const toggle = document.getElementById('sound-toggle');
        if (toggle) {
            toggle.textContent = this.isMuted ? '🔇' : '🔊';
            toggle.classList.toggle('muted');
        }
        
        if (this.isMuted) {
            this.stopSound('ambient');
        }
        
        return this.isMuted;
    }

    speak(text, rate = 0.9) {
        if (this.isMuted) return;
        
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = 1;
            utterance.volume = this.volume;
            this.speechSynthesis.speak(utterance);
        }
    }
}

/* ========================================
   INITIALIZE & EXPORT
   ======================================== */
export const audioManager = new AudioManager();

export function playSound(soundName, loop = false) {
    audioManager.playSound(soundName, loop);
}

export function stopSound(soundName) {
    audioManager.stopSound(soundName);
}

export function speak(text, rate = 0.9) {
    audioManager.speak(text, rate);
}

export function toggleMute() {
    return audioManager.toggleMute();
}

/* ========================================
   LOAD VOICES (for Speech Synthesis)
   ======================================== */
if ('speechSynthesis' in window) {
    let voicesLoaded = false;
    const loadVoices = () => {
        if (voicesLoaded) return;
        const voices = window.speechSynthesis.getVoices();
        voicesLoaded = voices.length > 0;
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}