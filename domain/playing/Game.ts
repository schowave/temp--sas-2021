import { Aggregate } from '../../elements/Aggregate';
import riddles from './riddles.json';

class Game extends Aggregate {
  private hasBeenOpened: boolean;

  private currentLevel: number | undefined;

  private hasBeenCompleted: boolean;

  public constructor ({ aggregateId }: {
    aggregateId: string;
  }) {
    super({
      context: 'playing',
      aggregate: 'Game',
      aggregateId
    });

    this.hasBeenOpened = false;
    this.currentLevel = undefined;
    this.hasBeenCompleted = false;
  }

  public open (): void {
    if (this.hasBeenOpened) {
      throw new Error('Game has already been opened.');
    }

    const level = 1;
    const { question } = riddles[level - 1];

    this.publishEvent('opened', {
      level,
      question
    });
  }

  public opened ({ level }: {
    level: number;
    question: string;
  }): void {
    this.hasBeenOpened = true;
    this.currentLevel = level;
  }

  public makeGuess ({ guess }: {
    guess: string;
  }): void {
    if (!this.hasBeenOpened) {
      throw new Error('Game has not yet been opened.');
    }
    if (this.hasBeenCompleted) {
      throw new Error('Game has already been completed.');
    }

    this.publishEvent('guessMade', {
      level: this.currentLevel,
      guess
    });

    const { answer } = riddles[this.currentLevel! - 1];

    if (guess.toLowerCase() !== answer.toLowerCase()) {
      this.publishEvent('guessWasWrong', {
        level: this.currentLevel,
        guess
      });

      return;
    }

    this.publishEvent('guessWasRight', {
      level: this.currentLevel,
      guess
    });

    const nextLevel = this.currentLevel! + 1 <= riddles.length ?
      this.currentLevel! + 1 :
      undefined;
    const nextQuestion = nextLevel ?
      riddles[nextLevel - 1].question :
      undefined;

    this.publishEvent('levelCompleted', {
      level: this.currentLevel,
      nextLevel,
      nextQuestion
    });

    if (!nextLevel) {
      this.publishEvent('gameCompleted', {});
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public guessMade (): void {
    // Intentionally left blank.
  }

  // eslint-disable-next-line class-methods-use-this
  public guessWasWrong (): void {
    // Intentionally left blank.
  }

  // eslint-disable-next-line class-methods-use-this
  public guessWasRight (): void {
    // Intentionally left blank.
  }

  public levelCompleted ({ nextLevel }: {
    nextLevel: number | undefined;
  }): void {
    this.currentLevel = nextLevel;
  }

  public gameCompleted (): void {
    this.hasBeenCompleted = true;
  }
}

export { Game };
