export interface GameModel {
  whitePlayerToken: string;
  blackPlayerToken: string;
  fen: string;
  moveHistory: string[];
}

export interface GameParams {
  token: string;
}
