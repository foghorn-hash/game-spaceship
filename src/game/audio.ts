/**
 * Web Audio API procedural sound engine & synthwave combat music loop
 * Zero external audio files, 100% reliable, zero 404s.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;

  private musicIntervalId: number | null = null;
  private isMusicPlaying: boolean = false;
  private currentStep: number = 0;
  private bpm: number = 126;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMusic(mute: boolean) {
    this.isMusicMuted = mute;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(mute ? 0 : 0.45, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMuted;
  }

  /**
   * Sound effect: Player Plasma Shot (3D-kiihdytetty plasma-ammus)
   * High-tech laser transient + rising acceleration surge + punch
   */
  public playPlayerPlasmaShot() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Laser chirping tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);

    // FM modulation for high-tech plasma buzz
    const fmOsc = this.ctx.createOscillator();
    const fmGain = this.ctx.createGain();
    fmOsc.type = 'sine';
    fmOsc.frequency.setValueAtTime(140, t);
    fmGain.gain.setValueAtTime(300, t);
    fmGain.gain.exponentialRampToValueAtTime(10, t + 0.1);
    fmOsc.connect(fmGain);
    fmGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3500, t);
    filter.frequency.exponentialRampToValueAtTime(500, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    fmOsc.start(t);
    osc.start(t);
    fmOsc.stop(t + 0.14);
    osc.stop(t + 0.14);
  }

  /**
   * Sound effect: Enemy Plasma Shot (menacing alien pulse)
   */
  public playEnemyShot() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.Q.setValueAtTime(3, t);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  /**
   * Sound effect: Enemy Battleship Explosion
   * Massive multi-layered detonation with sub-bass boom, noise shockwave, and metal fragmentation
   */
  public playEnemyExplosion() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;

    // 1. Heavy sub-bass thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(25, t + 0.7);

    subGain.gain.setValueAtTime(0.7, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);

    subOsc.start(t);
    subOsc.stop(t + 0.8);

    // 2. White noise blast & shockwave rumble
    const bufferSize = this.ctx.sampleRate * 0.9;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(2200, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(120, t + 0.8);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    whiteNoise.start(t);
    whiteNoise.stop(t + 0.9);

    // 3. Metallic ring fragmentation
    const ringOsc = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ringOsc.type = 'square';
    ringOsc.frequency.setValueAtTime(620, t);
    ringOsc.frequency.exponentialRampToValueAtTime(160, t + 0.4);

    ringGain.gain.setValueAtTime(0.18, t);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    ringOsc.connect(ringGain);
    ringGain.connect(this.sfxGain);

    ringOsc.start(t);
    ringOsc.stop(t + 0.5);
  }

  /**
   * Sound effect: Player shield or hull hit
   */
  public playPlayerHit() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  /**
   * Sound effect: Level completed fanfare chime
   */
  public playLevelUp() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  /**
   * Synthwave Combat Music Loop:
   * 16-step rhythmic electro cyberpunk loop with punchy kick, snappy snare, hi-hats, bassline and synth arpeggio.
   */
  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    const stepDuration = 60 / (this.bpm * 4); // 16th note in seconds (~0.119s)

    const bassNotes = [
      110, 110, 110, 110,  // A2
      110, 110, 130.81, 146.83, // C3, D3
      98, 98, 98, 98,       // G2
      123.47, 123.47, 130.81, 146.83 // B2, C3, D3
    ];

    const leadNotes = [
      440, 0, 554.37, 0, 659.25, 0, 880, 0,
      659.25, 554.37, 440, 0, 523.25, 587.33, 659.25, 0
    ];

    const loop = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

      const t = this.ctx.currentTime;
      const step = this.currentStep % 16;

      // 1. Kick on steps 0, 4, 8, 12 (Four on the floor)
      if (step % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, t);
        kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.1);
        kickGain.gain.setValueAtTime(0.65, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(t);
        kickOsc.stop(t + 0.13);
      }

      // 2. Snare / clap on steps 4 and 12
      if (step === 4 || step === 12) {
        const snareNoise = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
        const data = snareNoise.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = snareNoise;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1200, t);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.musicGain);
        noiseSrc.start(t);
        noiseSrc.stop(t + 0.12);
      }

      // 3. Hi-hat every even step, louder on offbeat
      if (step % 2 === 0) {
        const hiHatNoise = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
        const data = hiHatNoise.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const hatSrc = this.ctx.createBufferSource();
        hatSrc.buffer = hiHatNoise;
        const hatFilter = this.ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(6000, t);
        const hatGain = this.ctx.createGain();
        const vol = (step % 4 === 2) ? 0.22 : 0.12;
        hatGain.gain.setValueAtTime(vol, t);
        hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        hatSrc.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.musicGain);
        hatSrc.start(t);
        hatSrc.stop(t + 0.05);
      }

      // 4. Bass synth note
      const bassFreq = bassNotes[step];
      if (bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFilter = this.ctx.createBiquadFilter();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, t);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(800, t);
        bassFilter.frequency.exponentialRampToValueAtTime(200, t + stepDuration * 0.8);

        bassGain.gain.setValueAtTime(0.3, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.9);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(t);
        bassOsc.stop(t + stepDuration);
      }

      // 5. Arpeggiated lead synth
      const leadFreq = leadNotes[step];
      if (leadFreq > 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        const leadFilter = this.ctx.createBiquadFilter();

        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(leadFreq, t);

        leadFilter.type = 'bandpass';
        leadFilter.frequency.setValueAtTime(1400, t);
        leadFilter.Q.setValueAtTime(2.5, t);

        leadGain.gain.setValueAtTime(0.16, t);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.7);

        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(this.musicGain);

        leadOsc.start(t);
        leadOsc.stop(t + stepDuration * 0.75);
      }

      this.currentStep++;
    };

    this.musicIntervalId = window.setInterval(loop, stepDuration * 1000);
  }

  public stopMusic() {
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.isMusicPlaying = false;
  }
}

export const sound = new SoundEngine();
