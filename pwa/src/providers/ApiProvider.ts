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
  const firebase = useFirebase();

  const { isLoading: loading, data, error, refetch: refetchQuery } = useQuery<
    T,
    Error
  >(
    url,
    async () => {
      const auth = firebase.auth();

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
        firebase.auth().signOut();
        return undefined;
      }

      return res.status === 204 ? undefined : res.json();
    },
    {
      cacheTime: 0,
    },
  );

  const refetch = useCallback(
    () => refetchQuery({ throwOnError: true }) as Promise<T>,
    [refetchQuery],
  );

  return { loading, data, error: error || undefined, refetch };
};

export interface Song {
  number: string;
  title: string;
  content: string;
}

export type SongSummary = Pick<Song, 'number' | 'title'>;

export const useSongs = () => useApi<SongSummary[]>('songs');

export const useSong = (number: string) => useApi<Song>(`songs/${number}`);

export const useMutation = <T, B>(
  url: string,
  options: RequestInit = {},
): [(body: B) => Promise<T>, Omit<UseApiValue<T>, 'refetch'>] => {
  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const mutate = useCallback(
    async (body: B): Promise<T> => {
      try {
        setLoading(true);
        const auth = firebase.auth();

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
          firebase.auth().signOut();
          return (undefined as unknown) as T;
        }

        const responseData = res.status === 204 ? undefined : await res.json();

        setData(responseData);
        setLoading(false);

        return responseData;
      } catch (error) {
        setError(error);
        setLoading(false);

        throw error;
      }
    },
    [firebase, options, url],
  );

  return [mutate, { loading, data, error }];
};

export const useSongUpdate = (number: string) =>
  useMutation<Song, Partial<Song>>(`songs/${number}`, {
    method: 'PATCH',
  });

export const useSongDeletion = (number: string) =>
  useMutation<Song, void>(`songs/${number}`, {
    method: 'DELETE',
  });

export const useSongCreation = () =>
  useMutation<Song, Song>('songs', {
    method: 'POST',
  });
