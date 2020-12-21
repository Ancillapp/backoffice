import { update } from '../../../services/prayer';

import type { RequestHandler } from 'express';

export const updatePrayer: RequestHandler = async (
  { params: { slug }, body: { slug: newSlug, title, subtitle, content } },
  res,
) => {
  if (!newSlug && !title && !subtitle && !content) {
    res.status(400).send();
    return;
  }

  const updatedPrayer = await update(slug, {
    slug: newSlug,
    title,
    subtitle,
    content,
  });

  if (!updatedPrayer) {
    res.status(404).send();
    return;
  }

  res.json(updatedPrayer);
};
