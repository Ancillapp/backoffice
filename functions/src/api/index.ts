import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { ssr } from './middlewares/ssr';

import { getPrayers } from './handlers/prayers/list';
import { getPrayer } from './handlers/prayers/detail';
import { getSongs } from './handlers/songs/list';
import { getSong } from './handlers/songs/detail';
import { updateSong } from './handlers/songs/update';
import { authorize } from './middlewares/authorize';

const app = express();

app.use(cors());

app.use(ssr);

app.get('/api/prayers', authorize, getPrayers);
app.get('/api/prayers/:slug', authorize, getPrayer);
app.get('/api/songs', authorize, getSongs);
app.get('/api/songs/:number', authorize, getSong);
app.patch('/api/songs/:number', authorize, bodyParser.json(), updateSong);

export const api = functions.https.onRequest(app);
