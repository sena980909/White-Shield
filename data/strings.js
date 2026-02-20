/**
 * Shared UI strings and messages.
 */
var WS = window.WS || {};

WS.strings = {
  // Meta command responses
  help: [
    '사용 가능한 명령어:',
    '  help   - 이 도움말 표시',
    '  hint   - 현재 단계의 힌트 보기',
    '  clear  - 화면 초기화',
    '  status - 현재 임무 진행 상황',
    '',
    '리눅스 명령어를 입력하여 임무를 수행하세요.',
  ],

  hintPrefix: '[힌트]',
  hintExhausted: '더 이상 힌트가 없습니다. 위의 힌트를 참고하세요.',
  autoHintPrefix: '고전하고 계시는군요. 힌트를 드리겠습니다:',

  clearConfirm: '화면을 초기화했습니다.',

  // Generic wrong-answer feedback
  wrongGeneric: '올바른 명령어가 아닙니다. 다시 시도하세요.',
  wrongPartial: '방향은 맞습니다! 하지만 명령어가 정확하지 않습니다.',

  // Status
  statusFormat: '현재 임무: {title} | 진행: {current}/{total} 단계',

  // Quit
  quitConfirm: '작전을 중단하시겠습니까? 현재 진행 상황은 저장되지 않습니다.',
};
