import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useFirebase } from './FirebaseProvider';

export interface UseApiValue<T> {
  loading: boolean;
  data?: T;
  error?: Error;
  refetch(): Promise<T>;
}

export const useApi = <T>(
  url: string,
  options: RequestInit = {},
): UseApiValue<T> => {
  const { auth } = useFirebase();

  const {
    isLoading: loading,
    data,
    error,
    refetch: refetchQuery,
  } = useQuery<T, Error>(
    url,
    async () => {
      if (!auth.currentUser) {
        throw new Error('User must be logged in to use APIs');
      }

      const token = await auth.currentUser.getIdToken();

      const res = await fetch(`${process.env.REACT_APP_API_URL}/${url}`, {
        ...options,
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (res.status === 401 || res.status === 403) {
        auth.signOut();
        return undefined;
      }

      return res.status === 204 ? undefined : res.json();
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const refetch = useCallback(
    () => refetchQuery({ throwOnError: true }) as Promise<T>,
    [refetchQuery],
  );

  return { loading, data, error: error || undefined, refetch };
};

export enum Role {
  USER = 'USER',
  SUPERUSER = 'SUPERUSER',
}

export enum Provider {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  MICROSOFT = 'MICROSOFT',
  APPLE = 'APPLE',
  GITHUB = 'GITHUB',
}

export interface User {
  id: string;
  email: string;
  verified: boolean;
  disabled: boolean;
  createdAt: string;
  lastLoggedInAt: string;
  roles: Role[];
  providers: Provider[];
}

export const useUsers = () => useApi<User[]>('users');

export const useMutation = <T, B>(
  url: string,
  options: RequestInit = {},
): [(body: B) => Promise<T>, Omit<UseApiValue<T>, 'refetch'>] => {
  const { auth } = useFirebase();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const mutate = useCallback(
    async (body: B): Promise<T> => {
      try {
        setLoading(true);

        if (!auth.currentUser) {
          throw new Error('User must be logged in to use APIs');
        }

        const token = await auth.currentUser.getIdToken();

        const res = await fetch(`${process.env.REACT_APP_API_URL}/${url}`, {
          ...options,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
            ...options.headers,
          },
          body: JSON.stringify(body),
        });

        if (res.status === 401 || res.status === 403) {
          auth.signOut();
          return undefined as unknown as T;
        }

        const responseData = res.status === 204 ? undefined : await res.json();

        setData(responseData);
        setLoading(false);

        return responseData;
      } catch (error) {
        setError(error as Error);
        setLoading(false);

        throw error;
      }
    },
    [auth, options, url],
  );

  return [mutate, { loading, data, error }];
};

export enum SongLanguage {
  ITALIAN = 'it',
  GERMAN = 'de',
  PORTUGUESE = 'pt',
}

export enum SongCategory {
  KYRIE = 'kyrie',
  GLORY = 'glory',
  HALLELUJAH = 'hallelujah',
  CREED = 'creed',
  OFFERTORY = 'offertory',
  HOLY = 'holy',
  ANAMNESIS = 'anamnesis',
  AMEN = 'amen',
  OUR_FATHER = 'our-father',
  LAMB_OF_GOD = 'lamb-of-god',
  CANONS_AND_REFRAINS = 'canons-and-refrains',
  FRANCISCANS = 'franciscans',
  PRAISE_AND_FAREWELL = 'praise-and-farewell',
  ENTRANCE = 'entrance',
  HOLY_SPIRIT = 'holy-spirit',
  WORSHIP = 'worship',
  EUCHARIST = 'eucharist',
  OTHER_SONGS = 'other-songs',
  VENI_CREATOR = 'veni-creator',
  BENEDICTUS = 'benedictus',
  MAGNIFICAT = 'magnificat',
  CANTICLES = 'canticles',
  HYMNS = 'hymns',
  SIMPLE_PRAYER = 'simple-prayer',
  MARIANS = 'marians',
  ANIMATION = 'animation',
  GREGORIANS = 'gregorians',
  ADVENT = 'advent',
  CHRISTMAS = 'christmas',
  LENT = 'lent',
}

export interface Song {
  language: SongLanguage;
  category: SongCategory;
  number: string;
  title: string;
  content: string;
}

export type SongSummary = Omit<Song, 'content'>;

export const useSongs = () => useApi<SongSummary[]>('songs');

export const useSongsCount = () => useApi<{ count: number }>('songs/count');

export const useSong = (
  language: SongLanguage,
  category: SongCategory,
  number: string,
) => useApi<Song>(`songs/${language}/${category}/${number}`);

export const useSongUpdate = (
  language: SongLanguage,
  category: SongCategory,
  number: string,
) =>
  useMutation<Song, Partial<Song>>(`songs/${language}/${category}/${number}`, {
    method: 'PATCH',
  });

export const useSongDeletion = (
  language: SongLanguage,
  category: SongCategory,
  number: string,
) =>
  useMutation<Song, void>(`songs/${language}/${category}/${number}`, {
    method: 'DELETE',
  });

export const useSongCreation = () =>
  useMutation<Song, Song>('songs', {
    method: 'POST',
  });

export type PrayerLanguage = 'it' | 'la' | 'de' | 'en' | 'pt';

export interface Prayer {
  slug: string;
  title: Record<PrayerLanguage, string | undefined>;
  image?: string;
  content: Record<PrayerLanguage, string | undefined>;
}

export type PrayerSummary = Pick<Prayer, 'slug' | 'title' | 'image'>;

export const usePrayers = () => useApi<PrayerSummary[]>('prayers');

export const usePrayersCount = () => useApi<{ count: number }>('prayers/count');

export const usePrayer = (slug: string) => useApi<Prayer>(`prayers/${slug}`);

export const usePrayerUpdate = (slug: string) =>
  useMutation<Prayer, Partial<Prayer>>(`prayers/${slug}`, {
    method: 'PATCH',
  });

export const usePrayerDeletion = (slug: string) =>
  useMutation<Prayer, void>(`prayers/${slug}`, {
    method: 'DELETE',
  });

export const usePrayerCreation = () =>
  useMutation<Prayer, Prayer>('prayers', {
    method: 'POST',
  });

export interface Ancilla {
  code: string;
  name: {
    en: string;
    id: string;
    de: string;
    pt: string;
  };
  link: string;
  thumbnail: string;
}

export interface AncillaSummary extends Omit<Ancilla, 'name'> {
  name: string;
}

export const useAncillas = () => useApi<AncillaSummary[]>('ancillas');

export const useAncillasCount = () =>
  useApi<{ count: number }>('ancillas/count');

export const useAncilla = (number: string) =>
  useApi<Ancilla>(`ancillas/${number}`);

export const useUsersCount = () => useApi<{ count: number }>('users/count');

export interface SessionsReportRecord {
  date: string;
  sessions: number;
}

export const useSessions = (days = 14) =>
  useApi<SessionsReportRecord[]>(`analytics/sessions?days=${days}`);

export const useTotalSessions = (from = '2020-05-01', to = 'today') =>
  useApi<{ count: number }>(`analytics/sessions/total?from=${from}&to=${to}`);

export interface DailyHolyMassBookings {
  date: string;
  bookings: number;
  fraternity: {
    id: string;
    location: string;
    seats: number;
  };
}

export interface FullDataDailyHolyMassBookings
  extends Omit<DailyHolyMassBookings, 'bookings'> {
  bookings: {
    user: {
      id: string;
      email: string;
    };
    seats: number;
  }[];
}

export const useNextDaysHolyMassesBookings = <F extends boolean = false>(
  days = 3,
  fullData: F = false as F,
) =>
  useApi<
    F extends false ? DailyHolyMassBookings[] : FullDataDailyHolyMassBookings[]
  >(
    `holy-masses/next-days-bookings?days=${days}${fullData ? '&fullData' : ''}`,
  );

export interface Timetable {
  fraternityId: string;
  location: string;
  masses: {
    sunday?: string[];
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    default?: string[];
    overrides?: Record<string, string[]>;
  };
}

export const useTimetables = () =>
  useApi<Timetable[]>('holy-masses/timetables');

export const useTimetableUpdate = (fraternityId: string) =>
  useMutation<Timetable['masses'], Partial<Timetable['masses']>>(
    `holy-masses/timetables/${fraternityId}`,
    {
      method: 'PATCH',
    },
  );
