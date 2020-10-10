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

import { SongSummary } from '../providers/ApiProvider';

export interface SongsProps {
  items: SongSummary[];
}

interface SongsRowProps extends Omit<ListChildComponentProps, 'data'> {
  data: { width: number; height: number };
}

const useStyles = makeStyles((theme) => ({
  songsContainer: {
    width: '100%',
    height: '100%',
    flex: '1 1 auto',
  },
  songsRow: {
    display: 'grid',
    placeItems: 'center',
    gridTemplateColumns: 'repeat(5, 1fr)',
    width: '100%',
    maxWidth: theme.breakpoints.width('md'),
    margin: '0 auto',
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
    transition: theme.transitions.create('transform', {
      duration: 300,
    }),

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
                  key={number}
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
                      {number.endsWith('bis')
                        ? number.slice(2, -2)
                        : number.slice(2)}
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
          const maxWidth = Math.min(width, theme.breakpoints.width('md'));

          const itemWidth = Math.floor(maxWidth / 5);
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
