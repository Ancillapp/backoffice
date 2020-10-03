import { list } from '../../../services/prayer';

import type { RequestHandler } from 'express';

export const getPrayers: RequestHandler = async (
  { query: { fullData } },
  res,
) => {
  const prayers = await list(typeof fullData !== 'undefined');

  res.json(prayers);
};
