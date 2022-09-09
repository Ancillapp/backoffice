import React, { FunctionComponent, memo, useCallback } from 'react';

import { makeStyles } from '@mui/styles';

export interface SongPreviewProps {
  content: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    '& p': {
      fontSize: '1rem',
      textAlign: 'left',
      margin: '1rem 0',
    },
    '& strong': {
      color: theme.palette.secondary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  chorus: {
    fontWeight: theme.typography.fontWeightBold,
  },
  bridge: {
    fontStyle: 'italic',
  },
  ending: {},
  verse: {},
}));

const SongPreview: FunctionComponent<SongPreviewProps> = ({ content }) => {
  const classes = useStyles();

  const getParagraphClass = useCallback(
    (paragraph: string) => {
      if (/^(?:rit\.|refrain:)/i.test(paragraph)) {
        return classes.chorus;
      }
      if (/^bridge/i.test(paragraph)) {
        return classes.bridge;
      }
      if (/^(?:finale|fin\.|ende:)/i.test(paragraph)) {
        return classes.ending;
      }
      return classes.verse;
    },
    [classes.bridge, classes.chorus, classes.ending, classes.verse],
  );

  const compile = useCallback(
    (rawString: string) =>
      rawString
        .split('\n\n')
        .map(
          paragraph =>
            `<p class="${getParagraphClass(paragraph)}">${paragraph
              .replace(/\n/g, '<br>')
              .replace(
                /^(rit\.|refrain:|bridge|finale|fin\.|ende:|\d\.)/i,
                '<strong>$1</strong>',
              )}</p>`,
        )
        .join(''),
    [getParagraphClass],
  );

  return (
    <div
      className={classes.root}
      dangerouslySetInnerHTML={{ __html: compile(content) }}
    />
  );
};

export default memo(SongPreview);
