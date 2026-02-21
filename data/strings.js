/**
 * Shared UI strings - softer, commander-style feedback via O.R.O.R.A.
 */
var WS = window.WS || {};

WS.strings = {
  help: [
    '── G-DECK 도움말 ──',
    '  help   - 이 도움말 표시',
    '  hint   - 현재 단계의 힌트 보기',
    '  clear  - 화면 초기화',
    '  status - 현재 임무 진행 상황',
    '',
    '리눅스 명령어를 입력하여 임무를 수행하세요.',
    'O.R.O.R.A가 실시간으로 지원합니다.',
  ],

  hintPrefix: '[O.R.O.R.A]',
  hintExhausted: '더 이상 힌트가 없습니다. 위의 힌트를 참고하세요.',

  clearConfirm: '[G-DECK] 화면을 초기화했습니다.',

  // Rotating wrong-answer messages (commander speaks, softer tone)
  wrongGeneric: [
    '[단장] 음... 이건 아닌 것 같은데? 다시 시도해보게, {name}.',
    '[단장] 좋은 시도야. 하지만 다른 접근이 필요해.',
    '[단장] 그건 지금 상황엔 맞지 않아. 목표를 다시 확인해봐.',
    '[단장] 아쉽군, {name}. 한번 더 생각해보게.',
  ],

  wrongPartial: [
    '[단장] 오, 방향은 맞아! 옵션이나 인자를 확인해보게.',
    '[단장] 거의 다 왔는데! 조금만 수정해봐, {name}.',
    '[단장] 맞는 방향이야. 세부 옵션을 좀 더 다듬어보게.',
  ],

  autoHintPrefix: '[단장] 좀 막히는 모양이군. O.R.O.R.A에게 힌트를 요청했다:',

  statusFormat: '[G-DECK] 현재 임무: {title} | 진행: {current}/{total} 단계',

  typoSuggestion: '[G-DECK] 혹시 \'{cmd}\' 명령어를 입력하려고 했나요?',

  quitConfirm: '[G-DECK] 작전을 중단하시겠습니까? 현재 진행 상황은 저장되지 않습니다.',
};
