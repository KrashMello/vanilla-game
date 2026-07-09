import { Object } from '@/core/Object.js';
import type { Sprite as SpriteType } from '@/core/sprite.js';

export class Player extends Object {
  maxSpeed: number;
  sprite_counter: number;
  position: string;
  animation_timer: number;
  sprite_index: number;
  sprite_animation: number;
  animation_max_column: boolean;
  sprite!: SpriteType;
  name: string = 'player';
  life: number = 100;
  max_life: number = 100;
  mana: number = 100;
  max_mana: number = 100;
  input!: InputHandler;
  spriteSheet!: SpriteSheets;
  constructor() {
    super()
    this.x = innerWidth / 2
    this.y = innerHeight / 2
    this.width = 44
    this.height = 44
    this.maxSpeed = 3
    this.sprite_counter = 0
    this.position = 'idle'
    this.animation_timer = 0
    this.sprite_index = 82
    this.sprite_animation = 2
    this.animation_max_column = false
  }

  async init() {
    const { SpriteSheets } = await import('@/core/spritesheet.js');
    this.spriteSheet = SpriteSheets.player;
    this.spriteSheet.init()
    const { InputHandler } = await import('@/core/inputs.js');
    this.input = InputHandler.getInstance();
  }

  animation(deltaTime: number) {
    this.animation_timer += deltaTime
    if (this.animation_timer > (1000 / this.sprite_animation)) {
      this.animation_timer -= (1000 / this.sprite_animation)
      this.sprite_counter++
      if (this.sprite_counter > this.sprite_animation - 1) {
        this.setAnimation()
        this.sprite_counter = 0
      }
    }
  }
  setAnimation() {
    if (this.position == 'idle') {
      this.sprite_index = 82
      this.sprite_animation = 2
    }
    else if (this.position == 'left') {
      this.sprite_index = 86
      this.sprite_animation = 6
    }
    else if (this.position == 'right') {
      this.sprite_index = 86
      this.sprite_animation = 6
    }
    else if (this.position == 'up') {
      this.sprite_index = 98
      this.sprite_animation = 5
    }
    else if (this.position == 'down') {
      this.sprite_index = 91
      this.sprite_animation = 6
    }

  }
  setPosition(position: string) {
    this.position = position
  }
  move() {
    this.setPosition('idle')
    if (this.input.LEFT) {
      this.speedX = -this.maxSpeed;
      this.setPosition('left')
    }
    if (this.input.RIGHT) {
      this.speedX = this.maxSpeed
      this.setPosition('right')
    }
    if (this.input.UP) {
      this.speedY = -this.maxSpeed
      this.setPosition('up')
    }
    if (this.input.DOWN) {
      this.speedY = this.maxSpeed
      this.setPosition('down')
    }
  }
  borderCollision(canvas: HTMLCanvasElement) {
    if (this.x < -12) {
      this.x = -12
    };
    if (this.x > canvas.width - this.width + 12) {
      this.x = canvas.width - this.width + 12
    }
    if (this.y < -12) {
      this.y = -12;
    }
    if (this.y > canvas.height - this.height) {
      this.y = canvas.height - this.height;
    }
  }
  collisionBox(context: ctx) {
    context.strokeStyle = this.color;
    context.strokeRect(this.x + 12, this.y + 12, 19, 32);
  }
  update(opt: ObjectUpdateOptions) {
    const { deltaTime, canvas, ctx } = opt;
    this.speedX = 0
    this.speedY = 0
    this.move()
    this.animation(deltaTime)
    super.update(opt);
    this.borderCollision(canvas);
  }
  printName(context: ctx) {
    context.fillStyle = this.color;
    context.font = 'bold 10px Arial';
    context.fillText(this.name, this.x, this.y - 8)
  }
  printLifeBar(context: ctx) {
    const size = this.spriteSheet.sprite_size ?? this.width;
    context.fillStyle = 'gray';
    context.fillRect(this.x, this.y - 4, size, 3);
    context.fillStyle = 'green';
    context.fillRect(this.x, this.y - 4, (size * this.life) / this.max_life, 3);
  }
  printManaBar(context: ctx) {
    const size = this.spriteSheet.sprite_size ?? this.width;
    context.fillStyle = 'gray';
    context.fillRect(this.x, this.y, size, 3);
    context.fillStyle = 'blue';
    context.fillRect(this.x, this.y, (size * this.mana) / this.max_mana, 3);
  }
  draw(context: ctx) {
    this.printName(context)
    this.printLifeBar(context)
    this.printManaBar(context)
    this.spriteSheet.sprite.draw({ context, index: this.sprite_index + this.sprite_counter, x: this.x, y: this.y })
    this.collisionBox(context);
  }
}
