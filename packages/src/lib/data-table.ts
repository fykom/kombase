import type { Column } from '@tanstack/react-table';
import { dataTableConfig } from '../components/data-table/data-table-config';
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from '../components/data-table/types';

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
  isHeader = false,
  stickyHeader = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
  isHeader?: boolean;
  stickyHeader?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  const isSticky = isPinned || (isHeader && stickyHeader);

  return {
    background: 'var(--background)',
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px var(--border) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px var(--border) inset'
          : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isSticky ? 'sticky' : 'relative',
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    top: isHeader && stickyHeader ? 0 : undefined,
    width: column.getSize(),
    zIndex: isPinned
      ? isHeader && stickyHeader
        ? 30
        : 10
      : isHeader && stickyHeader
        ? 20
        : undefined,
  };
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<FilterVariant, { label: string; value: FilterOperator }[]> = {
    boolean: dataTableConfig.booleanOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    select: dataTableConfig.selectOperators,
    text: dataTableConfig.textOperators,
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  if (filterVariant === 'dateRange' || filterVariant === 'range') {
    return 'isBetween';
  }
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === 'text' ? 'iLike' : 'eq');
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === 'isEmpty' ||
      filter.operator === 'isNotEmpty' ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== '' && filter.value !== null && filter.value !== undefined),
  );
}
