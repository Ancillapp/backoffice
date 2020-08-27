import { useQuery } from 'react-query';
import { useFirebase } from './FirebaseProvider';

export interface UseApiValue<T> {
  loading: boolean;
  data?: T;
  error?: Error;
}

export const useApi = <T>(
  url: string,
  options: RequestInit = {},
): UseApiValue<T> => {
  const firebase = useFirebase();

  const { isLoading: loading, data, error } = useQuery<T, Error>(
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
  );

  if (error) {
    console.log(error);
  }

  return { loading, data, error: error || undefined };
};

export interface Song {
  number: string;
  title: string;
  content: string;
}

export type SongSummary = Pick<Song, 'number' | 'title'>;

export const useSongs = () => useApi<SongSummary[]>('songs');

export const useSong = (number: string) => useApi<Song>(`songs/${number}`);
