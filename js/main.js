/**
 * Main - Bootstrap with nickname prompt and intro sequence.
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
  for (var i = 0; i < ASCII_LOGO.length; i++) {
    terminal.printLine(ASCII_LOGO[i], 'ascii-art');
  }
  await wait(500);
  await terminal.typeLines(BOOT_LINES);

  // ── Nickname Prompt ──
  await terminal.typeLine('[시스템] 보안 터미널 접속 확인', 'system', 20);
  await terminal.typeLine('[시스템] 신원 확인이 필요합니다.', 'system', 20);
  terminal.printBlank();
  await terminal.typeLine('콜사인(닉네임)을 입력하세요:', 'objective', 25);

  var nickname = '';
  while (!nickname.trim()) {
    nickname = await terminal.waitForInput();
    if (!nickname.trim()) {
      await terminal.typeLine('[시스템] 콜사인을 입력해야 합니다.', 'system', 20);
    }
  }
  WS.playerName = nickname.trim();

  terminal.printBlank();
  await terminal.typeLine('[단장] ' + WS.playerName + '... 좋은 콜사인이군.', 'commander', 25);
  await wait(300);
  await terminal.typeLine('[단장] 나는 이 작전의 총 지휘관, 단장이다.', 'commander', 25);
  await wait(200);
  await terminal.typeLine('[단장] 오늘 네가 맡을 작전은 "Operation: White Shield".', 'commander', 25);
  await wait(200);
  await terminal.typeLine('[단장] 우리 본부 서버가 해킹 공격을 받고 있다.', 'commander', 25);
  await terminal.typeLine('[단장] 네 임무는 공격을 분석하고, 시스템을 방어하는 것이야.', 'commander', 25);
  await wait(200);
  terminal.printBlank();
  await terminal.typeLine('help - 도움말 | hint - 힌트 | clear - 화면 초기화', 'dim', 15);
  terminal.printBlank();
  await terminal.typeLine('[단장] 준비됐나, ' + WS.playerName + '? 바로 시작하지.', 'commander', 25);
  terminal.printBlank();
  await wait(500);

  // Start game
  var game = new WS.StageManager(terminal, WS.stages, audio);
  await game.start();
});

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}
