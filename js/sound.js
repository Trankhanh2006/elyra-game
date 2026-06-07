// ============================================
// SOUND SYSTEM - Web Audio API
// ============================================

class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.soundEnabled = true;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.soundEnabled = false;
        }
    }

    // Generate beep sound
    beep(freq = 400, duration = 100, volume = 0.3) {
        if (!this.soundEnabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.value = freq;
        osc.type = 'sine';

        gain.gain.setValueAtTime(volume * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

        osc.start(now);
        osc.stop(now + duration / 1000);
    }

    // Attack sound
    playAttack() {
        this.beep(600, 80, 0.2);
    }

    // Damage sound
    playDamage() {
        this.beep(200, 150, 0.3);
    }

    // Heal sound
    playHeal() {
        this.beep(800, 200, 0.2);
    }

    // Boss appear
    playBossAppear() {
        this.beep(150, 300, 0.4);
        setTimeout(() => this.beep(150, 300, 0.4), 150);
    }

    // Victory
    playVictory() {
        this.beep(523, 150, 0.3);
        setTimeout(() => this.beep(659, 150, 0.3), 160);
        setTimeout(() => this.beep(784, 300, 0.3), 320);
    }

    // Game over
    playGameOver() {
        this.beep(200, 200, 0.3);
        setTimeout(() => this.beep(150, 200, 0.3), 220);
        setTimeout(() => this.beep(100, 400, 0.3), 440);
    }

    // Projectile fire
    playFire() {
        this.beep(400, 50, 0.15);
    }

    // Item collect
    playCollect() {
        this.beep(800, 100, 0.2);
        setTimeout(() => this.beep(1000, 100, 0.2), 110);
    }
}
