class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Arena placeholder
    this.add.rectangle(400, 300, 800, 600, 0x222222);

    // Player 1 placeholder — red square
    this.p1 = this.add.rectangle(200, 500, 40, 60, 0xff4444);
    this.p2 = this.add.rectangle(600, 500, 40, 60, 0x4444ff);

    // Ground line
    this.add.line(0, 0, 0, 530, 800, 530, 0x666666);

    // HUD placeholder
    this.add.text(50, 20, 'P1 HP: 100', { color: '#ff4444', fontSize: '16px' });
    this.add.text(600, 20, 'P2 HP: 100', { color: '#4444ff', fontSize: '16px' });
    this.add.text(350, 20, '120', { color: '#ffffff', fontSize: '20px' });

    // Controls info
    this.add.text(200, 560, '← → move | A attack | B block', { color: '#888', fontSize: '12px' });
  }

  update() {
    // Placeholder — no logic yet
  }
}