import type { Game } from './game.js';

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
  lastTime: number = 0;
  FRAME_INTERVAL: number;
  game: Game;

  constructor(game: Game) {
    this.game = game;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!this.canvas) throw new Error('Canvas not found');
    this.ctx = this.canvas.getContext('2d') as ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.FRAME_INTERVAL = 1000 / this.UPS;
  }

  async start() {
    await this.run(0);
  }

  private async run(time: number) {
    const delta = time - this.lastTime;
    this.lastTime = time;
    this.frameTimer += delta;
    this.fpsRefreshTimer += delta;

    if (this.fpsRefreshTimer >= this.FRAME_INTERVAL) {
      this.game.update(delta);
      this.frameTimer -= this.FRAME_INTERVAL;
    }

    if (this.fpsRefreshTimer >= 1000) {
      this.fpsDisplay = this.fps;
      this.fps = 0;
      this.fpsRefreshTimer = 0;
    }

    this.fps++;
    this.game.draw();
    requestAnimationFrame((t) => this.run(t));
  }
}
