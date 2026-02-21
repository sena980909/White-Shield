/**
 * Terminal - Rendering engine for the CLI terminal UI
 * Handles typing animation, input capture, scrolling, and display.
 */
var WS = window.WS || {};

WS.Terminal = class Terminal {
  constructor(containerEl, audio) {
    this.container = containerEl;
    this.output = containerEl.querySelector('#output');
    this.inputLine = containerEl.querySelector('#input-line');
    this.commandInput = containerEl.querySelector('#command-input');
    this.cursor = containerEl.querySelector('#cursor');
    this.audio = audio || null;

    this._defaultSpeed = 30; // ms per character
    this._fastSpeed = 10;

    var self = this;
    this._audioActivated = false;

    // Focus input on container click + activate audio
    this.container.addEventListener('click', function() {
      self._activateAudio();
      if (!self.inputLine.classList.contains('hidden')) {
        self.commandInput.focus();
      }
    });

    // Activate audio on first keypress in input
    this.commandInput.addEventListener('keydown', function() {
      self._activateAudio();
    });

    // Auto-resize input (Korean/CJK = 2ch width, ASCII = 1ch)
    this.commandInput.addEventListener('input', function() {
      var val = self.commandInput.value;
      var w = 0;
      for (var i = 0; i < val.length; i++) {
        w += val.charCodeAt(i) > 127 ? 2 : 1;
      }
      self.commandInput.style.width = Math.max(1, w + 1) + 'ch';
    });
  }

  /* ── Typing Animation ── */

  /**
   * Type a single line with character-by-character animation.
   * Returns a promise that resolves when the line is fully displayed.
   */
  typeLine(text, cssClass, speed) {
    var self = this;
    if (speed === undefined) speed = this._defaultSpeed;

    return new Promise(function(resolve) {
      var lineEl = document.createElement('div');
      lineEl.className = 'line' + (cssClass ? ' ' + cssClass : '');
      self.output.appendChild(lineEl);

      if (speed === 0 || !text) {
        lineEl.textContent = text;
        self._scrollToBottom();
        resolve();
        return;
      }

      var i = 0;
      lineEl.classList.add('typing-cursor');

      function typeNext() {
        if (i < text.length) {
          lineEl.textContent += text[i];
          if (self.audio && i % 3 === 0) self.audio.tick();
          i++;
          if (i % 8 === 0 || i === text.length) self._scrollToBottom();
          setTimeout(typeNext, speed);
        } else {
          lineEl.classList.remove('typing-cursor');
          self._scrollToBottom();
          resolve();
        }
      }

      typeNext();
    });
  }

  /**
   * Type multiple lines sequentially.
   * Each item: { text, class, speed, delay }
   * delay = pause in ms after the line finishes (negative = before).
   */
  async typeLines(lines) {
    for (var k = 0; k < lines.length; k++) {
      var line = lines[k];
      if (line.delay && line.delay < 0) {
        await this._wait(Math.abs(line.delay));
      }
      await this.typeLine(
        line.text || '',
        line['class'] || '',
        line.speed !== undefined ? line.speed : this._defaultSpeed
      );
      if (line.delay && line.delay > 0) {
        await this._wait(line.delay);
      }
    }
  }

  /* ── Instant Print ── */

  printLine(text, cssClass) {
    var lineEl = document.createElement('div');
    lineEl.className = 'line' + (cssClass ? ' ' + cssClass : '');
    lineEl.textContent = text;
    this.output.appendChild(lineEl);
    this._scrollToBottom();
  }

  printHTML(html, cssClass) {
    var lineEl = document.createElement('div');
    lineEl.className = 'line' + (cssClass ? ' ' + cssClass : '');
    lineEl.innerHTML = html;
    this.output.appendChild(lineEl);
    this._scrollToBottom();
  }

  printBlank() {
    this.printLine('');
  }

  /* ── Input Handling ── */

  /**
   * Show prompt and wait for user to press Enter.
   * Returns a promise that resolves with the input string.
   */
  waitForInput() {
    var self = this;
    return new Promise(function(resolve) {
      self.inputLine.classList.remove('hidden');
      self.commandInput.value = '';
      self.commandInput.style.width = '1ch';
      self.commandInput.focus();
      self._scrollToBottom();

      function onKeyDown(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Ensure audio context is resumed on user gesture
          if (self.audio) self.audio._ensureResumed();

          var value = self.commandInput.value;
          self.commandInput.removeEventListener('keydown', onKeyDown);
          self.inputLine.classList.add('hidden');

          // echo the command to output
          self.printLine('$ ' + value, 'user-input');
          self.printBlank();

          resolve(value);
        }
      }

      self.commandInput.addEventListener('keydown', onKeyDown);
    });
  }

  /* ── Screen Control ── */

  clear() {
    this.output.innerHTML = '';
  }

  flash() {
    this.container.classList.add('screen-flash');
    var container = this.container;
    setTimeout(function() { container.classList.remove('screen-flash'); }, 500);
  }

  /* ── Private Helpers ── */

  /** Activate audio + BGM on first user gesture */
  _activateAudio() {
    if (this._audioActivated) return;
    this._audioActivated = true;
    if (this.audio) this.audio._ensureResumed();
    // Also trigger BGM if available
    var bgmAudio = document.getElementById('bgm-audio');
    if (bgmAudio && bgmAudio.paused) {
      bgmAudio.play().catch(function() {});
    }
  }

  _scrollToBottom() {
    var self = this;
    if (this._scrollRAF) return;
    this._scrollRAF = requestAnimationFrame(function() {
      self.container.scrollTop = self.container.scrollHeight;
      self._scrollRAF = null;
    });
  }

  _wait(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }
};
