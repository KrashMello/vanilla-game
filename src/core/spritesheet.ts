import { Sprite } from './sprite';

export class SpriteSheets implements SpriteSheets {
  spriteSheet: HTMLImageElement;
  width: number = 0;
  height: number = 0;
  sprite_size?: number;
  sprite_width?: number;
  sprite_height?: number;
  sprite!: Sprite;
  static player: SpriteSheets = new SpriteSheets({
    src: 'assets/sprite/player.png',
    sprite_size: 44
  });
  static scene_1: SpriteSheets = new SpriteSheets({
    src: 'assets/sprite/scene_1.png',
    sprite_size: 16
  });
  constructor(opt: {
    src: string;
    sprite_size?: number;
    sprite_width?: number;
    sprite_height?: number;
  }) {
    const { src, sprite_size, sprite_width, sprite_height } = opt;
    if (!sprite_size && (!sprite_width || !sprite_height))
      throw new Error('Sprite size not defined');
    this.spriteSheet = new Image();
    this.spriteSheet.src = src;
    this.spriteSheet.onload = () => {
      this.width = this.spriteSheet.width;
      this.height = this.spriteSheet.height;
    };
    if (sprite_size !== undefined) this.sprite_size = sprite_size;
    if (sprite_width !== undefined) this.sprite_width = sprite_width;
    if (sprite_height !== undefined) this.sprite_height = sprite_height;
  }
  async init() {
    const { Sprite } = await import('@/core/sprite.js');
    const spriteOpt: { size?: number; width?: number; height?: number } = {};
    if (this.sprite_size !== undefined) spriteOpt.size = this.sprite_size;
    if (this.sprite_width !== undefined) spriteOpt.width = this.sprite_width;
    if (this.sprite_height !== undefined) spriteOpt.height = this.sprite_height;
    this.sprite = new Sprite(this.spriteSheet, spriteOpt);
  }
}
