export class State {
  state: string;
  game: Engine;
  constructor(state: string, game: Engine) {
    this.state = state
    this.game = game
  }
}

