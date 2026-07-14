import { Entity } from '@/core/entity.js';
import type { PlayerSaveData } from '@/core/save-manager.js';
import { AnimationComponent } from '@/objects/player/components/animation.js';
import { HealthBarComponent } from '@/objects/player/components/health-bar.js';
import { InputComponent } from '@/objects/player/components/input.js';
import { MovementComponent } from '@/objects/player/components/movement.js';
import { SpriteRendererComponent } from '@/objects/player/components/sprite-renderer.js';

const playerAnimations: AnimationFrames = {
  idle: { index: 82, frames: 2 },
  left: { index: 86, frames: 6 },
  right: { index: 86, frames: 6 },
  up: { index: 98, frames: 5 },
  down: { index: 91, frames: 6 }
};

export class Player extends Entity {
  constructor() {
    super();
    this.x = innerWidth / 2;
    this.y = innerHeight / 2;
    this.width = 44;
    this.height = 44;
    this.maxSpeed = 3;

    this.addComponent(new InputComponent());
    this.addComponent(new MovementComponent(true));
    this.addComponent(new AnimationComponent(playerAnimations));
    this.addComponent(new SpriteRendererComponent('player'));
    this.addComponent(new HealthBarComponent('player', 100, 100, 100, 100));
  }

  getSaveData(): PlayerSaveData {
    const healthBar = this.getComponent(HealthBarComponent);
    return {
      x: this.x,
      y: this.y,
      life: healthBar?.life ?? 100,
      max_life: healthBar?.max_life ?? 100,
      mana: healthBar?.mana ?? 100,
      max_mana: healthBar?.max_mana ?? 100
    };
  }

  restoreSaveData(data: PlayerSaveData): void {
    this.x = data.x;
    this.y = data.y;
    const healthBar = this.getComponent(HealthBarComponent);
    if (healthBar) {
      healthBar.life = data.life;
      healthBar.max_life = data.max_life;
      healthBar.mana = data.mana;
      healthBar.max_mana = data.max_mana;
    }
  }
}
