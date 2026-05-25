import { Scene, type Types } from "phaser";
import { DirectionElements, type Direction } from "../../types/Direction";
import { Agent } from "./utils/Agent.ts";
import { Chatbox } from "./utils/ChatBox.ts";

export class AgentWorld extends Scene {
  player: Types.Physics.Arcade.SpriteWithDynamicBody | undefined = undefined;
  cursors: Types.Input.Keyboard.CursorKeys | undefined = undefined;
  interactKey: Phaser.Input.Keyboard.Key | undefined = undefined;
  interactWasDown = false;
  agents: Agent[] = [];
  chatbox: Chatbox | undefined = undefined;
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
    map.createLayer("NPC-tile", tilesets, 0, 0);
    const npc_obj_layer = map.getObjectLayer("NPC-object");
    const player_obj_layer = map.getObjectLayer("Player-object");

    decor_layer.setCollisionByProperty({ collides: true });
    boundary_layer.setCollisionByProperty({ collides: true });

    this.agents = (npc_obj_layer?.objects ?? [])
      .filter((obj) => obj.visible !== false)
      .map((obj) => {
        const obj_width = obj.width ?? 16;
        const obj_height = obj.height ?? 16;
        const obj_x = (obj.x ?? 0) + obj_width / 2;
        const obj_y = (obj.y ?? 0) + obj_height / 2;

        return new Agent(
          this,
          obj_x,
          obj_y,
          obj_height,
          obj_width,
          obj_height * 2,
          obj_width * 2,
          obj.name || "agent",
        );
      });
    const spawnPoint = player_obj_layer?.objects.find(
      (obj) => obj.name === "spawn",
    );
    if (!spawnPoint) {
      console.error("Could not find spawn point");
    }

    //Player physics
    this.player = this.physics.add.sprite(
      spawnPoint?.x || 16 * 15,
      spawnPoint?.y || 16 * 15,
      "player",
    );
    this.player.setBounce(0.0);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, decor_layer);
    this.physics.add.collider(this.player, boundary_layer);
    const player = this.player;
    if (!player) {
      throw new Error("Could not find player object");
    }

    this.agents.forEach((agent) => {
      this.physics.add.collider(player, agent.collisionZone);
    });

    this.chatbox = new Chatbox(
      this,
      this.scale.width / 2,
      this.scale.height - 95,
    );
    this.interactKey = this.input.keyboard?.addKey("E");

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
    const player = this.player;
    if (!player) {
      throw new Error("Could not find player object");
    }
    if (!this.interactKey) {
      throw new Error("Could not initialise interact key");
    }

    const interactPressed = this.interactKey.isDown && !this.interactWasDown;
    this.interactWasDown = this.interactKey.isDown;

    if (interactPressed) {
      if (this.chatbox?.visible) {
        this.chatbox.close();
      } else {
      const activeAgent = this.agents.find((agent) =>
        agent.isInteractable(player, this.playerDirection),
      );

      if (activeAgent) {
        this.chatbox?.open("hello");
      }
      }
    }

    if (this.cursors.right.isDown) {
      if (this.playerDirection != DirectionElements.right) {
        this.playerDirection = DirectionElements.right;
        player.setFlipX(false);
      }
      player.setVelocity(50, 0);
      player.anims.play("walk-sideways", true);
    } else if (this.cursors.left.isDown) {
      if (this.playerDirection != DirectionElements.left) {
        this.playerDirection = DirectionElements.left;
        player.setFlipX(true);
      }
      player.setVelocity(-50, 0);
      player.anims.play("walk-sideways", true);
    } else if (this.cursors.up.isDown) {
      if (this.playerDirection != DirectionElements.up) {
        this.playerDirection = DirectionElements.up;
      }
      player.setVelocity(0, -50);
      player.anims.play("walk-up", true);
    } else if (this.cursors.down.isDown) {
      if (this.playerDirection != DirectionElements.down) {
        this.playerDirection = DirectionElements.down;
      }
      player.setVelocity(0, 50);
    } else {
      if (
        this.playerDirection == DirectionElements.right ||
        this.playerDirection == DirectionElements.left
      ) {
        player.anims.play("idle-sidways", true);
      } else if (this.playerDirection == DirectionElements.up) {
        player.anims.play("idle-up", true);
      } else if (this.playerDirection == DirectionElements.down) {
        player.anims.play("idle-down", true);
      }
      player.setVelocity(0, 0);
    }
  }
}
