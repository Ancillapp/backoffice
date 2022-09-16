import { mongoDb } from '../helpers/mongo';
import { Song, SongCategory, SongLanguage, SongSummary } from '../models/mongo';

export type SongIdFields = Pick<Song, 'language' | 'category' | 'number'>;

const songCategoriesArray = Object.values(SongCategory);
const songLanguagesArray = Object.values(SongLanguage);

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

  return songs.sort((a, b) => {
    if (a.language !== b.language) {
      return (
        songLanguagesArray.indexOf(a.language) -
        songLanguagesArray.indexOf(b.language)
      );
    }

    // If the song language is italian, make sure the categories get properly sorted
    // Note that we already checked for language equality, so the two songs are in the same language.
    // For this reason, we don't need to check also for b.language
    if (a.language === SongLanguage.ITALIAN) {
      const categoriesDiff =
        songCategoriesArray.indexOf(a.category) -
        songCategoriesArray.indexOf(b.category);
      if (categoriesDiff !== 0) {
        return categoriesDiff;
      }
    }

    const normalizedNumberA = a.number.replace('bis', '').padStart(5, '0');
    const normalizedNumberB = b.number.replace('bis', '').padStart(5, '0');

    if (normalizedNumberA.startsWith(normalizedNumberB)) {
      return normalizedNumberA.endsWith('bis') ? -1 : 1;
    }

    return normalizedNumberA.localeCompare(normalizedNumberB);
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
