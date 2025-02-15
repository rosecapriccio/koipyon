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

let txt = "Hello";

export class MyScene extends Phaser.Scene {
  constructor() {
    // Phaser.Sceneのコンストラクタにはstringかオブジェクト（Phaser.Types.Scenes.SettingsConfig）を渡す
    // 以下は { key: 'myscene' } を渡したのと同義になる
    super("myscene");
  }
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private WORLD_SIZE_X = 675;
  private WORLD_SIZE_Y = 4000;
  private SCORETEXT_OFFSET_Y = 550;
  private background: Phaser.GameObjects.TileSprite;
  private score: integer;
  private loop: integer;
  private blinkcount: integer;
  private scoretext: Phaser.GameObjects.Text;
  private _stage?: Phaser.Physics.Arcade.Group;
  private stageinfo: Stage[] = [];

  private STAGE_TYPE = 5; // 1:normal 2:move 3:blink 4:broken 5:spring
  private isRotated = false;
  private isFollowedCamera = false;

  preload() {
    // アセット読み込み
    this.load.image("back", "assets/back.png");

    //魔法使い
    this.load.spritesheet("koitoga", "assets/koitoga.png", {
      frameWidth: 282,
      frameHeight: 330,
    });
    //地面の画像
    this.load.image("stage", "assets/grounds.png");
    this.load.spritesheet("stageall", "assets/groundsall.png", {
      frameWidth: 100,
      frameHeight: 25,
    });

    this.load.image("koito", "./assets/koitogame.png");
    this.load.image("koitore", "./assets/koitogamere.png");
  }

