import { Scene } from '@/core/scene.js';
export class Map1 extends Scene implements Scene {
  constructor() {
    super()
  }
  async init() {
    console.log('init map 1')
    const { SpriteSheets } = await import('@/core/spritesheet.js');
    this.spriteSheet = SpriteSheets.scene_1;
    this.spriteSheet.init()
  }
  draw(context: ctx) {
    console.log('draw map 1')
  }
  update(opt: ObjectUpdateOptions) {
    console.log('update map 1')
  }
}
