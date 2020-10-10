import { count } from '../../../services/ancilla';

import type { RequestHandler } from 'express';

export const getAncillasCount: RequestHandler = async (_, res) => {
  const totalCount = await count();

  res.json({ count: totalCount });
};
