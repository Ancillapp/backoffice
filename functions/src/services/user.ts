import { firebase } from '../helpers/firebase';

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

export interface UserData {
  id: string;
  email: string;
  verified: boolean;
  disabled: boolean;
  createdAt: string;
  lastLoggedInAt: string;
  roles: Role[];
  providers: Provider[];
}

const getAllUsersFromFirebase = async () => {
  let nextPageToken: string | undefined = undefined;
  let users: firebase.auth.UserRecord[] = [];

  do {
    const result: firebase.auth.ListUsersResult = await firebase
      .auth()
      .listUsers(1000, nextPageToken);

    nextPageToken = result.pageToken;
    users = users.concat(result.users);
  } while (nextPageToken);

  return users;
};

const providerIdToProviderMap: Record<string, Provider> = {
  password: Provider.EMAIL_PASSWORD,
  'google.com': Provider.GOOGLE,
  'facebook.com': Provider.FACEBOOK,
  'twitter.com': Provider.TWITTER,
  'microsoft.com': Provider.MICROSOFT,
  'apple.com': Provider.APPLE,
  'github.com': Provider.GITHUB,
};

export const list = async () => {
  const firebaseUsers = await getAllUsersFromFirebase();

  return firebaseUsers.map(
    ({
      uid: id,
      email = '',
      emailVerified: verified,
      disabled,
      metadata: { creationTime, lastSignInTime },
      customClaims: { roles = [Role.USER] } = {},
      providerData,
    }) => ({
      id,
      email,
      verified,
      disabled,
      createdAt: new Date(creationTime).toISOString(),
      lastLoggedInAt: new Date(lastSignInTime).toISOString(),
      roles,
      providers: providerData.map(
        ({ providerId }) => providerIdToProviderMap[providerId],
      ),
    }),
  );
};

export const count = async () => {
  const firebaseUsers = await getAllUsersFromFirebase();

  return firebaseUsers.length;
};
