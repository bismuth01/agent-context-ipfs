import { Scene } from "phaser";

export class AgentWorld extends Scene {
  constructor() {
    super("AgentWorld");
  }

  preload() {
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
    map.createLayer("Decor", tilesets, 0, 0);
    map.createLayer("Boundary", tilesets, 0, 0);
  }
}
