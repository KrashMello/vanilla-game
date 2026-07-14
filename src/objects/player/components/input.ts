import { Component } from '@/core/component.js';

export class InputComponent extends Component {
  async init() {
    const { InputHandler } = await import('@/core/inputs.js');
    (this.entity as any)._inputHandler = InputHandler.getInstance();
  }

  update() {
    const input = (this.entity as any)._inputHandler;
    if (!input) return;

    this.entity.speedX = 0;
    this.entity.speedY = 0;
    this.entity.direction = 'idle';

    if (input.LEFT) {
      this.entity.speedX = -this.entity.maxSpeed;
      this.entity.direction = 'left';
    }
    if (input.RIGHT) {
      this.entity.speedX = this.entity.maxSpeed;
      this.entity.direction = 'right';
    }
    if (input.UP) {
      this.entity.speedY = -this.entity.maxSpeed;
      this.entity.direction = 'up';
    }
    if (input.DOWN) {
      this.entity.speedY = this.entity.maxSpeed;
      this.entity.direction = 'down';
    }
  }
}
