export class topscreen extends Phaser.Scene {
  constructor() {
    super("topscreen");
  }
  private mode2 = false;
  private count = 0;
  preload() {
    // アセット読み込み
    //this.load.image("candy", "assets/sweets_candy.png");
    this.load.image("title", "./assets/title.png");
    this.load.image("fukidashi", "./assets/fukidashi.png");
    this.load.image("button01", "./assets/bptann01.png");
    this.load.image("button02", "./assets/bptann02.png");
    this.load.image("button04", "./assets/bptann04.png");
    this.load.image("angry", "./assets/angry.png");
  }
  create() {
    this.count = 0;
    this.mode2 = false;
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBackgroundColor("#fffaf0");
    //this.add.text(400, 300, "だめだよ").setOrigin(0.5, 0.5).setFontSize(30);

    const candy1 = this.add.image(345, 530, "title");
    candy1.setDisplaySize(714, 1080);

    const { width, height } = this.game.canvas;
    // 画面を埋めるようなZoneを作成
    const zone1 = this.add.zone(width / 2, height / 2 + 230, 400, 80);
    const zone2 = this.add.zone(width / 2, height / 2 + 350, 400, 80);
    const zone3 = this.add.zone(width / 2 + 10, height / 2 - 30, 180, 240);
    const zone4 = this.add.zone(150, 450, 100, 100);
    const zone5 = this.add.zone(width / 2, height / 2 + 470, 400, 80); // zone2の下あたりに配置

    //this.add.rectangle(150, 450, 100, 100, 0x6495ed);

    //this.add.rectangle(width / 2, height / 2 + 420, 400, 80, 0x6495ed);
    this.add.image(width / 2, height / 2 + 230, "button01");
    this.add.image(width / 2, height / 2 + 350, "button02");
    //this.add.rectangle(width / 2 + 10, height / 2 - 30, 180, 240, 0x6495ed);
    this.add.image(width / 2, height / 2 + 470, "button04");

    this.add
      .text(570, 40, "Ver.1.1.0")
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
      useHandCursor: true,
    });

    // Zoneをクリックできるように設定
    zone2.setInteractive({
      useHandCursor: true,
    });

    // Zoneをクリックできるように設定
    zone3.setInteractive({
      useHandCursor: true,
    });

    zone5.setInteractive({ useHandCursor: true });

    zone1.on("pointerdown", () => {
      zone1.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          const data = { mode: this.mode2 };
          this.scene.start("myscene", data);
        },
      );
    });

    zone2.on("pointerdown", () => {
      zone2.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("howto");
        },
      );
    });

    zone3.on("pointerdown", () => {
      let chat = "";
      this.mode2 = true;

      //zone3.removeInteractive();
      const fukidashi1 = this.add.image(150, 460, "fukidashi");
      fukidashi1.setDisplaySize(200, 160);

      if (this.count++ < 20) {
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
      } else {
        chat = "";
        zone4.setInteractive({
          useHandCursor: true,
        });
        this.add.image(150, 450, "angry").setDisplaySize(90, 90);
      }

      this.add
        .text(150, 455, chat)
        .setOrigin(0.5, 0.5)
        .setFontSize(24)
        .setFill("000000");
    });

    zone4.on("pointerdown", () => {
      zone4.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("myscene2");
        },
      );
    });

    zone5.on("pointerdown", () => {
      zone5.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("rankingscene"); // ランキングシーンへ
        },
      );
    });

    this.add
      .text(
        width / 2,
        height - 50,
        "本サイトは『アイドルマスターシャイニーカラーズ』の非公式二次創作ゲームです。\n公式および関係企業様とは一切関係ありません。",
        {
          fontFamily: '"M PLUS Rounded 1c", sans-serif',
          fontSize: "13px",
          color: "#888888",
          align: "center",
          lineSpacing: 6,
        },
      )
      .setOrigin(0.5);
  }
}
