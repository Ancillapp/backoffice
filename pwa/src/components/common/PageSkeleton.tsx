import React, { FunctionComponent } from 'react';

import { Skeleton } from '@material-ui/core';

import TopbarLayout from './TopbarLayout';
import Loader from './Loader';

const PageSkeleton: FunctionComponent = () => (
  <TopbarLayout
    startAdornment={null}
    title={<Skeleton variant="text" width={192} />}
  >
    <Loader />
  </TopbarLayout>
);

export default PageSkeleton;
