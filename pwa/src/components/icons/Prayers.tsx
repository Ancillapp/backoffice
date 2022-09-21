import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const PrayersIcon: FunctionComponent<SvgIconProps> = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M10 11.5v-2a1.7 1.7 0 0 1 .2-.5.8.8 0 0 1 .9-.5.8.8 0 0 1 .8.7V14a4.1 4.1 0 0 1-2.2 3.6L5.5 20a2 2 0 1 1-1.9-3.3l1.8-1a2.3 2.3 0 0 0 1.2-1.8l.8-4.7a1.5 1.5 0 0 1 .2-.5l2.4-4a1 1 0 0 1 2 .6 1.8 1.8 0 0 1-.2.6 22.3 22.3 0 0 1-1.4 2.5 4.4 4.4 0 0 0-.6 2.9.4.4 0 0 0 0 .2 1.1 1.1 0 0 0 .3 0zM14.2 11.5v-2A1.7 1.7 0 0 0 14 9a.8.8 0 0 0-1-.5.8.8 0 0 0-.7.7c0 1.6-.2 3.2-.1 4.7a4.1 4.1 0 0 0 2.2 3.6l4.2 2.4a2 2 0 1 0 2-3.3l-1.9-1a2.3 2.3 0 0 1-1.1-1.8l-.8-4.6a1.5 1.5 0 0 0-.2-.6l-2.4-4a1 1 0 0 0-2 .6 1.8 1.8 0 0 0 .2.6 22.3 22.3 0 0 0 1.4 2.5 4.4 4.4 0 0 1 .6 2.9.4.4 0 0 1-.1.2 1.1 1.1 0 0 1-.2 0z" />
  </SvgIcon>
);

export default PrayersIcon;
