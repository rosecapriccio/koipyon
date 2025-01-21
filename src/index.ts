import * as Phaser from "phaser";

//import { Scenes } from "./scene"; // 追加

// MySceneはもう使わないので削除

interface Stage {
  x: number;
  type: number;
}

class MyScene extends Phaser.Scene {
  constructor() {
    // Phaser.Sceneのコンストラクタにはstringかオブジェクト（Phaser.Types.Scenes.SettingsConfig）を渡す
    // 以下は { key: 'myscene' } を渡したのと同義になる
    super("myscene");
  }
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private WORLD_SIZE_X = 675;
  private WORLD_SIZE_Y = 3000;
  private background: Phaser.GameObjects.TileSprite;
  private scoretext: Phaser.GameObjects.Text;
  private _stage?: Phaser.Physics.Arcade.Group;
  private stageinfo: Stage[] = [];

  preload() {
    // アセット読み込み
    this.load.image("back", "assets/back.png");

    //魔法使い
    this.load.spritesheet("witch", "assets/witch.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    //地面の画像
    this.load.image("stage", "assets/grounds.png");
    this.load.image("koito", "./assets/koitogama.png");
    this.load.image("koitore", "./assets/koitogamere.png");
  }

  create() {
    // 画面中央に画像とテキストを配置
    //this.add.image(400, 300, "back");
    //this.background = this.add.tileSprite(225, 400, 450, 800, "back");

    //地面の作成
    // const grounds = this.physics.add.staticGroup();
    // grounds.create(0, 0, "ground");
    // for (let i = 100; i < this.WORLD_SIZE_Y; i = i + 125) {
    //   const randomValue = Math.random();
    //   grounds.create(this.WORLD_SIZE_X * randomValue, i, "ground");
    // }

    // マップに配置する「動的」な星オブジェクトを作成
    this._stage = this.physics.add.group({
      key: "stage",
      repeat: 24,
      setXY: { x: Math.random() * this.WORLD_SIZE_X, y: 3000, stepY: -125 },
    });
    this._stage.children.iterate((s, index) => {
      const stage = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      stage.setImmovable(true);
      stage.body.allowGravity = false;
      const randomValue = Math.random();
      stage.x = randomValue * this.WORLD_SIZE_X;
      console.log(index, stage.x, stage.y);
      let stagetemp: Stage = {
        x: stage.x,
        type: 1,
      };
      this.stageinfo.push(stagetemp);
      return true;
    });

    console.log(this.stageinfo);

    this.player = this.physics.add.sprite(
      this.WORLD_SIZE_X / 2,
      this.WORLD_SIZE_Y - 300,
      "koito"
    );

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(141, 165);
    this.player.setSize(140, 30).setOffset(71, 300);
    this.player.setMaxVelocity(1500);

    this.physics.add.overlap(this.player, this._stage); // 衝突処理を設定する

    this.anims.create({
      key: "left",
      frames: "koito",
    });
    this.anims.create({
      key: "right",
      frames: "koitore",
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
    // this.scoretext.text =
    //   "Score: " + (this.WORLD_SIZE_Y - this.player.y).toFixed(0);
    this.scoretext.text = "Score: " + this.player.y.toFixed(0);
    this.scoretext.y = this.player.y - 350;

    var pointer = this.input.activePointer;
    if (pointer.isDown) {
      // 左移動
      if (pointer.x < this.WORLD_SIZE_X / 2) {
        if (this.player.body.velocity.x <= -200) {
          this.player.setVelocityX(this.player.body.velocity.x - 5);
        } else {
          this.player.setVelocityX(-200);
        }
        //this.player.anims.play("left", true);
      }
      // 右移動
      else if (this.WORLD_SIZE_X / 2 < pointer.x) {
        if (this.player.body.velocity.x >= 200) {
          this.player.setVelocityX(this.player.body.velocity.x + 5);
        } else {
          this.player.setVelocityX(200);
        }
        //this.player.anims.play("right", true);
      }
    } else {
      if (this.player.body.velocity.x > 0) {
        this.player.setVelocityX(this.player.body.velocity.x - 10);
        if (this.player.body.velocity.x < 0) {
          this.player.setVelocityX(0);
        }
      } else if (this.player.body.velocity.x < 0) {
        this.player.setVelocityX(this.player.body.velocity.x + 10);
        if (this.player.body.velocity.x > 0) {
          this.player.setVelocityX(0);
        }
      }
      //this.player.setVelocityX(0);
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
    if (this.player.y < 1000) {
      this.player.y = 2000;
      // let i = 23;
      // this._stage!.children.iterate((s, index) => {
      //   const stage = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      //   if (0 <= i && i < 8) {
      //     const randomValue = Math.random();
      //     stage.x = randomValue * this.WORLD_SIZE_X;
      //     let stagetemp: Stage = {
      //       x: stage.x,
      //       type: 1,
      //     };
      //     this.stageinfo[i] = stagetemp;
      //   } else if (8 <= i && i < 24) {
      //     stage.x = this.stageinfo[i - 8].x;
      //     this.stageinfo[i] = this.stageinfo[i - 8];
      //   }
      //   i--;
      //   console.log(index, stage.x, stage.y);
      //   return true;
      // });
      this._stage!.children.iterate((s, index) => {
        const stage = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        if (17 <= index && index < 25) {
          const randomValue = Math.random();
          stage.x = randomValue * this.WORLD_SIZE_X;
          let stagetemp: Stage = {
            x: stage.x,
            type: 1,
          };
          this.stageinfo[index] = stagetemp;
          console.log(index, stage.x, stage.y);
        } else if (1 <= index && index < 17) {
          stage.x = this.stageinfo[index + 8].x;
          this.stageinfo[index] = this.stageinfo[index + 8];
          console.log(index, stage.x, stage.y);
        }
        //console.log(index, stage.x, stage.y);
        return true;
      });
      // this._stage!.children.iterate((s, index) => {
      //   const stage = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      //   if (0 <= index && index < 8) {
      //     const randomValue = Math.random();
      //     stage.x = randomValue * this.WORLD_SIZE_X;
      //     let stagetemp: Stage = {
      //       x: stage.x,
      //       type: 1,
      //     };
      //     this.stageinfo[index] = stagetemp;
      //     console.log(index, stage.x, stage.y);
      //   } else if (8 <= index && index < 24) {
      //   }
      //   //console.log(index, stage.x, stage.y);
      //   return true;
      // });
      console.log(this.stageinfo);
    }

    //console.log(this.player.body.y);
    if (this.player.body.touching.down && this.player.body.angle > 0) {
      this.player.setVelocityY(-750);
    } else {
      this.player.setAccelerationY(400);
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 675,
  height: 1200,
  backgroundColor: "#add8e6", // 背景色
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
      gravity: { x: 0, y: 600 }, // y:重力
      debug: true, // true にすることで衝突検知の範囲を画面に表示します。
    },
  },
  scene: MyScene, // 変更
};

new Phaser.Game(config);
