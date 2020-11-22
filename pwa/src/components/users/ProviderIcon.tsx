import React, { FunctionComponent, ReactNode } from 'react';

import { makeStyles, Tooltip } from '@material-ui/core';

import MailIcon from '@material-ui/icons/Mail';

import { Provider } from '../../providers/ApiProvider';

import GoogleIcon from '../icons/Google';
import FacebookIcon from '../icons/Facebook';
import TwitterIcon from '../icons/Twitter';
import MicrosoftIcon from '../icons/Microsoft';
import AppleIcon from '../icons/Apple';
import GitHubIcon from '../icons/GitHub';

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

const useStyles = makeStyles((theme) => ({
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
