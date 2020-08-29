import { create } from '../../../services/song';

import type { RequestHandler } from 'express';

export const createSong: RequestHandler = async (
  { body: { number, title, content } },
  res,
) => {
  if (!number && !title && !content) {
    res.status(400).send();
    return;
  }

  const newSong = await create({ number, title, content });

  if (!newSong) {
    res.status(400).send();
    return;
  }

  res.json(newSong);
};
