import { remove } from '../../../services/prayer';

import type { RequestHandler } from 'express';

export const deletePrayer: RequestHandler = async (
  { params: { slug } },
  res,
) => {
  const deletedPrayer = await remove(slug);

  if (!deletedPrayer) {
    res.status(404).send();
    return;
  }

  res.json(deletedPrayer);
};
