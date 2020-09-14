import { list } from '../../../services/ancilla';

import type { RequestHandler } from 'express';

export const getAncillas: RequestHandler = async (_, res) => {
  const ancillas = await list();

  res.json(ancillas);
};
