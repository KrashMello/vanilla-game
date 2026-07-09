import { Scene } from '@/core/scene.js';

export class Map1 extends Scene implements Scene {
  constructor() {
    super()
    this.depth = 0
  }
  async init() {
    const { SpriteSheets } = await import('@/core/spritesheet.js');
    this.spriteSheet = SpriteSheets.scene_1;
    await this.spriteSheet.init();
    await super.init();
  }
  draw(context: ctx) {
    if (this.spriteSheet.sprite) {
      const sprite = this.spriteSheet.sprite;
      const cols = sprite.maxColumnsCalc;
      const rows = sprite.maxRowsCalc;
      const size = this.spriteSheet.sprite_size ?? 16;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          sprite.draw({
            context,
            index,
            x: col * size,
            y: row * size
          });
        }
      }
    }
    super.draw(context);
  }
}
