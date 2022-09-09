import { mongoDb } from '../helpers/mongo';
import { Song, SongSummary } from '../models/mongo';

export type SongIdFields = Pick<Song, 'language' | 'category' | 'number'>;

const getSongsCollection = async () => {
  const db = await mongoDb;

  return db.collection<Song>('songs');
};

export const get = async ({ language, category, number }: SongIdFields) => {
  const songsCollection = await getSongsCollection();

  const song = await songsCollection.findOne(
    { language, category, number },
    {
      projection: {
        _id: 0,
      },
    },
  );

  return song as Song | null;
};

export const list = async (fullData?: boolean) => {
  const songsCollection = await getSongsCollection();

  const songs: typeof fullData extends string ? Song[] : SongSummary[] =
    await songsCollection
      .find(
        {},
        {
          projection: {
            _id: 0,
            language: 1,
            category: 1,
            number: 1,
            title: 1,
            ...(fullData && { content: 1 }),
          },
        },
      )
      .toArray();

  return songs.sort(({ number: a }, { number: b }) => {
    const normalizedA = a.replace('bis', '').padStart(4, '0');
    const normalizedB = b.replace('bis', '').padStart(4, '0');

    if (normalizedA === normalizedB) {
      return b.endsWith('bis') ? -1 : 1;
    }

    return normalizedA < normalizedB ? -1 : 1;
  });
};

export const count = async () => {
  const songsCollection = await getSongsCollection();

  const count = await songsCollection.find().count();

  return count;
};

export const update = async (
  { language, category, number }: SongIdFields,
  {
    language: newLanguage,
    category: newCategory,
    number: newNumber,
    title,
    content,
  }: Partial<Song>,
) => {
  const songsCollection = await getSongsCollection();

  const response = await songsCollection.findOneAndUpdate(
    { language, category, number },
    {
      $set: {
        ...(newLanguage && { language: newLanguage }),
        ...(newCategory && { category: newCategory }),
        ...(newNumber && { number: newNumber }),
        ...(title && { title }),
        ...(content && { content }),
      },
    },
    {
      returnDocument: 'after',
    },
  );

  return response.value || null;
};

export const remove = async ({ language, category, number }: SongIdFields) => {
  const songsCollection = await getSongsCollection();

  const response = await songsCollection.findOneAndDelete({
    language,
    category,
    number,
  });

  return response.value || null;
};

export const create = async (song: Song) => {
  const existingSong = await get(song);

  if (existingSong) {
    return null;
  }

  const songsCollection = await getSongsCollection();

  const response = await songsCollection.insertOne(song);

  if (!response.insertedId) {
    return null;
  }

  return song;
};
