import { GameObjects, Scene, Physics } from "phaser";
import { type Direction, DirectionElements } from "../../../types/Direction.ts";

export class Agent extends GameObjects.Container {
  collisionZone!: GameObjects.Zone;
  overlapZone!: GameObjects.Zone;
  player!: Physics.Arcade.Sprite;

  constructor(
    scene: Scene,
    centerX: number,
    centerY: number,
    collisionHeight: number,
    collisionWidth: number,
    overlapHeight: number,
    overlapWidth: number,
    agentName: string = "agent",
  ) {
    super(scene, centerX, centerY);

    const agentBody = scene.add.rectangle(
      0,
      0,
      collisionWidth,
      collisionHeight,
      0x4f46e5,
      0.85,
    );
    const agentLabel = scene.add
      .text(0, -(collisionHeight / 2) - 12, agentName, {
        fontFamily: "Georgia, Times, serif",
        fontSize: "10px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 1);
    this.add([agentBody, agentLabel]);
    scene.add.existing(this);

    this.collisionZone = scene.add.zone(
      centerX,
      centerY,
      collisionWidth,
      collisionHeight,
    );
    scene.physics.add.existing(this.collisionZone, true);

    this.overlapZone = scene.add.zone(centerX, centerY, overlapWidth, overlapHeight);
    scene.physics.add.existing(this.overlapZone, true);

    const collisionBody = this.collisionZone.body as Physics.Arcade.StaticBody;
    collisionBody.setSize(collisionWidth, collisionHeight);
    collisionBody.updateFromGameObject();

    const overlapBody = this.overlapZone.body as Physics.Arcade.StaticBody;
    overlapBody.setSize(overlapWidth, overlapHeight);
    overlapBody.updateFromGameObject();
  }

  isInteractable(
    player: Physics.Arcade.Sprite,
    direction: Direction,
  ): boolean {
    const isOverlap = this.scene.physics.overlap(player, this.overlapZone);
    if (!isOverlap) {
      return false;
    }

    const relX = this.x - player.x;
    const relY = this.y - player.y;

    if (
      direction == DirectionElements.down &&
      relY > player.displayHeight / 2
    ) {
      return true;
    } else if (
      direction == DirectionElements.up &&
      relY < player.displayHeight / 2
    ) {
      return true;
    } else if (
      direction == DirectionElements.right &&
      relX > player.displayWidth / 2
    ) {
      return true;
    } else if (
      direction == DirectionElements.left &&
      relX < player.displayWidth / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
}
