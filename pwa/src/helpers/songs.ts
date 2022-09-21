import {
  SongCategory,
  SongLanguage,
  SongSummary,
} from '../providers/ApiProvider';

export interface ExtendedSongSummary extends SongSummary {
  formattedNumber: string;
}

export const songCategoriesArray = Object.values(SongCategory);

export const songLanguagesArray = Object.values(SongLanguage);

export const songCategoryToPrefixMap: Partial<
  Record<SongLanguage, Partial<Record<SongCategory, string>>>
> = {
  [SongLanguage.ITALIAN]: {
    [SongCategory.KYRIE]: 'A',
    [SongCategory.GLORY]: 'A',
    [SongCategory.HALLELUJAH]: 'A',
    [SongCategory.CREED]: 'A',
    [SongCategory.OFFERTORY]: 'A',
    [SongCategory.HOLY]: 'A',
    [SongCategory.ANAMNESIS]: 'A',
    [SongCategory.AMEN]: 'A',
    [SongCategory.OUR_FATHER]: 'A',
    [SongCategory.LAMB_OF_GOD]: 'A',
    [SongCategory.CANONS_AND_REFRAINS]: 'R',
    [SongCategory.FRANCISCANS]: 'C',
    [SongCategory.PRAISE_AND_FAREWELL]: 'C',
    [SongCategory.ENTRANCE]: 'C',
    [SongCategory.HOLY_SPIRIT]: 'C',
    [SongCategory.WORSHIP]: 'C',
    [SongCategory.EUCHARIST]: 'C',
    [SongCategory.OTHER_SONGS]: 'C',
    [SongCategory.BENEDICTUS]: 'X',
    [SongCategory.MAGNIFICAT]: 'X',
    [SongCategory.CANTICLES]: 'X',
    [SongCategory.HYMNS]: 'N',
    [SongCategory.SIMPLE_PRAYER]: 'C',
    [SongCategory.MARIANS]: 'C',
    [SongCategory.ANIMATION]: 'E',
    [SongCategory.GREGORIANS]: 'O',
    [SongCategory.ADVENT]: 'F',
    [SongCategory.CHRISTMAS]: 'I',
    [SongCategory.LENT]: 'L',
  },
};
