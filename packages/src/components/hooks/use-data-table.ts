import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import * as React from 'react';
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
  JoinOperator,
} from '@/components/data-table/types';
import { useDebouncedCallback } from '@/components/hooks/use-debounced-callback';
import { getValidFilters } from '@/lib/data-table';

const DEBOUNCE_MS = 300;

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  debounceMs?: number;
  enableAdvancedFilter?: boolean;
  isAdvanceFilter?: boolean;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  manualFiltering?: boolean;
  filters?: ExtendedColumnFilter<TData>[];
  setFilters?: React.Dispatch<React.SetStateAction<ExtendedColumnFilter<TData>[]>>;
  joinOperator?: JoinOperator;
  setJoinOperator?: React.Dispatch<React.SetStateAction<JoinOperator>>;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    debounceMs = DEBOUNCE_MS,
    enableAdvancedFilter = false,
    isAdvanceFilter = false,
    page: controlledPage,
    perPage: controlledPerPage,
    onPageChange,
    onPerPageChange,
    manualFiltering: controlledManualFiltering,
    filters: controlledFilters,
    setFilters: controlledSetFilters,
    joinOperator: controlledJoinOperator,
    setJoinOperator: controlledSetJoinOperator,
    ...tableProps
  } = props;

  const isAdvanced = enableAdvancedFilter || isAdvanceFilter;

  const [localFilters, setLocalFilters] = React.useState<ExtendedColumnFilter<TData>[]>(
    initialState?.columnFilters
      ? initialState.columnFilters.map((cf) => ({
          filterId: Math.random().toString(36).substring(7),
          id: cf.id as Extract<keyof TData, string>,
          operator: 'eq',
          value: cf.value as string | string[],
          variant: 'text',
        }))
      : [],
  );
  const [localJoinOperator, setLocalJoinOperator] = React.useState<JoinOperator>('and');

  const filters = controlledFilters !== undefined ? controlledFilters : localFilters;
  const setFilters = controlledSetFilters !== undefined ? controlledSetFilters : setLocalFilters;

  const joinOperator =
    controlledJoinOperator !== undefined ? controlledJoinOperator : localJoinOperator;
  const setJoinOperator =
    controlledSetJoinOperator !== undefined ? controlledSetJoinOperator : setLocalJoinOperator;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  );

  const [internalPage, setInternalPage] = React.useState<number>(
    initialState?.pagination?.pageIndex !== undefined ? initialState.pagination.pageIndex + 1 : 1,
  );
  const [internalPerPage, setInternalPerPage] = React.useState<number>(
    initialState?.pagination?.pageSize ?? 10,
  );

  const page = controlledPage ?? internalPage;
  const perPage = controlledPerPage ?? internalPerPage;

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        const newPage = newPagination.pageIndex + 1;

        if (controlledPage === undefined) setInternalPage(newPage);
        if (controlledPerPage === undefined) setInternalPerPage(newPagination.pageSize);

        onPageChange?.(newPage);
        onPerPageChange?.(newPagination.pageSize);
      } else {
        const newPage = updaterOrValue.pageIndex + 1;
        if (controlledPage === undefined) setInternalPage(newPage);
        if (controlledPerPage === undefined) setInternalPerPage(updaterOrValue.pageSize);

        onPageChange?.(newPage);
        onPerPageChange?.(updaterOrValue.pageSize);
      }
    },
    [pagination, controlledPage, controlledPerPage, onPageChange, onPerPageChange],
  );

  const [sorting, setSorting] = React.useState<ExtendedColumnSort<TData>[]>(
    initialState?.sorting ?? [],
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
    },
    [sorting],
  );

  const filterableColumns = React.useMemo(() => {
    if (isAdvanced) return [];
    return columns.filter((column) => column.enableColumnFilter);
  }, [columns, isAdvanced]);

  const [filterValues, setFilterValuesRef] = React.useState<
    Record<string, string | string[] | null>
  >({});

  const setFilterValues = React.useCallback((updates: Record<string, string | string[] | null>) => {
    setFilterValuesRef((prev) => ({ ...prev, ...updates }));
  }, []);

  const debouncedSetFilterValues = useDebouncedCallback(
    (values: Record<string, string | string[] | null>) => {
      if (controlledPage === undefined) setInternalPage(1);
      onPageChange?.(1);
      setFilterValues(values);
    },
    debounceMs,
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (isAdvanced) return;

      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;

        const filterUpdates = next.reduce<Record<string, string | string[] | null>>(
          (acc, filter) => {
            if (filterableColumns.find((column) => column.id === filter.id)) {
              acc[filter.id] = filter.value as string | string[];
            }
            return acc;
          },
          {},
        );

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, isAdvanced],
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      if (filterValue && typeof filterValue === 'object' && 'filters' in filterValue) {
        return matchRow(row, filterValue.filters, filterValue.joinOperator || 'and');
      }
      return true;
    },
    initialState,
    manualFiltering:
      controlledManualFiltering !== undefined ? controlledManualFiltering : !isAdvanced,
    manualPagination: true,
    manualSorting: true,
    meta: {
      ...tableProps.meta,
      debounceMs,
      filters,
      isAdvanceFilter: isAdvanced,
      joinOperator,
      setFilters,
      setJoinOperator,
    },
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    pageCount,
    state: {
      columnFilters,
      columnVisibility,
      globalFilter: isAdvanced ? { filters, joinOperator } : undefined,
      pagination,
      rowSelection,
      sorting,
    },
  });

  return {
    filters,
    filterValues,
    joinOperator,
    page,
    perPage,
    setFilters,
    setJoinOperator,
    sorting,
    table,
  };
}

