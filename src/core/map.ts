import type { Camera } from './camera';

export class GameMap {
  spriteSheet!: SpriteSheets;
  tileSize: number;

  constructor(spriteSheet: SpriteSheets, tileSize: number) {
    this.spriteSheet = spriteSheet;
    this.tileSize = tileSize;
  }

  async init() {
    await this.spriteSheet.init();
  }

  draw(context: ctx, camera?: Camera) {
    if (!this.spriteSheet.sprite) return;

    const sprite = this.spriteSheet.sprite;
    const cols = sprite.maxColumnsCalc;
    const rows = sprite.maxRowsCalc;
    const size = this.tileSize;

    if (camera) {
      const vw = camera.width / camera.zoom;
      const vh = camera.height / camera.zoom;
      const startCol = Math.max(0, Math.floor(camera.x / size));
      const endCol = Math.min(cols, Math.ceil((camera.x + vw) / size));
      const startRow = Math.max(0, Math.floor(camera.y / size));
      const endRow = Math.min(rows, Math.ceil((camera.y + vh) / size));

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          const index = row * cols + col;
          sprite.draw({ context, index, x: col * size, y: row * size });
        }
      }
    } else {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          sprite.draw({ context, index, x: col * size, y: row * size });
        }
      }
    }
  }
}
