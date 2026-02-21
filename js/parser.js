/**
 * Parser - Command matching engine (pure functions, no DOM dependency)
 */
var WS = window.WS || {};

/** Match result types */
WS.MatchType = {
  EXACT: 'exact',
  PATTERN: 'pattern',
  KEYWORD: 'keyword',
  PARTIAL: 'partial',
  NONE: 'none',
};

/**
 * Normalize user input: lowercase, trim, collapse whitespace, strip trailing semicolons.
 */
WS.normalize = function(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/;+$/, '');
};

/**
 * Match input against a command definition.
 *
 * commandDef shape:
 *   { exact, alts[], keywords[], pattern? }
 *
 * Returns: { type: MatchType, matched: boolean }
 */
WS.matchCommand = function(rawInput, commandDef) {
  var input = WS.normalize(rawInput);

  if (!input) {
    return { type: WS.MatchType.NONE, matched: false };
  }

  // 1. Exact match
  var candidates = [commandDef.exact].concat(commandDef.alts || []).map(WS.normalize);
  if (candidates.indexOf(input) !== -1) {
    return { type: WS.MatchType.EXACT, matched: true };
  }

  // 2. Pattern (regex) match
  if (commandDef.pattern) {
    var re = new RegExp(commandDef.pattern, 'i');
    if (re.test(input)) {
      return { type: WS.MatchType.PATTERN, matched: true };
    }
  }

  // 3. Keyword match - all keywords present
  if (commandDef.keywords && commandDef.keywords.length > 0) {
    var kws = commandDef.keywords.map(function(k) { return k.toLowerCase(); });
    var allPresent = kws.every(function(kw) { return input.indexOf(kw) !== -1; });
    if (allPresent) {
      return { type: WS.MatchType.KEYWORD, matched: true };
    }

    // 4. Partial match - some but not all keywords
    var somePresent = kws.some(function(kw) { return input.indexOf(kw) !== -1; });
    if (somePresent) {
      return { type: WS.MatchType.PARTIAL, matched: false };
    }
  }

  // 5. No match
  return { type: WS.MatchType.NONE, matched: false };
};

/* ── Typo Correction System ── */

/** Commands used in the game + common Linux commands */
var KNOWN_COMMANDS = [
  'grep', 'cat', 'netstat', 'lsof', 'iptables', 'kill', 'top',
  'crontab', 'find', 'rm', 'vi', 'vim', 'nano', 'systemctl',
  'strings', 'echo', 'base64', 'lastb', 'last', 'history',
  'chage', 'nmap', 'chattr', 'auditctl', 'tcpdump', 'sha256sum',
  'shasum', 'cp', 'route', 'ps', 'awk', 'sort', 'uniq', 'head',
  'chmod', 'chown', 'usermod', 'passwd', 'sudo', 'ping', 'ssh',
  'tail', 'less', 'ls', 'cd', 'pwd', 'mkdir', 'mv', 'ip',
  'service', 'wget', 'curl', 'whoami', 'id', 'df', 'du',
  'mount', 'umount', 'tar', 'gzip', 'sed', 'wc',
];

