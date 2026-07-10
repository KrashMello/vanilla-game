import { SpriteSheets } from './spritesheet';

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
    const layers = this.processLayers(tiledMap.layers);
    const objects = this.extractObjects(tiledMap.layers);
    const collisionGrid = this.buildCollisionGrid(tiledMap, layers);

    return {
      width: tiledMap.width,
      height: tiledMap.height,
      tileWidth: tiledMap.tilewidth,
      tileHeight: tiledMap.tileheight,
      layers,
      tilesets,
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

  private processLayers(tiledLayers: Tiled.Layer[]): ProcessedLayer[] {
    const layers: ProcessedLayer[] = [];

    for (const tiledLayer of tiledLayers) {
      if (tiledLayer.type === 'group' && tiledLayer.layers) {
        const groupLayers = this.processLayers(tiledLayer.layers);
        layers.push(...groupLayers);
        continue;
      }

      if (tiledLayer.type === 'tilelayer') {
        layers.push(this.processTileLayer(tiledLayer));
      } else if (tiledLayer.type === 'objectgroup') {
        layers.push(this.processObjectGroup(tiledLayer));
      } else if (tiledLayer.type === 'imagelayer') {
        layers.push(this.processImageLayer(tiledLayer));
      }
    }

    return layers;
  }

  private processTileLayer(layer: Tiled.Layer): ProcessedLayer {
    let data: number[][] | undefined;

    if (Array.isArray(layer.data)) {
      data = this.convertTo2DArray(layer.data, layer.width ?? 0, layer.height ?? 0);
    }

    const chunks: ProcessedChunk[] | undefined = layer.chunks?.map(chunk => ({
      x: chunk.x,
      y: chunk.y,
      width: chunk.width,
      height: chunk.height,
      data: this.convertTo2DArray(
        Array.isArray(chunk.data) ? chunk.data : [],
        chunk.width,
        chunk.height
      )
    }));

    return {
      id: layer.id,
      name: layer.name,
      type: 'tilelayer',
      visible: layer.visible,
      opacity: layer.opacity,
      data,
      chunks,
      offsetx: layer.offsetx ?? 0,
      offsety: layer.offsety ?? 0,
      parallaxx: layer.parallaxx ?? 1,
      parallaxy: layer.parallaxy ?? 1
    };
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

  private buildCollisionGrid(tiledMap: Tiled.Map, layers: ProcessedLayer[]): boolean[][] {
    const width = tiledMap.width;
    const height = tiledMap.height;
    const collisionGrid: boolean[][] = [];

    for (let y = 0; y < height; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < width; x++) {
        row.push(false);
      }
      collisionGrid.push(row);
    }

    for (const layer of layers) {
      if (layer.name.toLowerCase().includes('collision') && layer.data) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const tileId = layer.data[y]?.[x] ?? 0;
            if (tileId > 0) {
              const row = collisionGrid[y];
              if (row) row[x] = true;
            }
          }
        }
      }
    }

    return collisionGrid;
  }

  getSpawnPoint(objects: GameObject[], name: string): { x: number; y: number } | null {
    const obj = objects.find(o => o.name === name);
    if (obj) {
      return { x: obj.x, y: obj.y };
    }
    return null;
  }

  getObjectsByType(objects: GameObject[], type: string): GameObject[] {
    return objects.filter(o => o.type === type);
  }

  getObjectsByName(objects: GameObject[], name: string): GameObject[] {
    return objects.filter(o => o.name === name);
  }
}
