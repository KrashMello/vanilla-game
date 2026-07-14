const SAVE_KEY = 'game_save';

export interface PlayerSaveData {
  x: number;
  y: number;
  life: number;
  max_life: number;
  mana: number;
  max_mana: number;
}

export interface GameState {
  sceneName: string;
  player: PlayerSaveData;
  camera: {
    zoom: number;
  };
}

export class SaveManager {
  private static instance: SaveManager;

  private constructor() {}

  static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  save(state: GameState): void {
    try {
      const data = JSON.stringify(state);
      localStorage.setItem(SAVE_KEY, data);
    } catch (e) {
      console.error('Fallo al guardar el juego:', e);
    }
  }

  load(): GameState | null {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (!data) return null;
      return JSON.parse(data) as GameState;
    } catch (e) {
      console.error('Fallo al cargar el juego:', e);
      return null;
    }
  }

  hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  clear(): void {
    localStorage.removeItem(SAVE_KEY);
  }
}
