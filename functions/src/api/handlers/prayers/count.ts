import { count } from '../../../services/prayer';

import type { RequestHandler } from 'express';

export const getPrayersCount: RequestHandler = async (_, res) => {
  const totalCount = await count();

  res.json({ count: totalCount });
};
