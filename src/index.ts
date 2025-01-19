import * as Phaser from "phaser";

//import { Scenes } from "./scene"; // 追加

// MySceneはもう使わないので削除

class MyScene extends Phaser.Scene {
  constructor() {
    // Phaser.Sceneのコンストラクタにはstringかオブジェクト（Phaser.Types.Scenes.SettingsConfig）を渡す
    // 以下は { key: 'myscene' } を渡したのと同義になる
    super("myscene");
  }
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private WORLD_SIZE_X = 450;
  private WORLD_SIZE_Y = 20000;
  private background: Phaser.GameObjects.TileSprite;
  private scoretext: Phaser.GameObjects.Text;

  preload() {
    // アセット読み込み
    this.load.image("back", "assets/back.png");

    //魔法使い
    this.load.spritesheet("witch", "assets/witch.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    //地面の画像
    this.load.image("ground", "assets/ground.png");
    this.load.image("koito", "./assets/koitoooo.png");
  }

  create() {
    // 画面中央に画像とテキストを配置
    //this.add.image(400, 300, "back");
    //this.background = this.add.tileSprite(225, 400, 450, 800, "back");

    //地面の作成
    const grounds = this.physics.add.staticGroup();
    grounds.create(0, 0, "ground");
    for (let i = 100; i < this.WORLD_SIZE_Y; i = i + 250) {
      const randomValue = Math.random();
      grounds.create(300 * randomValue, i, "ground");
    }

    this.player = this.physics.add.sprite(
      this.WORLD_SIZE_X / 2,
      this.WORLD_SIZE_Y - 300,
      "koito"
    );

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    //this.player.setDisplaySize(100, 117);
    this.player.setSize(80, 28).setOffset(38, 130);
    this.player.setMaxVelocity(1500);

    this.physics.add.overlap(this.player, grounds); // 衝突処理を設定する

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("witch", { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("koito", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("koito", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.WORLD_SIZE_X, this.WORLD_SIZE_Y);
    this.physics.world.setBounds(0, 0, this.WORLD_SIZE_X, this.WORLD_SIZE_Y);

    this.scoretext = this.add.text(12, 12, "Score: 0", {
      font: "24px",
    });

    //this.player.anims.play("left", true);
    this.cursors = this.input.keyboard!.createCursorKeys();
    //this.input.mouse!.capture = true;
  }

  update() {
    //this.background.tilePositionY;
    this.scoretext.text =
      "Score: " + (this.WORLD_SIZE_Y - this.player.y).toFixed(0);
    this.scoretext.y = this.player.y - 350;

    var pointer = this.input.activePointer;
    if (pointer.isDown) {
      // 左移動
      if (pointer.x < this.WORLD_SIZE_X / 2) {
        this.player.setVelocityX(-160);
        //this.player.anims.play("left", true);
      }
      // 右移動
      else if (this.WORLD_SIZE_X / 2 < pointer.x) {
        this.player.setVelocityX(160);
        //this.player.anims.play("right", true);
      }
    } else {
      this.player.setVelocityX(0);
    }
    // //左キーが押された時
    // if (this.cursors.left.isDown) {
    //   this.player.setVelocityX(-100);
    //   //this.player.anims.play("left", true);
    // }
    // //右キーが押された時
    // else if (this.cursors.right.isDown) {
    //   this.player.setVelocityX(100);
    //   //this.player.anims.play("right", true);
    // }
    // //キーが押されていない時
    // else {
    //   this.player.setVelocityX(0);
    // }
    //上キーが押されたらジャンプ（接地しているときのみ）
    console.log(this.player.body.angle);
    if (this.player.body.touching.down && this.player.body.angle > 0) {
      this.player.setVelocityY(-750);
    } else {
      this.player.setAccelerationY(400);
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  backgroundColor: "#add8e6", // 背景色
  render: {
    //pixelArt: true,
    antialias: true,
    antialiasGL: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  //resolution: window.devicePixelRatio,
  parent: "game-app",
  physics: {
    default: "arcade", // ここでarcadeを指定します。
    arcade: {
      gravity: { x: 0, y: 600 }, // y:重力
      debug: true, // true にすることで衝突検知の範囲を画面に表示します。
    },
  },
  scene: MyScene, // 変更
};

new Phaser.Game(config);