  create() {
    //this.cameras.main.fadeIn(1000, 0, 0, 0);

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

    this.anims.create({
      key: "stage1",
      frames: this.anims.generateFrameNumbers("stageall", { start: 0, end: 0 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "stage2",
      frames: this.anims.generateFrameNumbers("stageall", { start: 1, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "stage3",
      frames: this.anims.generateFrameNumbers("stageall", { start: 2, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "stage4",
      frames: this.anims.generateFrameNumbers("stageall", { start: 3, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "stage5",
      frames: this.anims.generateFrameNumbers("stageall", { start: 4, end: 4 }),
      frameRate: 5,
      repeat: -1,
    });

    this._stage = this.physics.add.group({
      key: "stageall",
      repeat: 24,
      setXY: { x: Math.random() * this.WORLD_SIZE_X, y: 3000, stepY: -125 },
    });

    // this._stage = this.physics.add.group();
    // for (let i = 0; i < 24; i++) {
    //   let stage = this.physics.add.sprite(
    //     Math.random() * this.WORLD_SIZE_X,
    //     3000 - 125 * i,
    //     "stageall"
    //   );
    //   this._stage.add(stage);
    // }

    this.stageinfo.splice(0);
    this._stage.children.iterate((s, index) => {
      const stage = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      //stage.setImmovable(true);
      stage.body.allowGravity = false;
      const randomValue = Math.random();
      stage.x = randomValue * this.WORLD_SIZE_X;
      //console.log(index, stage.x, stage.y);
      let stagetemp: Stage = {
        x: stage.x,
        type: Math.floor(Math.random() * this.STAGE_TYPE) + 1,
        velox: 0,
      };
      this.stageinfo.push(stagetemp);
      if (this.stageinfo[index].type == 2) {
        stage.setVelocityX(30);
        this.stageinfo[index].velox = stage.body.velocity.x;
      }
      console.log("stage" + this.stageinfo[index].type.toString());
      stage.anims.play("stage" + this.stageinfo[index].type.toString(), true);
      return true;
    });

    //console.log(this.stageinfo.length);

    this.player = this.physics.add.sprite(
      this.WORLD_SIZE_X / 2,
      this.WORLD_SIZE_Y - 2000,
      "koitoga"
    );

    this.player.setBounce(0.2);
    //this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(141, 165);
    this.player.setSize(140, 30).setOffset(71, 300);
    this.player.setMaxVelocity(1500);

    this.physics.add.overlap(this.player, this._stage); // 衝突処理を設定す

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

    this.cameras.main.startFollow(this.player);
    this.isFollowedCamera = true;
    this.cameras.main.setBounds(0, 0, this.WORLD_SIZE_X, this.WORLD_SIZE_Y);
    this.physics.world.setBounds(0, 0, this.WORLD_SIZE_X, this.WORLD_SIZE_Y);

    this.scoretext = this.add.text(12, 12, "Score: 0", {
      font: "24px",
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    //this.input.mouse!.capture = true;
    this.score = 0;
    this.loop = 0;
    this.blinkcount = 0;
  }

  update() {
    if (this.player.body.x < 0) this.player.body.x = 0;
    else if (this.player.body.x > this.WORLD_SIZE_X)
      this.player.body.x = this.WORLD_SIZE_X;

    //.log(this.player.body.velocity.y);
    this.blinkcount++;
    if (this.isFollowedCamera) {
      this.score = this.WORLD_SIZE_Y - this.player.y + 1000 * this.loop - 1900;
      if (this.score < 0) this.score = 0;
      this.scoretext.text = "Score: " + this.score.toFixed(0);
      this.scoretext.y = this.player.y - this.SCORETEXT_OFFSET_Y;
    }

    console.log(this.player.body.velocity.y);
    if (this.player.body.velocity.y > 1250) {
      this.cameras.main.stopFollow();
      this.player.setCollideWorldBounds(false);
      this.isFollowedCamera = false;
    }
    if (this.player.body.y > 5500) {
      //.log("bbbb");
      // this.cameras.main.fadeOut(1200, 0, 0, 0);
      // // このシーンが完全にフェードアウトしてから次のシーンをstartする
      // this.cameras.main.once(
      //   Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      //   () => {
      //     this.scene.start("gameover");
      //   }
      // );
      txt = this.scoretext.text;
      const data = { score: this.score };
      this.scene.restart();
      this.scene.start("gameover", data);
    }
    //this.background.tilePositionY;
    // this.scoretext.text =
    //   "Score: " + (this.WORLD_SIZE_Y - this.player.y).toFixed(0);

    var pointer = this.input.activePointer;
    if (pointer.isDown) {
      // 左移動
      if (pointer.x < this.WORLD_SIZE_X / 2) {
        if (this.player.body.velocity.x <= -200) {
          this.player.setVelocityX(this.player.body.velocity.x - 5);
        } else {
          this.player.setVelocityX(-200);
        }
        this.player.anims.play("left", true);
      }
      // 右移動
      else if (this.WORLD_SIZE_X / 2 < pointer.x) {
        if (this.player.body.velocity.x >= 200) {
          this.player.setVelocityX(this.player.body.velocity.x + 5);
        } else {
          this.player.setVelocityX(200);
        }
        this.player.anims.play("right", true);
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
    // 左右のキーに合わせて移動
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    }

    this._stage!.children.iterate((s, index) => {
      const stage = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      if (this.stageinfo[index].type == 2) {
        //console.log(index, this.stageinfo[index].type);
        if (stage.x > 575) {
          stage.setVelocityX(-30);
          this.stageinfo[index].velox = stage.body.velocity.x;
        } else if (stage.x < 100) {
          stage.setVelocityX(30);
          this.stageinfo[index].velox = stage.body.velocity.x;
        }
        this.stageinfo[index].x = stage.x;
      } else if (this.stageinfo[index].type == 3) {
        if (this.blinkcount < 150) {
          stage.x = this.stageinfo[index].x;
        } else if (this.blinkcount < 300) {
          if (this.blinkcount % 2 == 0) {
            stage.x = this.stageinfo[index].x;
          } else {
            stage.x = -500;
          }
        } else if (this.blinkcount < 420) {
          stage.x = -500;
        } else {
          this.blinkcount = 0;
        }
      }

      if (stage.y - this.player.y > 800 && !(17 <= index && index < 25)) {
        stage.x = -1000;
        this.stageinfo[index].x = stage.x;
        this.stageinfo[index].type = 1;
      }

      return true;
    });

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
      this.loop++;
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
            type: Math.floor(Math.random() * this.STAGE_TYPE) + 1,
            velox: 0,
          };
          this.stageinfo[index] = stagetemp;
          if (this.stageinfo[index].type == 2) {
            stage.setVelocityX(30);
            this.stageinfo[index].velox = stage.body.velocity.x;
          } else {
            stage.setVelocityX(0);
          }
          stage.anims.play(
            "stage" + this.stageinfo[index].type.toString(),
            true
          );
          //console.log(index, stage.x, stage.y);
        } else if (1 <= index && index < 17) {
          stage.x = this.stageinfo[index + 8].x;
          this.stageinfo[index] = this.stageinfo[index + 8];
          if (this.stageinfo[index].type == 2) {
            stage.setVelocityX(this.stageinfo[index].velox);
            //this.stageinfo[index].velox = stage.body.velocity.x;
          } else {
            stage.setVelocityX(0);
          }
          stage.anims.play(
            "stage" + this.stageinfo[index].type.toString(),
            true
          );
          //console.log(index, stage.x, stage.y);
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
      //console.log(this.stageinfo);
    }

    //console.log(this.player.body.y);
    if (this.player.body.touching.down && this.player.body.angle > 0) {
      let velo = -750;
      this._stage!.children.iterate((s, index) => {
        const stage = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        if (stage.body.touching.up) {
          //console.log(index, this.stageinfo[index].type);
          if (this.stageinfo[index].type == 4) {
            stage.x = -1000;
            this.stageinfo[index].x = stage.x;
          } else if (this.stageinfo[index].type == 5) {
            velo = -1030;
            this.isRotated = true;
            this.player.angle = 0;
          }
        }
        return true;
      });
      this.player.setVelocityY(velo);
    } else {
      this.player.setAccelerationY(400);
    }
    if (true == this.isRotated) {
      this.player.angle -= 6;
      if (0 == Math.round(this.player.angle) % 360) {
        this.isRotated = false;
        this.player.angle = 0;
      }
    }
    //console.log(this.player.angle);
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
      debug: false, // true にすることで衝突検知の範囲を画面に表示します。
    },
  },
  scene: [topscreen, MyScene, gameover],
};

export default txt; //これが必要になります

new Phaser.Game(config);
