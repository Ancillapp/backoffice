import { list } from '../../../services/song';

import type { RequestHandler } from 'express';

export const getSongs: RequestHandler = async (
  { query: { fullData } },
  res,
) => {
  const songs = await list(typeof fullData !== 'undefined');

  res.json(songs);
};
