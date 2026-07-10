export class Sprite implements Sprite {
  size?: number;
  width?: number;
  height?: number;
  maxColumns: number = 0;
  maxRows: number = 0;
  spriteSheet: HTMLImageElement;
  constructor(
    spriteSheet: HTMLImageElement,
    opt: { size?: number; width?: number; height?: number }
  ) {
    const { size, width, height } = opt;
    if (!size && (!width || !height)) throw new Error('Sprite size not defined');
    if (size !== undefined) this.size = size;
    if (width !== undefined) this.width = width;
    if (height !== undefined) this.height = height;
    this.spriteSheet = spriteSheet;
  }
  get maxColumnsCalc(): number {
    const w = this.width ?? this.size;
    if (!w || this.spriteSheet.width === 0) return 0;
    return Math.floor(this.spriteSheet.width / w);
  }
  get maxRowsCalc(): number {
    const h = this.height ?? this.size;
    if (!h || this.spriteSheet.height === 0) return 0;
    return Math.floor(this.spriteSheet.height / h);
  }
  getSpriteData(index: number) {
    const w = this.width ?? this.size ?? 0;
    const h = this.height ?? this.size ?? 0;
    const cols = w > 0 ? Math.floor(this.spriteSheet.width / w) : 0;
    if (cols === 0) {
      return { col: 0, row: 0, width: 0, height: 0 };
    }
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      col: col * w,
      row: row * h,
      width: w,
      height: h
    };
  }
  draw(opt: { context: ctx; index: number; x: number; y: number }) {
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
