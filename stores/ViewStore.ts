interface GamesRow {
  id: string;
  level: number;
  question: string;
}

class ViewStore {
  private games: GamesRow[];

  private highscore: number;

  public constructor () {
    this.games = [];
    this.highscore = 0;
  }

  public createGame (game: GamesRow): void {
    this.games.push(game);
  }

  public readGames (): GamesRow[] {
    return this.games;
  }

  public updateGame (id: string, updatedGameData: Omit<GamesRow, 'id'>): void {
    const gameToUpdate = this.games.find((game): boolean => game.id === id);

    gameToUpdate!.level = updatedGameData.level;
    gameToUpdate!.question = updatedGameData.question;
  }

  public deleteGame (id: string): void {
    this.games = this.games.filter((game): boolean => game.id !== id);
  }

  public readHighscore (): number {
    return this.highscore;
  }

  public updateHighscore (highscore: number): void {
    this.highscore = highscore;
  }
}

export { ViewStore };
