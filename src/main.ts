window.addEventListener('load', async () => {
  const { Engine } = await import('@/core/engine');
  const { Player } = await import('@/objects/player/player');
  const { Monster } = await import('@/objects/monster/monster');
  const engine = new Engine();
  const objects = [new Player(), new Monster()];
  engine.setObjects(objects);
  engine.start();
});
