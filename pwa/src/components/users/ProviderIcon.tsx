import React, { FunctionComponent, ReactNode } from 'react';

import { Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { Mail as MailIcon } from '@mui/icons-material';

import { Provider } from '../../providers/ApiProvider';

import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Microsoft as MicrosoftIcon,
  Apple as AppleIcon,
  GitHub as GitHubIcon,
} from '../icons';

export interface ProviderIconProps {
  provider: Provider;
}

const providerToDataMap: Record<Provider, { name: string; icon: ReactNode }> = {
  [Provider.EMAIL_PASSWORD]: {
    name: 'Email e password',
    icon: <MailIcon />,
  },
  [Provider.GOOGLE]: {
    name: 'Google',
    icon: <GoogleIcon />,
  },
  [Provider.FACEBOOK]: {
    name: 'Facebook',
    icon: <FacebookIcon />,
  },
  [Provider.TWITTER]: {
    name: 'Twitter',
    icon: <TwitterIcon />,
  },
  [Provider.MICROSOFT]: {
    name: 'Microsoft',
    icon: <MicrosoftIcon />,
  },
  [Provider.APPLE]: {
    name: 'Apple',
    icon: <AppleIcon />,
  },
  [Provider.GITHUB]: {
    name: 'GitHub',
    icon: <GitHubIcon />,
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5),
  },
}));

const ProviderIcon: FunctionComponent<ProviderIconProps> = ({ provider }) => {
  const classes = useStyles();

  const { name, icon } = providerToDataMap[provider];

  return (
    <Tooltip title={name}>
      <span className={classes.root}>{icon}</span>
    </Tooltip>
  );
};

export default ProviderIcon;
