import React, { FunctionComponent } from 'react';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Page from '../components/Page';

const Dashboard: FunctionComponent<TopbarLayoutProps> = (props) => (
  <TopbarLayout title="Dashboard" {...props}>
    <Page>Dashboard</Page>
  </TopbarLayout>
);

export default Dashboard;
