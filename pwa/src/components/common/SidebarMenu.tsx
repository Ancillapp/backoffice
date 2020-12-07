import React, {
  ReactNode,
  FunctionComponent,
  Fragment,
  useCallback,
} from 'react';

import { NavLink } from 'react-router-dom';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';

import PrayersIcon from '../icons/Prayers';
import AncillaDominiIcon from '../icons/AncillaDomini';
import HolyMassIcon from '../icons/HolyMass';

const useStyles = makeStyles((theme) => ({
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
