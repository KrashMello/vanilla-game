import { SaveManager } from '@/core/save-manager.js';

window.addEventListener('load', async () => {
  const { Game } = await import('@/core/game.js');
  const { Scene_1 } = await import('@/scenes/scene_1.js');
  const game = new Game();
  const scene_1 = new Scene_1(game.engine.canvas, 'map_3.json');
  game.addScene(scene_1);

  const savedState = SaveManager.getInstance().load();
  if (savedState) {
    scene_1.restoreSaveData(savedState);
  }

  game.start();
});
