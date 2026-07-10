import type { Camera } from './camera';

export class GameMap {
  spriteSheet!: SpriteSheets;
  tileSize: number;
  layers: ProcessedLayer[] = [];
  tilesets: Map<number, SpriteSheets> = new Map();
  collisionGrid: boolean[][] = [];
  objects: GameObject[] = [];
  mapWidth: number = 0;
  mapHeight: number = 0;

  constructor(spriteSheet: SpriteSheets | null, tileSize: number) {
    if (spriteSheet) {
      this.spriteSheet = spriteSheet;
    }
    this.tileSize = tileSize;
  }

  static fromProcessedData(data: ProcessedMap): GameMap {
    const map = new GameMap(null, data.tileWidth);
    map.layers = data.layers;
    map.tilesets = data.tilesets;
    map.collisionGrid = data.collisionGrid;
    map.objects = data.objects;
    map.mapWidth = data.width * data.tileWidth;
    map.mapHeight = data.height * data.tileHeight;
    return map;
  }

  async init() {
    if (this.spriteSheet) {
      await this.spriteSheet.init();
    }

    for (const spriteSheet of this.tilesets.values()) {
      await spriteSheet.init();
    }
  }

  draw(context: ctx, camera?: Camera) {
    if (this.layers.length > 0) {
      this.drawProcessedLayers(context, camera);
    } else if (this.spriteSheet?.sprite) {
      this.drawLegacyMap(context, camera);
    }
  }

  private drawProcessedLayers(context: ctx, camera?: Camera) {
    for (const layer of this.layers) {
      if (!layer.visible) continue;

      if (layer.type === 'tilelayer') {
        this.drawTileLayer(context, layer, camera);
      }
    }
  }

  private drawTileLayer(context: ctx, layer: ProcessedLayer, camera?: Camera) {
    if (!layer.data && !layer.chunks) return;

    if (layer.data) {
      this.drawTileData(context, layer.data, layer, camera);
    }

    if (layer.chunks) {
      for (const chunk of layer.chunks) {
        this.drawChunk(context, chunk, layer, camera);
      }
    }
  }

  private drawTileData(
    context: ctx,
    data: number[][],
    _layer: ProcessedLayer,
    camera?: Camera
  ) {
    const size = this.tileSize;
    const rows = data.length;
    const cols = data[0]?.length ?? 0;

    if (camera) {
      const vw = camera.width / camera.zoom;
      const vh = camera.height / camera.zoom;
      const startCol = Math.max(0, Math.floor(camera.x / size));
      const endCol = Math.min(cols, Math.ceil((camera.x + vw) / size));
      const startRow = Math.max(0, Math.floor(camera.y / size));
      const endRow = Math.min(rows, Math.ceil((camera.y + vh) / size));

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          const tileId = data[row]?.[col] ?? 0;
          if (tileId > 0) {
            this.drawTile(context, tileId, col * size, row * size);
          }
        }
      }
    } else {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const tileId = data[row]?.[col] ?? 0;
          if (tileId > 0) {
            this.drawTile(context, tileId, col * size, row * size);
          }
        }
      }
    }
  }

  private drawChunk(
    context: ctx,
    chunk: ProcessedChunk,
    _layer: ProcessedLayer,
    camera?: Camera
  ) {
    const size = this.tileSize;
    const startX = chunk.x * size;
    const startY = chunk.y * size;

    if (camera) {
      const vw = camera.width / camera.zoom;
      const vh = camera.height / camera.zoom;
      const endX = startX + chunk.width * size;
      const endY = startY + chunk.height * size;

      if (startX > camera.x + vw || endX < camera.x) return;
      if (startY > camera.y + vh || endY < camera.y) return;
    }

    for (let row = 0; row < chunk.height; row++) {
      for (let col = 0; col < chunk.width; col++) {
        const tileId = chunk.data[row]?.[col] ?? 0;
        if (tileId > 0) {
          const x = (chunk.x + col) * size;
          const y = (chunk.y + row) * size;
          this.drawTile(context, tileId, x, y);
        }
      }
    }
  }

  private drawTile(context: ctx, tileId: number, x: number, y: number) {
    let firstGid = 0;
    for (const [gid] of this.tilesets) {
      if (gid <= tileId) {
        firstGid = gid;
      }
    }

    if (firstGid === 0) return;

    const spriteSheet = this.tilesets.get(firstGid);
    if (!spriteSheet?.sprite) return;

    const localId = tileId - firstGid;
    spriteSheet.sprite.draw({ context, index: localId, x, y });
  }

  private drawLegacyMap(context: ctx, camera?: Camera) {
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

  isSolid(tileX: number, tileY: number): boolean {
    if (tileY < 0 || tileY >= this.collisionGrid.length) return true;
    if (tileX < 0 || tileX >= (this.collisionGrid[0]?.length ?? 0)) return true;
    return this.collisionGrid[tileY]?.[tileX] ?? false;
  }

  isSolidAtPixel(x: number, y: number): boolean {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    return this.isSolid(tileX, tileY);
  }

  getObjectsByName(name: string): GameObject[] {
    return this.objects.filter(o => o.name === name);
  }

  getObjectsByType(type: string): GameObject[] {
    return this.objects.filter(o => o.type === type);
  }

  getSpawnPoint(name: string): { x: number; y: number } | null {
    const obj = this.objects.find(o => o.name === name);
    if (obj) {
      return { x: obj.x, y: obj.y };
    }
    return null;
  }

  getWorldWidth(): number {
    return this.mapWidth;
  }

  getWorldHeight(): number {
    return this.mapHeight;
  }
}
