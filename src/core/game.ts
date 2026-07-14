import { Engine } from './engine.js';
import { InputHandler } from './inputs.js';
import { SaveManager } from './save-manager.js';
import type { Scene } from './scene.js';

export class Game {
  engine: Engine;
  scenes: Scene[] = [];
  currentScene: Scene | null = null;

  constructor() {
    this.engine = new Engine(this);
  }

  addScene(scene: Scene) {
    this.scenes.push(scene);
    if (!this.currentScene) {
      this.currentScene = scene;
    }
  }

  removeScene(scene: Scene) {
    this.scenes = this.scenes.filter((s) => s !== scene);
    if (this.currentScene === scene) {
      this.currentScene = this.scenes[0] ?? null;
    }
  }

  async switchScene(scene: Scene) {
    if (this.currentScene) {
      this.saveCurrentState();
      this.currentScene.onExit();
    }
    this.currentScene = scene;
    if (!this.scenes.includes(scene)) {
      this.scenes.push(scene);
    }
    await scene.init();
  }

  async start() {
    for (const scene of this.scenes) {
      await scene.init();
    }

    const savedState = SaveManager.getInstance().load();
    if (savedState && this.currentScene) {
      this.currentScene.restoreSaveData(savedState);
    }

    setInterval(() => {
      this.saveCurrentState();
    }, 30000);

    await this.engine.start();
  }

  update(deltaTime: number) {
    InputHandler.getInstance().update();
    if (!this.currentScene) return;
    this.currentScene.update(deltaTime);
  }

  saveCurrentState() {
    if (!this.currentScene) return;
    const state = this.currentScene.getSaveData();
    if (state) {
      SaveManager.getInstance().save(state);
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

    if (this.currentScene) {
      this.currentScene.camera.apply(this.engine.ctx);
      this.currentScene.draw(this.engine.ctx);
      this.currentScene.camera.restore(this.engine.ctx);
    }

    this.engine.ctx.font = 'bold 20px Arial';
    this.engine.ctx.fillStyle = 'yellow';
    this.engine.ctx.fillText(`FPS:  ${this.engine.fpsDisplay}`, 10, 30);
  }
}
