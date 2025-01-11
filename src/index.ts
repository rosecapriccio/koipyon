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
    this.load.image("koito", "./assets/koito.png");
  }

  create() {
    // 画面中央に画像とテキストを配置
    this.add.image(400, 300, "back");
    this.player = this.physics.add.sprite(400, 300, "koito");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(60, 60);

    //地面の作成
    const grounds = this.physics.add.staticGroup();
    grounds.create(100, 100, "ground");
    grounds.create(300, 550, "ground");
    grounds.create(500, 100, "ground");
    grounds.create(700, 550, "ground");

    this.physics.add.collider(this.player, grounds); // 衝突処理を設定する

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("witch", { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("witch", { start: 3, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("witch", { start: 6, end: 8 }),
      frameRate: 5,
      repeat: -1,
    });

    //this.player.anims.play("left", true);
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    //左キーが押された時
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-100);
      //this.player.anims.play("left", true);
    }
    //右キーが押された時
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(100);
      //this.player.anims.play("right", true);
    }
    //キーが押されていない時
    else {
      this.player.setVelocityX(0);
    }
    //上キーが押されたらジャンプ（接地しているときのみ）
    if (this.player.body.touching.down) {
      this.player.setVelocityY(-600);
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  //pixelArt: true,
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
      debug: false, // true にすることで衝突検知の範囲を画面に表示します。
    },
  },
  scene: MyScene, // 変更
};

new Phaser.Game(config);
