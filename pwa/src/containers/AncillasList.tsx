import React, { FunctionComponent } from 'react';

import AddIcon from '@material-ui/icons/Add';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Ancillas from '../components/Ancillas';
import { useAncillas } from '../providers/ApiProvider';
import AutosizedFab from '../components/FloatingActionButton';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const AncillasList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { loading, data, error } = useAncillas();

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <>
      <TopbarLayout title="Ancilla Domini" {...props}>
        {loading || !data ? <Loader /> : <Ancillas items={data} />}
      </TopbarLayout>

      <Link to="/ancilla-domini/nuovo">
        <AutosizedFab>
          <AddIcon />
        </AutosizedFab>
      </Link>
    </>
  );
};

export default AncillasList;
