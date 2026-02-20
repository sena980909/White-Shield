/**
 * Audio - Simple sound effects using Web Audio API.
 * All sounds are procedurally generated (no external files needed).
 */
var WS = window.WS || {};

WS.Audio = class Audio {
  constructor() {
    this._ctx = null;
    this._enabled = true;
    this._tickCounter = 0;
  }

  _getCtx() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        this._enabled = false;
        return null;
      }
    }
    return this._ctx;
  }

  _ensureResumed() {
    var ctx = this._getCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  /** Typing tick - very short, subtle click */
  tick() {
    if (!this._enabled) return;
    this._tickCounter++;
    if (this._tickCounter % 3 !== 0) return;

    var ctx = this._ensureResumed();
    if (!ctx) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.value = 800 + Math.random() * 200;
    gain.gain.value = 0.02;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  }

  /** Alert/warning beep */
  alert() {
    if (!this._enabled) return;
    var ctx = this._ensureResumed();
    if (!ctx) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.value = 440;
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
    gain.gain.value = 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  /** Success chime - ascending two-tone */
  success() {
    if (!this._enabled) return;
    var ctx = this._ensureResumed();
    if (!ctx) return;

    [523, 659].forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.1;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15 * (i + 1) + 0.2);

      osc.start(ctx.currentTime + 0.15 * i);
      osc.stop(ctx.currentTime + 0.15 * (i + 1) + 0.2);
    });
  }

  /** Incoming message notification */
  incoming() {
    if (!this._enabled) return;
    var ctx = this._ensureResumed();
    if (!ctx) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  toggle() {
    this._enabled = !this._enabled;
    return this._enabled;
  }
};
