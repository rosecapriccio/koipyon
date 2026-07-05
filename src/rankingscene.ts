import { getTopScores } from "./firebase";

export class rankingscene extends Phaser.Scene {
  constructor() {
    super("rankingscene");
  }

  preload() {
    this.load.image("button03", "./assets/bptann03.png");
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBackgroundColor("#fffaf0");
    const { width, height } = this.game.canvas;

    this.add
      .text(width / 2, 70, "〜TOP 15 プロデューサーさん〜", {
        fontFamily: '"M PLUS Rounded 1c", sans-serif',
        fontSize: "40px",
        color: "#2c447e",
        fontStyle: "bold",
        stroke: "#ffffff",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setShadow(0, 4, "rgba(44, 68, 126, 0.2)", 4, true, true);

    const loadingText = this.add
      .text(width / 2, height / 2, "Loading...", {
        fontFamily: '"M PLUS Rounded 1c", sans-serif',
        fontSize: "28px",
        color: "#888888",
      })
      .setOrigin(0.5);

    this.loadRanking(loadingText);

    const btnY = height - 100;
    this.add.image(width / 2, btnY, "button03");

    const zone = this.add.zone(width / 2, btnY, 400, 100);
    zone.setInteractive({ useHandCursor: true });
    zone.on("pointerdown", () => {
      zone.removeInteractive();
      this.scene.start("topscreen");
    });
  }

  async loadRanking(loadingText: Phaser.GameObjects.Text) {
    const { width } = this.game.canvas;
    const scores = await getTopScores(15);
    loadingText.destroy();

    scores.forEach((data: any, i: number) => {
      const y = 170 + i * 58;

      let baseStyle = {
        fontFamily: '"M PLUS Rounded 1c", sans-serif',
        fontSize: "26px",
        color: "#4a4a4a",
        fontStyle: "bold",
        stroke: "#ffffff",
        strokeThickness: 4,
      };

      let rankText = `${i + 1}.`;

      if (i === 0) {
        rankText = "👑 1.";
        baseStyle.color = "#d99b00";
        baseStyle.fontSize = "28px";
        baseStyle.strokeThickness = 6;
      } else if (i === 1) {
        rankText = "🥈 2.";
        baseStyle.color = "#7f8c8d";
        baseStyle.fontSize = "28px";
        baseStyle.strokeThickness = 6;
      } else if (i === 2) {
        rankText = "🥉 3.";
        baseStyle.color = "#a0522d";
        baseStyle.fontSize = "28px";
        baseStyle.strokeThickness = 6;
      }

      this.add.text(width / 2 - 270, y, rankText, baseStyle).setOrigin(0, 0.5);

      this.add.text(width / 2 - 180, y, data.name, baseStyle).setOrigin(0, 0.5);

      const scoreTxt = this.add
        .text(
          width / 2 + 270,
          y,
          `${(data.score / 10).toFixed(0)} mm`,
          baseStyle,
        )
        .setOrigin(1, 0.5);

      if (i < 3) {
        scoreTxt.setShadow(0, 2, "rgba(0,0,0,0.15)", 2, true, true);
      }
    });
  }
}
