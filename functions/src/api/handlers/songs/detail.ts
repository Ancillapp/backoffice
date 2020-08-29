import { get } from '../../../services/song';

import type { RequestHandler } from 'express';

export const getSong: RequestHandler = async ({ params: { number } }, res) => {
  res.set(
    'Cache-Control',
    'public, max-age=1800, s-maxage=3600, stale-while-revalidate=3600',
  );

  const song = await get(number);

  if (!song) {
    res.status(404).send();
    return;
  }

  res.json(song);
};
