import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@material-ui/core';

const TwitterIcon: FunctionComponent<SvgIconProps> = (props) => (
  <SvgIcon viewBox="0 0 3333 3333" {...props}>
    <path
      fill="#1da1f2"
      d="M1667 0a1667 1667 0 110 3334 1667 1667 0 010-3334zm900 1108c-66 30-137 49-212 58 76-46 135-118 162-204-71 42-151 73-234 90a369 369 0 00-630 337c-307-16-579-162-761-386a368 368 0 00114 493c-61-2-117-19-167-46v5c0 179 127 328 296 362a391 391 0 01-167 6 371 371 0 00345 257 741 741 0 01-547 153c164 105 358 166 566 166 679 0 1051-563 1051-1051l-1-48c72-52 135-117 184-191z"
    />
  </SvgIcon>
);

export default TwitterIcon;
