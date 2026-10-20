// Web Audio API ambient synthesizer for real acoustic feedback without external asset dependencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  public isPlaying: boolean = false;
  public currentTrack: string | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFrequency(baseFreq: number, trackName: string, onStop?: () => void) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrack = trackName;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.3);

    // Warm stereo shimmer using 3 detuned oscillators (root, minor 3rd/5th harmonic, sub)
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 0.5, baseFreq * 2.01];
    const oscTypes: OscillatorType[] = ['sine', 'triangle', 'sine', 'sine'];

    this.oscillators = freqs.map((f, i) => {
      const osc = this.ctx!.createOscillator();
      let pan: StereoPannerNode | null = null;
      try {
        if ('createStereoPanner' in this.ctx!) {
          pan = this.ctx!.createStereoPanner();
        }
      } catch {
        pan = null;
      }
      osc.type = oscTypes[i];
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

      if (pan) {
        pan.pan.setValueAtTime((i % 2 === 0 ? -0.3 : 0.3), this.ctx!.currentTime);
        osc.connect(pan);
        pan.connect(masterGain);
      } else {
        osc.connect(masterGain);
      }

      osc.start();
      return osc;
    });

    // Gentle low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    masterGain.connect(filter);
    filter.connect(this.ctx.destination);
    this.currentGain = masterGain;

    // Auto-fade after 12 seconds if not manually stopped
    setTimeout(() => {
      if (this.currentTrack === trackName) {
        this.stop();
        if (onStop) onStop();
      }
    }, 12000);
  }

  playClickTick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // AudioContext not allowed before user gesture
    }
  }

  stop() {
    if (this.currentGain && this.ctx) {
      try {
        this.currentGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
        setTimeout(() => {
          this.oscillators.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
          this.oscillators = [];
        }, 220);
      } catch {
        this.oscillators = [];
      }
    }
    this.isPlaying = false;
    this.currentTrack = null;
  }
}

export const soundEngine = new SoundEngine();
