import { InputHandler } from './inputs';

export class Engine {
  fps: number = 0;
  UPS: number = 60;
  frameTimer: number = 0;
  fpsCount: number = 0;
  fpsDisplay: number = 0;
  fpsRefreshTimer: number = 0;
  canvas: HTMLCanvasElement;
  ctx: ctx;
  width: number;
  height: number;
  lastTime: number;
  FRAME_INTERVAL: number;
  scenes: Scene[] = [];

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!this.canvas) throw new Error('Canvas not found');
    this.ctx = this.canvas.getContext('2d') as ctx;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.lastTime = 0;
    this.FRAME_INTERVAL = 1000 / this.UPS;
  }
  addScene(scene: Scene) {
    this.scenes.push(scene);
  }
  removeScene(scene: Scene) {
    this.scenes = this.scenes.filter((s) => s !== scene);
  }

  async start() {
    for (const scene of this.scenes) {
      await scene.init();
    }
    await this.run(0);
  }

  async update(deltaTime: number) {
    InputHandler.getInstance().update();
    const opt: ObjectUpdateOptions = { deltaTime, canvas: this.canvas, ctx: this.ctx };
    for (const scene of this.scenes) {
      scene.update(opt);
    }
  }

  async draw() {
    this.fps++;
    if (!this.canvas) throw new Error('Canvas not found');
    if (!this.ctx) throw new Error('Context not found');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.width !== window.innerWidth || this.height !== window.innerHeight) {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    const sorted = [...this.scenes].sort((a, b) => a.depth - b.depth);
    for (const scene of sorted) {
      scene.draw(this.ctx);
    }
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillText(`FPS:  ${this.fpsDisplay}`, 10, 30);
  }

  async run(time: number) {
    const delta = time - this.lastTime;
    this.lastTime = time;
    this.frameTimer += delta;
    this.fpsRefreshTimer += delta;
    if (this.fpsRefreshTimer >= this.FRAME_INTERVAL) {
      this.update(delta);
      this.frameTimer -= this.FRAME_INTERVAL;
    }
    if (this.fpsRefreshTimer >= 1000) {
      this.fpsDisplay = this.fps;
      this.fps = 0;
      this.fpsRefreshTimer = 0;
    }
    this.draw();
    requestAnimationFrame((t) => this.run(t));
  }
}
