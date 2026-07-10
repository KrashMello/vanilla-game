import type { Component } from './component.js';
import type { Scene } from './scene.js';

export class Entity {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  color: string = 'yellow';
  speedX: number = 0;
  speedY: number = 0;
  depth: number = 0;
  markedForDeletion: boolean = false;

  maxSpeed: number = 3;
  direction: string = 'idle';

  scene: Scene | null = null;
  private components: Component[] = [];

  addComponent(component: Component) {
    component.setEntity(this);
    this.components.push(component);
  }

  removeComponent(component: Component) {
    this.components = this.components.filter((c) => c !== component);
  }

  getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
    return this.components.find((c) => c instanceof type) as T | undefined;
  }

  async init() {
    await Promise.all(this.components.map((c) => c.init()));
  }

  update(opt: ObjectUpdateOptions) {
    for (const component of this.components) {
      component.update(opt);
    }
  }

  draw(context: ctx) {
    for (const component of this.components) {
      component.draw(context);
    }
  }
}
