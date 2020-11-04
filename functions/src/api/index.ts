import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { ssr } from './middlewares/ssr';

import { getAncillas } from './handlers/ancillas/list';
import { getAncillasCount } from './handlers/ancillas/count';
import { getAncilla } from './handlers/ancillas/detail';
import { getPrayers } from './handlers/prayers/list';
import { getPrayersCount } from './handlers/prayers/count';
import { getPrayer } from './handlers/prayers/detail';
import { getSongs } from './handlers/songs/list';
import { getSongsCount } from './handlers/songs/count';
import { getSong } from './handlers/songs/detail';
import { updateSong } from './handlers/songs/update';
import { deleteSong } from './handlers/songs/delete';
import { createSong } from './handlers/songs/create';
// import { getUsersCount } from './handlers/users/count';
import { getPageViewsReport } from './handlers/analytics/page-views';
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
app.get('/api/songs', authorize, getSongs);
app.get('/api/songs/count', authorize, getSongsCount);
app.get('/api/songs/:number', authorize, getSong);
app.patch('/api/songs/:number', authorize, bodyParser.json(), updateSong);
app.delete('/api/songs/:number', authorize, deleteSong);
app.post('/api/songs', authorize, createSong);
// app.get('/api/users/count', authorize, getUsersCount);
app.get('/api/analytics/page-views', authorize, getPageViewsReport);

export const api = functions.https.onRequest(app);
