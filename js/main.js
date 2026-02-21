/**
 * Main - G-DECK bootstrap with nickname prompt, save detection, and intro sequence.
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
  { text: '[G-DECK] 디바이스 초기화 중...', 'class': 'system', speed: 15, delay: 200 },
  { text: '[G-DECK] 보안 모듈 로드 완료', 'class': 'system', speed: 15, delay: 100 },
  { text: '[G-DECK] O.R.O.R.A 위성 링크 수립 중...', 'class': 'system', speed: 15, delay: 100 },
  { text: '[G-DECK] O.R.O.R.A 연결 완료 - 암호화 채널 활성', 'class': 'success', speed: 15, delay: 100 },
  { text: '[G-DECK] 작전 코드: WHITE SHIELD', 'class': 'success', speed: 15, delay: 400 },
  { text: '', 'class': '' },
];

function _showLogo(terminal) {
  for (var i = 0; i < ASCII_LOGO.length; i++) {
    terminal.printLine(ASCII_LOGO[i], 'ascii-art');
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  var containerEl = document.getElementById('terminal');
  var audio = new WS.Audio();
  var terminal = new WS.Terminal(containerEl, audio);

  // Enable audio on first interaction
  document.addEventListener('click', function() { audio._ensureResumed(); }, { once: true });
  document.addEventListener('keydown', function() { audio._ensureResumed(); }, { once: true });

  // Initialize BGM & HUD
  var bgm = new WS.BGM();
  var hud = new WS.HUD();

  // Display ASCII logo
  _showLogo(terminal);
  await wait(500);

  // ── Save Detection ──
  var saveData = WS.SaveManager.load();
  if (saveData) {
    await terminal.typeLine('[G-DECK] 이전 진행 상황이 감지되었습니다.', 'system', 20);
    await terminal.typeLine('[G-DECK] 요원: ' + saveData.playerName, 'system', 20);
    terminal.printBlank();
    await terminal.typeLine('이어서 진행하시겠습니까? (Y/N)', 'objective', 25);

    var answer = '';
    while (answer !== 'y' && answer !== 'n') {
      answer = (await terminal.waitForInput()).trim().toLowerCase();
      if (answer !== 'y' && answer !== 'n') {
        await terminal.typeLine('[G-DECK] Y 또는 N을 입력하세요.', 'system', 20);
      }
    }

    if (answer === 'y') {
      // Resume: restore state, skip boot/nickname
      WS.playerName = saveData.playerName;
      hud.show();
      hud.setOracle('ONLINE');
      terminal.printBlank();
      await terminal.typeLine('[G-DECK] 세션 복원 중...', 'system', 20);
      await wait(300);
      await terminal.typeLine('[단장] 돌아왔군, ' + WS.playerName + '. 바로 이어서 가지.', 'commander', 25);
      terminal.printBlank();
      await wait(300);

      var game = new WS.StageManager(terminal, WS.stages, audio, hud);
      game.bgm = bgm;
      await game.start(saveData.stageIndex);
      return;
    } else {
      // New game: clear save, re-display logo
      WS.SaveManager.clear();
      terminal.clear();
      _showLogo(terminal);
      await wait(500);
    }
  }

  // ── Normal Boot ──
  await terminal.typeLines(BOOT_LINES);

  // ── Nickname Prompt ──
  await terminal.typeLine('[G-DECK] 보안 터미널 접속 확인', 'system', 20);
  await terminal.typeLine('[G-DECK] 신원 확인이 필요합니다.', 'system', 20);
  terminal.printBlank();
  await terminal.typeLine('콜사인(닉네임)을 입력하세요:', 'objective', 25);

  var nickname = '';
  while (!nickname.trim()) {
    nickname = await terminal.waitForInput();
    if (!nickname.trim()) {
      await terminal.typeLine('[G-DECK] 콜사인을 입력해야 합니다.', 'system', 20);
    }
  }
  WS.playerName = nickname.trim();

  terminal.printBlank();
  await terminal.typeLine('[O.R.O.R.A] 요원 "' + WS.playerName + '" 신원 확인 완료.', 'system', 20);
  await wait(300);

  // Activate HUD after identity confirmed
  hud.show();
  hud.setOracle('ONLINE');

  await terminal.typeLine('[단장] ' + WS.playerName + '... 좋은 콜사인이군.', 'commander', 25);
  await wait(300);
  await terminal.typeLine('[단장] 나는 이 작전의 총 지휘관, 단장이다.', 'commander', 25);
  await terminal.typeLine('[단장] 지금 네 G-DECK에 O.R.O.R.A가 연결됐다.', 'commander', 25);
  await wait(200);
  await terminal.typeLine('[단장] O.R.O.R.A는 본부의 지원 시스템이야. 내가 여기로 통신한다.', 'commander', 25);
  await wait(200);
  await terminal.typeLine('[단장] 오늘 네가 맡을 작전은 "Operation: White Shield".', 'commander', 25);
  await wait(200);
  await terminal.typeLine('[단장] 우리 본부 서버가 해킹 공격을 받고 있다.', 'commander', 25);
  await terminal.typeLine('[단장] 네 임무는 G-DECK으로 시스템에 접속해서 공격을 분석하고 방어하는 거야.', 'commander', 25);
  await wait(200);
  terminal.printBlank();
  await terminal.typeLine('help - 도움말 | hint - 힌트 | clear - 화면 초기화', 'dim', 15);
  terminal.printBlank();
  await terminal.typeLine('[단장] 그 전에 기본기부터 점검하지. VR 훈련에 접속한다, ' + WS.playerName + '.', 'commander', 25);
  terminal.printBlank();
  await wait(500);

  // Start game
  var game = new WS.StageManager(terminal, WS.stages, audio, hud);
  game.bgm = bgm;
  await game.start();
});

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}
