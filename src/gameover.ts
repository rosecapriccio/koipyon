import { MyScene } from "./index";
import { saveScore, getTopScores } from "./firebase";
import { loginAnonymously } from "./firebase";

export class gameover extends Phaser.Scene {
  constructor() {
    super("gameover");
  }

  private scene1: MyScene;
  private scoretext: Phaser.GameObjects.Text;
  preload() {
    // アセット読み込み
    //this.load.image("candy", "assets/sweets_candy.png");
    this.load.image("koitofall", "./assets/koitofall.png");
    this.load.image("button03", "./assets/bptann03.png");
    this.load.image("gover", "./assets/gameover.png");
  }
  create(data: any) {
    //this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBackgroundColor("#fffaf0");

    const { width, height } = this.game.canvas;
    // 画面を埋めるようなZoneを作成

    const candy1 = this.add.image(width / 2 - 30, 480, "koitofall");
    candy1.setDisplaySize(680, 965);

    this.scene1 = this.scene.get("MyScene") as MyScene;
    let val = this.scene1;

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

    // this.add
    //   .text(width / 2, 80, "ゲームオーバー")
    //   .setOrigin(0.5, 0.5)
    //   .setFontSize(50)
    //   .setFill("000000");

    this.add.image(width / 2, 70, "gover");
    //.setDisplaySize(680, 965);

    this.add
      .text(width / 2, 930, "" + result + "プロデューサーさんですね！", {
        fontFamily: '"M PLUS Rounded 1c", sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setFontSize(35)
      .setFill("000000");

    this.scoretext = this.add
      .text(width / 2, 870, "Score: " + (data.score / 10).toFixed(0) + " mm", {
        fontFamily: '"M PLUS Rounded 1c", sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setFontSize(50)
      .setFill("000000");

    const zone = this.add.zone(width / 2, 1050, 400, 100);
    //this.add.rectangle(width / 2, 1050, 400, 100, 0xff0000);
    this.add.image(width / 2, 1050, "button03");
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
        },
      );
    });

    // const showRanking = async () => {
    //   const topScores: any[] = await getTopScores(5); // 上位5件取得

    //   let rankingText = "--- TOP 5 ---\n";
    //   topScores.forEach((data, index) => {
    //     rankingText += `${index + 1}. ${data.name} : ${data.score} mm\n`;
    //   });

    //   this.add
    //     .text(width / 2, 300, rankingText)
    //     .setOrigin(0.5)
    //     .setFontSize(24)
    //     .setFill("#000000")
    //     .setAlign("center");
    // };

    // // テスト用：ボタンを押したら即座にダミーデータを送信
    // const testButton = this.add
    //   .text(width / 2, 700, "【テスト送信】")
    //   .setOrigin(0.5)
    //   .setFontSize(24)
    //   .setInteractive({ useHandCursor: true });

    // testButton.on("pointerdown", async () => {
    //   console.log("テスト送信開始...");

    //   const dummyName = "プロデューサー候補生";
    //   const dummyScore = data.score; // MySceneから渡ってきた実際のスコア

    //   const success = await saveScore(dummyName, dummyScore);

    //   if (success) {
    //     console.log("Firebaseへの保存に成功しました！");
    //     testButton.setText("送信成功！コンソールを確認してください");
    //     // 1. 入力欄や送信ボタンを消す（または薄くする）

    //     // 2. 「登録完了！」などのメッセージを出す
    //     const msg = this.add
    //       .text(width / 2, 750, "ランキングに登録しました！")
    //       .setOrigin(0.5);

    //     // 3. ランキングを表示する
    //     await showRanking(); // ここで呼び出す！
    //   } else {
    //     console.log("保存に失敗しました。");
    //     testButton.setText("送信失敗...");
    //   }
    // });

    const checkRankIn = async () => {
      const topScores = await getTopScores(20);

      // まだデータが20件ない場合、または今回のスコアが20位のスコア以上の場合
      const isRankIn =
        topScores.length < 20 ||
        data.score >= (topScores[topScores.length - 1] as any).score;

      if (isRankIn) {
        const bgWidth = 540;
        const bgHeight = 220;
        const bgX = width / 2 - bgWidth / 2;
        const bgY = 580; // フォーム全体の表示位置に合わせる

        const formBg = this.add.graphics();
        formBg.fillStyle(0xffffff, 0.85); // 純白（ffffff）を不透明度85%で
        formBg.fillRoundedRect(bgX, bgY, bgWidth, bgHeight, 15); // 角丸半径15px
        formBg.setDepth(0);

        this.add
          .text(width / 2, 620, "ランクイン！名前を入力してください", {
            fontFamily: '"M PLUS Rounded 1c"',
            fontSize: "28px",
            color: "#1a2248",
          })
          .setOrigin(0.5);

        const counter = this.add
          .text(width / 2 + 190, 680, `0/8`, {
            fontSize: "18px",
            color: "#698aff",
          })
          .setOrigin(0, 0.5);

        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.placeholder = "プロデューサー名を入力";
        inputElement.maxLength = 8;

        inputElement.addEventListener("input", () => {
          counter.setText(`${inputElement.value.length}/8`);
          if (inputElement.value.length >= inputElement.maxLength) {
            counter.setColor("#ff0000");
          } else {
            counter.setColor("#696cff");
          }
        });

        Object.assign(inputElement.style, {
          width: "350px",
          height: "50px",
          fontSize: "24px",
          textAlign: "center",
          borderRadius: "10px",
          border: "2px solid #7369ff",
          backgroundColor: "#ffffff",
          color: "#333333",
          fontFamily: '"M PLUS Rounded 1c", sans-serif',
        });

        const domInput = this.add.dom(width / 2, 680, inputElement);
        const sendBtn = this.add
          .text(width / 2, 750, "【ランキングに登録】", {
            fontFamily: '"M PLUS Rounded 1c", sans-serif',
            fontSize: "32px",
            color: "#ffffff",
            backgroundColor: "#3952c0",
            padding: { x: 20, y: 10 },
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        sendBtn.on("pointerdown", async () => {
          loginAnonymously();

          const name = inputElement.value.trim();

          if (name === "") {
            alert("名前を入力してください！");
            return;
          }

          sendBtn.disableInteractive();
          sendBtn.setText("送信中...");

          const success = await saveScore(name, data.score);

          if (success) {
            sendBtn.setText("登録完了！");
            domInput.setVisible(false);

            this.time.delayedCall(2000, () => {
              this.scene.start("rankingscene");
            });
          } else {
            sendBtn.setText("通信失敗... ごめんなさい...");
            sendBtn.setInteractive();
          }
        });
      } else {
      }
    };

    checkRankIn();
  }
}
