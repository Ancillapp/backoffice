import { count } from '../../../services/song';

import type { RequestHandler } from 'express';

export const getSongsCount: RequestHandler = async (_, res) => {
  const totalCount = await count();

  res.json({ count: totalCount });
};
