import { get } from '../../../services/ancilla';

import type { RequestHandler } from 'express';

export const getAncilla: RequestHandler = async ({ params: { code } }, res) => {
  const ancilla = await get(code);

  if (!ancilla) {
    res.status(404).send();
    return;
  }

  res.json(ancilla);
};
