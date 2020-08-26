import * as functions from 'firebase-functions';
import { MongoClient, ObjectId } from 'mongodb';

const uri = functions.config().mongodb.uri;
const db = functions.config().mongodb.name;

export { ObjectId };

export const mongoDb = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .connect()
  .then((client) => client.db(db));
