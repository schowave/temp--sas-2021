import { RequestHandler } from 'express';
import { ViewStore } from '../../stores/ViewStore';

const getHighscore = function ({ viewStore }: {
  viewStore: ViewStore;
}): RequestHandler {
  return function (req, res): void {
    res.json(viewStore.readHighscore());
  };
};

export { getHighscore };
