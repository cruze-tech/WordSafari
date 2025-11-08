// 🔊 Word Safari: Audio Management Module
// Handles sound effects, background music, and text-to-speech

/* ========================================
   AUDIO MANAGER
   ======================================== */
class AudioManager {
    constructor() {
        this.sounds = {
            ambient: document.getElementById('audio-ambient'),
            correct: document.getElementById('audio-correct'),
            wrong: document.getElementById('audio-wrong'),
            click: document.getElementById('audio-click')
        };
        
        this.isMuted = false;
        this.volume = 0.5;
        
        // Initialize audio elements
        Object.values(this.sounds).forEach(audio => {
            if (audio) audio.volume = this.volume;
        });
        
        // Load mute state from storage
        const savedMute = localStorage.getItem('wordSafariMuted');
        if (savedMute === 'true') {
            this.toggleMute();
        }
    }
    
    /* ========================================
       SOUND PLAYBACK
       ======================================== */
    playSound(soundName, loop = false) {
        if (this.isMuted) return;
        
        const audio = this.sounds[soundName];
        if (!audio) return;
        
        audio.loop = loop;
        
        // Reset audio to start
        audio.currentTime = 0;
        
        // Play with error handling
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Audio playback prevented:', error);
            });
        }
    }
    
    stopSound(soundName) {
        const audio = this.sounds[soundName];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
    
    /* ========================================
       VOLUME CONTROL
       ======================================== */
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        Object.values(this.sounds).forEach(audio => {
            if (audio) audio.volume = this.volume;
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Update all audio elements
        Object.values(this.sounds).forEach(audio => {
            if (audio) audio.muted = this.isMuted;
        });
        
        // Update UI
        const toggleBtn = document.getElementById('sound-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.isMuted ? '🔇' : '🔊';
            toggleBtn.classList.toggle('muted', this.isMuted);
        }
        
        // Save state
        localStorage.setItem('wordSafariMuted', this.isMuted);
    }
    
    /* ========================================
       TEXT-TO-SPEECH
       ======================================== */
    speak(text, rate = 0.9) {
        if (this.isMuted) return;
        
        // Use Web Speech API
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = 1.0;
            utterance.volume = this.volume;
            
            // Use a child-friendly voice if available
            const voices = window.speechSynthesis.getVoices();
            const childVoice = voices.find(v => 
                v.name.includes('Google') || v.name.includes('Female')
            );
            if (childVoice) {
                utterance.voice = childVoice;
            }
            
            window.speechSynthesis.speak(utterance);
        }
    }
    
    /* ========================================
       PRONUNCIATION AUDIO
       ======================================== */
    playPronunciation(word) {
        if (this.isMuted) return;
        
        // First try to speak the word
        this.speak(word);
        
        // Optionally load from dictionary API
        // This is a placeholder for future implementation
        /*
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data[0]?.phonetics[0]?.audio) {
                    const audio = new Audio(data[0].phonetics[0].audio);
                    audio.volume = this.volume;
                    audio.play();
                }
            })
            .catch(() => {
                // Fallback to speech synthesis
                this.speak(word);
            });
        */
    }
    
    /* ========================================
       BACKGROUND MUSIC CONTROL
       ======================================== */
    startAmbientMusic() {
        this.playSound('ambient', true);
    }
    
    stopAmbientMusic() {
        this.stopSound('ambient');
    }
    
    /* ========================================
       EFFECT SOUNDS
       ======================================== */
    playCorrectSound() {
        this.playSound('correct');
    }
    
    playWrongSound() {
        this.playSound('wrong');
    }
    
    playClickSound() {
        this.playSound('click');
    }
}

/* ========================================
   INITIALIZE & EXPORT
   ======================================== */
export const audioManager = new AudioManager();

// Convenience export functions
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
    audioManager.toggleMute();
}

/* ========================================
   LOAD VOICES (for Speech Synthesis)
   ======================================== */
if ('speechSynthesis' in window) {
    // Load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => v.name));
    };
}