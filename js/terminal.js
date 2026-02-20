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
    this.container.addEventListener('click', function() {
      if (!self.inputLine.classList.contains('hidden')) {
        self.commandInput.focus();
      }
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
          if (self.audio) self.audio.tick();
          i++;
          self._scrollToBottom();
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
      self.commandInput.focus();
      self._scrollToBottom();

      function onKeyDown(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
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

  _scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  _wait(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }
};
