/**
 * HUD - G-DECK Heads-Up Display overlay
 * Battery, stealth meter, temperature, O.R.O.R.A status, Titan status, mission counter
 */
var WS = window.WS || {};

WS.HUD = class HUD {
  constructor() {
    this.el = document.getElementById('hud-overlay');
    this.batVal = document.getElementById('hud-bat-val');
    this.stlBar = document.getElementById('hud-stl-bar');
    this.stlVal = document.getElementById('hud-stl-val');
    this.oracleEl = document.getElementById('hud-oracle');
    this.titanEl = document.getElementById('hud-titan');
    this.tempVal = document.getElementById('hud-temp-val');
    this.tempUnit = document.getElementById('hud-temp-unit');
    this.misVal = document.getElementById('hud-mis-val');

    this._battery = 100;
    this._stealth = 100;
    this._temp = 42;
    this._drainTimer = null;
    this._flickerTimer = null;
  }

  /** Fade in the HUD */
  show() {
    this.el.classList.add('hud-visible');
    this._startDrain();
  }

  /** Update battery percentage */
  setBattery(v) {
    this._battery = Math.max(5, Math.min(100, v));
    this.batVal.textContent = this._battery;
    var p = this.batVal.parentElement;
    p.classList.remove('hud-critical', 'hud-warn');
    if (this._battery <= 20) p.classList.add('hud-critical');
    else if (this._battery <= 40) p.classList.add('hud-warn');
  }

  /** Update stealth meter */
  setStealth(v) {
    this._stealth = Math.max(0, Math.min(100, v));
    this.stlVal.textContent = this._stealth;
    var n = Math.round(this._stealth / 12.5);
    this.stlBar.textContent = '\u2588'.repeat(n) + '\u2591'.repeat(8 - n);
    var p = this.stlBar.parentElement;
    p.classList.remove('hud-critical', 'hud-warn');
    if (this._stealth <= 30) p.classList.add('hud-critical');
    else if (this._stealth <= 60) p.classList.add('hud-warn');
  }

  /** Update temperature display */
  setTemp(v, unit) {
    this._temp = v;
    this.tempVal.textContent = v.toLocaleString();
    if (unit) this.tempUnit.textContent = unit;
    var p = this.tempVal.parentElement;
    p.classList.remove('hud-critical', 'hud-warn', 'hud-pulse');
    if (v >= 2000) { p.classList.add('hud-critical'); p.classList.add('hud-pulse'); }
    else if (v >= 800) p.classList.add('hud-warn');
  }

  /** Set O.R.O.R.A connection status */
  setOracle(status) {
    this.oracleEl.textContent = 'O.R.O.R.A: ' + status;
    this.oracleEl.classList.remove('hud-good', 'hud-warn', 'hud-critical', 'hud-pulse');
    if (status === 'ONLINE') this.oracleEl.classList.add('hud-good');
    else if (status === 'UNSTABLE' || status === 'DEGRADED') {
      this.oracleEl.classList.add('hud-warn');
      this.oracleEl.classList.add('hud-pulse');
    }
    else { this.oracleEl.classList.add('hud-critical'); this.oracleEl.classList.add('hud-pulse'); }

    // Flicker effect when degraded
    this._stopFlicker();
    if (status === 'DEGRADED' || status === 'UNSTABLE') this._startFlicker();
  }

  /** Set Titan Mainframe status */
  setTitan(status) {
    this.titanEl.textContent = 'TITAN: ' + status;
    this.titanEl.classList.remove('hud-good', 'hud-warn', 'hud-critical');
    if (status === 'SECURED' || status === 'NEUTRALIZED') this.titanEl.classList.add('hud-good');
    else if (status === 'BREACHING' || status === 'DETECTED') this.titanEl.classList.add('hud-warn');
    else if (status === 'HOSTILE' || status === 'COMPROMISED') this.titanEl.classList.add('hud-critical');
  }

  /** Update mission progress counter */
  setMission(current, total) {
    this.misVal.textContent = current + '/' + total;
  }

  /** Flash red + screen shake for incoming attack */
  attackAlert() {
    document.body.classList.add('attack-shake');
    var overlay = document.getElementById('attack-overlay');
    overlay.classList.add('attack-active');
    setTimeout(function() {
      document.body.classList.remove('attack-shake');
      overlay.classList.remove('attack-active');
    }, 800);
  }

  /** Toggle continuous danger border pulse */
  dangerMode(on) {
    if (on) this.el.classList.add('hud-danger-mode');
    else this.el.classList.remove('hud-danger-mode');
  }

  /** Slow cosmetic battery drain */
  _startDrain() {
    var self = this;
    this._drainTimer = setInterval(function() {
      if (self._battery > 5) self.setBattery(self._battery - 1);
    }, 450000);
  }

  /** HUD flicker for unstable connection */
  _startFlicker() {
    var self = this;
    this._flickerTimer = setInterval(function() {
      self.el.style.opacity = (Math.random() > 0.3) ? '1' : '0.6';
      setTimeout(function() { self.el.style.opacity = '1'; }, 100);
    }, 2000);
  }

  _stopFlicker() {
    if (this._flickerTimer) { clearInterval(this._flickerTimer); this._flickerTimer = null; }
    this.el.style.opacity = '';
  }
};
