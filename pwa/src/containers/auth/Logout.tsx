import React, { FunctionComponent, useEffect } from 'react';

import { useFirebase } from '../../providers/FirebaseProvider';

import Loader from '../../components/common/Loader';

const Logout: FunctionComponent = () => {
  const firebase = useFirebase();

  useEffect(() => {
    firebase.auth().signOut();
  }, [firebase]);

  return <Loader />;
};

export default Logout;
