import type { Camera } from './camera';
import { SpriteSheets } from './spritesheet';

const CHUNK_SIZE = 16;

export class GameMap {
  tileSize: number = 0;
  layers: ProcessedLayer[] = [];
  tilesets: Map<string, SpriteSheets> = new Map();
  private tilesetMeta: Map<string, { name: string; columns: number; tilecount: number }> =
    new Map();
  tileLookup: Map<number, { spriteSheetName: string; localId: number }> = new Map();
  collisionGrid: Set<string> = new Set();
  objects: GameObject[] = [];
  mapWidth: number = 0;
  mapHeight: number = 0;
  private initialized: boolean = false;
  private basePath: string;
  private jsonPath: string;

  static map_1: GameMap = new GameMap({ jsonPath: 'map_1.json' });
  static map_2: GameMap = new GameMap({ jsonPath: 'map_2.json' });
  static map_3: GameMap = new GameMap({ jsonPath: 'map_3.json' });

  constructor(opt: { basePath?: string; jsonPath: string }) {
    this.basePath = opt.basePath ?? 'assets/maps/';
    this.jsonPath = opt.jsonPath;
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    const response = await fetch(`${this.basePath}${this.jsonPath}`);
    const tiledMap: Tiled.Map = await response.json();

    this.processMap(tiledMap);
    for (const spriteSheet of this.tilesets.values()) {
      await spriteSheet.init();
    }
    this.buildTileLookup();
  }

  private buildTileLookup() {
    this.tileLookup.clear();

    for (const [name, meta] of this.tilesetMeta) {
      for (let localId = 0; localId < meta.tilecount; localId++) {
        this.tileLookup.set(localId + 1, { spriteSheetName: name, localId });
      }
    }
  }

  private processMap(tiledMap: Tiled.Map) {
    const tilesets = this.processTilesets(tiledMap.tilesets);
    const tilesetMeta = this.processTilesetMeta(tiledMap.tilesets);
    const layers = this.processLayers(tiledMap.layers, tiledMap.tilewidth, tiledMap.tileheight);
    const objects = this.extractObjects(tiledMap.layers);
    const collisionGrid = this.buildCollisionGrid(layers);
    this.mapWidth = tiledMap.width * tiledMap.tilewidth;
    this.mapHeight = tiledMap.height * tiledMap.tileheight;
    this.tileSize = tiledMap.tilewidth;
    this.layers = layers;
    this.tilesets = tilesets;
    this.tilesetMeta = tilesetMeta;
    this.objects = objects;
    this.collisionGrid = collisionGrid;
  }

  private processTilesets(tiledTilesets: Tiled.Tileset[]): Map<number, SpriteSheets> {
    const tilesets = new Map<number, SpriteSheets>();
    for (const tiledTileset of tiledTilesets) {
      const spriteSheetKey = tiledTileset.image.split('.')[0] as string;
      const spriteSheet = (SpriteSheets as unknown as Record<string, SpriteSheets>)[spriteSheetKey];
      if (spriteSheet) tilesets.set(tiledTileset.name, spriteSheet);
    }

    return tilesets;
  }

  private processTilesetMeta(
    tiledTilesets: Tiled.Tileset[]
  ): Map<number, { columns: number; tilecount: number }> {
    const meta = new Map<string, { columns: number; tilecount: number }>();

    for (const tiledTileset of tiledTilesets) {
      meta.set(tiledTileset.name, {
        name: tiledTileset.name,
        columns: tiledTileset.columns,
        tilecount: tiledTileset.tilecount
      });
    }

    return meta;
  }

  private processLayers(
    tiledLayers: Tiled.Layer[],
    tileWidth: number,
    tileHeight: number
  ): ProcessedLayer[] {
    const layers: ProcessedLayer[] = [];

    for (const tiledLayer of tiledLayers) {
      if (tiledLayer.type === 'group' && tiledLayer.layers) {
        const groupLayers = this.processLayers(tiledLayer.layers, tileWidth, tileHeight);
        layers.push(...groupLayers);
        continue;
      }

      if (tiledLayer.type === 'tilelayer') {
        layers.push(this.processTileLayer(tiledLayer, tileWidth, tileHeight));
      } else if (tiledLayer.type === 'objectgroup') {
        layers.push(this.processObjectGroup(tiledLayer));
      } else if (tiledLayer.type === 'imagelayer') {
        layers.push(this.processImageLayer(tiledLayer));
      }
    }

    return layers;
  }

  private processTileLayer(
    layer: Tiled.Layer,
    tileWidth: number,
    tileHeight: number
  ): ProcessedLayer {
    let chunks: ProcessedChunk[] | undefined;

    if (Array.isArray(layer.data)) {
      const data = this.convertTo2DArray(layer.data, layer.width ?? 0, layer.height ?? 0);
      chunks = this.convertDataToChunks(data, tileWidth, tileHeight);
    } else if (layer.chunks) {
      chunks = layer.chunks.map((chunk) => this.processChunk(chunk, tileWidth, tileHeight));
    }

    return {
      id: layer.id,
      name: layer.name,
      type: 'tilelayer',
      visible: layer.visible,
      opacity: layer.opacity,
      chunks,
      offsetx: layer.offsetx ?? 0,
      offsety: layer.offsety ?? 0,
      parallaxx: layer.parallaxx ?? 1,
      parallaxy: layer.parallaxy ?? 1
    };
  }

