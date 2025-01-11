export class EndingScene extends Phaser.Scene {
  constructor() {
    super("ending");
  }

  create() {
    const { width, height } = this.game.canvas;

    this.add.image(width / 2, height / 2, "logo");
    this.add.text(width / 2, height / 2 + 60, "おわり").setOrigin(0.5);
    this.add
      .text(
        width / 2,
        height / 2 + 80,
        "背景:[Cyberpunk Street Environment] by Luis Zuno @ansimuz"
      )
      .setOrigin(0.5);

    const zone = this.add.zone(width / 2, height / 2, width, height);
    zone.setInteractive({
      useHandCursor: true,
    });
    zone.on("pointerdown", () => {
      this.scene.start("title"); // TitleSceneに遷移
    });
  }
}
