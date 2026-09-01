const assert = require('node:assert');
const { describe, it } = require('node:test');

// Track graphics calls for assertion
const graphicsCalls = [];
let graphicsInstance = null;

// Minimal Phaser mock for GameScene
global.Phaser = {
  Scene: class {
    constructor() { this.key = null; }
  },
  Math: { Clamp: (v, min, max) => Math.min(Math.max(v, min), max) },
  Input: {
    Keyboard: {
      KeyCodes: {
        A: 65, D: 68, J: 74, K: 75,
        LEFT: 37, RIGHT: 39,
        NUMPAD_ONE: 97, NUMPAD_TWO: 98,
        F3: 114,
      },
      JustDown(key) { return key && key.isDown; },
    },
  },
};

let createdShapes = [];

function createMockAdd() {
  return {
    rectangle(x, y, w, h, color) {
      const rect = {
        x, y, width: w, height: h, color,
        _visible: true,
        setOrigin() { return rect; },
        setInteractive() { return rect; },
        on() {},
        setVisible(v) { rect._visible = v; return rect; },
      };
      createdShapes.push(rect);
      return rect;
    },
    text(x, y, str, style) {
      const txt = {
        x, y, text: str, style,
        _visible: true,
        setOrigin() { return txt; },
        setText(v) { txt.text = v; return txt; },
        setVisible(v) { txt._visible = v; return txt; },
        setInteractive() { return txt; },
        on() {},
        destroy() {},
      };
      createdShapes.push(txt);
      return txt;
    },
    line() { return {}; },
    graphics() {
      graphicsCalls.length = 0;
      graphicsInstance = {
        clear() { graphicsCalls.push('clear'); },
        fillStyle(color, alpha) { graphicsCalls.push({ method: 'fillStyle', color, alpha }); },
        fillRect(x, y, w, h) { graphicsCalls.push({ method: 'fillRect', x, y, w, h }); },
        setDepth() { return graphicsInstance; },
        setVisible(v) { graphicsInstance._visible = v; return graphicsInstance; },
      };
      return graphicsInstance;
    },
  };
}

function createMockKeys() {
  return {
    left: { isDown: false },
    right: { isDown: false },
    attack: { isDown: false },
    block: { isDown: false },
  };
}

// Load modules
const Player = require('../client/js/Player.js');
const GameScene = require('../client/js/scenes/GameScene.js');
global.Player = Player;

function createGameScene() {
  createdShapes.length = 0;
  graphicsCalls.length = 0;
  const game = new GameScene();
  game.add = createMockAdd();
  game.input = {
    keyboard: {
      addKey() { return { isDown: false }; },
    },
  };
  game.scene = { start() {} };
  return game;
}

