import { Component } from '@/core/component.js';

export class MovementComponent extends Component {
  hasBorderCollision: boolean;

  constructor(hasBorderCollision: boolean = true) {
    super();
    this.hasBorderCollision = hasBorderCollision;
  }

  update(_opt: ObjectUpdateOptions) {
    this.entity.x += this.entity.speedX;
    this.entity.y += this.entity.speedY;

    if (this.hasBorderCollision && this.entity.scene) {
      const camera = this.entity.scene.camera;
      const worldW = camera.worldWidth ?? Infinity;
      const worldH = camera.worldHeight ?? Infinity;
      if (this.entity.x < -12) {
        this.entity.x = -12;
      }
      if (this.entity.x > worldW - this.entity.width + 12) {
        this.entity.x = worldW - this.entity.width + 12;
      }
      if (this.entity.y < -12) {
        this.entity.y = -12;
      }
      if (this.entity.y > worldH - this.entity.height) {
        this.entity.y = worldH - this.entity.height;
      }
    }
  }
}
