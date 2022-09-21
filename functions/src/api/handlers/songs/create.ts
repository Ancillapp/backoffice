import { create } from '../../../services/song';
import type { Song } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export const createSong: RequestHandler<
  Record<string, unknown>,
  Song,
  Song
> = async ({ body: { language, category, number, title, content } }, res) => {
  if (!language && !category && !number && !title && !content) {
    res.status(400).send();
    return;
  }

  const newSong = await create({ language, category, number, title, content });

  if (!newSong) {
    res.status(400).send();
    return;
  }

  res.json(newSong);
};
