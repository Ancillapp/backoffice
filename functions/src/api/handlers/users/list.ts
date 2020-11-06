import { list } from '../../../services/user';

import type { RequestHandler } from 'express';

export const getUsers: RequestHandler = async (_, res) => {
  const users = await list();

  res.json(users);
};
