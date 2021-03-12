import { Event } from '../../elements/Event';
import { EventPublisher } from '../../publishers/EventPublisher';
import { RequestHandler } from 'express';

const getEvents = function ({ eventPublisher }: {
  eventPublisher: EventPublisher;
}): RequestHandler {
  return function (req, res): void {
    res.writeHead(200, {
      'content-type': 'application/x-ndjson'
    });

    setInterval((): void => {
      res.write(`${JSON.stringify({ ping: 'pong' })}\n`);
    }, 90_000);

    eventPublisher.on('domain-event', (event: Event): void => {
      res.write(`${JSON.stringify(event)}\n`);
    });
  };
};

export { getEvents };
