import { Component } from '@/core/component.js';

export class HealthBarComponent extends Component {
  name: string;
  life: number;
  max_life: number;
  mana: number;
  max_mana: number;

  constructor(
    name: string = 'entity',
    life: number = 100,
    max_life: number = 100,
    mana: number = 100,
    max_mana: number = 100
  ) {
    super();
    this.name = name;
    this.life = life;
    this.max_life = max_life;
    this.mana = mana;
    this.max_mana = max_mana;
  }

  draw(context: ctx) {
    const spriteSheet = (this.entity as any)._spriteSheet as SpriteSheets | undefined;
    const size = spriteSheet?.sprite_size ?? this.entity.width;

    context.fillStyle = this.entity.color;
    context.font = 'bold 10px Arial';
    context.fillText(this.name, this.entity.x, this.entity.y - 8);

    context.fillStyle = 'gray';
    context.fillRect(this.entity.x, this.entity.y - 4, size, 3);
    context.fillStyle = 'green';
    context.fillRect(this.entity.x, this.entity.y - 4, (size * this.life) / this.max_life, 3);

    if (this.max_mana > 0) {
      context.fillStyle = 'gray';
      context.fillRect(this.entity.x, this.entity.y, size, 3);
      context.fillStyle = 'blue';
      context.fillRect(this.entity.x, this.entity.y, (size * this.mana) / this.max_mana, 3);
    }
  }
}
