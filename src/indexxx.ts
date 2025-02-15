import * as Phaser from "phaser";
import { topscreen } from "./topscreen";
import { gameover } from "./gameover";

//import { Scenes } from "./scene"; // 追加

// MySceneはもう使わないので削除

interface Stage {
  x: number;
  type: number;
  velox: number;
}

class MyScene extends Phaser.Scene {
  constructor() {
    // Phaser.Sceneのコンストラクタにはstringかオブジェクト（Phaser.Types.Scenes.SettingsConfig）を渡す
    // 以下は { key: 'myscene' } を渡したのと同義になる
    super("myscene");
  }
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private WORLD_SIZE_X = 1500;
  private WORLD_SIZE_Y = 1200;
  private blockGroup: Phaser.Physics.Arcade.StaticGroup;
  private candy: Phaser.Physics.Arcade.Group;
  private isRotated = 0;

  preload() {
    // アセット読み込み
    this.load.image("candy", "assets/trampoline.png");

    //魔法使い
    this.load.spritesheet("koitoga", "assets/koitoga.png", {
      frameWidth: 282,
      frameHeight: 330,
    });
    //地面の画像
    this.load.image("stage", "assets/ground.png");
    this.load.image("koito", "./assets/koitogame.png");
    this.load.image("koitore", "./assets/koitogamere.png");
  }

  create() {
    this.blockGroup = this.physics.add.staticGroup(); // groupの生成と要素の追加を同時に行う場合
    this.blockGroup
      .create(750, 700, "candy")
      .setSize(100, 30)
      .setOffset(180, 105);

    this.player = this.physics.add.sprite(100, 100, "koitoga");

    this.player.setBounce(0.2);
    //this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(141, 165);
    this.player.setSize(140, 30).setOffset(71, 300);
    //this.player.setSize(205, 330).setOffset(35, 0);
    this.player.setMaxVelocity(1500);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("koitoga", { start: 0, end: 0 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("koitoga", { start: 1, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.player.anims.play("left", true);
    //this.player.setMaxVelocity(200, 400);
    this.player.setCollideWorldBounds(true);

    this.physics.world.setBounds(0, 0, this.WORLD_SIZE_X, this.WORLD_SIZE_Y);

    //const candy1 = this.add.image(800, 160, "candy");

    this.physics.add.overlap(this.player, this.blockGroup); // 衝突処理を設定す
    //candy1.setDisplaySize(95, 120);

    // const rect1 = this.add.rectangle(0, 1100, 1000, 1000, 0xc7915a);
    // const rect2 = this.add.rectangle(1450, 1100, 800, 1000, 0xc7915a);
    // //const rect3 = this.add.rectangle(450, 530, 150, 30, 0xc7915a);
    // this.blockGroup = this.physics.add.staticGroup([rect1, rect2]); // groupの生成と要素の追加を同時に行う場合
    // //this.blockGroup.add(candy1); // 要素を追加する場合はaddまたはaddMultipleメソッドを使う
    // this.blockGroup.create(750, 450, "stage");

    // this.physics.add.collider(this.player, this.blockGroup);

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    // プレイヤーの移動速度を0に
    this.player.setVelocityX(0);

    // 左右のキーに合わせて移動
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    }

    // ジャンプ（プレイヤーが地面に接地しているときのみジャンプ可能）
    if (this.cursors.space.isDown || this.cursors.up.isDown) {
      this.player.setVelocityY(-1000);
    } else if (this.player.body.touching.down && this.player.body.angle > 0) {
      this.player.setVelocityY(-400);
      this.isRotated++;
    } else {
      this.player.setAccelerationY(300);
    }
    if (3 == this.isRotated) {
      this.player.angle -= 6;
      if (0 == Math.round(this.player.angle) % 360) {
        this.isRotated = 0;
        this.player.angle = 0;
      }
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1500,
  height: 1200,
  backgroundColor: "#ffffff", // 背景色
  render: {
    //pixelArt: true,
    //antialias: true,
    //antialiasGL: true,
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
      gravity: { x: 0, y: 300 }, // y:重力
      debug: false, // true にすることで衝突検知の範囲を画面に表示します。
    },
  },
  scene: [MyScene],
};

new Phaser.Game(config);
