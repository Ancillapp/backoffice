import React, { FunctionComponent, useCallback } from 'react';

import { FixedSizeList, ListChildComponentProps } from 'react-window';

import AutoSizer from 'react-virtualized-auto-sizer';

import { Card, Grid, makeStyles, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';

export interface SongSummary {
  number: string;
  title: string;
}

export interface SongsProps {
  items: SongSummary[];
}

interface SongsRowProps extends Omit<ListChildComponentProps, 'data'> {
  data: { height: number };
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
  songLink: {
    textDecoration: 'none',
  },
  song: {
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
  const classes = useStyles();

  const SongsRow = useCallback<FunctionComponent<SongsRowProps>>(
    ({ style, index, data: { height } }) => (
      <div style={style}>
        <Grid container spacing={5} style={{ height }}>
          {[...Array(4)].map((_, subindex) => {
            const {
              [index * 4 + subindex]: {
                number = undefined,
                title = undefined,
              } = {},
            } = items;

            return (
              number &&
              title && (
                <Grid item xs={3} key={`${index}-${subindex}`}>
                  <Link to={`/canti/${number}`} className={classes.songLink}>
                    <Card className={classes.song}>
                      <Typography variant="h3" align="center">
                        {number.slice(2)}
                      </Typography>
                      <Typography variant="h6" align="center">
                        {title}
                      </Typography>
                    </Card>
                  </Link>
                </Grid>
              )
            );
          })}
        </Grid>
      </div>
    ),
    [classes.song, classes.songLink, items],
  );

  return (
    <div className={classes.songsContainer}>
      <AutoSizer>
        {({ width, height }) => {
          const itemHeight = Math.floor((width / 8) * 3);

          return (
            <FixedSizeList
              width={width}
              height={height}
              itemCount={Math.ceil(items.length / 4)}
              itemSize={itemHeight}
              itemData={{ height: itemHeight }}
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
