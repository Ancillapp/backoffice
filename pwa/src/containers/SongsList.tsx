import React, { FunctionComponent } from 'react';

import { useQuery } from 'react-query';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Loader from '../components/Loader';
import Songs, { SongSummary } from '../components/Songs';

const SongsList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { isLoading, data, error } = useQuery<SongSummary[], Error>(
    'songs',
    () =>
      fetch(`${process.env.REACT_APP_API_URL}/songs`).then((res) => res.json()),
  );

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <TopbarLayout title="Canti" {...props}>
      {isLoading || !data ? <Loader /> : <Songs items={data} />}
    </TopbarLayout>
  );
};

export default SongsList;
