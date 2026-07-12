interface Scene {
  entities: Entity[];
  map: GameMap | null;
  camera: Camera;
  depth: number;
  addEntity(entity: Entity): void;
  removeEntity(entity: Entity): void;
  init(): Promise<void>;
  onEnter(): Promise<void> | void;
  onExit(): void;
  update(opt: ObjectUpdateOptions): void;
  draw(context: ctx): void;
}
