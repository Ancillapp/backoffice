import React, { FunctionComponent } from 'react';

import { useUsers } from '../providers/ApiProvider';
import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Users from '../components/Users';

const UsersList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { data, loading } = useUsers();

  return (
    <TopbarLayout title="Utenti" {...props}>
      <Users items={data} loading={loading} />
    </TopbarLayout>
  );
};

export default UsersList;
