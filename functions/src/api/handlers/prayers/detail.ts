import { get } from '../../../services/song';

import type { RequestHandler } from 'express';

export const getPrayer: RequestHandler = async ({ params: { slug } }, res) => {
  const prayer = await get(slug);

  if (!prayer) {
    res.status(404).send();
    return;
  }

  res.json(prayer);
};
