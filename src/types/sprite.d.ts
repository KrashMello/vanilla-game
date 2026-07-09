interface Sprite {
  size?: number;
  width?: number;
  height?: number;
  max_column: number;
  max_row: number;
  spriteSheet: HTMLImageElement;
  draw({ context: ctx, index: number, x: number, y: number }): void;
}
