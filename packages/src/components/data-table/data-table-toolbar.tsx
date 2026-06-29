import type { Column, Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';

import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableSliderFilter } from '@/components/data-table/data-table-slider-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { cn } from '@/lib/utils';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  viewOptions?: boolean;
  hideFilter?: boolean;
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  children,
  actions,
  className,
  viewOptions = true,
  hideFilter = false,
  ...props
}: DataTableToolbarProps<TData>) {
  const advancedFilters = (table.options.meta as any)?.filters as any[] | undefined;
  const setAdvancedFilters = (table.options.meta as any)?.setFilters as
    | ((val: any) => void)
    | undefined;
  const isAdvancedActive = (table.options.meta as any)?.isAdvanceFilter ?? false;

  const isFiltered = isAdvancedActive
    ? advancedFilters && advancedFilters.length > 0
    : table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table, table.options.columns],
  );

  const onReset = React.useCallback(() => {
    if (isAdvancedActive && setAdvancedFilters) {
      setAdvancedFilters([]);
    } else {
      table.resetColumnFilters();
    }
  }, [table, isAdvancedActive, setAdvancedFilters]);

  return (
    <div
      aria-orientation="horizontal"
      className={cn('flex w-full items-start justify-between gap-2 p-1', className)}
      role="toolbar"
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {!hideFilter &&
          columns.map((column) => (
            <DataTableToolbarFilter column={column} key={column.id} table={table} />
          ))}
        {children}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            className="border-dashed h-8 text-xs gap-1.5"
            onClick={onReset}
            size="sm"
            variant="outline"
          >
            <X className="size-3.5" />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {viewOptions && <DataTableViewOptions align="end" table={table} />}
      </div>
    </div>
  );
}
interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
  table: Table<TData>;
}

function DataTableToolbarFilter<TData>({ column, table }: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta;
    const debounceMs = (table.options.meta as any)?.debounceMs ?? 300;

    const onFilterRender = React.useCallback(() => {
      if (!columnMeta?.variant) return null;

      switch (columnMeta.variant) {
        case 'text':
          return (
            <DebouncedInput
              className="h-8 w-40 lg:w-56"
              debounce={debounceMs}
              onChange={(val) => column.setFilterValue(val)}
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ''}
            />
          );

        case 'number':
          return (
            <div className="relative">
              <DebouncedInput
                className={cn('h-8 w-32', columnMeta.unit && 'pr-8')}
                debounce={debounceMs}
                inputMode="numeric"
                onChange={(val) => column.setFilterValue(val)}
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                type="number"
                value={(column.getFilterValue() as string) ?? ''}
              />
              {columnMeta.unit && (
                <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                  {columnMeta.unit}
                </span>
              )}
            </div>
          );

        case 'range':
          return <DataTableSliderFilter column={column} title={columnMeta.label ?? column.id} />;

        case 'date':
        case 'dateRange':
          return (
            <DataTableDateFilter
              column={column}
              multiple={columnMeta.variant === 'dateRange'}
              presets={columnMeta.presets}
              title={columnMeta.label ?? column.id}
            />
          );

        case 'select':
        case 'multiSelect':
          return (
            <DataTableFacetedFilter
              column={column}
              loading={columnMeta.loading}
              multiple={columnMeta.variant === 'multiSelect'}
              options={columnMeta.options ?? []}
              title={columnMeta.label ?? column.id}
            />
          );

        default:
          return null;
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}
