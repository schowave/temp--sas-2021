import { Event } from './elements/Event';
import { EventPublisher } from './publishers/EventPublisher';
import { EventStore } from './stores/EventStore';
import { flaschenpost } from 'flaschenpost';
import { getApi } from './apis/getApi';
import http from 'http';
import { processenv } from 'processenv';
import { runProjections } from './projections/runProjections';
import { ViewStore } from './stores/ViewStore';

const logger = flaschenpost.getLogger();

const eventStore = new EventStore();
const eventPublisher = new EventPublisher();
const viewStore = new ViewStore();

eventPublisher.on('domain-event', ({ event }: {
  event: Event;
}): void => {
  runProjections({ viewStore, event });
});

const server = http.createServer(getApi({
  eventStore,
  eventPublisher,
  viewStore
}));

const port = processenv('PORT', 3_000) as number;

server.listen(port, (): void => {
  logger.info('Server started.', { port });
});
