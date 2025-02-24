export class howto extends Phaser.Scene {
  constructor() {
    super("howto");
  }

  preload() {
    // アセット読み込み
    this.load.image("button03", "./assets/bptann03.png");
    this.load.image("howtokoito", "./assets/howto.png");
  }

  create() {
    //this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBackgroundColor("#fffaf0");

    const { width, height } = this.game.canvas;
    // 画面を埋めるようなZoneを作成

    this.add
      .text(width / 2, 80, "遊び方")
      .setOrigin(0.5, 0.5)
      .setFontSize(50)
      .setFill("000000");

    const candy1 = this.add.image(width / 2, 550, "howtokoito");
    candy1.setDisplaySize(528, 770);

    const zone = this.add.zone(width / 2, 1030, 400, 100);
    //this.add.rectangle(width / 2, 1020, 400, 100, 0xff0000);
    this.add.image(width / 2, 1030, "button03");
    // Zoneをクリックできるように設定
    zone.setInteractive({
      useHandCursor: true, // マウスオーバーでカーソルが指マークになる
    });

    zone.on("pointerdown", () => {
      zone.removeInteractive();
      this.scene.start("topscreen");
    });
  }
}
