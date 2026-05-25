import { GameObjects, Scene } from "phaser";

export class Chatbox extends GameObjects.Container {
  chatPanel!: GameObjects.Rectangle;
  chatText!: GameObjects.Text;

  readonly boxWidth = 520;
  readonly boxHeight = 150;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    defaultData: string = "",
  ) {
    super(scene, x, y);

    this.chatPanel = scene.add.rectangle(
      0,
      0,
      this.boxWidth,
      this.boxHeight,
      0x101827,
      0.94,
    );
    this.chatPanel.setStrokeStyle(2, 0x8b5cf6, 1);

    this.chatText = scene.add
      .text(0, 0, defaultData, {
        fontFamily: "Georgia, Times, serif",
        fontSize: "22px",
        color: "#f8fafc",
        align: "center",
        wordWrap: { width: this.boxWidth - 48 },
      })
      .setOrigin(0.5);

    this.add([this.chatPanel, this.chatText]);
    scene.add.existing(this);
    this.setVisible(false);
  }

  updateChat(response: string) {
    this.chatText.setText(response);
  }

  open(response: string) {
    this.updateChat(response);
    this.setVisible(true);
  }

  close() {
    this.setVisible(false);
  }
}
