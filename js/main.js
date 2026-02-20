/**
 * Main - Bootstrap module. Assembles all modules and starts the game.
 */
var WS = window.WS || {};

var ASCII_LOGO = [
  '',
  '  ██╗    ██╗██╗  ██╗██╗████████╗███████╗',
  '  ██║    ██║██║  ██║██║╚══██╔══╝██╔════╝',
  '  ██║ █╗ ██║███████║██║   ██║   █████╗  ',
  '  ██║███╗██║██╔══██║██║   ██║   ██╔══╝  ',
  '  ╚███╔███╔╝██║  ██║██║   ██║   ███████╗',
  '   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝',
  '',
  '  ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ ',
  '  ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗',
  '  ███████╗███████║██║█████╗  ██║     ██║  ██║',
  '  ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║',
  '  ███████║██║  ██║██║███████╗███████╗██████╔╝',
  '  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ ',
  '',
];

var BOOT_LINES = [
  { text: '[BOOT] 시스템 초기화 중...', 'class': 'system', speed: 15, delay: 200 },
  { text: '[BOOT] 보안 모듈 로드 완료', 'class': 'system', speed: 15, delay: 100 },
  { text: '[BOOT] 네트워크 인터페이스 활성화...', 'class': 'system', speed: 15, delay: 100 },
  { text: '[BOOT] 암호화 채널 수립 완료', 'class': 'system', speed: 15, delay: 100 },
  { text: '[BOOT] 작전 코드: WHITE SHIELD', 'class': 'success', speed: 15, delay: 400 },
  { text: '', 'class': '' },
];

var INTRO_LINES = [
  { text: '당신은 사이버 보안 특수팀 소속 요원입니다.', 'class': 'narrator', delay: 200 },
  { text: '단장의 지시를 받아 시스템을 방어하고 취약점을 해결합니다.', 'class': 'narrator', delay: 200 },
  { text: '', 'class': '' },
  { text: '명령어를 입력하여 임무를 수행하세요.', 'class': 'dim', delay: 100 },
  { text: 'help - 도움말 | hint - 힌트 | clear - 화면 초기화', 'class': 'dim', delay: 400 },
  { text: '', 'class': '' },
];

document.addEventListener('DOMContentLoaded', async function() {
  var containerEl = document.getElementById('terminal');
  var audio = new WS.Audio();
  var terminal = new WS.Terminal(containerEl, audio);

  // Enable audio on first interaction
  document.addEventListener('click', function() { audio._ensureResumed(); }, { once: true });
  document.addEventListener('keydown', function() { audio._ensureResumed(); }, { once: true });

  // Initialize BGM
  var bgm = new WS.BGM();

  // Boot sequence
  await showIntro(terminal);

  // Start game
  var game = new WS.StageManager(terminal, WS.stages, audio);
  await game.start();
});

async function showIntro(terminal) {
  // ASCII logo
  for (var i = 0; i < ASCII_LOGO.length; i++) {
    terminal.printLine(ASCII_LOGO[i], 'ascii-art');
  }

  await wait(500);

  // Boot lines
  await terminal.typeLines(BOOT_LINES);

  // Intro
  await terminal.typeLines(INTRO_LINES);
}

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}
