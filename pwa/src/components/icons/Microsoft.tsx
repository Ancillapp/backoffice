import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const MicrosoftIcon: FunctionComponent<SvgIconProps> = props => (
  <SvgIcon viewBox="0 0 64 64" {...props}>
    <path fill="#f25022" d="M0 0h30v30H0z" />
    <path fill="#7fba00" d="M34 0h30v30H34z" />
    <path fill="#00a4ef" d="M0 34h30v30H0z" />
    <path fill="#ffb900" d="M34 34h30v30H34z" />
  </SvgIcon>
);

export default MicrosoftIcon;
