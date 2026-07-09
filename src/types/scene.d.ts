interface Scene {
  objects: Object[];
  spriteSheet: SpriteSheets;
  init(): Promise<void>;
  update(opt: ObjectUpdateOptions): void;
  draw(context: ctx): void;
}
