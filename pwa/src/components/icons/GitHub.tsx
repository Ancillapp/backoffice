import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@material-ui/core';

const GitHubIcon: FunctionComponent<SvgIconProps> = (props) => (
  <SvgIcon viewBox="0 0 1024 1024" fill="#1b1f23" {...props}>
    <path d="M512 0a512 512 0 00-162 998c26 4 35-11 35-25v-95c-129 24-162-31-173-60-5-15-30-60-52-72-18-10-44-34-1-34 41-1 69 37 79 52 46 78 120 56 149 42 5-33 18-55 33-68-114-13-233-57-233-253 0-56 20-102 52-137-5-13-23-66 5-136 0 0 43-14 141 52a475 475 0 01256 0c98-66 141-52 141-52 28 70 10 123 5 136 33 35 53 81 53 137 0 197-120 240-234 253 19 16 35 47 35 95l-1 140c0 14 10 30 35 25A513 513 0 00512 0z" />
  </SvgIcon>
);

export default GitHubIcon;
