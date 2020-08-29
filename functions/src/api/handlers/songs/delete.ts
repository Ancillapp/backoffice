import { remove } from '../../../services/song';

import type { RequestHandler } from 'express';

export const deleteSong: RequestHandler = async (
  { params: { number } },
  res,
) => {
  const deletedSong = await remove(number);

  if (!deletedSong) {
    res.status(404).send();
    return;
  }

  res.json(deletedSong);
};
