import { Camera } from '@/core/camera.js';
import type { Entity } from '@/core/entity.js';
import { GameMap } from '@/core/map.js';
import type { GameState, PlayerSaveData } from '@/core/save-manager.js';
import { Scene } from '@/core/scene.js';

export class Scene_1 extends Scene {
  tiledMapPath: string;
  private player: Entity | null = null;
  private savedPlayerData: PlayerSaveData | null = null;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.depth = 0;
    this.tiledMapPath = 'map_3.json';
    this.name = 'scene_1';
  }

  async init() {
    this.camera = new Camera(this.canvas, {
      worldWidth: 3000,
      worldHeight: 3000
    });

    this.map = GameMap.map_3;
    const { Player } = await import('@/objects/player/player.js');
    const { Monster } = await import('@/objects/monster/monster.js');
    this.player = new Player();
    this.addEntity(this.player);
    this.addEntity(new Monster());

    await super.init();
  }

  async onEnter() {
    if (!this.map || !this.player) return;

    this.camera.worldWidth = this.map.getWorldWidth();
    this.camera.worldHeight = this.map.getWorldHeight();

    if (this.savedPlayerData) {
      this.player.x = this.savedPlayerData.x;
      this.player.y = this.savedPlayerData.y;
    } else {
      const playerSpawn = this.map.getSpawnPoint('player_spawn');
      if (playerSpawn) {
        this.player.x = playerSpawn.x;
        this.player.y = playerSpawn.y;
      } else {
        this.player.x = (this.camera.worldWidth ?? 3000) / 2;
        this.player.y = (this.camera.worldHeight ?? 3000) / 2;
      }
    }

    const monsterSpawn = this.map.getSpawnPoint('monster_spawn');
    const monster = this.entities.find((e) => e !== this.player);
    if (monster && monsterSpawn) {
      monster.x = monsterSpawn.x;
      monster.y = monsterSpawn.y;
    }

    this.camera.follow(this.player);
    this.savedPlayerData = null;
  }

  getSaveData(): GameState | null {
    if (!this.player) return null;
    const player = this.player as import('@/objects/player/player.js').Player;
    return {
      sceneName: this.name,
      player: player.getSaveData(),
      camera: {
        zoom: this.camera.zoom
      }
    };
  }

  restoreSaveData(state: GameState): void {
    this.savedPlayerData = state.player;
    this.camera.zoom = state.camera.zoom;
  }
}
