import React, {
  Children,
  cloneElement,
  FunctionComponent,
  isValidElement,
  PropsWithChildren,
  ReactElement,
} from 'react';

import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.text.primary
        : theme.palette.primary.contrastText,
  },
}));

const TopbarIcon: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
  ...props
}) => {
  const classes = useStyles();

  return (
    <>
      {Children.map(children, child => {
        if (isValidElement(child)) {
          return cloneElement(child as ReactElement, {
            ...props,
            ...child.props,
            className: clsx(classes.root, child.props.className),
          });
        }

        return child;
      })}
    </>
  );
};

export default TopbarIcon;
