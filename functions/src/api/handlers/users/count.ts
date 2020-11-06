import { count } from '../../../services/user';

import type { RequestHandler } from 'express';

export const getUsersCount: RequestHandler = async (_, res) => {
  const totalCount = await count();

  res.json({ count: totalCount });
};
