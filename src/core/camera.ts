import type { Entity } from './entity.js';

export class Camera {
  x: number = 0;
  y: number = 0;
  width: number;
  height: number;
  target: Entity | null = null;

  worldWidth: number | null = null;
  worldHeight: number | null = null;
  mode: CameraMode = 'instant';
  playerMode: PlayerMode = 'centered';
  lerpFactor: number = 0.1;
  deadZone: DeadZone = { x: 0, y: 0, width: 100, height: 80 };
  offset: { x: number; y: number } = { x: 0, y: 0 };
  zoom: number = 2;

  constructor(canvas: HTMLCanvasElement, options?: CameraOptions) {
    this.width = canvas.width;
    this.height = canvas.height;
    if (options) {
      if (options.worldWidth !== undefined) this.worldWidth = options.worldWidth;
      if (options.worldHeight !== undefined) this.worldHeight = options.worldHeight;
      if (options.mode) this.mode = options.mode;
      if (options.playerMode) this.playerMode = options.playerMode;
      if (options.lerpFactor !== undefined) this.lerpFactor = options.lerpFactor;
      if (options.deadZone) this.deadZone = options.deadZone;
      if (options.zoom !== undefined) this.zoom = Math.ceil(options.zoom);
    }
  }

  follow(target: Entity) {
    this.target = target;
  }

  setZoom(value: number) {
    this.zoom = Math.ceil(value);
  }

  update() {
    if (!this.target) return;

    let targetX: number;
    let targetY: number;

    if (this.playerMode === 'centered') {
      targetX = this.target.x + this.target.width / 2 - this.width / 2;
      targetY = this.target.y + this.target.height / 2 - this.height / 2;
    } else {
      targetX = this.target.x + this.target.width / 2 - this.width / 2 + this.offset.x;
      targetY = this.target.y + this.target.height / 2 - this.height / 2 + this.offset.y;
    }

    if (this.mode === 'instant') {
      this.x = targetX;
      this.y = targetY;
    } else if (this.mode === 'smooth') {
      this.x += (targetX - this.x) * this.lerpFactor;
      this.y += (targetY - this.y) * this.lerpFactor;
    } else if (this.mode === 'deadzone') {
      const dzCenterX = this.x + this.width / 2;
      const dzCenterY = this.y + this.height / 2;
      const playerCenterX = this.target.x + this.target.width / 2;
      const playerCenterY = this.target.y + this.target.height / 2;
      const halfDzW = this.deadZone.width / 2;
      const halfDzH = this.deadZone.height / 2;

      if (playerCenterX < dzCenterX - halfDzW) {
        this.x = playerCenterX + halfDzW - this.width / 2;
      } else if (playerCenterX > dzCenterX + halfDzW) {
        this.x = playerCenterX - halfDzW - this.width / 2;
      }

      if (playerCenterY < dzCenterY - halfDzH) {
        this.y = playerCenterY + halfDzH - this.height / 2;
      } else if (playerCenterY > dzCenterY + halfDzH) {
        this.y = playerCenterY - halfDzH - this.height / 2;
      }
    }

    // this.clampToBounds();
  }

  clampToBounds() {
    const minX = (this.width * (1 - this.zoom)) / (2 * this.zoom);
    const minY = (this.height * (1 - this.zoom)) / (2 * this.zoom);
    const maxX =
      this.worldWidth !== null
        ? this.worldWidth - (this.width * (this.zoom + 1)) / (2 * this.zoom)
        : Infinity;
    const maxY =
      this.worldHeight !== null
        ? this.worldHeight - (this.height * (this.zoom + 1)) / (2 * this.zoom)
        : Infinity;
    this.x = Math.max(minX, Math.min(this.x, maxX));
    this.y = Math.max(minY, Math.min(this.y, maxY));
  }

  apply(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.width / this.zoom, this.height / this.zoom);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.width / this.zoom, -this.height / this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  restore(ctx: CanvasRenderingContext2D) {
    ctx.restore();
  }

  screenToWorld(sx: number, sy: number): { x: number; y: number } {
    return {
      x: (sx - this.width / 2) / this.zoom + this.width / 2 + this.x,
      y: (sy - this.height / 2) / this.zoom + this.height / 2 + this.y
    };
  }

  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: (wx - this.x - this.width / 2) * this.zoom + this.width / 2,
      y: (wy - this.y - this.height / 2) * this.zoom + this.height / 2
    };
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
