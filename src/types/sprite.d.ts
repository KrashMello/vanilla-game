interface Sprite {
  size?: number;
  width?: number;
  height?: number;
  maxColumnsCalc: number;
  maxRowsCalc: number;
  spriteSheet: HTMLImageElement;
  getSpriteData(index: number): { col: number; row: number; width: number; height: number };
  draw(opt: { context: ctx; index: number; x: number; y: number }): void;
}
