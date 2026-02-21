/**
 * BGM Controller - Manages background music playback and volume UI.
 */
var WS = window.WS || {};

WS.BGM = class BGM {
  constructor() {
    this.audio = document.getElementById('bgm-audio');
    this.toggleBtn = document.getElementById('bgm-toggle');
    this.volumeSlider = document.getElementById('bgm-volume');
    this.volLabel = document.getElementById('bgm-vol-label');

    this.playing = false;
    this.userInteracted = false;

    // Set initial volume
    var initialVol = parseInt(this.volumeSlider.value, 10);
    this.audio.volume = initialVol / 100;

    this._bindEvents();
  }

  _bindEvents() {
    var self = this;

    // Toggle button
    this.toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (self.playing) {
        self.pause();
      } else {
        self.play();
      }
    });

    // Volume slider
    this.volumeSlider.addEventListener('input', function() {
      var val = parseInt(self.volumeSlider.value, 10);
      self.audio.volume = val / 100;
      self.volLabel.textContent = val + '%';

      if (val === 0) {
        self.toggleBtn.classList.add('muted');
      } else {
        self.toggleBtn.classList.remove('muted');
      }
    });

    // Prevent slider from stealing focus from command input
    this.volumeSlider.addEventListener('mousedown', function(e) {
      e.stopPropagation();
    });

    // Auto-start BGM on first user interaction
    var startOnInteraction = function() {
      if (!self.userInteracted) {
        self.userInteracted = true;
        self.play();
      }
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
    };

    document.addEventListener('click', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);
  }

  play() {
    var self = this;
    this.audio.play().then(function() {
      self.playing = true;
      self.toggleBtn.classList.remove('muted');
      self.toggleBtn.textContent = '\u266B'; // ♫
    }).catch(function() {
      // Autoplay blocked - will retry on next interaction
    });
  }

  pause() {
    this.audio.pause();
    this.playing = false;
    this.toggleBtn.classList.add('muted');
    this.toggleBtn.textContent = '\u266B'; // ♫
  }

  /** Switch to ending BGM track (crossfade). */
  switchToEnding() {
    var endingAudio = document.getElementById('bgm-ending');
    if (!endingAudio) return;

    var self = this;
    var vol = this.audio.volume;

    // Fade out current BGM
    var fadeOut = setInterval(function() {
      if (self.audio.volume > 0.05) {
        self.audio.volume = Math.max(0, self.audio.volume - 0.05);
      } else {
        clearInterval(fadeOut);
        self.audio.pause();
        self.audio.volume = vol;

        // Switch to ending track
        endingAudio.volume = 0;
        endingAudio.play().then(function() {
          // Fade in ending BGM
          var fadeIn = setInterval(function() {
            if (endingAudio.volume < vol - 0.05) {
              endingAudio.volume = Math.min(vol, endingAudio.volume + 0.05);
            } else {
              endingAudio.volume = vol;
              clearInterval(fadeIn);
            }
          }, 50);

          // Bind volume slider to ending audio
          self.audio = endingAudio;
          self.playing = true;
        }).catch(function() {});
      }
    }, 50);
  }
};
