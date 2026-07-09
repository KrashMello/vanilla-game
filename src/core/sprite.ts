export class Sprite implements Sprite {
  size?: number
  width?: number;
  height?: number;
  max_column: number = 0;
  max_row: number = 0;
  spriteSheet: HTMLImageElement;
  constructor(spriteSheet: HTMLImageElement, opt: { size?: number, width?: number, height?: number }) {
    const { size, width, height } = opt;
    if (!size && (!width || !height))
      throw new Error('Sprite size not defined');
    this.size = size;
    this.width = width;
    this.height = height;
    this.spriteSheet = spriteSheet;
  }
  get maxColumns(): number {
    if (!this.size || !this.width)
      return 0
    return Math.floor(this.spriteSheet.width / (this.width ?? this.size));
  }
  get maxRows(): number {
    if (this.spriteSheet.height === 0) return 0;
    if (!this.size || !this.height)
      return 0
    return Math.floor(this.spriteSheet / (this.height ?? this.size));
  }
  getSpriteData(index: number) {
    const cols = Math.floor(this.spriteSheet.width / (this.width ?? this.size));
    if (cols === 0 && (!this.size && (!this.width || !this.height))) {
      return { col: 0, row: 0, x: 0, y: 0, width: 0, height: 0 };
    }
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      col: col * (this.width || this.size),
      row: row * (this.height || this.size),
      width: (this.width || this.size),
      height: (this.height || this.size)
    };
  }
  draw(opt: { context: ctx; index: number, x: number, y: number }) {
    const { context, index, x, y } = opt;
    const spriteData = this.getSpriteData(index);
    context.drawImage(
      this.spriteSheet,
      spriteData.col,
      spriteData.row,
      spriteData.width,
      spriteData.height,
      x,
      y,
      spriteData.width,
      spriteData.height
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

