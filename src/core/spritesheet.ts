export class SpriteSheets {
  spriteSheet: HTMLImageElement;
  width: number = 0;
  height: number = 0;
  static player: SpriteSheets = new SpriteSheets('assets/sprite/player.png');
  constructor(src: string) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = src;
    this.width = this.spriteSheet.width;
    this.height = this.spriteSheet.height;

  }
}
