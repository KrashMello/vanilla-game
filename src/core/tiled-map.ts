import { SpriteSheets } from './spritesheet';

const CHUNK_SIZE = 16;

export class TiledMapLoader {
  private basePath: string;

  constructor(basePath = 'assets/maps/') {
    this.basePath = basePath;
  }

  async load(jsonPath: string): Promise<ProcessedMap> {
    const response = await fetch(`${this.basePath}${jsonPath}`);
    const tiledMap: Tiled.Map = await response.json();
    return this.processMap(tiledMap);
  }

  private processMap(tiledMap: Tiled.Map): ProcessedMap {
    const tilesets = this.processTilesets(tiledMap.tilesets);
    const tilesetMeta = this.processTilesetMeta(tiledMap.tilesets);
    const layers = this.processLayers(tiledMap.layers, tiledMap.tilewidth, tiledMap.tileheight);
    const objects = this.extractObjects(tiledMap.layers);
    const collisionGrid = this.buildCollisionGrid(layers);

    return {
      width: tiledMap.width,
      height: tiledMap.height,
      tileWidth: tiledMap.tilewidth,
      tileHeight: tiledMap.tileheight,
      layers,
      tilesets,
      tilesetMeta,
      objects,
      collisionGrid
    };
  }

  private processTilesets(tiledTilesets: Tiled.Tileset[]): Map<number, SpriteSheets> {
    const tilesets = new Map<number, SpriteSheets>();

    for (const tiledTileset of tiledTilesets) {
      const src = `assets/sprite/${tiledTileset.image}`;
      const spriteSheet = new SpriteSheets({
        src,
        sprite_size: tiledTileset.tilewidth
      });
      tilesets.set(tiledTileset.firstgid, spriteSheet);
    }

    return tilesets;
  }

  private processTilesetMeta(
    tiledTilesets: Tiled.Tileset[]
  ): Map<number, { columns: number; tilecount: number }> {
    const meta = new Map<number, { columns: number; tilecount: number }>();

    for (const tiledTileset of tiledTilesets) {
      meta.set(tiledTileset.firstgid, {
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

  getSpawnPoint(objects: GameObject[], name: string): { x: number; y: number } | null {
    const obj = objects.find((o) => o.name === name);
    if (obj) {
      return { x: obj.x, y: obj.y };
    }
    return null;
  }

  getObjectsByType(objects: GameObject[], type: string): GameObject[] {
    return objects.filter((o) => o.type === type);
  }

  getObjectsByName(objects: GameObject[], name: string): GameObject[] {
    return objects.filter((o) => o.name === name);
  }
}
