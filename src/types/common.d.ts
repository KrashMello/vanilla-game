type ctx = CanvasRenderingContext2D;
interface Engine {
  fps: number;
  UPS: number;
  frameTimer: number;
  fpsCount: number;
  fpsDisplay: number;
  fpsRefreshTimer: number;
  canvas: HTMLCanvasElement;
  ctx: ctx;
  width: number;
  height: number;
  lastTime: number;
  FRAME_INTERVAL: number;
  scenes: Scene[];
  addScene(scene: Scene): void;
  removeScene(scene: Scene): void;
  start(): Promise<void>;
  update(deltaTime: number): Promise<void>;
  draw(): Promise<void>;
  run(time: number): Promise<void>;
}