describe('Debug Visualisation', () => {
  it('should set debugMode to false by default', () => {
    const game = createGameScene();
    game.create();

    assert.strictEqual(game.debugMode, false, 'debugMode harus false secara default');
  });

  it('should toggle debugMode when F3 key is pressed', () => {
    const game = createGameScene();
    game.create();
    assert.strictEqual(game.debugMode, false, 'debugMode starts false');

    // Press F3 — JustDown triggers when key.isDown
    game.debugKey.isDown = true;
    game.update(0, 16);
    assert.strictEqual(game.debugMode, true, 'debugMode harus toggle ke true setelah F3');

    // Release key
    game.debugKey.isDown = false;
    game.update(0, 16);

    // Press F3 again
    game.debugKey.isDown = true;
    game.update(0, 16);
    assert.strictEqual(game.debugMode, false, 'debugMode harus toggle ke false setelah F3 kedua');
  });

  it('should create a Phaser Graphics object for debug drawing', () => {
    const game = createGameScene();
    game.create();

    // After create(), a graphics object should exist for debug
    assert.ok(game.debugGraphics !== undefined, 'debugGraphics harus ada setelah create()');
  });

  it('should draw hitbox as red transparent rect when debugMode is on and player is attacking', () => {
    const game = createGameScene();
    game.create();

    // Enable debug mode
    game.debugMode = true;

    // P1 attacks so hitbox is active
    game.player1.startAttack();

    // Call update (which should call drawDebug)
    game.player1.update(0, 16);
    game.update(0, 16);

    // Check that fillStyle with red-ish color and alpha < 1 was called
    const redFillCalls = graphicsCalls.filter(
      c => c.method === 'fillStyle' && c.color === 0xff0000 && c.alpha < 1
    );
    assert.ok(redFillCalls.length >= 1, 'Hitbox harus digambar dengan red transparent fill');
  });

  it('should draw hurtbox as green/yellow transparent rect when debugMode is on', () => {
    const game = createGameScene();
    game.create();

    // Enable debug mode
    game.debugMode = true;

    // Call update (which should call drawDebug)
    game.update(0, 16);

    // Check that fillStyle with green-ish color and alpha < 1 was called
    const greenFillCalls = graphicsCalls.filter(
      c => c.method === 'fillStyle' && (c.color === 0x00ff00 || c.color === 0xffff00) && c.alpha < 1
    );
    assert.ok(greenFillCalls.length >= 1, 'Hurtbox harus digambar dengan green/yellow transparent fill');
  });

  it('should not draw anything when debugMode is off', () => {
    const game = createGameScene();
    game.create();

    // debugMode is false by default
    game.player1.startAttack();
    game.player1.update(0, 16);
    game.update(0, 16);

    // graphicsCalls should not contain debug-style fillStyle calls
    const debugCalls = graphicsCalls.filter(
      c => c.method === 'fillStyle' && (c.color === 0xff0000 || c.color === 0x00ff00) && c.alpha < 1
    );
    assert.strictEqual(debugCalls.length, 0, 'Tidak ada debug drawing saat debugMode off');
  });

  it('should not affect gameplay when debug mode is active', () => {
    const game = createGameScene();
    game.create();

    // Enable debug mode
    game.debugMode = true;

    // Verify match still runs normally
    assert.strictEqual(game.matchController.state, 'playing', 'Match state harus playing');
    assert.strictEqual(game.matchController.matchTime, 120, 'Timer harus 120');

    // Players can still move and attack
    game.player1.startAttack();
    assert.strictEqual(game.player1.state, 'attacking', 'Player harus bisa attack saat debug on');

    // Damage still works
    game.player1.takeDamage(10);
    assert.strictEqual(game.player1.hp, 90, 'Damage harus tetap bekerja saat debug on');
  });

  it('should clear graphics before drawing each frame', () => {
    const game = createGameScene();
    game.create();

    game.debugMode = true;
    game.update(0, 16);

    // 'clear' should be called before any draw operations
    const clearIdx = graphicsCalls.findIndex(c => c === 'clear');
    assert.ok(clearIdx >= 0, 'Graphics.clear() harus dipanggil setiap frame');
    // clear should be before any fillStyle/fillRect calls
    const firstFillIdx = graphicsCalls.findIndex(c => c.method === 'fillStyle');
    if (firstFillIdx >= 0) {
      assert.ok(clearIdx < firstFillIdx, 'clear() harus sebelum fillStyle');
    }
  });

  it('should toggle debugMode on/off without resetting the game', () => {
    const game = createGameScene();
    game.create();

    // Simulate some gameplay
    game.player1.takeDamage(30);
    game.matchController.matchTime = 80;

    // Toggle debug on
    game.debugMode = true;
    assert.strictEqual(game.player1.hp, 70, 'HP tidak berubah saat debug diaktifkan');
    assert.strictEqual(game.matchController.matchTime, 80, 'Timer tidak berubah saat debug diaktifkan');

    // Toggle debug off
    game.debugMode = false;
    assert.strictEqual(game.player1.hp, 70, 'HP tidak berubah saat debug dinonaktifkan');
    assert.strictEqual(game.matchController.state, 'playing', 'Match state tidak berubah');
  });
});