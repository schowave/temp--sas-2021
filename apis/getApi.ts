import cors from 'cors';
import { EventPublisher } from '../publishers/EventPublisher';
import { EventStore } from '../stores/EventStore';
import { getEvents } from './events/getEvents';
import { getGames } from './queries/getGames';
import { getHighscore } from './queries/getHighscore';
import { json } from 'body-parser';
import { makeGuess } from './commands/makeGuess';
import { openGame } from './commands/openGame';
import { ViewStore } from '../stores/ViewStore';
import express, { Application } from 'express';

const getApi = function ({ eventStore, eventPublisher, viewStore }: {
  eventStore: EventStore;
  eventPublisher: EventPublisher;
  viewStore: ViewStore;
}): Application {
  const api = express();

  api.use(cors());
  api.use(json());

  // Command
  api.post('/playing/game/open', openGame({ eventStore, eventPublisher }));
  api.post('/playing/game/:id/make-guess', makeGuess({ eventStore, eventPublisher }));

  // Query
  api.get('/games', getGames({ viewStore }));
  api.get('/highscore', getHighscore({ viewStore }));

  // Event
  api.get('/events', getEvents({ eventPublisher }));

  return api;
};

export { getApi };
