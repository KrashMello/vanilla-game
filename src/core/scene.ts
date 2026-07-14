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

  update(deltatime: number) {
    this.camera.update();
    for (const entity of this.entities) {
      entity.update(deltatime);
    }
  }

  draw(context: ctx) {
    if (this.map) {
      for (const layer of this.map.layers) {
        if (!layer.visible) continue;
        if (layer.type !== 'tilelayer') continue;
        if (!layer.chunks) continue;
        for (const chunk of layer.chunks) {
          this.drawChunk(context, chunk);
        }
      }
    }
    const sorted = [...this.entities].sort((a, b) => a.depth - b.depth);
    for (const entity of sorted) {
      if (this.isInViewport(entity.x, entity.y, entity.width, entity.height)) entity.draw(context);
    }
  }

  private drawChunk(context: ctx, chunk: ProcessedChunk) {
    const vw = this.camera.width / this.camera.zoom;
    const vh = this.camera.height / this.camera.zoom;

    if (
      chunk.worldBounds.maxX < this.camera.x ||
      chunk.worldBounds.minX > this.camera.x + vw ||
      chunk.worldBounds.maxY < this.camera.y ||
      chunk.worldBounds.minY > this.camera.y + vh
    ) {
      return;
    }
    for (let row = 0; row < chunk.height; row++) {
      for (let col = 0; col < chunk.width; col++) {
        const tileId = chunk.data[row]?.[col] ?? 0;
        if (tileId > 0) {
          const x = chunk.x + col;
          const y = chunk.y + row;
          this.drawTile(context, tileId, x, y);
        }
      }
    }
  }

  private drawTile(context: ctx, tileId: number, x: number, y: number) {
    if (!this.map) return;
    const lookup = this.map.tileLookup.get(tileId);
    if (!lookup.spriteSheetName) return;
    const spriteSheet = this.map.tilesets.get(lookup.spriteSheetName);
    if (!spriteSheet) return;
    x = x * spriteSheet.sprite_width;
    y = y * spriteSheet.sprite_height;
    spriteSheet?.sprite.draw({ context, index: lookup.localId, x, y });
  }

  isInViewport(x: number, y: number, w: number, h: number): boolean {
    const camX = this.camera.x + this.camera.width / 4;
    const camY = this.camera.y + this.camera.height / 4;
    const vw = this.camera.width / 2;
    const vh = this.camera.height / 2;
    return x + w > camX && x < camX + vw && y + h > camY && y < camY + vh;
  }
}
