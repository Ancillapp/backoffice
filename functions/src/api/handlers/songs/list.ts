import { list } from '../../../services/song';
import { Song, SongSummary } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export interface GetSongsQueryParams {
  fullData?: string;
}

export const getSongs: RequestHandler<
  Record<string, unknown>,
  Song[] | SongSummary[],
  void,
  GetSongsQueryParams
> = async ({ query: { fullData } }, res) => {
  const songs = await list(typeof fullData !== 'undefined');

  res.json(songs);
};
