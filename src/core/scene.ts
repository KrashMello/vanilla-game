import { Camera } from './camera.js';
import type { Entity } from './entity.js';
import type { GameMap } from './map.js';
import type { GameState } from './save-manager.js';

export class Scene {
  canvas: HTMLCanvasElement;
  entities: Entity[] = [];
  map: GameMap | null = null;
  camera: Camera;
  depth: number = 0;
  name: string = 'scene';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera = new Camera(canvas);
  }

  addEntity(entity: Entity) {
    entity.scene = this;
    this.entities.push(entity);
  }

  removeEntity(entity: Entity) {
    entity.scene = null;
    this.entities = this.entities.filter((e) => e !== entity);
  }

  async init() {
    if (this.map) {
      await this.map.init();
    }
    for (const entity of this.entities) {
      entity.scene = this;
      await entity.init();
    }
    await this.onEnter();
  }

  async onEnter() {}
  onExit() {}

  getSaveData(): GameState | null {
    return null;
  }

  restoreSaveData(_state: GameState): void {}

  update(opt: ObjectUpdateOptions) {
    this.camera.update();
    for (const entity of this.entities) {
      entity.update(opt);
    }
  }

  draw(context: ctx) {
    if (this.map) {
      this.map.draw(context, this.camera);
    }
    const sorted = [...this.entities].sort((a, b) => a.depth - b.depth);
    for (const entity of sorted) {
      if (
        !this.map ||
        this.map.isInViewport(entity.x, entity.y, entity.width, entity.height, this.camera)
      ) {
        entity.draw(context);
      }
    }
  }
}
