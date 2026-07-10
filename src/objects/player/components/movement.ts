import { Component } from '@/core/component.js';
import type { GameMap } from '@/core/map.js';

export class MovementComponent extends Component {
  hasBorderCollision: boolean;
  hasTileCollision: boolean;

  constructor(hasBorderCollision: boolean = true, hasTileCollision: boolean = false) {
    super();
    this.hasBorderCollision = hasBorderCollision;
    this.hasTileCollision = hasTileCollision;
  }

  update(_opt: ObjectUpdateOptions) {
    const nextX = this.entity.x + this.entity.speedX;
    const nextY = this.entity.y + this.entity.speedY;

    if (this.hasTileCollision && this.entity.scene?.map) {
      const map = this.entity.scene.map;
      const canMoveX = this.checkTileCollision(nextX, this.entity.y, map);
      const canMoveY = this.checkTileCollision(this.entity.x, nextY, map);

      if (canMoveX) {
        this.entity.x = nextX;
      }
      if (canMoveY) {
        this.entity.y = nextY;
      }
    } else {
      this.entity.x = nextX;
      this.entity.y = nextY;
    }

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

  private checkTileCollision(x: number, y: number, map: GameMap): boolean {
    const corners = [
      { x: x + 4, y: y + 4 },
      { x: x + this.entity.width - 4, y: y + 4 },
      { x: x + 4, y: y + this.entity.height - 4 },
      { x: x + this.entity.width - 4, y: y + this.entity.height - 4 }
    ];

    for (const corner of corners) {
      if (map.isSolidAtPixel(corner.x, corner.y)) {
        return false;
      }
    }

    return true;
  }
}
