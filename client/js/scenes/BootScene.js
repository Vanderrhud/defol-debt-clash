class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Placeholder assets for offline prototype
    // Will load placeholder sprites here later
  }

  create() {
    this.scene.start('GameScene');
  }
}