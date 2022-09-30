import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

import { ssr } from './middlewares/ssr';

import { getAncillas } from './handlers/ancillas/list';
import { getAncillasCount } from './handlers/ancillas/count';
import { getAncilla } from './handlers/ancillas/detail';
import { getPrayers } from './handlers/prayers/list';
import { getPrayersCount } from './handlers/prayers/count';
import { getPrayer } from './handlers/prayers/detail';
import { updatePrayer } from './handlers/prayers/update';
import { deletePrayer } from './handlers/prayers/delete';
import { createPrayer } from './handlers/prayers/create';
import { getSongs } from './handlers/songs/list';
import { getSongsCount } from './handlers/songs/count';
import { getSong } from './handlers/songs/detail';
import { updateSong } from './handlers/songs/update';
import { deleteSong } from './handlers/songs/delete';
import { createSong } from './handlers/songs/create';
import { getUsers } from './handlers/users/list';
import { getUsersCount } from './handlers/users/count';
import {
  getSessionsReport,
  getTotalSessions,
} from './handlers/analytics/sessions';
import { getNextDaysBookings } from './handlers/holy-masses/next-days-bookings';
import { getTimetables } from './handlers/holy-masses/timetables/list';
import { updateTimetable } from './handlers/holy-masses/timetables/update';
import { authorize } from './middlewares/authorize';

const app = express();

app.use(cors());

app.use(ssr);

app.get('/api/ancillas', authorize, getAncillas);
app.get('/api/ancillas/count', authorize, getAncillasCount);
app.get('/api/ancillas/:code', authorize, getAncilla);
app.get('/api/prayers', authorize, getPrayers);
app.get('/api/prayers/count', authorize, getPrayersCount);
app.get('/api/prayers/:slug', authorize, getPrayer);
app.patch('/api/prayers/:slug', authorize, express.json(), updatePrayer);
app.delete('/api/prayers/:slug', authorize, deletePrayer);
app.post('/api/prayers', authorize, express.json(), createPrayer);
app.get('/api/songs', authorize, getSongs);
app.get('/api/songs/count', authorize, getSongsCount);
app.get('/api/songs/:language/:category/:number', authorize, getSong);
app.patch(
  '/api/songs/:language/:category/:number',
  authorize,
  express.json(),
  updateSong,
);
app.delete('/api/songs/:language/:category/:number', authorize, deleteSong);
app.post('/api/songs', authorize, express.json(), createSong);
app.get('/api/users', authorize, getUsers);
app.get('/api/users/count', authorize, getUsersCount);
app.get('/api/analytics/sessions', authorize, getSessionsReport);
app.get('/api/analytics/sessions/total', authorize, getTotalSessions);
app.get('/api/holy-masses/next-days-bookings', authorize, getNextDaysBookings);
app.get('/api/holy-masses/timetables', authorize, getTimetables);
app.patch(
  '/api/holy-masses/timetables/:fraternityId',
  authorize,
  express.json(),
  updateTimetable,
);

export const api = functions.https.onRequest(app);
