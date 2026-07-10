import type { Scene } from './scene.js';
import { Engine } from './engine.js';
import { InputHandler } from './inputs.js';

export class Game {
  engine: Engine;
  scenes: Scene[] = [];

  constructor() {
    this.engine = new Engine(this);
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
    await this.engine.start();
  }

  update(deltaTime: number) {
    InputHandler.getInstance().update();
    for (const scene of this.scenes) {
      const opt: ObjectUpdateOptions = {
        deltaTime,
        canvas: this.engine.canvas,
        ctx: this.engine.ctx,
        camera: scene.camera
      };
      scene.update(opt);
    }
  }

  draw() {
    this.engine.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);

    if (this.engine.width !== window.innerWidth || this.engine.height !== window.innerHeight) {
      this.engine.width = this.engine.canvas.width = window.innerWidth;
      this.engine.height = this.engine.canvas.height = window.innerHeight;
      for (const scene of this.scenes) {
        scene.camera.resize(this.engine.width, this.engine.height);
      }
    }

    const sorted = [...this.scenes].sort((a, b) => a.depth - b.depth);
    for (const scene of sorted) {
      scene.camera.apply(this.engine.ctx);
      scene.draw(this.engine.ctx);
      scene.camera.restore(this.engine.ctx);
    }

    this.engine.ctx.font = 'bold 20px Arial';
    this.engine.ctx.fillStyle = 'yellow';
    this.engine.ctx.fillText(`FPS:  ${this.engine.fpsDisplay}`, 10, 30);
  }
}
