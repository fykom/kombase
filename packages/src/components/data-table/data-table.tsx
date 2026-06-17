import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  wrapperClassname?: string;
  emptyState?: React.ReactNode;
  stickyHeader?: boolean;
  onEndReached?: () => void;
  isLoading?: boolean;
  endReachedThreshold?: number;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  wrapperClassname,
  emptyState,
  stickyHeader,
  onEndReached,
  isLoading,
  endReachedThreshold = 100,
  ...props
}: DataTableProps<TData>) {
  const tableRef = React.useRef<HTMLTableElement>(null);

  React.useEffect(() => {
    if (!onEndReached) return;

    const scrollContainer = tableRef.current?.parentElement;
    if (!scrollContainer) return;

    let isFetchingLocal = false;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollHeight - scrollTop - clientHeight < endReachedThreshold) {
        if (!isFetchingLocal && !isLoading) {
          isFetchingLocal = true;
          onEndReached();
        }
      } else {
        isFetchingLocal = false;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [onEndReached, endReachedThreshold, isLoading]);

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4',
      )}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table
          ref={tableRef}
          wrapperClassname={cn(stickyHeader && 'max-h-[600px] overflow-y-auto', wrapperClassname)}
        >
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    colSpan={header.colSpan}
                    key={header.id}
                    style={{
                      ...getCommonPinningStyles({
                        column: header.column,
                        isHeader: true,
                        stickyHeader,
                      }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={table.getAllColumns().length}>
                  {emptyState ?? 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
