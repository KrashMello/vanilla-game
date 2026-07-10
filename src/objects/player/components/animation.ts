import { Component } from '@/core/component.js';

export interface AnimationFrames {
  idle: { index: number; frames: number };
  left: { index: number; frames: number };
  right: { index: number; frames: number };
  up: { index: number; frames: number };
  down: { index: number; frames: number };
}

export class AnimationComponent extends Component {
  frames: AnimationFrames;
  sprite_counter: number = 0;
  animation_timer: number = 0;
  sprite_index: number = 82;
  sprite_animation: number = 2;
  sprite_fps: number = 2;
  private lastDirection: string = '';

  constructor(frames: AnimationFrames) {
    super();
    this.frames = frames;
  }

  update(opt: ObjectUpdateOptions) {
    const dir = this.entity.direction;
    if (dir !== this.lastDirection) {
      this.lastDirection = dir;
      this.sprite_counter = 0;
      this.animation_timer = 0;
      const anim = this.frames[dir as keyof AnimationFrames];
      if (anim) {
        this.sprite_index = anim.index;
        this.sprite_animation = anim.frames;
      }
    }

    this.animation_timer += opt.deltaTime;
    if (this.animation_timer > 1000 / this.sprite_fps) {
      this.animation_timer -= 1000 / this.sprite_fps;
      this.sprite_counter++;
      if (this.sprite_counter > this.sprite_animation - 1) {
        this.sprite_counter = 0;
      }
    }
  }
}
