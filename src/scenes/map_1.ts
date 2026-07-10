import { Camera } from '@/core/camera.js';
import { GameMap } from '@/core/map.js';
import { Scene } from '@/core/scene.js';

export class Map1 extends Scene {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.depth = 0;
    this.camera = new Camera(canvas, {
      worldWidth: 3000,
      worldHeight: 3000,
      mode: 'smooth',
      zoom: 1.5
    });
  }

  async init() {
    const { SpriteSheets } = await import('@/core/spritesheet.js');
    const spriteSheet = SpriteSheets.scene_1;
    this.map = new GameMap(spriteSheet, 16);
    const { Player } = await import('@/objects/player/player.js');
    const { Monster } = await import('@/objects/monster/monster.js');
    const player = new Player();
    const monster = new Monster();

    this.addEntity(player);
    this.addEntity(monster);
    this.camera.follow(player);
    await super.init();
  }
}
