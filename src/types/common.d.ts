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
  game: Game;
  start(): Promise<void>;
}