function matchRow<TData>(
  row: any,
  filters: ExtendedColumnFilter<TData>[],
  joinOperator: JoinOperator,
): boolean {
  const validFilters = getValidFilters(filters);
  if (validFilters.length === 0) return true;

  const results = validFilters.map((filter) => {
    const cellValue = row.getValue(filter.id);
    const filterValue = filter.value;
    const operator = filter.operator;

    if (operator === 'isEmpty') {
      return cellValue === null || cellValue === undefined || cellValue === '';
    }
    if (operator === 'isNotEmpty') {
      return cellValue !== null && cellValue !== undefined && cellValue !== '';
    }

    if (filter.variant === 'boolean') {
      return String(cellValue) === String(filterValue);
    }

    if (filter.variant === 'date' || filter.variant === 'dateRange') {
      if (!cellValue) return false;
      const cellDate = dayjs(cellValue);
      if (!cellDate.isValid()) return false;

      if (operator === 'isBetween') {
        if (!Array.isArray(filterValue) || filterValue.length < 2) return false;
        const start = dayjs(Number(filterValue[0]));
        const end = dayjs(Number(filterValue[1]));
        return cellDate.isAfter(start.startOf('day')) && cellDate.isBefore(end.endOf('day'));
      }

      const cmpDate = dayjs(Number(filterValue));
      if (!cmpDate.isValid()) return false;

      switch (operator) {
        case 'eq':
          return cellDate.isSame(cmpDate, 'day');
        case 'ne':
          return !cellDate.isSame(cmpDate, 'day');
        case 'lt':
          return cellDate.isBefore(cmpDate, 'day');
        case 'lte':
          return cellDate.isBefore(cmpDate, 'day') || cellDate.isSame(cmpDate, 'day');
        case 'gt':
          return cellDate.isAfter(cmpDate, 'day');
        case 'gte':
          return cellDate.isAfter(cmpDate, 'day') || cellDate.isSame(cmpDate, 'day');
        default:
          return false;
      }
    }

    if (filter.variant === 'select' || filter.variant === 'multiSelect') {
      const selected = Array.isArray(filterValue) ? filterValue : [filterValue].filter(Boolean);
      if (selected.length === 0) return true;
      const valStr = String(cellValue).toLowerCase();

      if (operator === 'notInArray') {
        return !selected.some((v) => String(v).toLowerCase() === valStr);
      }
      return selected.some((v) => String(v).toLowerCase() === valStr);
    }

    if (filter.variant === 'number' || filter.variant === 'range') {
      if (operator === 'isBetween') {
        if (!Array.isArray(filterValue) || filterValue.length < 2) return false;
        const val = Number(cellValue);
        return val >= Number(filterValue[0]) && val <= Number(filterValue[1]);
      }
      const val = Number(cellValue);
      const filterNum = Number(filterValue);
      switch (operator) {
        case 'eq':
          return val === filterNum;
        case 'ne':
          return val !== filterNum;
        case 'lt':
          return val < filterNum;
        case 'lte':
          return val <= filterNum;
        case 'gt':
          return val > filterNum;
        case 'gte':
          return val >= filterNum;
        default:
          return false;
      }
    }

    const strCellValue = String(cellValue).toLowerCase();
    const strFilterValue = String(filterValue).toLowerCase();

    switch (operator) {
      case 'iLike':
        return strCellValue.includes(strFilterValue);
      case 'notILike':
        return !strCellValue.includes(strFilterValue);
      case 'eq':
        return strCellValue === strFilterValue;
      case 'ne':
        return strCellValue !== strFilterValue;
      default:
        return false;
    }
  });

  if (joinOperator === 'or') {
    return results.some(Boolean);
  }
  return results.every(Boolean);
}
