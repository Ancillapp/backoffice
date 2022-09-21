import React, {
  ComponentType,
  FunctionComponent,
  HTMLAttributes,
  useCallback,
  useRef,
} from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';

import { FixedSizeList, ListChildComponentProps } from 'react-window';

import clsx from 'clsx';

import {
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableHead,
  TableHeadProps,
  TableRow,
  Theme,
  Skeleton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const ROW_HEIGHT = 56;

export type VirtualTableItem = Record<string, any>;

export interface VirtualTableCellProps<
  I extends VirtualTableItem = VirtualTableItem,
> {
  index: number;
  data?: I;
  loading?: boolean;
}

export type VirtualTableCell<I extends VirtualTableItem = VirtualTableItem> =
  ComponentType<VirtualTableCellProps<I>>;

export interface VirtualTableColumn<
  I extends VirtualTableItem = VirtualTableItem,
> {
  key?: keyof I;
  title?: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  justify?:
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'left'
    | 'right'
    | 'normal'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'safe center'
    | 'unsafe center'
    | 'inherit'
    | 'initial'
    | 'unset';
  cellTemplate?: VirtualTableCell<I>;
}

export interface VirtualTableProps<
  I extends VirtualTableItem = VirtualTableItem,
> extends HTMLAttributes<HTMLDivElement> {
  columns: VirtualTableColumn<I>[];
  items?: I[];
  loading?: boolean;
  estimatedRows?: number;
}

export interface VirtualTableStylesProps {
  columns: Pick<VirtualTableColumn, 'width' | 'minWidth' | 'maxWidth'>[];
}

export type VirtualTableRowProps = ListChildComponentProps;

export type VirtualTableComponent = <
  I extends VirtualTableItem = VirtualTableItem,
>(
  props: VirtualTableProps<I>,
) => ReturnType<FunctionComponent>;

const formatColumnWidth = (width: VirtualTableColumn['width']): string => {
  switch (typeof width) {
    case 'number': {
      return `${width}px`;
    }

    case 'undefined': {
      return '1fr';
    }

    default: {
      return `${width}`;
    }
  }
};

const useStyles = makeStyles<Theme, VirtualTableStylesProps>(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
  },
  row: ({ columns }) => ({
    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gridTemplateColumns: columns
      .map(({ width }) => formatColumnWidth(width))
      .join(' '),
    ...Object.fromEntries(
      columns.map(({ width, minWidth, maxWidth }, index) => [
        `& > *:nth-child(${index + 1})`,
        {
          ...(width && { width: formatColumnWidth(width) }),
          ...(minWidth && { minWidth: formatColumnWidth(minWidth) }),
          ...(maxWidth && { maxWidth: formatColumnWidth(maxWidth) }),
        },
      ]),
    ),
  }),
  cell: {
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}`,
    height: ROW_HEIGHT,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  head: {
    position: 'relative',
    flex: '0 0 auto',
    width: '100%',
    overflow: 'auto',
  },
  body: {
    position: 'relative',
    flex: '1 1 auto',
    width: '100%',
    overflow: 'hidden',

    '& > *': {
      overflow: 'hidden',
    },
  },
}));

const VirtualTable: VirtualTableComponent = ({
  columns,
  items,
  className,
  loading,
  estimatedRows = 50,
  ...props
}) => {
  const classes = useStyles({ columns });

  const headRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const VirtualTableRow = useCallback<FunctionComponent<VirtualTableRowProps>>(
    ({ index, style }) => (
      <TableRow component="div" className={classes.row} style={style}>
        {columns.map(({ key, justify, cellTemplate: CellTemplate }) => (
          <TableCell
            key={`${key as string}-${index}`}
            sx={{ justifyContent: justify }}
            component="div"
            className={classes.cell}
          >
            {typeof CellTemplate === 'function' && (
              <CellTemplate
                index={index}
                data={items?.[index]}
                loading={loading}
              />
            )}

            {typeof CellTemplate !== 'function' &&
              key &&
              (loading ? (
                <Skeleton variant="text" width={128} />
              ) : (
                `${items?.[index][key]}`
              ))}
          </TableCell>
        ))}
      </TableRow>
    ),
    [classes.cell, classes.row, columns, items, loading],
  );

  const handleHeadScroll = useCallback<NonNullable<TableHeadProps['onScroll']>>(
    event => {
      if (!bodyRef.current?.firstElementChild) {
        return;
      }

      bodyRef.current.firstElementChild.scrollLeft = (
        event.target as HTMLDivElement
      ).scrollLeft;
    },
    [],
  );

  const handleBodyScroll = useCallback<NonNullable<TableBodyProps['onScroll']>>(
    event => {
      if (!headRef.current) {
        return;
      }

      headRef.current.scrollLeft = (event.target as HTMLDivElement).scrollLeft;
    },
    [],
  );

  return (
    <AutoSizer>
      {({ width, height }) => (
        <Table
          component="div"
          className={clsx(classes.root, className)}
          style={{ width, height }}
          {...props}
        >
          <TableHead
            component="div"
            className={classes.head}
            onScroll={handleHeadScroll}
            ref={headRef}
          >
            <TableRow component="div" className={classes.row}>
              {columns.map(({ key, title = key as string, justify }) => (
                <TableCell
                  key={key as string}
                  sx={{ justifyContent: justify }}
                  component="div"
                  className={classes.cell}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            component="div"
            className={classes.body}
            onScroll={handleBodyScroll}
            ref={bodyRef}
          >
            <FixedSizeList
              width={width}
              height={height}
              itemCount={loading ? estimatedRows : items?.length || 0}
              itemSize={ROW_HEIGHT}
            >
              {VirtualTableRow}
            </FixedSizeList>
          </TableBody>
        </Table>
      )}
    </AutoSizer>
  );
};

export default VirtualTable;
