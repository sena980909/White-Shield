/**
 * Certificate - Ending completion certificate with copy/download support.
 * Displays a terminal-themed overlay card after game completion.
 */
var WS = window.WS || {};

WS.Certificate = {
  /**
   * Show the certificate overlay with player info.
   * @param {string} playerName
   * @param {number} missionCount
   */
  show: function(playerName, missionCount) {
    var overlay = document.getElementById('certificate-overlay');
    if (!overlay) return;

    var dateStr = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });

    document.getElementById('cert-name').textContent = playerName;
    document.getElementById('cert-date').textContent = dateStr;
    document.getElementById('cert-missions').textContent = missionCount + '/' + missionCount + ' CLEAR';

    overlay.classList.add('certificate-visible');
  },

  /** Generate plain text version of the certificate. */
  _toText: function() {
    var name = WS.playerName || '요원';
    var dateStr = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
    return [
      '',
      '╔══════════════════════════════════════════╗',
      '║   OPERATION: WHITE SHIELD & IRONCLAD     ║',
      '║   MISSION COMPLETE CERTIFICATE           ║',
      '╠══════════════════════════════════════════╣',
      '║                                          ║',
      '║  Agent: ' + name,
      '║  Date:  ' + dateStr,
      '║  Missions: 25/25 CLEAR',
      '║                                          ║',
      '║  ── O.R.O.R.A ASSESSMENT ──              ║',
      '║  탐지 능력: ██████████ 탁월              ║',
      '║  대응 속도: ██████████ 탁월              ║',
      '║  위기 대처: ██████████ 탁월              ║',
      '║  Rating: ★★★★★ EXCEPTIONAL              ║',
      '║                                          ║',
      '║  "The shield held."  — Commander         ║',
      '║                                          ║',
      '╚══════════════════════════════════════════╝',
      '',
      '#OperationWhiteShield #WhiteHat #Cybersecurity',
      ''
    ].join('\n');
  },

  /** Copy certificate text to clipboard. */
  copyText: function() {
    var text = this._toText();
    var btn = document.getElementById('cert-copy-btn');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        if (btn) {
          btn.textContent = '복사 완료!';
          setTimeout(function() { btn.textContent = '텍스트 복사'; }, 2000);
        }
      }).catch(function() {
        WS.Certificate._fallbackCopy(text, btn);
      });
    } else {
      this._fallbackCopy(text, btn);
    }
  },

  /** Fallback copy for older browsers. */
  _fallbackCopy: function(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (btn) {
      btn.textContent = '복사 완료!';
      setTimeout(function() { btn.textContent = '텍스트 복사'; }, 2000);
    }
  },

  /** Lazy-load html2canvas and save certificate as PNG. */
  saveImage: function() {
    var btn = document.getElementById('cert-image-btn');
    var card = document.getElementById('certificate-card');
    if (!card) return;

    if (btn) btn.textContent = '생성 중...';

    var doCapture = function() {
      html2canvas(card, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false
      }).then(function(canvas) {
        var link = document.createElement('a');
        link.download = 'WhiteShield_' + (WS.playerName || 'Agent') + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        if (btn) {
          btn.textContent = '저장 완료!';
          setTimeout(function() { btn.textContent = '이미지 저장'; }, 2000);
        }
      }).catch(function() {
        if (btn) {
          btn.textContent = '저장 실패';
          setTimeout(function() { btn.textContent = '이미지 저장'; }, 2000);
        }
      });
    };

    if (typeof html2canvas === 'function') {
      doCapture();
    } else {
      var script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = doCapture;
      script.onerror = function() {
        if (btn) {
          btn.textContent = '로드 실패';
          setTimeout(function() { btn.textContent = '이미지 저장'; }, 2000);
        }
      };
      document.head.appendChild(script);
    }
  }
};
