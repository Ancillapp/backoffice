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

export const update = async (
  slug: string,
  { slug: newSlug, title, subtitle, content }: Partial<PrayerData>,
) => {
  const prayersCollection = await getPrayersCollection();

  const response = await prayersCollection.findOneAndUpdate(
    { slug },
    {
      $set: {
        ...(newSlug && { slug: newSlug }),
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        ...(content && { content }),
      },
    },
    {
      returnDocument: 'after',
    },
  );

  return response.value || null;
};

export const remove = async (slug: string) => {
  const prayersCollection = await getPrayersCollection();

  const response = await prayersCollection.findOneAndDelete({ slug });

  return response.value || null;
};

export const create = async (prayer: PrayerData) => {
  const existingPrayer = await get(prayer.slug);

  if (existingPrayer) {
    return null;
  }

  const prayersCollection = await getPrayersCollection();

  const response = await prayersCollection.insertOne(prayer);

  if (!response.insertedId) {
    return null;
  }

  return prayer;
};
