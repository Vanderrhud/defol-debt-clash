const assert = require('node:assert');
const { describe, it } = require('node:test');

// Mock Phaser
global.Phaser = {
  Math: { Clamp: (v, min, max) => Math.min(Math.max(v, min), max) },
  Geom: {
    Rectangle: class {
      constructor(x, y, w, h) { this.x = x; this.y = y; this.width = w; this.height = h; }
    },
  },
};

// Helper: check rectangle overlap
function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function createMockScene() {
  let rectId = 0;
  return {
    add: {
      rectangle(x, y, w, h, color) {
        rectId++;
        return { x, y, width: w, height: h, color, id: rectId };
      },
      text() { return {}; },
    },
    time: {
      addEvent() { return {}; },
    },
  };
}

function createKeyMock(isDown = false) {
  return { isDown };
}

describe('Player combat system', () => {
  describe('HP & damage', () => {
    it('should start with 100 HP', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      assert.strictEqual(player.hp, 100);
      assert.strictEqual(player.maxHp, 100);
    });

    it('should reduce HP when takeDamage is called', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.takeDamage(10);
      assert.strictEqual(player.hp, 90);
    });

    it('should not reduce HP below 0', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.takeDamage(200);
      assert.strictEqual(player.hp, 0);
    });
  });

  describe('Attack', () => {
    it('should create a hitbox in front of player when attacking', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      // P1 starts facing right
      player.startAttack();

      assert.ok(player.hitbox !== null, 'Harus ada hitbox');
      // Hitbox should be to the RIGHT of the player (facing right)
      assert.ok(player.hitbox.x > player.sprite.x, 'Hitbox harus di depan player');
    });

    it('should have hitbox active for approximately 300ms', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.startAttack();
      assert.ok(player.hitbox !== null, 'Hitbox ada setelah attack dimulai');

      // After 300ms, hitbox should be gone
      player.update(500, 350); // 350ms delta
      assert.strictEqual(player.hitbox, null, 'Hitbox harus hilang setelah 300ms');
    });

    it('should not attack again while already attacking', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.startAttack();
      const firstHitbox = player.hitbox;
      // Try attacking again
      player.startAttack();
      // Should still be the same hitbox, not a new one
      assert.strictEqual(player.hitbox, firstHitbox, 'Hitbox tidak boleh diganti saat masih attacking');
    });
  });

  describe('State transitions', () => {
    it('should set state to attacking when startAttack is called', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.startAttack();
      assert.strictEqual(player.state, 'attacking');
    });

    it('should return to idle after attack finishes', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.startAttack();
      player.update(0, 350);
      assert.strictEqual(player.state, 'idle');
    });
  });

  describe('Block', () => {
    it('should set state to blocking when startBlock is called', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.startBlock();
      assert.strictEqual(player.state, 'blocking');
    });

    it('should reduce damage by 50% when blocking', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.startBlock();
      const damage = player.takeDamage(20);
      // With 50% reduction, raw 20 -> actual 10
      assert.strictEqual(player.hp, 90, 'HP harus berkurang 10 (bukan 20)');
      assert.strictEqual(damage, 10, 'Damage aktual harus 10');
    });

    it('should prevent movement while blocking', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(true), // block held
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      // Simulate right key pressing while blocking
      player.keys.right.isDown = true;
      player.update(0, 1000);
      assert.strictEqual(player.sprite.x, 200, 'Player tidak boleh bergerak saat blocking');
    });

    it('should return to idle when stopBlock is called', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.startBlock();
      player.stopBlock();
      assert.strictEqual(player.state, 'idle');
    });
  });

  describe('Hitbox collision', () => {
    it('should detect overlap between attack hitbox and opponent hurtbox', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const p1Keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };
      const p2Keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const p1 = new Player(scene, 200, 500, p1Keys, 0xff4444, 'p1');
      const p2 = new Player(scene, 250, 500, p2Keys, 0x4444ff, 'p2');

      // P1 attacks (hitbox appears to the right)
      p1.startAttack();

      // Check collision
      const hurtbox = {
        x: p2.sprite.x - p2.sprite.width / 2,
        y: p2.sprite.y - p2.sprite.height / 2,
        width: p2.sprite.width,
        height: p2.sprite.height,
      };

      const hitbox = p1.getHitbox();
      const overlaps = rectsOverlap(hitbox, hurtbox.x ? hurtbox : p2.getHurtbox());
      assert.ok(overlaps, 'Hitbox harus overlap dengan hurtbox lawan yang berdekatan');
    });

    it('should not detect overlap when opponent is far away', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const p1Keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };
      const p2Keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const p1 = new Player(scene, 200, 500, p1Keys, 0xff4444, 'p1');
      const p2 = new Player(scene, 600, 500, p2Keys, 0x4444ff, 'p2');

      p1.startAttack();

      const hitbox = p1.getHitbox();
      const hurtbox = p2.getHurtbox();
      const overlaps = rectsOverlap(hitbox, hurtbox);
      assert.strictEqual(overlaps, false, 'Hitbox tidak boleh overlap dengan lawan yang jauh');
    });
  });

  describe('Visual feedback', () => {
    it('should set flashRed flag when taking damage', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.takeDamage(10);
      assert.strictEqual(player.flashRed, true, 'flashRed harus true setelah kena damage');
    });

    it('should clear flashRed after approximately 100ms', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(), block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.takeDamage(10);
      assert.strictEqual(player.flashRed, true, 'flashRed true setelah damage');

      // After 150ms, flash should be cleared
      player.update(500, 150);
      assert.strictEqual(player.flashRed, false, 'flashRed harus false setelah ~100ms');
    });
  });

  describe('Key-controlled combat', () => {
    it('should start attack when attack key is pressed in update()', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(true), // pressed
        block: createKeyMock(),
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.update(0, 16); // one frame
      assert.strictEqual(player.state, 'attacking', 'Player harus attacking saat tombol attack ditekan');
    });

    it('should start block when block key is held in update()', () => {
      const Player = require('../client/js/Player.js');
      const scene = createMockScene();
      const keys = {
        left: createKeyMock(), right: createKeyMock(),
        attack: createKeyMock(),
        block: createKeyMock(true), // held
      };

      const player = new Player(scene, 200, 500, keys, 0xff4444, 'p1');
      player.update(0, 16); // one frame
      assert.strictEqual(player.state, 'blocking', 'Player harus blocking saat tombol block ditekan');
    });
  });
});