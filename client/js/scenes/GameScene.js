/* global Phaser, Player */

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
    };
    this.p2Keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    };

    // Player instances
    this.player1 = new Player(this, 200, 500, this.p1Keys, 0xff4444, 'p1');
    this.player2 = new Player(this, 600, 500, this.p2Keys, 0x4444ff, 'p2');

    // Ground line
    this.add.line(0, 0, 0, 530, 800, 530, 0x666666);

    // HUD placeholder
    this.add.text(50, 20, 'P1 HP: 100', { color: '#ff4444', fontSize: '16px' });
    this.add.text(600, 20, 'P2 HP: 100', { color: '#4444ff', fontSize: '16px' });
    this.add.text(350, 20, '120', { color: '#ffffff', fontSize: '20px' });

    // Controls info
    this.add.text(130, 560, 'P1: A/D move | P2: ← → move', { color: '#888', fontSize: '12px' });
  }

  update(time, delta) {
    // Player movement (update loop, not physics engine)
    this.player1.update(time, delta);
    this.player2.update(time, delta);
  }
}