import React, { FunctionComponent } from 'react';

import AddIcon from '@material-ui/icons/Add';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Songs from '../components/Songs';
import { useSongs } from '../providers/ApiProvider';
import AutosizedFab from '../components/FloatingActionButton';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const SongsList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { loading, data, error } = useSongs();

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <>
      <TopbarLayout title="Canti" {...props}>
        {loading || !data ? <Loader /> : <Songs items={data} />}
      </TopbarLayout>

      <Link to="/canti/nuovo">
        <AutosizedFab>
          <AddIcon />
        </AutosizedFab>
      </Link>
    </>
  );
};

export default SongsList;
