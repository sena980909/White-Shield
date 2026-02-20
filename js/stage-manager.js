/**
 * StageManager - Central game controller and state machine.
 *
 * States: BRIEFING → OBJECTIVE → AWAITING_INPUT → RESULT → TRANSITION
 */
var WS = window.WS || {};

WS.StageManager = class StageManager {
  constructor(terminal, stages, audio) {
    this.terminal = terminal;
    this.stages = stages;
    this.audio = audio || null;
    this.hintSystem = new WS.HintSystem();

    this.currentStageIndex = 0;
    this.currentCommandIndex = 0;
    this.state = 'IDLE';
  }

  /** Start the game from stage 0 */
  async start() {
    for (var i = 0; i < this.stages.length; i++) {
      this.currentStageIndex = i;
      var stage = this.stages[i];

      await this.runStage(stage);

      if (!stage.next) break;
    }
  }

  /** Run a single stage through its full lifecycle */
  async runStage(stage) {
    this.currentCommandIndex = 0;
    this.hintSystem.resetForNewStage();

    // BRIEFING
    this.state = 'BRIEFING';
    if (stage.briefing && stage.briefing.length > 0) {
      if (this.audio) this.audio.incoming();
      await this.terminal.typeLines(stage.briefing);
    }

    // OBJECTIVE
    this.state = 'OBJECTIVE';
    if (stage.objective && stage.objective.length > 0) {
      await this.terminal.typeLines(stage.objective);
    }

    // No commands = ending stage
    if (!stage.commands || stage.commands.length === 0) {
      return;
    }

    // COMMAND LOOP
    for (var cmdIdx = 0; cmdIdx < stage.commands.length; cmdIdx++) {
      this.currentCommandIndex = cmdIdx;
      this.hintSystem.resetForNewStage();

      var command = stage.commands[cmdIdx];
      await this.inputLoop(stage, command);

      // Show interstitial dialogue
      if (stage.interstitial && stage.interstitial[command.id]) {
        await this.terminal.typeLines(stage.interstitial[command.id]);
      }
    }

    // SUCCESS
    this.state = 'RESULT';
    if (stage.success && stage.success.length > 0) {
      if (this.audio) this.audio.success();
      await this.terminal.typeLines(stage.success);
    }

    // TRANSITION
    this.state = 'TRANSITION';
    await this._wait(300);
  }

  /** Input loop for a single command - repeats until correct input */
  async inputLoop(stage, commandDef) {
    this.state = 'AWAITING_INPUT';

    while (true) {
      var input = await this.terminal.waitForInput();

      // Check meta commands first
      var meta = WS.checkMeta(input);
      if (meta) {
        await this.handleMeta(meta, stage);
        continue;
      }

      // Check if empty
      if (!input.trim()) {
        continue;
      }

      // Match against expected command
      var result = WS.matchCommand(input, commandDef);

      if (result.matched) {
        return;
      }

      // Wrong answer handling
      var strings = WS.strings;

      if (result.type === WS.MatchType.PARTIAL) {
        var feedback =
          (commandDef.wrongFeedback && commandDef.wrongFeedback.partial) ||
          strings.wrongPartial;
        await this.terminal.typeLine('[시스템] ' + feedback, 'system', 20);
        this.terminal.printBlank();
      } else {
        await this.terminal.typeLine('[시스템] ' + strings.wrongGeneric, 'system', 20);
        this.terminal.printBlank();
      }

      // Record wrong attempt and possibly show auto-hint
      var shouldAutoHint = this.hintSystem.recordWrongAttempt();
      if (shouldAutoHint && stage.hints && stage.hints.length > 0) {
        if (this.audio) this.audio.alert();
        await this.terminal.typeLine(
          '[시스템] ' + strings.autoHintPrefix,
          'hint',
          20
        );
        var hint = this.hintSystem.getNextHint(stage.hints);
        if (hint) {
          await this.terminal.typeLine(
            strings.hintPrefix + ' ' + hint.text,
            'hint',
            20
          );
        }
        this.terminal.printBlank();
      }
    }
  }

  /** Handle meta commands: help, hint, clear, status */
  async handleMeta(command, stage) {
    var strings = WS.strings;

    switch (command) {
      case 'help':
        this.terminal.printBlank();
        for (var i = 0; i < strings.help.length; i++) {
          this.terminal.printLine(strings.help[i], 'dim');
        }
        this.terminal.printBlank();
        break;

      case 'hint':
        this.terminal.printBlank();
        if (stage.hints && stage.hints.length > 0) {
          var hint = this.hintSystem.getNextHint(stage.hints);
          if (hint) {
            await this.terminal.typeLine(
              strings.hintPrefix + ' ' + hint.text,
              'hint',
              20
            );
            if (hint.remaining > 0) {
              this.terminal.printLine(
                '(남은 힌트: ' + hint.remaining + '개)',
                'dim'
              );
            }
          } else {
            this.terminal.printLine(strings.hintExhausted, 'dim');
          }
        } else {
          this.terminal.printLine('이 단계에서는 힌트가 제공되지 않습니다.', 'dim');
        }
        this.terminal.printBlank();
        break;

      case 'clear':
        this.terminal.clear();
        this.terminal.printLine(strings.clearConfirm, 'dim');
        this.terminal.printBlank();
        break;

      case 'status': {
        this.terminal.printBlank();
        var title = stage.title || '알 수 없음';
        var current = this.currentStageIndex + 1;
        var total = this.stages.length - 1;
        var msg = strings.statusFormat
          .replace('{title}', title)
          .replace('{current}', current)
          .replace('{total}', total);
        this.terminal.printLine(msg, 'objective');
        if (stage.commands && stage.commands.length > 1) {
          this.terminal.printLine(
            '현재 명령어 단계: ' + (this.currentCommandIndex + 1) + '/' + stage.commands.length,
            'dim'
          );
        }
        this.terminal.printBlank();
        break;
      }

      case 'quit':
        this.terminal.printBlank();
        this.terminal.printLine(strings.quitConfirm, 'system');
        this.terminal.printBlank();
        break;
    }
  }

  _wait(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }
};
