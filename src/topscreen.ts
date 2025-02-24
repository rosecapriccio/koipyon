export class topscreen extends Phaser.Scene {
  constructor() {
    super("topscreen");
  }
  private mode2 = false;
  preload() {
    // アセット読み込み
    //this.load.image("candy", "assets/sweets_candy.png");
    this.load.image("title", "./assets/title.png");
    this.load.image("fukidashi", "./assets/fukidashi.png");
    this.load.image("button01", "./assets/bptann01.png");
    this.load.image("button02", "./assets/bptann02.png");
  }
  create() {
    this.mode2 = false;
    console.log(this.mode2);
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
    const zone3 = this.add.zone(width / 2 + 10, height / 2 - 30, 180, 240);

    const zone4 = this.add.zone(100, 100, 100, 100);
    this.add.rectangle(100, 100, 100, 100, 0x6495ed);

    //this.add.rectangle(width / 2, height / 2 + 420, 400, 80, 0x6495ed);
    this.add.image(width / 2, height / 2 + 270, "button01");
    this.add.image(width / 2, height / 2 + 420, "button02");
    //this.add.rectangle(width / 2 + 10, height / 2 - 30, 180, 240, 0x6495ed);

    this.add
      .text(570, 40, "Ver.1.0.0")
      .setOrigin(0.5, 0.5)
      .setFontSize(30)
      .setFill("000000");

    // this.add
    //   .text(width / 2, height / 2 + 270, "スタート")
    //   .setOrigin(0.5, 0.5)
    //   .setFontSize(30);
    // this.add
    //   .text(width / 2, height / 2 + 420, "あそびかた")
    //   .setOrigin(0.5, 0.5)
    //   .setFontSize(30);

    // Zoneをクリックできるように設定
    zone1.setInteractive({
      useHandCursor: true, // マウスオーバーでカーソルが指マークになる
    });

    // Zoneをクリックできるように設定
    zone2.setInteractive({
      useHandCursor: true, // マウスオーバーでカーソルが指マークになる
    });

    // Zoneをクリックできるように設定
    zone3.setInteractive({
      useHandCursor: true, // マウスオーバーでカーソルが指マークになる
    });

    // Zoneをクリックできるように設定
    zone4.setInteractive({
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
          const data = { mode: this.mode2 };
          console.log(data);
          this.scene.start("myscene", data);
        }
      );
    });

    zone2.on("pointerdown", () => {
      zone2.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);
      // このシーンが完全にフェードアウトしてから次のシーンをstartする
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("howto");
        }
      );
    });

    zone3.on("pointerdown", () => {
      let chat = "";
      let res = Math.random();
      if (res > 0.75) {
        chat = "ぴゃっ";
      } else if (res > 0.5) {
        chat = "だめだよ";
      } else if (res > 0.25) {
        chat = "えっへん";
      } else {
        chat = "ぴぇ...";
      }
      this.mode2 = true;
      //zone3.removeInteractive();
      const fukidashi1 = this.add.image(150, 460, "fukidashi");
      fukidashi1.setDisplaySize(200, 160);
      this.add
        .text(150, 455, chat)
        .setOrigin(0.5, 0.5)
        .setFontSize(24)
        .setFill("000000");
    });

    zone4.on("pointerdown", () => {
      zone4.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);
      // このシーンが完全にフェードアウトしてから次のシーンをstartする
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("myscene2");
        }
      );
    });
  }
}
