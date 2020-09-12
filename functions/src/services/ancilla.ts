import { mongoDb } from '../helpers/mongo';
import { Ancilla } from '../models/mongo';

export type AncillaData = Omit<Ancilla, '_id'>;

const getAncillasCollection = async () => {
  const db = await mongoDb;

  return db.collection<Ancilla>('ancillas');
};

export const get = async (code: string) => {
  const ancillasCollection = await getAncillasCollection();

  const projection = {
    _id: 0,
    code: 1,
    name: 1,
  };

  const data = (code === 'latest'
    ? (
        await ancillasCollection
          .find({}, { projection })
          .sort({ date: -1 })
          .limit(1)
          .toArray()
      )[0]
    : await ancillasCollection.findOne({ code }, { projection })) as Pick<
    Ancilla,
    '_id' | 'code' | 'name'
  > | null;

  if (!data) {
    return null;
  }

  return {
    ...data,
    link: `https://firebasestorage.googleapis.com/v0/b/ancillas/o/processed%2F${encodeURIComponent(
      data.code,
    )}.pdf?alt=media`,
    thumbnail: `https://firebasestorage.googleapis.com/v0/b/ancillas/o/processed%2F${encodeURIComponent(
      data.code,
    )}.jpg?alt=media`,
  };
};

export const list = async () => {
  const ancillasCollection = await getAncillasCollection();

  const ancillas = (await ancillasCollection
    .find(
      {},
      {
        projection: {
          _id: 0,
          code: 1,
          name: 1,
        },
      },
    )
    .sort({ date: -1 })
    .toArray()) as Pick<Ancilla, '_id' | 'code' | 'name'>[];

  return ancillas.map(({ code, name: { it: name }, ...rest }) => ({
    ...rest,
    name,
    code,
    link: `https://firebasestorage.googleapis.com/v0/b/ancillas/o/processed%2F${encodeURIComponent(
      code,
    )}.pdf?alt=media`,
    thumbnail: `https://firebasestorage.googleapis.com/v0/b/ancillas/o/processed%2F${encodeURIComponent(
      code,
    )}.jpg?alt=media`,
  }));
};
