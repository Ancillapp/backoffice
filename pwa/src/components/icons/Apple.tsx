import React, { FunctionComponent } from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const AppleIcon: FunctionComponent<SvgIconProps> = props => (
  <SvgIcon viewBox="0 0 1187 1187" fill="#000" {...props}>
    <path d="M1073 925a645 645 0 01-64 115q-51 72-82 99-50 46-106 47c-27 0-60-8-98-23s-73-24-105-24q-50 0-108 24-58 23-93 24-54 2-108-48-35-30-86-103-56-77-91-180-38-111-38-215 0-120 51-206 41-69 108-110c45-26 94-40 147-41 28 0 66 9 113 27s76 26 89 26c10 0 43-10 100-31q80-29 135-24 150 12 225 118-134 81-133 227 1 114 82 189a270 270 0 0083 54q-10 29-21 55zM844 24q0 89-65 166c-53 61-116 96-184 91a185 185 0 01-1-23c0-57 24-118 68-168q33-38 84-63t96-27a216 216 0 012 24z" />
  </SvgIcon>
);

export default AppleIcon;
