interface InputHandler {
  keys: boolean[];
  UP: boolean;
  DOWN: boolean;
  LEFT: boolean;
  RIGHT: boolean;
  setKey(key: number, value: boolean): void;
  getKey(key: number): boolean;
  update(): void;
}
