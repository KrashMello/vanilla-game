import { Key } from 'ts-keycode-enum';

export class InputHandler {
  TOTAL_KEYS: number = 222;
  keys: boolean[] = Array(this.TOTAL_KEYS).fill(false);
  UP: boolean = false;
  DOWN: boolean = false;
  LEFT: boolean = false;
  RIGHT: boolean = false;
  JUMP: boolean = false;
  private static instance: InputHandler | null;
  constructor() {
    window.addEventListener('keydown', (e) => {
      this.setKey(e.keyCode, true);
    });

    window.addEventListener('keyup', (e) => {
      this.setKey(e.keyCode, false);
    });
  }
  static getInstance(): InputHandler {
    if (!InputHandler.instance) InputHandler.instance = new InputHandler();
    return InputHandler.instance;
  }
  setKey(key: number, value: boolean) {
    this.keys[key] = value;
  }
  getKey(key: number): boolean {
    return this.keys[key] ?? false;
  }
  update() {
    this.UP = this.getKey(Key.W) || this.getKey(Key.UpArrow) || this.getKey(Key.K);
    this.DOWN = this.getKey(Key.S) || this.getKey(Key.DownArrow) || this.getKey(Key.J);
    this.LEFT = this.getKey(Key.A) || this.getKey(Key.LeftArrow) || this.getKey(Key.H);
    this.RIGHT = this.getKey(Key.D) || this.getKey(Key.RightArrow) || this.getKey(Key.L);
    this.JUMP = this.getKey(Key.Space);
  }
}
