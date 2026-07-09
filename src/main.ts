window.addEventListener('load', async () => {
  const { Engine } = await import('@/core/engine');
  const { Map1 } = await import('@/scenes/map_1');
  const { Player } = await import('@/objects/player/player');
  const { Monster } = await import('@/objects/monster/monster');

  const engine = new Engine();

  const map1 = new Map1();
  map1.addObject(new Player());
  map1.addObject(new Monster());

  engine.addScene(map1);
  engine.start();
});
