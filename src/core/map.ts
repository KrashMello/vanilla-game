import type { Camera } from './camera';

export class GameMap {
  tileSize: number = 0;
  layers: ProcessedLayer[] = [];
  tiledMapPath: string;
  tilesets: Map<number, SpriteSheets> = new Map();
  private tilesetMeta: Map<number, { columns: number; tilecount: number }> = new Map();
  private tileLookup: Map<number, { spriteSheet: SpriteSheets; localId: number }> = new Map();
  collisionGrid: Set<string> = new Set();
  objects: GameObject[] = [];
  mapWidth: number = 0;
  mapHeight: number = 0;
  camera: Camera;
  private initialized: boolean = false;

  constructor(tiledMapPath: string, camera: Camera) {
    this.tiledMapPath = tiledMapPath ?? '';
    this.camera = camera;
  }

  private fromProcessedData(data: ProcessedMap) {
    this.layers = data.layers;
    this.tilesets = data.tilesets;
    this.tilesetMeta = data.tilesetMeta;
    this.collisionGrid = data.collisionGrid;
    this.objects = data.objects;
    this.mapWidth = data.width * data.tileWidth;
    this.mapHeight = data.height * data.tileHeight;
    this.tileSize = data.tileWidth;
  }

  private buildTileLookup() {
    this.tileLookup.clear();

    for (const [gid, meta] of this.tilesetMeta) {
      const spriteSheet = this.tilesets.get(gid);
      if (!spriteSheet?.sprite) continue;

      for (let localId = 0; localId < meta.tilecount; localId++) {
        this.tileLookup.set(gid + localId, { spriteSheet, localId });
      }
    }
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    const { TiledMapLoader } = await import('@/core/tiled-map.js');
    const loader = new TiledMapLoader();
    const mapData = await loader.load(this.tiledMapPath);

    this.fromProcessedData(mapData);
    for (const spriteSheet of this.tilesets.values()) {
      await spriteSheet.init();
    }
    this.buildTileLookup();
  }

  draw(context: ctx, camera: Camera) {
    for (const layer of this.layers) {
      if (!layer.visible) continue;
      if (layer.type !== 'tilelayer') continue;
      if (!layer.chunks) continue;

      for (const chunk of layer.chunks) {
        this.drawChunk(context, chunk, camera);
      }
    }
  }

  private drawChunk(context: ctx, chunk: ProcessedChunk, camera: Camera) {
    const vw = camera.width / camera.zoom;
    const vh = camera.height / camera.zoom;

    if (
      chunk.worldBounds.maxX < camera.x ||
      chunk.worldBounds.minX > camera.x + vw ||
      chunk.worldBounds.maxY < camera.y ||
      chunk.worldBounds.minY > camera.y + vh
    ) {
      return;
    }

    for (let row = 0; row < chunk.height; row++) {
      for (let col = 0; col < chunk.width; col++) {
        const tileId = chunk.data[row]?.[col] ?? 0;
        if (tileId > 0) {
          const x = (chunk.x + col) * this.tileSize;
          const y = (chunk.y + row) * this.tileSize;
          this.drawTile(context, tileId, x, y);
        }
      }
    }
  }

  private drawTile(context: ctx, tileId: number, x: number, y: number) {
    const lookup = this.tileLookup.get(tileId);
    if (!lookup?.spriteSheet.sprite) return;
    const data = lookup.spriteSheet.sprite.getSpriteData(lookup.localId);
    context.drawImage(
      lookup.spriteSheet.sprite.spriteSheet,
      data.col,
      data.row,
      data.width,
      data.height,
      x - 0.5,
      y - 0.5,
      data.width + 1,
      data.height + 1
    );
  }

  isInViewport(x: number, y: number, w: number, h: number, camera: Camera): boolean {
    const vw = camera.width / camera.zoom;
    const vh = camera.height / camera.zoom;
    return !(x + w < camera.x || x > camera.x + vw || y + h < camera.y || y > camera.y + vh);
  }

  isSolid(tileX: number, tileY: number): boolean {
    return this.collisionGrid.has(`${tileX},${tileY}`);
  }

  isSolidAtPixel(x: number, y: number): boolean {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    return this.isSolid(tileX, tileY);
  }

  getObjectsByName(name: string): GameObject[] {
    return this.objects.filter((o) => o.name === name);
  }

  getObjectsByType(type: string): GameObject[] {
    return this.objects.filter((o) => o.type === type);
  }

  getSpawnPoint(name: string): { x: number; y: number } | null {
    const obj = this.objects.find((o) => o.name === name);
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
