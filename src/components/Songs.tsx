import React, { FunctionComponent, useCallback } from 'react';

import { FixedSizeList, ListChildComponentProps } from 'react-window';

import AutoSizer from 'react-virtualized-auto-sizer';

import {
  Card,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

export interface SongSummary {
  number: string;
  title: string;
}

export interface SongsProps {
  items: SongSummary[];
}

interface SongsRowProps extends Omit<ListChildComponentProps, 'data'> {
  data: { width: number; height: number };
}

const useStyles = makeStyles((theme) => ({
  songsContainer: {
    width: '100%',
    maxWidth: theme.breakpoints.width('md'),
    height: '100%',
    flex: '1 1 auto',
    margin: '0 auto',
    padding: `0 ${theme.spacing(5)}px`,
  },
  songsRow: {
    display: 'grid',
    placeItems: 'center',
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
  songLink: {
    textDecoration: 'none',
    margin: theme.spacing(1),
  },
  song: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    willChange: 'transform',
    transition: '0.3s transform',

    '&:hover, &:active': {
      transform: 'scale(1.025)',
    },
  },
}));

const Songs: FunctionComponent<SongsProps> = ({ items }) => {
  const theme = useTheme();

  const classes = useStyles();

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const SongsRow = useCallback<FunctionComponent<SongsRowProps>>(
    ({ style, index, data: { width, height } }) => (
      <div style={style}>
        <div className={classes.songsRow} style={{ height }}>
          {[...Array(5)].map((_, subindex) => {
            const {
              [index * 5 + subindex]: {
                number = undefined,
                title = undefined,
              } = {},
            } = items;

            return (
              number &&
              title && (
                <Link
                  to={`/canti/${number}`}
                  key={`${index}-${subindex}`}
                  className={classes.songLink}
                  style={{
                    width: width - theme.spacing(2),
                    height: height - theme.spacing(2),
                  }}
                >
                  <Card className={classes.song}>
                    <Typography
                      variant={isDesktop ? 'h2' : 'h4'}
                      align="center"
                    >
                      {number.slice(2)}
                    </Typography>
                    {isDesktop && (
                      <Typography variant="h6" align="center" color="secondary">
                        {title}
                      </Typography>
                    )}
                  </Card>
                </Link>
              )
            );
          })}
        </div>
      </div>
    ),
    [classes.song, classes.songLink, classes.songsRow, isDesktop, items, theme],
  );

  return (
    <div className={classes.songsContainer}>
      <AutoSizer>
        {({ width, height }) => {
          const itemWidth = Math.floor(width / 5);
          const itemHeight = Math.floor((itemWidth / 2) * 3);

          return (
            <FixedSizeList
              width={width}
              height={height}
              itemCount={Math.ceil(items.length / 5)}
              itemSize={itemHeight}
              itemData={{ width: itemWidth, height: itemHeight }}
            >
              {SongsRow}
            </FixedSizeList>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default Songs;
