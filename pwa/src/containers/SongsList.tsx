import React, { FunctionComponent } from 'react';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Songs from '../components/Songs';
import { useSongs } from '../providers/ApiProvider';
import PageSkeleton from '../components/PageSkeleton';

const SongsList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { loading, data, error } = useSongs();

  if (error) {
    return <span>{error.message}</span>;
  }

  return loading || !data ? (
    <PageSkeleton />
  ) : (
    <TopbarLayout title="Canti" {...props}>
      <Songs items={data} />
    </TopbarLayout>
  );
};

export default SongsList;
