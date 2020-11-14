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
  Box,
  BoxProps,
  makeStyles,
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableHead,
  TableHeadProps,
  TableRow,
  Theme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const ROW_HEIGHT = 56;

export type VirtualTableItem = Record<string, any>;

export interface VirtualTableCellProps<
  I extends VirtualTableItem = VirtualTableItem
> {
  index: number;
  data?: I;
  loading?: boolean;
}

export type VirtualTableCell<
  I extends VirtualTableItem = VirtualTableItem
> = ComponentType<VirtualTableCellProps<I>>;

export interface VirtualTableColumn<
  I extends VirtualTableItem = VirtualTableItem
> {
  key?: keyof I;
  title?: string;
  width?: number | string;
  justify?: BoxProps['justifyContent'];
  cellTemplate?: VirtualTableCell<I>;
}

export interface VirtualTableProps<
  I extends VirtualTableItem = VirtualTableItem
> extends HTMLAttributes<HTMLDivElement> {
  columns: VirtualTableColumn<I>[];
  items?: I[];
  loading?: boolean;
  estimatedRows?: number;
}

export interface VirtualTableStylesProps {
  columns: Pick<VirtualTableColumn, 'width'>[];
}

export type VirtualTableRowProps = ListChildComponentProps;

export type VirtualTableComponent = <
  I extends VirtualTableItem = VirtualTableItem
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

const useStyles = makeStyles<Theme, VirtualTableStylesProps>((theme) => ({
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
  }),
  cell: {
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}px`,
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
          <Box key={`${key}-${index}`} justifyContent={justify} clone>
            <TableCell component="div" className={classes.cell}>
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
          </Box>
        ))}
      </TableRow>
    ),
    [classes.cell, classes.row, columns, items, loading],
  );

  const handleHeadScroll = useCallback<NonNullable<TableHeadProps['onScroll']>>(
    (event) => {
      if (!bodyRef.current?.firstElementChild) {
        return;
      }

      bodyRef.current.firstElementChild.scrollLeft = (event.target as HTMLDivElement).scrollLeft;
    },
    [],
  );

  const handleBodyScroll = useCallback<NonNullable<TableBodyProps['onScroll']>>(
    (event) => {
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
          {columns.map(({ key, title = key, justify }) => (
            <Box key={`${key}`} justifyContent={justify} clone>
              <TableCell component="div" className={classes.cell}>
                {title}
              </TableCell>
            </Box>
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
