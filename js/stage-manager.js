/**
 * StageManager - Central game controller and state machine.
 * Supports {name} placeholder, rotating soft-fail messages, HUD integration.
 */
var WS = window.WS || {};

WS.playerName = '요원'; // default, overwritten by nickname prompt

WS.StageManager = class StageManager {
  constructor(terminal, stages, audio, hud) {
    this.terminal = terminal;
    this.stages = stages;
    this.audio = audio || null;
    this.hud = hud || null;
    this.hintSystem = new WS.HintSystem();

    this.currentStageIndex = 0;
    this.currentCommandIndex = 0;
    this.state = 'IDLE';
    this._wrongIdx = 0;
    this._partialIdx = 0;

    // Count mission stages (those with commands) for HUD
    this._missionStages = [];
    for (var i = 0; i < stages.length; i++) {
      if (stages[i].commands && stages[i].commands.length > 0) {
        this._missionStages.push(stages[i].id);
      }
    }
  }

  /** Replace {name} in text */
  _t(text) {
    if (!text) return text;
    return text.replace(/\{name\}/g, WS.playerName);
  }

  /** Process lines array - replace {name} in all text */
  _processLines(lines) {
    var self = this;
    return lines.map(function(line) {
      return { text: self._t(line.text || ''), 'class': line['class'] || '', speed: line.speed, delay: line.delay };
    });
  }

  /** Pick next rotating message from an array */
  _pickRotating(arr, counterName) {
    var msg = arr[this[counterName] % arr.length];
    this[counterName]++;
    return this._t(msg);
  }

  /** Update HUD based on stage context */
  _updateHUD(stage) {
    if (!this.hud) return;
    var id = stage.id;

    // Update mission counter
    var mIdx = this._missionStages.indexOf(id);
    if (mIdx >= 0) {
      this.hud.setMission(mIdx + 1, this._missionStages.length);
    }

    // Stage-specific HUD updates
    switch (id) {
      // ACT 1 - normal ops
      case 'stage_1':
        this.hud.setTitan('--');
        this.hud.setStealth(95);
        break;
      case 'stage_3':
        this.hud.setStealth(80);
        break;
      case 'stage_7':
        this.hud.setStealth(65);
        break;
      case 'stage_10':
        this.hud.setStealth(55);
        break;
      case 'stage_14':
        this.hud.setStealth(70);
        break;

      // ACT 2 transition - dramatic HUD shift
      case 'stage_act2_intro':
        this.hud.attackAlert();
        this.hud.setTitan('HOSTILE');
        this.hud.dangerMode(true);
        this.hud.setStealth(50);
        break;
      case 'stage_15':
        this.hud.setTemp(42, '°C');
        break;
      case 'stage_16':
        this.hud.setStealth(45);
        break;
      case 'stage_17':
        this.hud.setTitan('BREACHING');
        break;
      case 'stage_18':
        this.hud.setTemp(2847, '°C');
        break;
      case 'stage_19':
        this.hud.setTemp(2971, '°C');
        break;

      // DDoS mission
      case 'stage_20':
        this.hud.setOracle('DEGRADED');
        this.hud.attackAlert();
        this.hud.setTemp(800, '°C');
        break;

      // Ending - all clear
      case 'stage_ending':
        this.hud.dangerMode(false);
        this.hud.setOracle('ONLINE');
        this.hud.setTitan('NEUTRALIZED');
        this.hud.setTemp(42, '°C');
        this.hud.setStealth(100);
        break;
    }
  }

  async start() {
    for (var i = 0; i < this.stages.length; i++) {
      this.currentStageIndex = i;
      this._updateHUD(this.stages[i]);
      await this.runStage(this.stages[i]);
      if (!this.stages[i].next) break;
    }
  }

  async runStage(stage) {
    this.currentCommandIndex = 0;
    this.hintSystem.resetForNewStage();

    // BRIEFING
    this.state = 'BRIEFING';
    if (stage.briefing && stage.briefing.length > 0) {
      if (this.audio) this.audio.incoming();
      await this.terminal.typeLines(this._processLines(stage.briefing));
    }

    // OBJECTIVE
    this.state = 'OBJECTIVE';
    if (stage.objective && stage.objective.length > 0) {
      await this.terminal.typeLines(this._processLines(stage.objective));
    }

    // No commands = ending/transition stage
    if (!stage.commands || stage.commands.length === 0) return;

    // COMMAND LOOP
    for (var cmdIdx = 0; cmdIdx < stage.commands.length; cmdIdx++) {
      this.currentCommandIndex = cmdIdx;
      this.hintSystem.resetForNewStage();
      await this.inputLoop(stage, stage.commands[cmdIdx]);

      // Interstitial dialogue
      var cmd = stage.commands[cmdIdx];
      if (stage.interstitial && stage.interstitial[cmd.id]) {
        await this.terminal.typeLines(this._processLines(stage.interstitial[cmd.id]));
      }
    }

    // SUCCESS
    this.state = 'RESULT';
    if (stage.success && stage.success.length > 0) {
      if (this.audio) this.audio.success();
      await this.terminal.typeLines(this._processLines(stage.success));
    }

    // Post-success HUD updates
    if (this.hud) {
      if (stage.id === 'stage_19') {
        this.hud.setTemp(800, '°C');
        this.hud.setTitan('SECURED');
      }
      if (stage.id === 'stage_20') {
        this.hud.setOracle('ONLINE');
      }
    }

    this.state = 'TRANSITION';
    await this._wait(300);
  }

  async inputLoop(stage, commandDef) {
    this.state = 'AWAITING_INPUT';
    var strings = WS.strings;

    while (true) {
      var input = await this.terminal.waitForInput();

      var meta = WS.checkMeta(input);
      if (meta) { await this.handleMeta(meta, stage); continue; }
      if (!input.trim()) continue;

      var result = WS.matchCommand(input, commandDef);
      if (result.matched) return;

      // Dangerous command warning (skip normal wrong-answer flow)
      var dangerousMsg = WS.checkDangerous(input);
      if (dangerousMsg) {
        if (this.audio) this.audio.alert();
        await this.terminal.typeLine(strings.dangerousPrefix, 'error', 15);
        await this.terminal.typeLine(
          strings.dangerousWarning.replace('{msg}', dangerousMsg), 'error', 20
        );
        await this.terminal.typeLine(this._t(strings.dangerousSuffix), 'error', 20);
        this.terminal.printBlank();
        continue;
      }

      // Windows command guide for beginners
      var windowsHint = WS.checkWindows(input);
      if (windowsHint) {
        var winMsg = strings.windowsHint
          .replace('{linux}', windowsHint.linux)
          .replace('{desc}', windowsHint.desc);
        await this.terminal.typeLine(winMsg, 'hint', 20);
        this.terminal.printBlank();
        continue;
      }

      // Typo suggestion (before wrong-answer feedback)
      var typoSuggestion = WS.checkTypo(input);
      if (typoSuggestion) {
        var typoMsg = strings.typoSuggestion.replace('{cmd}', typoSuggestion);
        await this.terminal.typeLine(typoMsg, 'hint', 20);
      }

      // Soft failure - rotating commander messages
      if (result.type === WS.MatchType.PARTIAL) {
        var partialMsg = (commandDef.wrongFeedback && commandDef.wrongFeedback.partial)
          ? this._t('[단장] ' + commandDef.wrongFeedback.partial)
          : this._pickRotating(strings.wrongPartial, '_partialIdx');
        await this.terminal.typeLine(partialMsg, 'commander', 20);
      } else {
        await this.terminal.typeLine(
          this._pickRotating(strings.wrongGeneric, '_wrongIdx'),
          'commander', 20
        );
      }
      this.terminal.printBlank();

      // Auto-hint after threshold
      var shouldAutoHint = this.hintSystem.recordWrongAttempt();
      if (shouldAutoHint && stage.hints && stage.hints.length > 0) {
        await this.terminal.typeLine(this._t(strings.autoHintPrefix), 'hint', 20);
        var hint = this.hintSystem.getNextHint(stage.hints);
        if (hint) {
          await this.terminal.typeLine(strings.hintPrefix + ' ' + hint.text, 'hint', 20);
        }
        this.terminal.printBlank();
      }
    }
  }

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
            await this.terminal.typeLine(strings.hintPrefix + ' ' + hint.text, 'hint', 20);
            if (hint.remaining > 0) {
              this.terminal.printLine('(남은 힌트: ' + hint.remaining + '개)', 'dim');
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
        this.terminal.printLine(this._t(msg), 'objective');
        if (stage.commands && stage.commands.length > 1) {
          this.terminal.printLine(
            '현재 명령어 단계: ' + (this.currentCommandIndex + 1) + '/' + stage.commands.length, 'dim'
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
