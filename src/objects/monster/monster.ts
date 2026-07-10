import { Player } from '@/objects/player/player';

export class Monster extends Player {
  constructor() {
    super();
    this.x = 800;
    this.y = 500;
    this.width = 44;
    this.height = 44;
    this.color = 'yellow';
    this.maxSpeed = 5;
    this.sprite_counter = 0;
    this.position = 'idle';
    this.animation_timer = 0;
    this.sprite_animation = 2;
    this.animation_max_column = false;
    this.name = 'monster';
    this.life = 200;
    this.max_life = 200;
  }

  move() {}
}
