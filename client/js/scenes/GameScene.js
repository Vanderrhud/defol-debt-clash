/* global Phaser, Player */

const DAMAGE_PER_HIT = 10;
const MATCH_DURATION = 120; // detik
const HP_BAR_WIDTH = 200;
const HP_BAR_HEIGHT = 16;
const HP_BAR_Y = 20;

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Arena placeholder
    this.add.rectangle(400, 300, 800, 600, 0x222222);

    // Keyboard input setup
    this.p1Keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      block: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
    };
    this.p2Keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE),
      block: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO),
    };

    // Player instances
    this.player1 = new Player(this, 200, 500, this.p1Keys, 0xff4444, 'p1');
    this.player2 = new Player(this, 600, 500, this.p2Keys, 0x4444ff, 'p2');

    // Store original colors for flash revert
    this.player1Color = 0xff4444;
    this.player2Color = 0x4444ff;

    // Ground line
    this.add.line(0, 0, 0, 530, 800, 530, 0x666666);

    // Match controller
    this.matchController = {
      state: 'playing',   // 'playing' | 'finished'
      matchTime: MATCH_DURATION,
      result: null,        // null | 'p1' | 'p2' | 'draw'

      update: (delta) => {
        if (this.matchController.state === 'finished') return;

        // Update timer (delta dalam ms, konversi ke detik)
        this.matchController.matchTime -= delta / 1000;
        if (this.matchController.matchTime <= 0) {
          this.matchController.matchTime = 0;
          this.matchController.state = 'finished';
          this.matchController.result = 'draw';
          this.matchController.onMatchEnd();
          return;
        }

        // Check KO
        this.matchController.checkKO();
      },

      checkKO: () => {
        if (this.matchController.state === 'finished') return;
        if (this.player1.isKO()) {
          this.matchController.state = 'finished';
          this.matchController.result = 'p2';
          this.matchController.onMatchEnd();
        } else if (this.player2.isKO()) {
          this.matchController.state = 'finished';
          this.matchController.result = 'p1';
          this.matchController.onMatchEnd();
        }
      },

      rematch: () => {
        if (this.matchController.state !== 'finished') return;
        this.matchController.matchTime = MATCH_DURATION;
        this.matchController.state = 'playing';
        this.matchController.result = null;
        this.player1.reset();
        this.player2.reset();
        this.matchController.resetUI();
      },

      onMatchEnd: () => {
        this.matchController.showResult();
      },

      showResult: () => {
        let resultText = '';
        if (this.matchController.result === 'p1') {
          resultText = 'P1 WIN';
        } else if (this.matchController.result === 'p2') {
          resultText = 'P2 WIN';
        } else {
          resultText = 'DRAW';
        }

        this.matchResultText.setText(resultText);
        this.matchResultText.setVisible(true);

        this.rematchButton.setVisible(true);
        this.exitButton.setVisible(true);
      },

      resetUI: () => {
        this.matchResultText.setVisible(false);
        this.rematchButton.setVisible(false);
        this.exitButton.setVisible(false);
      },
    };

    // --- HUD Elements ---

    // P1 HP Bar (background + fill)
    this.p1HpBarBg = this.add.rectangle(60, HP_BAR_Y + HP_BAR_HEIGHT / 2, HP_BAR_WIDTH, HP_BAR_HEIGHT, 0x333333);
    this.p1HpBarBg.setOrigin(0, 0.5);
    this.p1HpBarFill = this.add.rectangle(60, HP_BAR_Y + HP_BAR_HEIGHT / 2, HP_BAR_WIDTH, HP_BAR_HEIGHT, 0xff4444);
    this.p1HpBarFill.setOrigin(0, 0.5);

    // P1 name label
    this.add.text(60, HP_BAR_Y - 12, 'P1', { color: '#ff4444', fontSize: '12px', fontFamily: 'monospace' });

    // P2 HP Bar (background + fill)
    this.p2HpBarBg = this.add.rectangle(540, HP_BAR_Y + HP_BAR_HEIGHT / 2, HP_BAR_WIDTH, HP_BAR_HEIGHT, 0x333333);
    this.p2HpBarBg.setOrigin(0, 0.5);
    this.p2HpBarFill = this.add.rectangle(540, HP_BAR_Y + HP_BAR_HEIGHT / 2, HP_BAR_WIDTH, HP_BAR_HEIGHT, 0x4444ff);
    this.p2HpBarFill.setOrigin(0, 0.5);

    // P2 name label
    this.add.text(540, HP_BAR_Y - 12, 'P2', { color: '#4444ff', fontSize: '12px', fontFamily: 'monospace' });

    // HP text overlay
    this.p1HpText = this.add.text(60 + HP_BAR_WIDTH / 2, HP_BAR_Y + HP_BAR_HEIGHT / 2, '100 / 100', {
      color: '#ffffff', fontSize: '11px', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.p2HpText = this.add.text(540 + HP_BAR_WIDTH / 2, HP_BAR_Y + HP_BAR_HEIGHT / 2, '100 / 100', {
      color: '#ffffff', fontSize: '11px', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Timer (center top)
    this.timerText = this.add.text(400, HP_BAR_Y, '120', {
      color: '#ffffff', fontSize: '24px', fontFamily: 'monospace',
    }).setOrigin(0.5, 0);

    // Match result text (center screen, large)
    this.matchResultText = this.add.text(400, 280, '', {
      color: '#ffff00', fontSize: '48px', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5).setVisible(false);

    // Rematch button
    this.rematchButton = this.add.text(400, 340, '[ Rematch ]', {
      color: '#00ff00', fontSize: '24px', fontFamily: 'monospace',
    }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });

    this.rematchButton.on('pointerdown', () => {
      this.matchController.rematch();
    });

    // Exit button
    this.exitButton = this.add.text(400, 380, '[ Exit ]', {
      color: '#ff6666', fontSize: '24px', fontFamily: 'monospace',
    }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });

    this.exitButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Controls info
    this.add.text(80, 560, 'P1: A/D move | J attack | K block', { color: '#888', fontSize: '11px', fontFamily: 'monospace' });
    this.add.text(500, 560, 'P2: ← → move | 1 atk | 2 blk', { color: '#888', fontSize: '11px', fontFamily: 'monospace' });

    // --- Debug visualization ---
    this.debugMode = false;
    this.debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F3);
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.setDepth(100); // draw on top of everything
  }

  /**
   * Cek apakah dua rectangle overlap (AABB collision)
   */
  rectsOverlap(a, b) {
    if (!a || !b) return false;
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Cek apakah hitbox attacker overlap dengan hurtbox defender.
   * Apply damage sekali per attack swing (hasHit flag).
   */
  checkHit(attacker, defender) {
    const hitbox = attacker.getHitbox();
    if (!hitbox) return false;
    if (attacker.hasHit) return false; // already hit this swing

    const hurtbox = defender.getHurtbox();
    if (this.rectsOverlap(hitbox, hurtbox)) {
      attacker.hasHit = true;
      return defender.takeDamage(DAMAGE_PER_HIT);
    }
    return false;
  }

  update(time, delta) {
    // Only process game logic if match is playing
    if (this.matchController.state === 'playing') {
      // Player updates (movement, attack, block)
      this.player1.update(time, delta);
      this.player2.update(time, delta);

      // Collision detection: P1 hits P2
      const dmg1 = this.checkHit(this.player1, this.player2);
      if (dmg1) {
        this.player2.sprite.fillColor = 0xff0000;
      }

      // Collision detection: P2 hits P1
      const dmg2 = this.checkHit(this.player2, this.player1);
      if (dmg2) {
        this.player1.sprite.fillColor = 0xff0000;
      }

      // Update match controller (timer + KO check)
      this.matchController.update(delta);
    }

    // Debug mode toggle
    if (Phaser.Input.Keyboard.JustDown(this.debugKey)) {
      this.debugMode = !this.debugMode;
    }

    // Debug draw
    this.drawDebug();

    // Visual feedback: revert flash when not hit
    if (!this.player1.flashRed && this.player1.sprite.fillColor !== this.player1Color) {
      this.player1.sprite.fillColor = this.player1Color;
    }
    if (!this.player2.flashRed && this.player2.sprite.fillColor !== this.player2Color) {
      this.player2.sprite.fillColor = this.player2Color;
    }

    // Update HUD — always update even when finished
    this.updateHUD();
  }

  drawDebug() {
    this.debugGraphics.clear();

    if (!this.debugMode) return;

    // Draw hurtbox for each player (green transparent)
    const p1Hurt = this.player1.getHurtbox();
    this.debugGraphics.fillStyle(0x00ff00, 0.3);
    this.debugGraphics.fillRect(p1Hurt.x, p1Hurt.y, p1Hurt.width, p1Hurt.height);

    const p2Hurt = this.player2.getHurtbox();
    this.debugGraphics.fillStyle(0x00ff00, 0.3);
    this.debugGraphics.fillRect(p2Hurt.x, p2Hurt.y, p2Hurt.width, p2Hurt.height);

    // Draw hitbox for each player (red transparent)
    const p1Hit = this.player1.getHitbox();
    if (p1Hit) {
      this.debugGraphics.fillStyle(0xff0000, 0.5);
      this.debugGraphics.fillRect(p1Hit.x, p1Hit.y, p1Hit.width, p1Hit.height);
    }

    const p2Hit = this.player2.getHitbox();
    if (p2Hit) {
      this.debugGraphics.fillStyle(0xff0000, 0.5);
      this.debugGraphics.fillRect(p2Hit.x, p2Hit.y, p2Hit.width, p2Hit.height);
    }
  }

  updateHUD() {
    // Update HP bar fills
    const p1Ratio = this.player1.hp / this.player1.maxHp;
    const p2Ratio = this.player2.hp / this.player2.maxHp;

    this.p1HpBarFill.width = HP_BAR_WIDTH * p1Ratio;
    this.p2HpBarFill.width = HP_BAR_WIDTH * p2Ratio;

    // Update HP text
    this.p1HpText.setText(`${this.player1.hp} / ${this.player1.maxHp}`);
    this.p2HpText.setText(`${this.player2.hp} / ${this.player2.maxHp}`);

    // Update timer display
    const seconds = Math.ceil(this.matchController.matchTime);
    this.timerText.setText(String(seconds));
  }
}

// Support Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameScene;
}