import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPageNumbers } from '@/lib/pagination';
import { cn } from '@/lib/utils';

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  showPageNumbers?: boolean;
  rowsPerPageText?: React.ReactNode | null;
  pageText?: ((page: number, total: number) => React.ReactNode) | null;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  showPageNumbers = true,
  rowsPerPageText = 'Rows per page',
  pageText,
  ...props
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div
      className={cn(
        'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 @max-2xl/content:flex-row-reverse">
        <Select
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
          value={`${table.getState().pagination.pageSize}`}
        >
          <SelectTrigger className="h-8 w-18 data-size:h-8">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showPageNumbers && rowsPerPageText !== null && (
          <p className="whitespace-nowrap font-medium text-sm">{rowsPerPageText}</p>
        )}
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        {showPageNumbers && pageText !== null && (
          <div className="flex items-center justify-center font-medium text-sm">
            {pageText ? pageText(currentPage, totalPages) : `Page ${currentPage} of ${totalPages}`}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            className="size-8 p-0 @max-md/content:hidden"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            variant="outline"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            className="size-8 p-0"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page number buttons */}
          {pageNumbers.map((pageNumber, index) => (
            <div className="flex items-center" key={`${pageNumber}-${index}`}>
              {pageNumber === '...' ? (
                <span className="px-1 text-sm text-muted-foreground">...</span>
              ) : (
                <Button
                  className="h-8 min-w-8 px-2"
                  onClick={() => table.setPageIndex((pageNumber as number) - 1)}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                >
                  <span className="sr-only">Go to page {pageNumber}</span>
                  {pageNumber}
                </Button>
              )}
            </div>
          ))}

          <Button
            className="size-8 p-0"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            variant="outline"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            className="size-8 p-0 @max-md/content:hidden"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
