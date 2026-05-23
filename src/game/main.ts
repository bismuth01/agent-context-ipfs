import { AUTO, Game, Scale, type Types } from "phaser";
import { AgentWorld } from "./scenes/AgentWorld";

const config: Types.Core.GameConfig = {
  type: AUTO,
  scale: {
    mode: Scale.FIT,
    parent: "game-container",
    autoCenter: Scale.CENTER_BOTH,
    width: 16 * 30,
    height: 16 * 20,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  backgroundColor: "#2b91fb",
  pixelArt: true,
  scene: [AgentWorld],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
