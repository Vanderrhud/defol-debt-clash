/* global Phaser */

class Player {
  /**
   * @param {Phaser.Scene} scene - Scene tempat player berada
   * @param {number} x - Posisi awal X
   * @param {number} y - Posisi awal Y
   * @param {{left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key}} keys - Key objects
   * @param {number} color - Warna hex
   * @param {string} name - Nama player ('p1' | 'p2')
   */
  constructor(scene, x, y, keys, color, name) {
    this.scene = scene;
    this.sprite = scene.add.rectangle(x, y, 40, 60, color);
    this.keys = keys;
    this.speed = 200; // px/s
    this.name = name;
  }

  /**
   * Panggil setiap frame dari scene.update()
   * @param {number} time - Waktu game (ms)
   * @param {number} delta - Delta waktu frame (ms)
   */
  update(time, delta) {
    const dt = delta / 1000; // konversi ms ke detik

    if (this.keys.left.isDown) {
      this.sprite.x -= this.speed * dt;
    }
    if (this.keys.right.isDown) {
      this.sprite.x += this.speed * dt;
    }

    // Clamp ke arena 800x600 (dengan margin 20px untuk half-width player)
    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, 20, 780);
  }
}

// Support Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Player;
}