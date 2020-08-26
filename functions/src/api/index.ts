import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

import { ssr } from './middlewares/ssr';

import { getPrayers } from './handlers/prayers/list';
import { getPrayer } from './handlers/prayers/detail';
import { getSongs } from './handlers/songs/list';
import { getSong } from './handlers/songs/detail';

const app = express();

app.use(cors());

app.use(ssr);

app.get('/api/prayers', getPrayers);
app.get('/api/prayers/:slug', getPrayer);
app.get('/api/songs', getSongs);
app.get('/api/songs/:number', getSong);

export const api = functions.https.onRequest(app);
