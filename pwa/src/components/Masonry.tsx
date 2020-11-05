import React, {
  FunctionComponent,
  Children,
  useEffect,
  useRef,
  isValidElement,
  cloneElement,
  useState,
} from 'react';

import clsx from 'clsx';

import MasonryLayout, { Options as MasonryLayoutOptions } from 'masonry-layout';

import { makeStyles, Theme, useTheme } from '@material-ui/core';

export interface MasonryContainerProps
  extends Omit<MasonryLayoutOptions, 'gutter' | 'itemSelector'> {
  container: true;
  item?: false;
  spacing?: number;
  className?: string;
}

export type ItemSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// TODO: improve these typings
export interface MasonryItemProps extends Record<string, unknown> {
  item: true;
  container?: false;
  xs?: ItemSize;
  sm?: ItemSize;
  md?: ItemSize;
  lg?: ItemSize;
  xl?: ItemSize;
}

export type MasonryProps = MasonryContainerProps | MasonryItemProps;

const useContainerStyles = makeStyles<
  Theme,
  Pick<MasonryContainerProps, 'spacing'>
>((theme) => ({
  root: ({ spacing = 0 }) => ({
    marginBottom: theme.spacing(-spacing),
  }),
  sizer: {
    width: `${100 / 12}%`,
  },
  item: ({ spacing = 0 }) => ({
    marginBottom: theme.spacing(spacing),
  }),
}));

const MasonryContainer: FunctionComponent<MasonryContainerProps> = ({
  className,
  children,
  spacing = 0,
  ...masonryOptions
}) => {
  const theme = useTheme();
  const classes = useContainerStyles({ spacing });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [masonry, setMasonry] = useState<MasonryLayout | null>(null);
  const [itemClassName] = useState(
    `react-masonry-${Date.now()}${Math.round(Math.random() * 1000)}`,
  );

  useEffect(() => {
    if (containerRef.current && itemClassName && !masonry) {
      setMasonry(
        new MasonryLayout(containerRef.current, {
          percentPosition: true,
          ...masonryOptions,
          itemSelector: `.${itemClassName}`,
          columnWidth: `.${classes.sizer}`,
          gutter: theme.spacing(spacing),
        }),
      );

      return () => (masonry as MasonryLayout | null)?.destroy?.();
    }
  }, [classes.sizer, itemClassName, masonry, masonryOptions, spacing, theme]);

  return (
    <div className={clsx(classes.root, className)} ref={containerRef}>
      <div className={classes.sizer} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            className: clsx(classes.item, itemClassName, child.props.className),
            spacing,
          });
        }

        return child;
      })}
    </div>
  );
};

const useItemStyles = makeStyles<
  Theme,
  Pick<MasonryItemProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl'> & { spacing: number }
>((theme) => ({
  root: ({ spacing, ...breakpoints }) =>
    Object.fromEntries(
      Object.entries(breakpoints)
        .filter(([, size]) => typeof size !== 'undefined')
        .map(([breakpoint, size = 1]) => [
          theme.breakpoints.up(breakpoint as 'xs' | 'sm' | 'md' | 'lg' | 'xl'),
          {
            width: `calc(${(size / 12) * 100}% - ${theme.spacing(
              spacing * 2,
            )}px)`,
          },
        ]),
    ),
}));

const MasonryItem: FunctionComponent<MasonryItemProps> = ({
  item,
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing,
  ...childProps
}) => {
  const classes = useItemStyles({
    xs,
    sm,
    md,
    lg,
    xl,
    spacing: spacing as number,
  });

  return isValidElement(children) ? (
    cloneElement(children, {
      ...childProps,
      className: clsx(classes.root, childProps.className as string | undefined),
    })
  ) : (
    <>{children}</>
  );
};

const Masonry: FunctionComponent<MasonryProps> = (props) =>
  props.container ? (
    <MasonryContainer {...props} />
  ) : (
    <MasonryItem {...props} />
  );

export default Masonry;
