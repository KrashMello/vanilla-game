import { Camera } from '@/core/camera.js';
import { GameMap } from '@/core/map.js';
import { Scene } from '@/core/scene.js';

export class Map1 extends Scene {
  useTiledMap: boolean;
  tiledMapPath: string;

  constructor(canvas: HTMLCanvasElement, tiledMapPath?: string) {
    super(canvas);
    this.depth = 0;
    this.useTiledMap = !!tiledMapPath;
    this.tiledMapPath = tiledMapPath ?? '';
    this.camera = new Camera(canvas, {
      worldWidth: 3000,
      worldHeight: 3000,
      mode: 'smooth',
      zoom: 1.5
    });
  }

  async init() {
    if (this.useTiledMap) {
      await this.initWithTiledMap();
    } else {
      await this.initLegacy();
    }

    const { Player } = await import('@/objects/player/player.js');
    const { Monster } = await import('@/objects/monster/monster.js');
    const player = new Player();
    const monster = new Monster();

    if (this.map) {
      const playerSpawn = this.map.getSpawnPoint('player_spawn');
      if (playerSpawn) {
        player.x = playerSpawn.x;
        player.y = playerSpawn.y;
      } else {
        player.x = (this.camera.worldWidth ?? 3000) / 2;
        player.y = (this.camera.worldHeight ?? 3000) / 2;
      }

      const monsterSpawn = this.map.getSpawnPoint('monster_spawn');
      if (monsterSpawn) {
        monster.x = monsterSpawn.x;
        monster.y = monsterSpawn.y;
      }
    }

    this.addEntity(player);
    this.addEntity(monster);
    this.camera.follow(player);
    await super.init();
  }

  private async initWithTiledMap() {
    const { TiledMapLoader } = await import('@/core/tiled-map.js');
    const loader = new TiledMapLoader();
    const mapData = await loader.load(this.tiledMapPath);

    this.map = GameMap.fromProcessedData(mapData);

    this.camera.worldWidth = this.map.getWorldWidth();
    this.camera.worldHeight = this.map.getWorldHeight();
  }

  private async initLegacy() {
    const { SpriteSheets } = await import('@/core/spritesheet.js');
    const spriteSheet = SpriteSheets.scene_1;
    this.map = new GameMap(spriteSheet, 16);
  }
}
