import { mongoDb } from '../helpers/mongo';
import { Prayer } from '../models/mongo';

export type PrayerData = Omit<Prayer, '_id'>;

const getPrayersCollection = async () => {
  const db = await mongoDb;

  return db.collection<Prayer>('prayers');
};

export const get = async (slug: string) => {
  const prayersCollection = await getPrayersCollection();

  const prayer = await prayersCollection.findOne(
    { slug },
    {
      projection: {
        _id: 0,
      },
    },
  );

  return prayer as PrayerData | null;
};

export const list = async (fullData?: boolean) => {
  const prayersCollection = await getPrayersCollection();

  const prayers = (await prayersCollection
    .find(
      {},
      {
        projection: {
          _id: 0,
          slug: 1,
          title: 1,
          image: 1,
          ...(typeof fullData !== 'undefined' && {
            content: 1,
          }),
        },
      },
    )
    .toArray()) as PrayerData[] | Omit<PrayerData, 'content'>[];

  return prayers;
};

export const count = async () => {
  const prayersCollection = await getPrayersCollection();

  const count = await prayersCollection.find().count();

  return count;
};
