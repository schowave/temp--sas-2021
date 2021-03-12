import { Event } from '../elements/Event';
import { flaschenpost } from 'flaschenpost';
import { ViewStore } from '../stores/ViewStore';

const logger = flaschenpost.getLogger();

const runProjections = function ({ viewStore, event }: {
  viewStore: ViewStore;
  event: Event;
}): void {
  const fullyQualifiedEventName = `${event.context}.${event.aggregate}.${event.name}`;

  logger.info('Received event.', { fullyQualifiedEventName, event });

  switch (fullyQualifiedEventName) {
    case 'playing.Game.opened': {
      viewStore.createGame({
        id: event.aggregateId,
        level: event.payload.level as number,
        question: event.payload.question as string
      });
      break;
    }

    case 'playing.Game.levelCompleted': {
      viewStore.updateGame(event.aggregateId, {
        level: event.payload.nextLevel as number,
        question: event.payload.nextQuestion as string
      });

      if (event.payload.level as number > viewStore.readHighscore()) {
        viewStore.updateHighscore(event.payload.level as number);
      }
      break;
    }

    case 'playing.Game.gameCompleted': {
      viewStore.deleteGame(event.aggregateId);
      break;
    }

    default: {
      break;
    }
  }
};

export { runProjections };
