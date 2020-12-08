import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@material-ui/core';

const HolyMassIcon: FunctionComponent<SvgIconProps> = (props) => (
  <SvgIcon viewBox="0 0 512 512" {...props}>
    <path d="M382 126a126 126 0 10-252 0 126 126 0 00252 0zm-75 15h-36v36h-30v-36h-36v-30h36V75h30v36h36zm0 0M113 210a23 23 0 00-31 31l110 110-22 22L60 263a52 52 0 01-15-39V68a23 23 0 00-45 0v221l90 149v74h151V362c0-16-7-31-18-42zm0 0M490 46c-13 0-23 10-23 23v155c0 14-5 28-15 39L342 373l-22-22 110-110a23 23 0 00-31-31L289 320c-11 11-18 41-18 57v135h151v-74l90-149V69c0-13-10-23-22-23zm0 0" />
  </SvgIcon>
);

export default HolyMassIcon;
