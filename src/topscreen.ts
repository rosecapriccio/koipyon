export class topscreen extends Phaser.Scene {
  constructor() {
    super("topscreen");
  }
  preload() {
    // アセット読み込み
    //this.load.image("candy", "assets/sweets_candy.png");
    this.load.image("title", "./assets/title.png");
  }
  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBackgroundColor("#fffaf0");
    //this.add.text(400, 300, "だめだよ").setOrigin(0.5, 0.5).setFontSize(30);

    const candy1 = this.add.image(345, 530, "title");
    candy1.setDisplaySize(714, 1080);

    const { width, height } = this.game.canvas;
    console.log(width, height);
    // 画面を埋めるようなZoneを作成
    const zone1 = this.add.zone(width / 2, height / 2 + 270, 400, 80);
    const zone2 = this.add.zone(width / 2, height / 2 + 420, 400, 80);

    this.add.rectangle(width / 2, height / 2 + 270, 400, 80, 0xff0000);
    this.add.rectangle(width / 2, height / 2 + 420, 400, 80, 0xff0000);

    // Zoneをクリックできるように設定
    zone1.setInteractive({
      useHandCursor: true, // マウスオーバーでカーソルが指マークになる
    });

    // Zoneをクリックできるように設定
    zone2.setInteractive({
      useHandCursor: true, // マウスオーバーでカーソルが指マークになる
    });

    // ZoneをクリックしたらMainSceneに遷移
    // zone.on("pointerdown", () => {
    //   this.scene.start("myscene");
    // });

    zone1.on("pointerdown", () => {
      zone1.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);
      // このシーンが完全にフェードアウトしてから次のシーンをstartする
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("myscene");
        }
      );
    });
  }
}
