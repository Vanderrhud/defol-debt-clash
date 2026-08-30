# ⚔️ Combat System & Rules

## 1. Input Layout (Mobile Touchscreen)
Layout dirancang ergonomis untuk jempol di layar landscape:

* **Sisi Kiri (Navigasi):**
  * Virtual Thumbstick / 4-Way D-Pad:
    * `Kiri / Kanan`: Bergerak maju / mundur (Mundur saat diserang = **Block**).
    * `Atas`: Lompat.
    * `Bawah`: Jongkok (Crouch).
    * `Double Tap Kiri/Kanan`: Dash maju / Back-dash menghindar.

* **Sisi Kanan (Action Cluster):**
  * `[A] Light Attack`: Serangan cepat jarak dekat. Frame start-up cepat, damage kecil, pembuka combo.
  * `[B] Heavy Attack`: Serangan senjata berbobot. Frame lambat, damage tinggi, efek knockback/stagger.
  * `[S] Special Skill`: Jurus khas karakter (memiliki cooldown singkat 3-5 detik).
  * `[ULT] Absurd Overclock`: Tombol super besar di pojok kanan bawah. Menyala saat *Bunga Meter* terisi 100%.

---

## 2. Sistem Bar Pertarungan
1. **Health Bar (HP):**
   * Total HP tiap karakter: 1000 HP.
   * HP mencapai 0 = K.O.

2. **Bunga Meter (Interest Gauge - Super Bar):**
   * Kapasitas: 100 poin.
   * **Pengisian:**
     * Menghasilkan hit sukses ke musuh: +3 poin per hit.
     * Menerima damage dari musuh: +5 poin per hit (mekanik *comeback*).
     * Melakukan Block sukses: +2 poin.
   * **Penggunaan:**
     * **50 Poin (EX Skill):** Modifikasi tombol `[S]` menjadi versi bertenaga (damage +50%, efek unblockable/knockdown).
     * **100 Poin (Absurd Ultimate):** Menekan tombol `[ULT]` memicu cutscene sinematik jurus absurd over-the-top yang menguras ~400-500 HP lawan jika kena.
