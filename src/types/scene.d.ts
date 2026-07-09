interface Scene {
  objects: Object[];
  spriteSheet: SpriteSheets;
  depth: number;
  addObject(object: Object): void;
  init(): Promise<void>;
  update(opt: ObjectUpdateOptions): void;
  draw(context: ctx): void;
}
