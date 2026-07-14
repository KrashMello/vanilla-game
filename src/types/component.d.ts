interface Component {
  entity: Entity;
  setEntity(entity: Entity): void;
  init(): Promise<void>;
  update(opt: ObjectUpdateOptions): void;
  draw(context: ctx): void;
}

interface AnimationFrames {
  idle: { index: number; frames: number };
  left: { index: number; frames: number };
  right: { index: number; frames: number };
  up: { index: number; frames: number };
  down: { index: number; frames: number };
}
