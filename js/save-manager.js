/**
 * SaveManager - Auto-save/load using localStorage.
 * Saves progress after each stage completion for seamless resume.
 */
var WS = window.WS || {};

WS.SaveManager = {
  STORAGE_KEY: 'ws_save',
  VERSION: 1,

  /** Save progress. stageIndex = the next stage to resume at. */
  save: function(playerName, stageIndex, stageId) {
    try {
      var data = {
        version: this.VERSION,
        playerName: playerName,
        stageIndex: stageIndex,
        stageId: stageId,
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage may be full or disabled — fail silently
    }
  },

  /** Load saved data. Returns parsed object or null. */
  load: function() {
    try {
      var raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.version !== this.VERSION) return null;
      if (typeof data.stageIndex !== 'number' || !data.playerName || !data.stageId) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  /** Clear save data. */
  clear: function() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      // fail silently
    }
  }
};
