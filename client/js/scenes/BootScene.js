class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.checkOrientation();
  }

  /**
   * Check screen orientation and show/hide rotate prompt.
   * Only start GameScene when in landscape.
   */
  checkOrientation() {
    const overlay = document.getElementById('rotate-overlay');

    if (!overlay) {
      // No overlay element — assume browser/desktop, start directly
      this.scene.start('GameScene');
      return;
    }

    const isLandscape = this.isLandscape();

    if (isLandscape) {
      overlay.classList.remove('visible');
      this.scene.start('GameScene');
    } else {
      overlay.classList.add('visible');
      // Wait for orientation change, then re-check
      this.waitForLandscape();
    }
  }

  /**
   * Determine if screen is in landscape orientation.
   * Uses window.innerWidth/Height as most reliable cross-browser check.
   * @returns {boolean}
   */
  isLandscape() {
    // Using screen.width/height is more reliable for orientation detection
    // than window.innerWidth because some mobile browsers report incorrect inner dimensions
    if (screen && typeof screen.width !== 'undefined' && typeof screen.height !== 'undefined') {
      return screen.width > screen.height;
    }
    // Fallback to window
    return window.innerWidth > window.innerHeight;
  }

  /**
   * Listen for orientation changes and re-check.
   * Keeps looping until landscape is detected.
   */
  waitForLandscape() {
    const checkAgain = () => {
      if (this.isLandscape()) {
        const overlay = document.getElementById('rotate-overlay');
        if (overlay) overlay.classList.remove('visible');
        this.scene.start('GameScene');
      } else {
        // Check again on next animation frame
        requestAnimationFrame(checkAgain);
      }
    };

    // Listen for both standard and legacy orientation events
    window.addEventListener('orientationchange', () => {
      // orientationchange fires before resize, so check on next frame
      requestAnimationFrame(checkAgain);
    });

    window.addEventListener('resize', checkAgain);

    // Also start polling in case events don't fire
    requestAnimationFrame(checkAgain);
  }
}