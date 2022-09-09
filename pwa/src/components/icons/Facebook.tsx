import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const FacebookIcon: FunctionComponent<SvgIconProps> = props => (
  <SvgIcon viewBox="0 0 256 256" {...props}>
    <path
      fill="#1977f3"
      d="M128 0a128 128 0 00-20 254v-89H75v-37h33v-28c0-32 19-50 48-50a196 196 0 0129 2v32h-16c-16 0-21 10-21 20v24h36l-6 37h-30v89A128 128 0 00128 0z"
    />
  </SvgIcon>
);

export default FacebookIcon;
