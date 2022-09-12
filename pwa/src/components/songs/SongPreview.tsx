import React, {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { makeStyles } from '@mui/styles';

import { UltimateGuitarParser, HtmlDivFormatter, Song } from 'chordsheetjs';
import { renderAbc } from 'abcjs';
import clsx from 'clsx';

const parser = new UltimateGuitarParser();
const formatter = new HtmlDivFormatter();
const template = document.createElement('template');

interface UltimateGuitarSection {
  type: 'ug';
  content: Song;
}

interface ABCSection {
  type: 'abc';
  content: string;
}

interface RawSection {
  type: 'raw';
  content: string;
}

type Section = UltimateGuitarSection | ABCSection | RawSection;

export interface SongPreviewProps {
  content: string;
  enableChords?: boolean;
}

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '1rem',
    textAlign: 'left',
    margin: '1rem 0',

    '& .chord': {
      '&:not(:last-child)': {
        paddingRight: '10px',
      },
      '&:after': {
        content: "'\\200b'",
      },
    },

    '& .paragraph': {
      marginBottom: '1em',
    },

    '& .row': {
      display: 'flex',
      // If there isn't enough space for the entire row to be shown,
      // make sure the text wraps properly
      flexWrap: 'wrap',
    },

    '& .lyrics': {
      // Some lyrics column might be longer than the screen, so we need to enable wrapping
      whiteSpace: 'wrap',

      '&:after': {
        content: "'\\200b'",
      },
    },

    '& strong, & .comment, & .chord': {
      color: theme.palette.secondary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
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
  const [abcSections, setAbcSections] = useState<string[]>([]);

  useEffect(() => {
    abcSections.forEach((abcSection, index) =>
      renderAbc(`abc-${index}`, abcSection, { responsive: 'resize' }),
    );
  }, [abcSections]);

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

  const parsedSections = useMemo<Section[]>(() => {
    const sections = content.split('```').filter(Boolean);
    return sections.map(section => {
      if (section.startsWith('abc')) {
        return {
          type: 'abc',
          content: section.slice(3),
        };
      }
      try {
        const parsedSong = parser.parse(section);
        return {
          type: 'ug',
          content: parsedSong,
        };
      } catch {
        return {
          type: 'raw',
          content: section,
        };
      }
    });
  }, [content]);

  const formattedContent = useMemo<string>(() => {
    const abcSections: string[] = [];

    const formattedSections = parsedSections.map(section => {
      switch (section.type) {
        case 'ug': {
          const formattedSong: string = formatter.format(section.content);
          template.innerHTML = formattedSong.trim();
          const element = template.content.firstChild as HTMLDivElement;
          element.classList.add('ug');
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
        }
        case 'abc': {
          const newLength = abcSections.push(section.content);
          return `<div class="abc" id="abc-${newLength - 1}"></div>`;
        }
        default: {
          return `<div class="raw">${section.content}</div>`;
        }
      }
    });
    setAbcSections(abcSections);
    return formattedSections.join('');
  }, [getParagraphClass, parsedSections]);

  return (
    <div
      className={clsx(classes.root, !enableChords && classes.withoutChords)}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export default memo(SongPreview);
