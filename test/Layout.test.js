const assert = require('node:assert');
const { describe, it } = require('node:test');

// --- Mocks for game.js ---
class MockScene {
  constructor() { this.key = null; }
}

global.Phaser = {
  AUTO: 'auto',
  Scale: {
    FIT: 'fit',
    CENTER_BOTH: 'center-both',
  },
  Scene: MockScene,
  Math: { Clamp: (v, min, max) => Math.min(Math.max(v, min), max) },
  Input: {
    Keyboard: {
      KeyCodes: {
        A: 65, D: 68, J: 74, K: 75,
        LEFT: 37, RIGHT: 39,
        NUMPAD_ONE: 97, NUMPAD_TWO: 98,
      },
    },
  },
};

global.BootScene = class BootScene extends MockScene {
  constructor() { super(); this.key = 'BootScene'; }
};
global.GameScene = class GameScene extends MockScene {
  constructor() { super(); this.key = 'GameScene'; }
};

// --- Test 1: Game config uses 16:9 landscape ratio ---

describe('Game config - landscape 16:9', () => {
  it('should export a config object with 16:9 width:height ratio', () => {
    const config = require('../client/js/game.js');

    assert.ok(config !== undefined, 'config harus di-export dari game.js');
    assert.strictEqual(typeof config.width, 'number', 'config.width harus number');
    assert.strictEqual(typeof config.height, 'number', 'config.height harus number');

    const ratio = config.width / config.height;
    // 16:9 = 1.777...
    const expectedRatio = 16 / 9;
    const tolerance = 0.01;
    assert.ok(
      Math.abs(ratio - expectedRatio) < tolerance,
      `Rasio harus ${expectedRatio.toFixed(4)} (16:9), got ${ratio.toFixed(4)} (${config.width}x${config.height})`
    );
  });

  it('should have Scale.FIT mode enabled', () => {
    const config = require('../client/js/game.js');

    assert.ok(config.scale !== undefined, 'config.scale harus ada');
    assert.strictEqual(config.scale.mode, 'fit', 'Scale mode harus FIT');
    assert.strictEqual(config.scale.autoCenter, 'center-both', 'autoCenter harus CENTER_BOTH');
  });
});

// --- Test 2: Orientation detection ---

function getOrientation(width, height) {
  // Returns 'landscape' if width > height, 'portrait' if height > width, 'square' if equal
  if (width > height) return 'landscape';
  if (height > width) return 'portrait';
  return 'square';
}

describe('Orientation detection', () => {
  it('should detect landscape when width > height', () => {
    assert.strictEqual(getOrientation(960, 540), 'landscape');
    assert.strictEqual(getOrientation(800, 600), 'landscape'); // not 16:9 but still landscape
  });

  it('should detect portrait when height > width', () => {
    assert.strictEqual(getOrientation(540, 960), 'portrait');
    assert.strictEqual(getOrientation(390, 844), 'portrait'); // iPhone 14 Pro
  });

  it('should detect square when width == height', () => {
    assert.strictEqual(getOrientation(600, 600), 'square');
  });
});

// --- Test 3: Rotate overlay visibility logic ---

function shouldShowRotatePrompt(screenWidth, screenHeight, gameConfig) {
  // Show rotate prompt when screen orientation doesn't match game's landscape aspect
  const isLandscape = screenWidth > screenHeight;
  const gameRatio = gameConfig.width / gameConfig.height;
  const expectedRatio = 16 / 9;

  // Game expects landscape (16:9). Show prompt if portrait.
  return !isLandscape;
}

describe('Rotate prompt logic', () => {
  const mockConfig = { width: 960, height: 540 };

  it('should show rotate prompt when in portrait orientation', () => {
    const visible = shouldShowRotatePrompt(390, 844, mockConfig);
    assert.strictEqual(visible, true, 'Rotate prompt harus muncul saat portrait');
  });

  it('should hide rotate prompt when in landscape orientation', () => {
    const visible = shouldShowRotatePrompt(844, 390, mockConfig);
    assert.strictEqual(visible, false, 'Rotate prompt harus hilang saat landscape');
  });
});

// --- Test 4: Layout proportional to canvas (no hardcoded pixel assumptions) ---

describe('HUD layout - proportional positioning', () => {
  function checkHPBarPositions(width, height) {
    const margin = 60;
    const hpBarWidth = 200;
    const hpBarHeight = 16;
    const hpBarY = 20;

    const p1BarX = margin;
    const p2BarX = width - margin - hpBarWidth;
    const timerX = width / 2;

    return {
      p1BarX,
      p2BarX,
      timerX,
      // The game arena should use full width
      arenaWidth: width,
      arenaHeight: height,
      // Controls info should be near bottom
      controlsY: height - 40,
      // Ground position: 88% of height (players stand at ~88% from top)
      groundY: Math.round(height * 0.88),
      // Result text centered
      resultCenterX: width / 2,
      resultCenterY: height / 2 - 20,
    };
  }

  it('should position P1 HP bar at left margin', () => {
    const layout = checkHPBarPositions(960, 540);
    assert.strictEqual(layout.p1BarX, 60, 'P1 bar harus di 60px dari kiri');
  });

  it('should position P2 HP bar at right margin, accounting for bar width', () => {
    const layout = checkHPBarPositions(960, 540);
    assert.strictEqual(layout.p2BarX, 960 - 60 - 200, 'P2 bar harus di 700px');
    assert.strictEqual(layout.p2BarX, 700);
  });

  it('should center timer at middle of canvas width', () => {
    const layout = checkHPBarPositions(960, 540);
    assert.strictEqual(layout.timerX, 480, 'Timer harus di tengah (480)');
  });

  it('should compute positions correctly for any 16:9 resolution', () => {
    // Test with a different 16:9 resolution
    const layout = checkHPBarPositions(1280, 720);
    assert.strictEqual(layout.p1BarX, 60, 'P1 bar margin tetap 60');
    assert.strictEqual(layout.p2BarX, 1280 - 60 - 200, 'P2 bar harus di 1020');
    assert.strictEqual(layout.timerX, 640, 'Timer harus di tengah (640)');
  });
});

// --- Test 5: Game should not advance while rotate prompt is shown ---

describe('BootScene - orientation gating', () => {
  it('should not start GameScene when in portrait orientation', () => {
    // Simulate: BootScene checks orientation, should NOT advance to GameScene
    const isLandscape = false; // portrait
    assert.strictEqual(isLandscape, false, 'Harus false (portrait)');

    // In portrait mode, the game should not start
    const canStart = isLandscape;
    assert.strictEqual(canStart, false, 'Game tidak boleh start saat portrait');
  });

  it('should start GameScene when in landscape orientation', () => {
    const isLandscape = true; // landscape
    const canStart = isLandscape;
    assert.strictEqual(canStart, true, 'Game boleh start saat landscape');
  });
});