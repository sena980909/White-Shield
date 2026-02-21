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
