import { Sprite } from "./sprite";

export class SpriteSheets implements SpriteSheets {
  spriteSheet: HTMLImageElement;
  width: number = 0;
  height: number = 0;
  sprite_size?: number;
  sprite_width?: number;
  sprite_height?: number;
  sprite!: Sprite;
  static player: SpriteSheets = new SpriteSheets({ src: 'assets/sprite/player.png', sprite_size: 44 });
  static scene_1: SpriteSheets = new SpriteSheets({ src: 'assets/sprite/scene_1.png', sprite_size: 16 });
  constructor(opt: { src: string, sprite_size?: number, sprite_width?: number, sprite_height?: number }) {
    const { src, sprite_size, sprite_width, sprite_height } = opt;
    if (!sprite_size && (!sprite_width || !sprite_height))
      throw new Error('Sprite size not defined');
    this.spriteSheet = new Image();
    this.spriteSheet.src = src;
    this.spriteSheet.onload = () => {
      this.width = this.spriteSheet.width;
      this.height = this.spriteSheet.height;
    }
    this.sprite_size = sprite_size;
    this.sprite_width = sprite_width;
    this.sprite_height = sprite_height;
  }
  async init() {
    const { Sprite } = await import('@/core/sprite.js');
    this.sprite = new Sprite(this.spriteSheet, {
      size: this.sprite_size,
      width: this.sprite_width,
      height: this.sprite_height
    });
  }
}
