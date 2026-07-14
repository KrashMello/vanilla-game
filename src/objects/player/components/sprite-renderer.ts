import { Component } from '@/core/component.js';
import { AnimationComponent } from './animation.js';

export class SpriteRendererComponent extends Component {
  spriteSheet!: SpriteSheets;

  constructor(private spriteSheetKey: 'player' | 'scene_1') {
    super();
  }

  async init() {
    const { SpriteSheets } = await import('@/core/spritesheet.js');
    this.spriteSheet = SpriteSheets[this.spriteSheetKey];
    await this.spriteSheet.init();
    (this.entity as any)._spriteSheet = this.spriteSheet;
  }

  draw(context: ctx) {
    if (!this.spriteSheet?.sprite) return;

    const anim = this.entity.getComponent(AnimationComponent);
    const index = anim ? anim.sprite_index + anim.sprite_counter : 82;

    this.spriteSheet.sprite.draw({
      context,
      index,
      x: this.entity.x,
      y: this.entity.y
    });

    context.strokeStyle = this.entity.color;
    context.strokeRect(this.entity.x + 12, this.entity.y + 12, 19, 32);
  }
}
