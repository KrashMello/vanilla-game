export class Scene implements Scene {
  objects: Object[] = [];
  spriteSheet!: SpriteSheets;
  depth: number = 0;
  constructor() { }
  addObject(object: any) {
    this.objects.push(object);
  }
  async init() {
    await Promise.all(this.objects.map((o) => o.init()));
  }
  update(opt: ObjectUpdateOptions) {
    this.objects.forEach((o) => o.update(opt));
  }
  draw(context: ctx) {
    const sorted = [...this.objects].sort((a, b) => a.depth - b.depth);
    sorted.forEach((o) => o.draw(context));
  }
}
