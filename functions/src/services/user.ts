import { firebase } from '../helpers/firebase';

export const list = async () => {
  let nextPageToken: string | undefined = undefined;
  const users: firebase.auth.UserRecord[] = [];

  do {
    const result: firebase.auth.ListUsersResult = await firebase
      .auth()
      .listUsers(1000, nextPageToken);

    nextPageToken = result.pageToken;
    users.concat(result.users);
  } while (nextPageToken);

  return users;
};

export const count = async () => {
  const usersList = await list();

  return usersList.length;
};
