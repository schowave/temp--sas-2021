import { EventPublisher } from '../../publishers/EventPublisher';
import { EventStore } from '../../stores/EventStore';
import { flaschenpost } from 'flaschenpost';
import { Game } from '../../domain/playing/Game';
import { RequestHandler } from 'express';
import { v4 as uuid } from 'uuid';

const logger = flaschenpost.getLogger();

const openGame = function ({ eventStore, eventPublisher }: {
  eventStore: EventStore;
  eventPublisher: EventPublisher;
}): RequestHandler {
  return function (req, res): void {
    res.status(200).end();

    logger.info('Open game requested.');

    const aggregateId = uuid();
    const game = new Game({ aggregateId });

    for (const event of eventStore.getEvents({
      context: 'playing',
      aggregate: 'Game',
      aggregateId
    })) {
      (game as any)[event.name](event.payload);
    }

    game.open();

    for (const event of game.unpublishedEvents) {
      eventStore.storeEvent({ event });
      eventPublisher.publish({ event });
    }
  };
};

export { openGame };
