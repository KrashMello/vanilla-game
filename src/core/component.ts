import type { Entity } from './entity.js';

export abstract class Component {
  entity: Entity = null!;

  setEntity(entity: Entity) {
    this.entity = entity;
  }

  async init() {}

  update(deltaTime: number) {}

  draw(_context: ctx) {}
}
