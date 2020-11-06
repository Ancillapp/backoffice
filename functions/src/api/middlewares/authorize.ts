import { firebase } from '../../helpers/firebase';
import { Role } from '../../services/user';

import type { RequestHandler } from 'express';

export const authorize: RequestHandler = async (
  { headers: { authorization } },
  res,
  next,
) => {
  res.set('Cache-Control', 'private, no-store');

  const token = authorization?.match(/Bearer (.+)/)?.[1];

  if (!token) {
    res.status(401).send();
    return;
  }

  const decodedToken = await firebase
    .auth()
    .verifyIdToken(token)
    .catch(() => null);

  if (!(decodedToken?.roles || []).includes(Role.SUPERUSER)) {
    res.status(403).send();
    return;
  }

  res.locals.user = decodedToken;

  next();
};
