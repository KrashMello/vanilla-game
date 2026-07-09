type ObjectOptions = { game: Engine, x: number, y: number, width: number, height: number, color: string }

type ObjectUpdateOptions = { deltaTime: number, canvas: HTMLCanvasElement, ctx: ctx }

interface Object {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speedX: number;
  speedY: number;
  depth: number;
  markedForDeletion: boolean;
  init(): Promise<void>;
  update(opt: ObjectUpdateOptions): void;
  draw(context: ctx): void;
}
