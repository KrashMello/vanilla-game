declare namespace Tiled {
  interface Map {
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
    orientation: 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
    renderorder: 'right-down' | 'right-up' | 'left-down' | 'left-up';
    layers: Layer[];
    tilesets: Tileset[];
    properties: Property[];
    infinite: boolean;
    compressionlevel: number;
    nextlayerid: number;
    nextobjectid: number;
    tiledversion: string;
    version: string;
    type: 'map';
    backgroundcolor?: string;
  }

  interface Layer {
    id: number;
    name: string;
    type: 'tilelayer' | 'objectgroup' | 'imagelayer' | 'group';
    visible: boolean;
    opacity: number;
    locked?: boolean;
    tintcolor?: string;
    parallaxx?: number;
    parallaxy?: number;
    offsetx?: number;
    offsety?: number;
    properties: Property[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    data?: number[] | string;
    chunks?: Chunk[];
    encoding?: 'csv' | 'base64';
    compression?: 'zlib' | 'gzip' | 'zstd' | '';
    objects?: Object[];
    image?: string;
    imagewidth?: number;
    imageheight?: number;
    transparentcolor?: string;
    repeatx?: boolean;
    repeaty?: boolean;
    startx?: number;
    starty?: number;
    draworder?: 'topdown' | 'index';
    layers?: Layer[];
    class?: string;
  }

  interface Chunk {
    data: number[] | string;
    height: number;
    width: number;
    x: number;
    y: number;
  }

  interface Tileset {
    firstgid: number;
    name: string;
    tilewidth: number;
    tileheight: number;
    tilecount: number;
    columns: number;
    image: string;
    imagewidth: number;
    imageheight: number;
    margin: number;
    spacing: number;
    tiles?: Tile[];
    properties?: Property[];
    transparentcolor?: string;
    source?: string;
    tiledversion?: string;
    version?: string;
    type?: 'tileset';
    class?: string;
    grid?: Grid;
    tileoffset?: TileOffset;
    fillmode?: 'stretch' | 'preserve-aspect-fit';
    objectalignment?: 'unspecified' | 'topleft' | 'top' | 'topright' | 'left' | 'center' | 'right' | 'bottomleft' | 'bottom' | 'bottomright';
    tilerendersize?: 'tile' | 'grid';
    wangsets?: WangSet[];
    terrains?: Terrain[];
    transformations?: Transformations;
  }

  interface Tile {
    id: number;
    image?: string;
    imagewidth?: number;
    imageheight?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    properties?: Property[];
    objectgroup?: Layer & { type: 'objectgroup' };
    animation?: Frame[];
    type?: string;
    terrain?: number[];
    probability?: number;
  }

  interface Frame {
    tileid: number;
    duration: number;
  }

  interface Object {
    id: number;
    name: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    visible: boolean;
    properties: Property[];
    gid?: number;
    point?: boolean;
    ellipse?: boolean;
    polygon?: Point[];
    polyline?: Point[];
    text?: Text;
    template?: string;
    class?: string;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface Text {
    text: string;
    fontfamily: string;
    fontsize: number;
    wrap: boolean;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikeout: boolean;
    kerning: boolean;
    halign: 'left' | 'center' | 'right';
    valign: 'top' | 'center' | 'bottom';
  }

  interface Property {
    name: string;
    type: 'string' | 'int' | 'float' | 'bool' | 'color' | 'file' | 'object' | 'class' | 'enum';
    value: string | number | boolean;
  }

  interface Grid {
    height: number;
    width: number;
    orientation: 'orthogonal' | 'isometric';
  }

  interface TileOffset {
    x: number;
    y: number;
  }

  interface WangSet {
    name: string;
    tile: number;
    properties: Property[];
    wangtiles: WangTile[];
    colors: WangColor[];
    cornercolors?: WangColor[];
    edgecolors?: WangColor[];
    type?: string;
  }

  interface WangTile {
    wangid: number[];
    tileid: number;
    hflip?: boolean;
    vflip?: boolean;
    dflip?: boolean;
  }

  interface WangColor {
    color: string;
    name: string;
    tile: number;
    probability: number;
    properties: Property[];
  }

  interface Terrain {
    name: string;
    tile: number;
    properties: Property[];
  }

  interface Transformations {
    hflip: boolean;
    vflip: boolean;
    rotate: boolean;
    preferuntransformed: boolean;
  }
}

declare interface ProcessedMap {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  layers: ProcessedLayer[];
  tilesets: Map<number, SpriteSheets>;
  objects: GameObject[];
  collisionGrid: boolean[][];
}

declare interface ProcessedLayer {
  id: number;
  name: string;
  type: 'tilelayer' | 'objectgroup' | 'imagelayer';
  visible: boolean;
  opacity: number;
  data?: number[][] | undefined;
  chunks?: ProcessedChunk[] | undefined;
  offsetx: number;
  offsety: number;
  parallaxx: number;
  parallaxy: number;
}

declare interface ProcessedChunk {
  x: number;
  y: number;
  width: number;
  height: number;
  data: number[][];
}

declare interface GameObject {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: Map<string, string | number | boolean>;
  gid?: number | undefined;
  visible: boolean;
}
