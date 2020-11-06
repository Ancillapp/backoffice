import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@material-ui/core';

const GoogleIcon: FunctionComponent<SvgIconProps> = (props) => (
  <SvgIcon viewBox="0 0 544 544" {...props}>
    <path
      fill="#4285f4"
      d="M539 278a320 320 0 00-5-55H278v105h147a126 126 0 01-55 83v68h88c51-48 81-118 81-201z"
    />
    <path
      fill="#34a853"
      d="M278 544c73 0 135-24 180-65l-88-68c-24 16-56 26-92 26-71 0-132-48-153-113H34v70a272 272 0 00244 150z"
    />
    <path
      fill="#fbbc04"
      d="M125 324a163 163 0 010-104v-70H34a272 272 0 000 244z"
    />
    <path
      fill="#ea4335"
      d="M278 108a148 148 0 01104 41l78-78A262 262 0 00278 0 272 272 0 0034 150l91 70c21-64 82-112 153-112z"
    />
  </SvgIcon>
);

export default GoogleIcon;
