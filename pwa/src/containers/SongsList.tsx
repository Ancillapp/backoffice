import React, { FunctionComponent } from 'react';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Loader from '../components/Loader';
import Songs from '../components/Songs';
import { useSongs } from '../providers/ApiProvider';

const SongsList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { loading, data, error } = useSongs();

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <TopbarLayout title="Canti" {...props}>
      {loading || !data ? <Loader /> : <Songs items={data} />}
    </TopbarLayout>
  );
};

export default SongsList;
