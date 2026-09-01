const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'game-container',
  backgroundColor: '#111111',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, GameScene],
};

// Only create the game in browser (not in Node.js test)
if (typeof window !== 'undefined') {
  const game = new Phaser.Game(GAME_CONFIG);
}

// Export for testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_CONFIG;
}