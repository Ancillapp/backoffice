import { list } from '../../../services/song';

import type { RequestHandler } from 'express';

export const getSongs: RequestHandler = async (
  { query: { fullData } },
  res,
) => {
  res.set(
    'Cache-Control',
    'public, max-age=1800, s-maxage=3600, stale-while-revalidate=3600',
  );

  const songs = await list(typeof fullData !== 'undefined');

  res.json(songs);
};
