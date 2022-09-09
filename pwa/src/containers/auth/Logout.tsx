import React, { FunctionComponent, useEffect } from 'react';

import { useFirebase } from '../../providers/FirebaseProvider';

import Loader from '../../components/common/Loader';

const Logout: FunctionComponent = () => {
  const { auth } = useFirebase();

  useEffect(() => {
    auth.signOut();
  }, [auth]);

  return <Loader />;
};

export default Logout;
