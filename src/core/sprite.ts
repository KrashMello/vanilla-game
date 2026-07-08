export class Sprite {
  x: number;
  y: number;
  size: number;
  column: number;
  row: number;
  maxColumn: number;
  maxRow: number;
  speedX: number = 0;
  speedY: number = 0;
  spriteSheet: HTMLImageElement;
  constructor(opt: spriteOptions) {
    const { x, y, size, column, row, spriteSheet } = opt;
    this.column = column * size;
    this.row = row * size;
    this.size = size;
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.maxColumn = this.spriteSheet.width / this.size;
    this.maxRow = this.spriteSheet.height / this.size;
  }
  setSpeedX(speedX: number) {
    this.speedX = speedX;
  }
  setSpeedY(speedY: number) {
    this.speedY = speedY;
  }
  setColumn(column: number) {
    this.column = column * this.size;
  }
  setRow(row: number) {
    this.row = row * this.size;
  }
  update(deltaTime: number) {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  draw(context: ctx) {
    context.drawImage(
      this.spriteSheet,
      this.column,
      this.row,
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Fallo al cargar la imagen: ${src}`));
    image.src = src;
  });
}

