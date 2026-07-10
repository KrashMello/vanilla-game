export class Object {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  color: string = 'yellow';
  speedX: number = 0;
  speedY: number = 0;
  depth: number = 0;
  markedForDeletion: boolean = false;
  constructor() {}

  async init() {}

  update(opt: ObjectUpdateOptions) {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(context: ctx) {
    context.strokeStyle = this.color;
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
}
