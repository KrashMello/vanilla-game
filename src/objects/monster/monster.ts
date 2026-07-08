import { Player } from '@/objects/player/player';

export class Monster extends Player {
  constructor() {
    super()
    this.x = 800
    this.y = 500
    this.width = 44
    this.height = 44
    this.color = 'yellow'
    this.maxSpeed = 5;
    this.sprite_counter = 0
    this.position = 'idle'
    this.animation_timer = 0
    this.column = 2
    this.row = 8
    this.sprite_animation = 2
    this.animation_max_column = false
    this.name = 'monster'
    this.life = 200
    this.max_life = 200
  }
  async init() {
    const { Sprite } = await import('@/core/sprite.js');
    const { SpriteSheets } = await import('@/core/spritesheet.js');
    const spriteSheet = SpriteSheets.player.spriteSheet;
    this.sprite = new Sprite({
      x: this.x,
      y: this.y,
      row: this.row,
      column: this.column,
      size: 44,
      spriteSheet: spriteSheet
    });
  }
  move() { }
}
