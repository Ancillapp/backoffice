import { create } from '../../../services/prayer';

import type { RequestHandler } from 'express';

export const createPrayer: RequestHandler = async (
  { body: { slug, title, subtitle, content } },
  res,
) => {
  if (!slug && !title && !subtitle && !content) {
    res.status(400).send();
    return;
  }

  const newPrayer = await create({ slug, title, subtitle, content });

  if (!newPrayer) {
    res.status(400).send();
    return;
  }

  res.json(newPrayer);
};
