type spriteOptions = { x: number, y: number, size: number, column: number, row: number, spriteSheet: HTMLImageElement }
interface Sprite {
  x: number;
  y: number;
  size: number;
  column: number;
  row: number;
  maxColumn: number;
  maxRow: number;
  speedX: number;
  speedY: number;
  spriteSheet: HTMLImageElement;
  setSpeedX(speedX: number): void;
  setSpeedY(speedY: number): void;
  setColumn(column: number): void;
  setRow(row: number): void;
  update(deltaTime: number): void;
  draw(context: ctx): void;
}
