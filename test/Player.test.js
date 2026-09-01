const assert = require('node:assert');
const { describe, it } = require('node:test');

// Mock Phaser.Math.Clamp
global.Phaser = { Math: { Clamp: (v, min, max) => Math.min(Math.max(v, min), max) } };

// Mock scene factory
function createMockScene() {
  return {
    add: {
      rectangle(x, y, w, h, color) {
        return { x, y, width: w, height: h, color };
      },
    },
  };
}

// Mock key objects — always include attack and block for the new Player
function createKeyMock(isDown = false) {
  return { isDown };
}

function makeKeys(left, right, attack, block) {
  return {
    left: createKeyMock(left ?? false),
    right: createKeyMock(right ?? false),
    attack: createKeyMock(attack ?? false),
    block: createKeyMock(block ?? false),
  };
}

describe('Player class', () => {
  it('should be loadable from client/js/Player.js', () => {
    const Player = require('../client/js/Player.js');
    assert.ok(typeof Player === 'function', 'Player harus berupa class/function');
  });

  it('should create a player with initial position', () => {
    const Player = require('../client/js/Player.js');
    const scene = createMockScene();
    const keys = makeKeys();

    const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
    assert.strictEqual(player.sprite.x, 200);
    assert.strictEqual(player.sprite.y, 500);
    assert.strictEqual(player.name, 'p1');
  });

  it('should move right when right key is down', () => {
    const Player = require('../client/js/Player.js');
    const scene = createMockScene();
    const keys = makeKeys(false, true); // right held

    const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
    player.update(0, 1000); // 1 detik delta
    assert.ok(player.sprite.x > 200, 'Player harus bergerak ke kanan');
  });

  it('should move left when left key is down', () => {
    const Player = require('../client/js/Player.js');
    const scene = createMockScene();
    const keys = makeKeys(true, false); // left held

    const player = new Player(scene, 500, 500, keys, 0x4444ff, 'p2');
    player.update(0, 1000); // 1 detik delta
    assert.ok(player.sprite.x < 500, 'Player harus bergerak ke kiri');
  });

  it('should move at ~200 px/s speed', () => {
    const Player = require('../client/js/Player.js');
    const scene = createMockScene();
    const keys = makeKeys(false, true); // right held

    const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
    player.update(0, 500); // 0.5 detik
    // Speed 200 px/s * 0.5s = 100 px
    assert.ok(Math.abs(player.sprite.x - 300) < 5, 'Kecepatan harus sekitar 200 px/s');
  });

  it('should not move when no keys are pressed', () => {
    const Player = require('../client/js/Player.js');
    const scene = createMockScene();
    const keys = makeKeys(); // all false

    const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
    player.update(0, 1000);
    assert.strictEqual(player.sprite.x, 200, 'X tidak boleh berubah');
  });

  it('should clamp position to arena bounds (20-780)', () => {
    const Player = require('../client/js/Player.js');
    const scene = createMockScene();
    const keys = makeKeys(true, false); // left held

    const player = new Player(scene, 10, 500, keys, 0xff4444, 'p1');
    player.update(0, 1000);
    // Clamping kiri: minimal x = 20
    assert.strictEqual(player.sprite.x, 20, 'Harus clamp ke batas kiri');
  });

  it('should clamp right side to 780', () => {
    const Player = require('../client/js/Player.js');
    const scene = createMockScene();
    const keys = makeKeys(false, true); // right held

    const player = new Player(scene, 790, 500, keys, 0xff4444, 'p1');
    player.update(0, 1000);
    assert.strictEqual(player.sprite.x, 780, 'Harus clamp ke batas kanan');
  });
});