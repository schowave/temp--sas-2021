import { RequestHandler } from 'express';
import { ViewStore } from '../../stores/ViewStore';

const getGames = function ({ viewStore }: {
  viewStore: ViewStore;
}): RequestHandler {
  return function (req, res): void {
    res.json(viewStore.readGames());
  };
};

export { getGames };
