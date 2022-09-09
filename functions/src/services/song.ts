import { mongoDb } from '../helpers/mongo';
import { Song } from '../models/mongo';

const getSongsCollection = async () => {
  const db = await mongoDb;

  return db.collection<Song>('songs');
};

export const get = async (number: string) => {
  const songsCollection = await getSongsCollection();

  const song = await songsCollection.findOne(
    { number },
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

  const songs = (await songsCollection
    .find(
      {},
      {
        projection: {
          _id: 0,
          number: 1,
          title: 1,
          ...(fullData && { content: 1 }),
        },
      },
    )
    .toArray()) as Song[] | Omit<Song, 'content'>[];

  return songs.sort(({ number: a }, { number: b }) => {
    const normalizedA = a.slice(2).replace('bis', '').padStart(4, '0');
    const normalizedB = b.slice(2).replace('bis', '').padStart(4, '0');

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
  number: string,
  { number: newNumber, title, content }: Partial<Song>,
) => {
  const songsCollection = await getSongsCollection();

  const response = await songsCollection.findOneAndUpdate(
    { number },
    {
      $set: {
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

export const remove = async (number: string) => {
  const songsCollection = await getSongsCollection();

  const response = await songsCollection.findOneAndDelete({ number });

  return response.value || null;
};

export const create = async (song: Song) => {
  const existingSong = await get(song.number);

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
