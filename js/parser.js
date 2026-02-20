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
