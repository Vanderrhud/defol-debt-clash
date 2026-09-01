const assert = require('node:assert');
const { describe, it } = require('node:test');

// Mock Phaser base class
class MockPhaserScene {
  constructor() { this.key = null; }
}

global.Phaser = {
  Scene: MockPhaserScene,
  Math: { Clamp: (v, min, max) => Math.min(Math.max(v, min), max) },
  Input: {
    Keyboard: {
      KeyCodes: {
        A: 65, D: 68, J: 74, K: 75,
        LEFT: 37, RIGHT: 39,
        NUMPAD_ONE: 97, NUMPAD_TWO: 98,
        F3: 114,
      },
      JustDown() { return false; },
    },
  },
};

// Track created shapes for visibility testing
const createdShapes = [];

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
      return {
        clear() {},
        fillStyle() {},
        fillRect() {},
        setDepth() { return this; },
      };
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

function createMockScene() {
  const add = createMockAdd();
  return { add };
}

function makeKeys(overrides = {}) {
  const def = () => ({ isDown: false });
  return {
    left: overrides.left ?? def(),
    right: overrides.right ?? def(),
    attack: overrides.attack ?? def(),
    block: overrides.block ?? def(),
  };
}

// Load modules
const Player = require('../client/js/Player.js');
const GameScene = require('../client/js/scenes/GameScene.js');

// Player must be global for GameScene's create() to work
global.Player = Player;

function createGameScene() {
  createdShapes.length = 0;
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

describe('Player - KO & Reset', () => {
  it('should return isKO() = true when HP is 0', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.takeDamage(100);
    assert.strictEqual(p.hp, 0);
    assert.strictEqual(p.isKO(), true);
  });

  it('should return isKO() = true when HP is below 0', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.takeDamage(999);
    assert.strictEqual(p.hp, 0);
    assert.strictEqual(p.isKO(), true);
  });

  it('should return isKO() = false when HP is above 0', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    assert.strictEqual(p.isKO(), false);
  });

  it('should return isKO() = false when damaged but still alive', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.takeDamage(50);
    assert.strictEqual(p.hp, 50);
    assert.strictEqual(p.isKO(), false);
  });
});

describe('Player - reset()', () => {
  it('should restore HP to maxHp', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.takeDamage(75);
    assert.strictEqual(p.hp, 25);
    p.reset();
    assert.strictEqual(p.hp, 100);
  });

  it('should set state to idle', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.startAttack();
    assert.strictEqual(p.state, 'attacking');
    p.reset();
    assert.strictEqual(p.state, 'idle');
  });

  it('should clear hitbox', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.startAttack();
    assert.ok(p.hitbox !== null);
    p.reset();
    assert.strictEqual(p.hitbox, null);
  });

  it('should clear flashRed and hasHit flags', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.takeDamage(10);
    assert.strictEqual(p.flashRed, true);
    assert.strictEqual(p.hasHit, false);
    p.reset();
    assert.strictEqual(p.flashRed, false);
  });

  it('should reset facing direction for p1 to right (1)', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p1');
    p.facing = -1;
    p.reset();
    assert.strictEqual(p.facing, 1);
  });

  it('should reset facing direction for p2 to left (-1)', () => {
    const scene = createMockScene();
    const p = new Player(scene, 200, 500, makeKeys(), 0xff4444, 'p2');
    p.facing = 1;
    p.reset();
    assert.strictEqual(p.facing, -1);
  });
});

describe('GameScene - Match state management', () => {
  it('should have a matchController with initial timer of 120s', () => {
    const game = createGameScene();
    game.create();

    assert.ok(game.matchController !== undefined, 'matchController should exist after create()');
    assert.strictEqual(game.matchController.matchTime, 120, 'Timer harus mulai dari 120 detik');
    assert.strictEqual(game.matchController.state, 'playing', 'Match state harus playing');
  });

  it('should update timer when matchController.update() is called with delta time', () => {
    const game = createGameScene();
    game.create();

    game.matchController.update(1000); // delta in ms

    assert.strictEqual(game.matchController.matchTime, 119, 'Timer harus berkurang 1 detik');
  });

  it('should set match state to "finished" and result to "draw" when timer reaches 0', () => {
    const game = createGameScene();
    game.create();

    // Set timer to almost expired
    game.matchController.matchTime = 1.5;
    game.matchController.update(2000); // 2 detik delta

    assert.strictEqual(game.matchController.matchTime, 0, 'Timer harus 0');
    assert.strictEqual(game.matchController.state, 'finished', 'State harus finished saat timer habis');
    assert.strictEqual(game.matchController.result, 'draw', 'Result harus draw saat timer habis tanpa KO');
  });

  it('should set state to finished and determine winner when player is KO', () => {
    const game = createGameScene();
    game.create();

    // Simulate player KO
    game.player1.hp = 0;
    game.matchController.checkKO();

    assert.strictEqual(game.matchController.state, 'finished', 'State harus finished saat KO');
    assert.strictEqual(game.matchController.result, 'p2', 'P2 harus menang saat P1 KO');
  });

  it('should determine P1 as winner when P2 is KO', () => {
    const game = createGameScene();
    game.create();

    game.player2.hp = 0;
    game.matchController.checkKO();

    assert.strictEqual(game.matchController.state, 'finished');
    assert.strictEqual(game.matchController.result, 'p1');
  });

  it('should not check KO or update timer when state is already finished', () => {
    const game = createGameScene();
    game.create();

    game.matchController.state = 'finished';
    game.matchController.matchTime = 50;

    game.matchController.update(5000);

    assert.strictEqual(game.matchController.matchTime, 50, 'Timer harus tetap saat state finished');
    assert.strictEqual(game.matchController.state, 'finished');
  });

  it('should not allow rematch while match is still playing', () => {
    const game = createGameScene();
    game.create();

    game.player1.takeDamage(30);

    game.matchController.rematch();

    assert.strictEqual(game.matchController.state, 'playing');
    assert.strictEqual(game.player1.hp, 70, 'HP tidak boleh direset saat match masih playing');
  });

  it('should reset everything on rematch when match is finished', () => {
    const game = createGameScene();
    game.create();

    // Force finish
    game.player2.hp = 0;
    game.matchController.checkKO();
    assert.strictEqual(game.matchController.state, 'finished');

    // Rematch
    game.matchController.rematch();

    assert.strictEqual(game.matchController.state, 'playing', 'State harus playing setelah rematch');
    assert.strictEqual(game.matchController.matchTime, 120, 'Timer harus 120 detik setelah rematch');
    assert.strictEqual(game.player1.hp, 100, 'HP P1 harus full');
    assert.strictEqual(game.player2.hp, 100, 'HP P2 harus full');
    assert.strictEqual(game.player1.state, 'idle', 'State player harus idle');
    assert.strictEqual(game.player2.state, 'idle');
  });
});