/** Levenshtein edit distance */
function _levenshtein(a, b) {
  var m = a.length, n = b.length;
  var dp = [];
  for (var i = 0; i <= m; i++) {
    dp[i] = [];
    for (var j = 0; j <= n; j++) {
      if (i === 0) dp[i][j] = j;
      else if (j === 0) dp[i][j] = i;
      else dp[i][j] = 0;
    }
  }
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Check if the input contains a typo of a known command.
 * Returns the suggested correct command, or null.
 */
WS.checkTypo = function(rawInput) {
  var normalized = WS.normalize(rawInput);
  var words = normalized.split(/\s+/);
  var checkWord = words[0];

  // If first word is 'sudo', check the second word
  if (checkWord === 'sudo' && words.length > 1) {
    checkWord = words[1];
  }

  if (!checkWord || checkWord.length < 3) return null;

  // Already a known command — no typo
  if (KNOWN_COMMANDS.indexOf(checkWord) >= 0) return null;

  var bestMatch = null;
  var bestDist = Infinity;
  // Max distance: 1 for short words (3-4), 2 for longer words (5+)
  var maxDist = checkWord.length <= 4 ? 1 : 2;

  for (var i = 0; i < KNOWN_COMMANDS.length; i++) {
    var cmd = KNOWN_COMMANDS[i];
    // Skip if length difference is too big
    if (Math.abs(checkWord.length - cmd.length) > maxDist) continue;
    var dist = _levenshtein(checkWord, cmd);
    if (dist > 0 && dist <= maxDist && dist < bestDist) {
      bestDist = dist;
      bestMatch = cmd;
    }
  }

  return bestMatch;
};

/* ── Dangerous Command Detection ── */

/** Patterns matching destructive/dangerous commands */
var DANGEROUS_PATTERNS = [
  // System destruction
  { re: /rm\s+(-[rRf]{1,4}\s+)*\/(\s|$)/, msg: '루트(/) 전체 삭제 명령입니다. 서버의 모든 데이터가 영구적으로 파괴됩니다.' },
  { re: /rm\s+(-[rRf]{1,4}\s+)*(\/etc|\/var|\/usr|\/boot|\/home|\/bin|\/sbin)(\/|\s|$)/, msg: '핵심 시스템 디렉토리 삭제 명령입니다. 서버가 복구 불가능하게 파괴됩니다.' },
  { re: /mkfs\s/, msg: '디스크 포맷 명령입니다. 파티션의 모든 데이터가 초기화됩니다.' },
  { re: /dd\s+.*if=\/dev\/(zero|urandom).*of=\/dev\/[sh]d/, msg: '디스크 덮어쓰기입니다. 물리 디스크가 파괴되어 복구가 불가능합니다.' },
  { re: /:\(\)\s*\{/, msg: 'Fork Bomb입니다. 무한 프로세스 생성으로 시스템이 응답 불능에 빠집니다.' },
  // Permission destruction
  { re: /chmod\s+(000|777)\s+(-[rR]\s+)?\//, msg: '루트 디렉토리 권한 변경은 전체 시스템을 파괴합니다.' },
  { re: /chown\s+.*-[rR]\s+.*\/(\s|$)/, msg: '루트 디렉토리 소유권 재귀 변경은 시스템을 파괴합니다.' },
  // Shutdown / reboot
  { re: /(shutdown|poweroff|halt)(\s|$)/, msg: '서버 종료 명령입니다. 작전 중 서비스 중단은 임무 실패를 의미합니다.' },
  { re: /^(sudo\s+)?reboot$/, msg: '서버 재부팅입니다. 긴급 작전 중 재부팅은 치명적 공백을 만듭니다.' },
  { re: /init\s+[06]/, msg: '런레벨 변경으로 서버가 종료/재부팅됩니다.' },
  // Data destruction
  { re: />\s*\/dev\/[sh]d/, msg: '디스크에 직접 쓰는 명령입니다. 파일시스템이 파괴됩니다.' },
  { re: /echo\s.*>\s*\/etc\/(passwd|shadow)/, msg: '인증 파일 덮어쓰기는 모든 사용자의 시스템 접근을 차단합니다.' },
  { re: /mv\s+\/etc\/(passwd|shadow)\s/, msg: '인증 파일 이동은 즉시 시스템 접근 장애를 일으킵니다.' },
  // Remote code execution
  { re: /(curl|wget)\s.*\|\s*(sudo\s+)?(bash|sh|zsh)/, msg: '원격 스크립트 직접 실행은 악성코드 감염의 주요 경로입니다.' },
  // Disk fill
  { re: /cat\s+\/dev\/(zero|urandom)\s*>/, msg: '무한 데이터 쓰기로 디스크가 가득 차 시스템이 마비됩니다.' },
  // Kernel panic
  { re: /echo\s.*>\s*\/proc\/sysrq/, msg: 'SysRq 트리거로 커널 패닉이 발생하여 시스템이 즉시 중단됩니다.' },
];

/**
 * Check if the input is a dangerous/destructive command.
 * Returns a warning message string, or null.
 */
WS.checkDangerous = function(rawInput) {
  var normalized = WS.normalize(rawInput);
  for (var i = 0; i < DANGEROUS_PATTERNS.length; i++) {
    if (DANGEROUS_PATTERNS[i].re.test(normalized)) {
      return DANGEROUS_PATTERNS[i].msg;
    }
  }
  return null;
};

/** Meta commands recognized globally */
var META_COMMANDS = ['help', 'hint', 'clear', 'status', 'quit'];

/**
 * Check if input is a meta command.
 * Returns the meta command name or null.
 */
WS.checkMeta = function(rawInput) {
  var input = WS.normalize(rawInput);
  if (META_COMMANDS.indexOf(input) !== -1) {
    return input;
  }
  return null;
};
