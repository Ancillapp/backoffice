import { get } from '../../../services/song';

import type { RequestHandler } from 'express';

export const getSong: RequestHandler = async ({ params: { number } }, res) => {
  const song = await get(number);

  if (!song) {
    res.status(404).send();
    return;
  }

  res.json(song);
};
