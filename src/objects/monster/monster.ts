import { HealthBarComponent } from '@/objects/player/components/health-bar';
import { InputComponent } from '@/objects/player/components/input';
import { Player } from '@/objects/player/player.js';

const monsterAnimations = {
  idle: { index: 82, frames: 2 },
  left: { index: 86, frames: 6 },
  right: { index: 86, frames: 6 },
  up: { index: 98, frames: 5 },
  down: { index: 91, frames: 6 }
};

export class Monster extends Player {
  constructor() {
    super();
    this.x = 800;
    this.y = 500;
    this.width = 44;
    this.height = 44;
    this.maxSpeed = 5;
    const input = this.getComponent(InputComponent);
    if (input) this.removeComponent(input);
    const health_bar = this.getComponent(HealthBarComponent);
    if (health_bar) this.removeComponent(health_bar);
    this.addComponent(new HealthBarComponent('monster', 200, 200, 0, 0));
  }
}
