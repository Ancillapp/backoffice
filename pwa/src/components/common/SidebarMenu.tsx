import React, {
  ReactNode,
  FunctionComponent,
  Fragment,
  useCallback,
} from 'react';

import { NavLink } from 'react-router-dom';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';

import {
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  LibraryMusic as LibraryMusicIcon,
} from '@mui/icons-material';

import {
  Prayers as PrayersIcon,
  AncillaDomini as AncillaDominiIcon,
  HolyMass as HolyMassIcon,
} from '../icons';

const useStyles = makeStyles(theme => ({
  active: {
    '& *': {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
}));

interface MenuItem {
  key: string;
  title: string;
  icon: ReactNode;
  link?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    link: '/',
    icon: <DashboardIcon />,
  },
  {
    key: 'utenti',
    title: 'Utenti',
    icon: <PeopleIcon />,
  },
  {
    key: 'canti',
    title: 'Canti',
    icon: <LibraryMusicIcon />,
  },
  {
    key: 'preghiere',
    title: 'Preghiere',
    icon: <PrayersIcon />,
  },
  {
    key: 'ancilla-domini',
    title: 'Ancilla Domini',
    icon: <AncillaDominiIcon />,
  },
  {
    key: 'santa-messa',
    title: 'Santa Messa',
    icon: <HolyMassIcon />,
  },
];

interface SidebarMenuProps {
  onItemClick?(): void;
}

const SidebarMenu: FunctionComponent<SidebarMenuProps> = ({ onItemClick }) => {
  const classes = useStyles();

  const handleListItemClick = useCallback(() => {
    onItemClick?.();
  }, [onItemClick]);

  return (
    <List component="nav">
      {MENU_ITEMS.map(({ key, title, icon, link }) => (
        <Fragment key={key}>
          <ListItem
            button
            component={NavLink}
            exact={key === 'dashboard'}
            to={link || `/${key}`}
            activeClassName={classes.active}
            onClick={handleListItemClick}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{title}</ListItemText>
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
};

export default SidebarMenu;
