import React, { FunctionComponent } from 'react';

import { Add as AddIcon } from '@mui/icons-material';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Ancillas from '../../components/ancillas/Ancillas';
import { useAncillas } from '../../providers/ApiProvider';
import AutosizedFab from '../../components/common/AutosizedFab';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const AncillasList: FunctionComponent<TopbarLayoutProps> = props => {
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