  private processChunk(chunk: Tiled.Chunk, tileWidth: number, tileHeight: number): ProcessedChunk {
    let data: number[][];

    if (Array.isArray(chunk.data)) {
      data = this.convertTo2DArray(chunk.data, chunk.width, chunk.height);
    } else {
      data = [];
      for (let y = 0; y < chunk.height; y++) {
        data.push(new Array(chunk.width).fill(0));
      }
    }

    return {
      x: chunk.x,
      y: chunk.y,
      width: chunk.width,
      height: chunk.height,
      data,
      worldBounds: {
        minX: chunk.x * tileWidth,
        minY: chunk.y * tileHeight,
        maxX: (chunk.x + chunk.width) * tileWidth,
        maxY: (chunk.y + chunk.height) * tileHeight
      }
    };
  }

  private convertDataToChunks(
    data: number[][],
    tileWidth: number,
    tileHeight: number
  ): ProcessedChunk[] {
    const chunks: ProcessedChunk[] = [];
    const rows = data.length;
    const cols = data[0]?.length ?? 0;

    for (let startY = 0; startY < rows; startY += CHUNK_SIZE) {
      for (let startX = 0; startX < cols; startX += CHUNK_SIZE) {
        const endY = Math.min(startY + CHUNK_SIZE, rows);
        const endX = Math.min(startX + CHUNK_SIZE, cols);
        const chunkData: number[][] = [];

        for (let y = startY; y < endY; y++) {
          const row: number[] = [];
          for (let x = startX; x < endX; x++) {
            row.push(data[y]?.[x] ?? 0);
          }
          chunkData.push(row);
        }

        chunks.push({
          x: startX,
          y: startY,
          width: endX - startX,
          height: endY - startY,
          data: chunkData,
          worldBounds: {
            minX: startX * tileWidth,
            minY: startY * tileHeight,
            maxX: endX * tileWidth,
            maxY: endY * tileHeight
          }
        });
      }
    }
    return chunks;
  }

  private processObjectGroup(layer: Tiled.Layer): ProcessedLayer {
    return {
      id: layer.id,
      name: layer.name,
      type: 'objectgroup',
      visible: layer.visible,
      opacity: layer.opacity,
      offsetx: layer.offsetx ?? 0,
      offsety: layer.offsety ?? 0,
      parallaxx: layer.parallaxx ?? 1,
      parallaxy: layer.parallaxy ?? 1
    };
  }

  private processImageLayer(layer: Tiled.Layer): ProcessedLayer {
    return {
      id: layer.id,
      name: layer.name,
      type: 'imagelayer',
      visible: layer.visible,
      opacity: layer.opacity,
      offsetx: layer.offsetx ?? 0,
      offsety: layer.offsety ?? 0,
      parallaxx: layer.parallaxx ?? 1,
      parallaxy: layer.parallaxy ?? 1
    };
  }

  private convertTo2DArray(data: number[], width: number, height: number): number[][] {
    const result: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        row.push(data[index] ?? 0);
      }
      result.push(row);
    }
    return result;
  }

  private extractObjects(layers: Tiled.Layer[]): GameObject[] {
    const objects: GameObject[] = [];

    for (const layer of layers) {
      if (layer.type === 'group' && layer.layers) {
        objects.push(...this.extractObjects(layer.layers));
        continue;
      }

      if (layer.type === 'objectgroup' && layer.objects) {
        for (const obj of layer.objects) {
          objects.push(this.processObject(obj));
        }
      }
    }

    return objects;
  }

  private processObject(obj: Tiled.Object): GameObject {
    const properties = new Map<string, string | number | boolean>();

    if (obj.properties) {
      for (const prop of obj.properties) {
        properties.set(prop.name, prop.value);
      }
    }

    return {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      rotation: obj.rotation,
      properties,
      gid: obj.gid,
      visible: obj.visible
    };
  }

  private buildCollisionGrid(layers: ProcessedLayer[]): Set<string> {
    const collisionGrid = new Set<string>();

    for (const layer of layers) {
      if (!layer.name.toLowerCase().includes('collision')) continue;
      if (!layer.chunks) continue;

      for (const chunk of layer.chunks) {
        for (let row = 0; row < chunk.height; row++) {
          for (let col = 0; col < chunk.width; col++) {
            if ((chunk.data[row]?.[col] ?? 0) > 0) {
              collisionGrid.add(`${chunk.x + col},${chunk.y + row}`);
            }
          }
        }
      }
    }

    return collisionGrid;
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
