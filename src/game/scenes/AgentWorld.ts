import { Scene, type Types } from "phaser";

const DirectionElements = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
} as const;

type Direction = (typeof DirectionElements)[keyof typeof DirectionElements];

export class AgentWorld extends Scene {
  player: Types.Physics.Arcade.SpriteWithDynamicBody | undefined = undefined;
  cursors: Types.Input.Keyboard.CursorKeys | undefined = undefined;
  playerDirection: Direction = DirectionElements.down;

  constructor() {
    super("AgentWorld");
  }

  preload() {
    // Loading map
    this.load.image(
      "grass_middle_tiles",
      "maps/tilesets/Cute_Fantasy_Free/Tiles/Grass_Middle.png",
    );
    this.load.image(
      "farmland_tiles",
      "maps/tilesets/Cute_Fantasy_Free/Tiles/FarmLand_Tile.png",
    );
    this.load.image(
      "path_middle_tiles",
      "maps/tilesets/Cute_Fantasy_Free/Tiles/Path_Middle.png",
    );
    this.load.image(
      "path_tiles",
      "maps/tilesets/Cute_Fantasy_Free/Tiles/Path_Tile.png",
    );
    this.load.image(
      "outdoor_decor_tiles",
      "maps/tilesets/Cute_Fantasy_Free/Outdoor decoration/Outdoor_Decor_Free.png",
    );
    this.load.image(
      "fences_tiles",
      "maps/tilesets/Cute_Fantasy_Free/Outdoor decoration/Fences.png",
    );
    this.load.image(
      "skeleton_tiles",
      "maps/tilesets/Cute_Fantasy_Free/Enemies/Skeleton.png",
    );
    this.load.tilemapTiledJSON("agent_world", "maps/agent-base-world.tmj");

    // Loading player
    this.load.spritesheet(
      "player",
      "maps/tilesets/Cute_Fantasy_Free/Player/Player.png",
      { frameWidth: 16 * 2, frameHeight: 16 * 2 },
    );
  }

  create() {
    const map = this.make.tilemap({ key: "agent_world" });
    const tile_connections = {
      Grass_middle: "grass_middle_tiles",
      Farmland: "farmland_tiles",
      Path_Middle: "path_middle_tiles",
      Path: "path_tiles",
      Outdoor_decor: "outdoor_decor_tiles",
      fence: "fences_tiles",
      Enemies: "skeleton_tiles",
    };

    const tilesets: Phaser.Tilemaps.Tileset[] = [];

    Object.entries(tile_connections).forEach(([key, value]) => {
      const tileset = map.addTilesetImage(key, value);

      if (!tileset) {
        throw new Error(
          `Unable to add tileset with key: ${key} and value: ${value}`,
        );
      }

      tilesets.push(tileset);
    });

    map.createLayer("Ground", tilesets, 0, 0);
    const decor_layer = map.createLayer("Decor", tilesets, 0, 0);
    const boundary_layer = map.createLayer("Boundary", tilesets, 0, 0);

    decor_layer.setCollisionByProperty({ collides: true });
    boundary_layer.setCollisionByProperty({ collides: true });

    //Player physics
    this.player = this.physics.add.sprite(16 * 10, 16 * 10, "player");
    this.player.setBounce(0.0);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, decor_layer);
    this.physics.add.collider(this.player, boundary_layer);

    // Player animations
    this.anims.create({
      key: "idle-down",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idle-sidways",
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idle-up",
      frames: this.anims.generateFrameNumbers("player", { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player", { start: 18, end: 23 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-sideways",
      frames: this.anims.generateFrameNumbers("player", { start: 24, end: 29 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player", { start: 30, end: 35 }),
      frameRate: 10,
      repeat: -1,
    });

    // Player controller
    this.cursors = this.input.keyboard?.createCursorKeys();
    if (!this.cursors) {
      throw new Error("Could not initialise cursors");
    }
  }

  update() {
    if (!this.cursors) {
      throw new Error("Could not initialise cursors");
    }
    if (!this.player) {
      throw new Error("Could not find player object");
    }
    if (this.cursors.right.isDown) {
      if (this.playerDirection != DirectionElements.right) {
        this.playerDirection = DirectionElements.right;
        this.player.setFlipX(false);
      }
      this.player.setVelocity(50, 0);
      this.player.anims.play("walk-sideways", true);
    } else if (this.cursors.left.isDown) {
      if (this.playerDirection != DirectionElements.left) {
        this.playerDirection = DirectionElements.left;
        this.player.setFlipX(true);
      }
      this.player.setVelocity(-50, 0);
      this.player.anims.play("walk-sideways", true);
    } else if (this.cursors.up.isDown) {
      if (this.playerDirection != DirectionElements.up) {
        this.playerDirection = DirectionElements.up;
      }
      this.player.setVelocity(0, -50);
      this.player.anims.play("walk-up", true);
    } else if (this.cursors.down.isDown) {
      if (this.playerDirection != DirectionElements.down) {
        this.playerDirection = DirectionElements.down;
      }
      this.player.setVelocity(0, 50);
    } else {
      if (
        this.playerDirection == DirectionElements.right ||
        this.playerDirection == DirectionElements.left
      ) {
        this.player.anims.play("idle-sidways", true);
      } else if (this.playerDirection == DirectionElements.up) {
        this.player.anims.play("idle-up", true);
      } else if (this.playerDirection == DirectionElements.down) {
        this.player.anims.play("idle-down", true);
      }
      this.player.setVelocity(0, 0);
    }
  }
}
