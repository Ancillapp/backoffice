import { update } from '../../../services/song';

import type { RequestHandler } from 'express';

export const updateSong: RequestHandler = async (
  { params: { number }, body: { number: newNumber, title, content } },
  res,
) => {
  if (!newNumber && !title && !content) {
    res.status(400).send();
    return;
  }

  const updatedSong = await update(number, {
    number: newNumber,
    title,
    content,
  });

  if (!updatedSong) {
    res.status(404).send();
    return;
  }

  res.json(updatedSong);
};
