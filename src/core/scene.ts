export class Scene implements Scene {
  objects: Object[] = [];
  spriteSheet!: SpriteSheets;
  constructor() { }
  addObject(object: any) {
    this.objects.push(object);
  }
  async init() {
    // await Promise.all(this.objects.map((o) => o.init()));
  }
  update(opt: ObjectUpdateOptions) {
    // this.objects.forEach((o) => o.update({ deltaTime, canvas: this.canvas, ctx: this.ctx }));
  }
  draw(context: ctx) {
    // this.objects.forEach((o) => o.draw(this.ctx));
  }
}
