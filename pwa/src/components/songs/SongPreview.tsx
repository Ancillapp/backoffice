import React, { FunctionComponent, memo, useCallback, useMemo } from 'react';

import { makeStyles } from '@mui/styles';

import { UltimateGuitarParser, HtmlDivFormatter } from 'chordsheetjs';
import clsx from 'clsx';

const parser = new UltimateGuitarParser();
const formatter = new HtmlDivFormatter();
const template = document.createElement('template');

export interface SongPreviewProps {
  content: string;
  enableChords?: boolean;
}

const scopedStyles = Object.fromEntries(
  Object.entries(HtmlDivFormatter.cssObject()).map(([className, styles]) => [
    `& ${className}`,
    styles,
  ]),
);

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '1rem',
    textAlign: 'left',
    margin: '1rem 0',

    '& strong, & .comment, & .chord': {
      color: theme.palette.secondary.main,
      fontWeight: theme.typography.fontWeightBold,
    },

    ...scopedStyles,
  },
  withoutChords: {
    '& .chord': {
      display: 'none',
    },
  },
  chorus: {
    fontWeight: theme.typography.fontWeightBold,
  },
  bridge: {
    fontStyle: 'italic',
  },
  ending: {},
}));

const SongPreview: FunctionComponent<SongPreviewProps> = ({
  content,
  enableChords = false,
}) => {
  const classes = useStyles();

  const getParagraphClass = useCallback(
    (type: string): string => {
      if (/^(?:rit|refrain)[:.]?$/i.test(type)) {
        return classes.chorus;
      }
      if (/^bridge[:.]?$/i.test(type)) {
        return classes.bridge;
      }
      if (/^(?:finale|fin|ende)[:.]?$/i.test(type)) {
        return classes.ending;
      }
      return '';
    },
    [classes.bridge, classes.chorus, classes.ending],
  );

  const parsedContent = useMemo(() => {
    try {
      const song = parser.parse(content);
      return song;
    } catch {
      return content;
    }
  }, [content]);

  const formattedContent = useMemo(() => {
    if (typeof parsedContent === 'string') {
      return parsedContent;
    }
    const formatted: string = formatter.format(parsedContent);
    template.innerHTML = formatted.trim();
    const element = template.content.firstChild as HTMLDivElement;
    const paragraphs = Array.from(element.querySelectorAll('.paragraph'));
    paragraphs.forEach(paragraph => {
      const comment = paragraph.querySelector<HTMLDivElement>('.comment');
      if (comment) {
        comment.innerHTML = `<strong>${comment.innerHTML}</strong>`;
      }
      const initialParagraphLyrics = paragraph.querySelector(
        '.row > .column > .lyrics',
      );
      const paragraphType = initialParagraphLyrics?.textContent?.match(
        /^(?:rit|refrain|bridge|finale|fin|ende|\d+)[:.]?/gi,
      )?.[0];
      if (paragraphType) {
        initialParagraphLyrics.innerHTML =
          initialParagraphLyrics.innerHTML.replace(
            paragraphType,
            `<strong>${paragraphType}</strong>`,
          );
      }
      const paragraphClass = getParagraphClass(
        paragraphType || comment?.innerText.trim() || '',
      );
      if (paragraphClass) {
        paragraph.classList.add(paragraphClass);
      }
    });
    return element.outerHTML;
  }, [getParagraphClass, parsedContent]);

  return (
    <div
      className={clsx(classes.root, !enableChords && classes.withoutChords)}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export default memo(SongPreview);
