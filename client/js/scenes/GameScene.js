/* global Phaser, Player */

const DAMAGE_PER_HIT = 10;

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

    // HUD elements
    this.hudP1 = this.add.text(50, 20, `P1 HP: ${this.player1.hp}`, { color: '#ff4444', fontSize: '16px' });
    this.hudP2 = this.add.text(600, 20, `P2 HP: ${this.player2.hp}`, { color: '#4444ff', fontSize: '16px' });
    this.add.text(350, 20, '120', { color: '#ffffff', fontSize: '20px' });

    // Controls info
    this.add.text(80, 560, 'P1: A/D move | J attack | K block', { color: '#888', fontSize: '11px' });
    this.add.text(500, 560, 'P2: ← → move | 1 atk | 2 blk', { color: '#888', fontSize: '11px' });
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

    // Visual feedback: revert flash when not hit
    if (!this.player1.flashRed && this.player1.sprite.fillColor !== this.player1Color) {
      this.player1.sprite.fillColor = this.player1Color;
    }
    if (!this.player2.flashRed && this.player2.sprite.fillColor !== this.player2Color) {
      this.player2.sprite.fillColor = this.player2Color;
    }

    // Update HUD
    this.hudP1.setText(`P1 HP: ${this.player1.hp}`);
    this.hudP2.setText(`P2 HP: ${this.player2.hp}`);
  }
}