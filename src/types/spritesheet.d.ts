interface SpriteSheets {
  spriteSheet: HTMLImageElement;
  width: number;
  height: number;
  sprite_size?: number;
  sprite_width?: number;
  sprite_height?: number;
  sprite: Sprite;
  init(): Promise<void>;
}
