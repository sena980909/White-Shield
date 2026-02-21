/**
 * HintSystem - Tracks wrong attempts and provides progressive hints.
 * Auto-hint triggers after 2 wrong attempts for faster progression.
 */
var WS = window.WS || {};

WS.HintSystem = class HintSystem {
  constructor() {
    this.wrongCount = 0;
    this.hintIndex = 0;
    this.autoHintThreshold = 3; // default for main game
  }

  /** Record a wrong attempt. Returns true if auto-hint should trigger. */
  recordWrongAttempt() {
    this.wrongCount++;
    return this.wrongCount >= this.autoHintThreshold;
  }

  /** Normalize hint: supports both { text: '...' } objects and plain strings */
  _hintText(raw) {
    return (typeof raw === 'object' && raw !== null && raw.text) ? raw.text : raw;
  }

  /**
   * Get the next hint from the hints array.
   * Returns { text, remaining } or null if no hints left.
   */
  getNextHint(hints) {
    if (!hints || hints.length === 0) {
      return null;
    }

    if (this.hintIndex >= hints.length) {
      return {
        text: this._hintText(hints[hints.length - 1]),
        remaining: 0,
      };
    }

    var text = this._hintText(hints[this.hintIndex]);
    this.hintIndex++;

    return {
      text: text,
      remaining: hints.length - this.hintIndex,
    };
  }

  /** Reset state for a new stage or new command within a stage. */
  resetForNewStage() {
    this.wrongCount = 0;
    this.hintIndex = 0;
  }
};
