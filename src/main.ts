window.addEventListener('load', async () => {
  const { Game } = await import('@/core/game');
  const { Map1 } = await import('@/scenes/map_1');
  const game = new Game();
  const map1 = new Map1(game.engine.canvas);
  game.addScene(map1);
  game.start();
});
