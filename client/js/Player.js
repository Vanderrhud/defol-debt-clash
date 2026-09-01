/* global Phaser */

const ATTACK_DURATION = 300; // ms
const FLASH_DURATION = 100; // ms
const HITBOX_WIDTH = 30;
const HITBOX_HEIGHT = 40;
const HITBOX_OFFSET = 25; // pixel offset dari player center ke hitbox
const DEFAULT_HP = 100;
const BLOCK_DAMAGE_MULTIPLIER = 0.5;

class Player {
  /**
   * @param {Phaser.Scene} scene - Scene tempat player berada
   * @param {number} x - Posisi awal X
   * @param {number} y - Posisi awal Y
   * @param {{left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key, attack: Phaser.Input.Keyboard.Key, block: Phaser.Input.Keyboard.Key}} keys - Key objects
   * @param {number} color - Warna hex
   * @param {string} name - Nama player ('p1' | 'p2')
   */
  constructor(scene, x, y, keys, color, name) {
    this.scene = scene;
    this.sprite = scene.add.rectangle(x, y, 40, 60, color);
    this.keys = keys;
    this.speed = 200; // px/s
    this.name = name;
    this.hp = DEFAULT_HP;
    this.maxHp = DEFAULT_HP;
    this.state = 'idle'; // 'idle' | 'attacking' | 'blocking'
    // P1 starts on left, facing right; P2 starts on right, facing left
    this.facing = (name === 'p1') ? 1 : -1;
    this.hitbox = null;
    this.attackTimer = 0;
    this.flashRed = false;
    this.flashTimer = 0;
    this.hasHit = false; // true setelah hitbox mendarat (cegah double-hit)
  }

  /**
   * Memulai serangan: bikin hitbox di depan player
   */
  startAttack() {
    if (this.state === 'attacking') return; // sudah attacking
    this.state = 'attacking';
    this.attackTimer = 0;
    this.hasHit = false; // reset untuk attack baru

    // Hitbox di depan player, arah facing
    this.hitbox = {
      x: this.facing === 1
        ? this.sprite.x + HITBOX_OFFSET
        : this.sprite.x - HITBOX_OFFSET - HITBOX_WIDTH,
      y: this.sprite.y - HITBOX_HEIGHT / 2,
      width: HITBOX_WIDTH,
      height: HITBOX_HEIGHT,
    };
  }

  /**
   * Memulai block
   */
  startBlock() {
    if (this.state === 'attacking') return; // tidak bisa block saat attacking
    this.state = 'blocking';
  }

  /**
   * Berhenti block, kembali idle
   */
  stopBlock() {
    if (this.state === 'blocking') {
      this.state = 'idle';
    }
  }

  /**
   * Menerima damage
   * @param {number} rawDamage - Damage mentah sebelum reduksi
   * @returns {number} - Damage aktual yang diterima
   */
  takeDamage(rawDamage) {
    let actualDamage = rawDamage;
    if (this.state === 'blocking') {
      actualDamage = Math.round(rawDamage * BLOCK_DAMAGE_MULTIPLIER);
    }
    this.hp = Math.max(0, this.hp - actualDamage);
    this.flashRed = true;
    this.flashTimer = 0;
    return actualDamage;
  }

  /**
   * Cek apakah player KO (HP <= 0)
   * @returns {boolean}
   */
  isKO() {
    return this.hp <= 0;
  }

  /**
   * Reset player ke kondisi awal (full HP, idle state)
   */
  reset() {
    this.hp = this.maxHp;
    this.state = 'idle';
    this.hitbox = null;
    this.attackTimer = 0;
    this.flashRed = false;
    this.flashTimer = 0;
    this.hasHit = false;
    this.facing = (this.name === 'p1') ? 1 : -1;
  }

  /**
   * Mendapatkan hitbox jika player sedang attacking
   * @returns {{x: number, y: number, width: number, height: number} | null}
   */
  getHitbox() {
    return this.hitbox;
  }

  /**
   * Mendapatkan hurtbox (area tubuh player)
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  getHurtbox() {
    return {
      x: this.sprite.x - this.sprite.width / 2,
      y: this.sprite.y - this.sprite.height / 2,
      width: this.sprite.width,
      height: this.sprite.height,
    };
  }

  /**
   * Panggil setiap frame dari scene.update()
   * @param {number} time - Waktu game (ms)
   * @param {number} delta - Delta waktu frame (ms)
   */
  update(time, delta) {
    const dt = delta / 1000; // konversi ms ke detik

    // Handle combat keys
    if (this.keys.attack.isDown && this.state === 'idle') {
      this.startAttack();
    }

    if (this.keys.block.isDown && this.state !== 'attacking') {
      if (this.state !== 'blocking') {
        this.startBlock();
      }
    } else if (this.state === 'blocking') {
      this.stopBlock();
    }

    // Movement hanya jika tidak blocking
    if (this.state !== 'blocking') {
      if (this.keys.left.isDown) {
        this.sprite.x -= this.speed * dt;
        this.facing = -1;
      }
      if (this.keys.right.isDown) {
        this.sprite.x += this.speed * dt;
        this.facing = 1;
      }
    }

    // Clamp ke arena 800x600 (dengan margin 20px untuk half-width player)
    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, 20, 780);

    // Attack timer: update hitbox position selama attacking
    if (this.state === 'attacking') {
      this.attackTimer += delta;
      // Update hitbox position mengikuti player
      this.hitbox.x = this.facing === 1
        ? this.sprite.x + HITBOX_OFFSET
        : this.sprite.x - HITBOX_OFFSET - HITBOX_WIDTH;
      this.hitbox.y = this.sprite.y - HITBOX_HEIGHT / 2;

      if (this.attackTimer >= ATTACK_DURATION) {
        this.hitbox = null;
        this.state = 'idle';
      }
    }

    // Flash timer
    if (this.flashRed) {
      this.flashTimer += delta;
      if (this.flashTimer >= FLASH_DURATION) {
        this.flashRed = false;
        this.flashTimer = 0;
      }
    }
  }
}

// Support Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Player;
}