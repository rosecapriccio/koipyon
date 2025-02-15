import { MyScene } from "./index";
import txt from "./index";

export class gameover extends Phaser.Scene {
  constructor() {
    super("gameover");
  }

  private scene1: MyScene;
  private scoretext: Phaser.GameObjects.Text;

  create(data: any) {
    //this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBackgroundColor("#fffaf0");
    this.scene1 = this.scene.get("MyScene") as MyScene;
    let val = this.scene1;

    const { width, height } = this.game.canvas;
    // 画面を埋めるようなZoneを作成

    let result: string = "";
    if (data.score < 5000) {
      result = "ダメダメ";
    } else if (data.score < 20000) {
      result = "まあまあ";
    } else if (data.score < 50000) {
      result = "すごすご";
    } else {
      result = "はなまる";
    }

    this.add
      .text(width / 2, 80, "ゲームオーバー")
      .setOrigin(0.5, 0.5)
      .setFontSize(50)
      .setFill("000000");

    this.add
      .text(width / 2, 880, "" + result + "プロデューサーさんですね！")
      .setOrigin(0.5, 0.5)
      .setFontSize(35)
      .setFill("000000");

    this.scoretext = this.add
      .text(width / 2, 800, "Score: " + data.score.toFixed(0) + " mm")
      .setOrigin(0.5, 0.5)
      .setFontSize(50)
      .setFill("000000");

    const zone = this.add.zone(width / 2, 1020, 400, 80);
    this.add.rectangle(width / 2, 1020, 400, 100, 0xff0000);
    // Zoneをクリックできるように設定
    zone.setInteractive({
      useHandCursor: true, // マウスオーバーでカーソルが指マークになる
    });

    // ZoneをクリックしたらMainSceneに遷移
    // zone.on("pointerdown", () => {
    //   this.scene.start("topscreen");
    // });

    zone.on("pointerdown", () => {
      zone.removeInteractive();
      this.cameras.main.fadeOut(1200, 0, 0, 0);
      // このシーンが完全にフェードアウトしてから次のシーンをstartする
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("topscreen");
        }
      );
    });
  }
}
