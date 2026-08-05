import type { Column } from '@tanstack/react-table';
import * as React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { cn } from '@/lib/utils';
import type { ExtendedColumnFilter } from './types';

interface DataTableRangeFilterProps<TData> extends React.ComponentProps<'div'> {
  filter: ExtendedColumnFilter<TData>;
  column: Column<TData>;
  inputId: string;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, 'filterId'>>,
  ) => void;
  debounceMs?: number;
}

export function DataTableRangeFilter<TData>({
  filter,
  column,
  inputId,
  onFilterUpdate,
  className,
  debounceMs = 300,
  ...props
}: DataTableRangeFilterProps<TData>) {
  const meta = column.columnDef.meta;

  const [min, max] = React.useMemo(() => {
    const range = column.columnDef.meta?.range;
    if (range) return range;

    const values = column.getFacetedMinMaxValues();
    if (!values) return [0, 100];

    return [values[0], values[1]];
  }, [column]);

  const formatValue = React.useCallback((value: string | number | undefined) => {
    if (value === undefined || value === '') return '';
    const numValue = Number(value);
    return Number.isNaN(numValue)
      ? ''
      : numValue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        });
  }, []);

  const value = React.useMemo((): [string, string] => {
    if (Array.isArray(filter.value)) {
      return [formatValue(filter.value[0]), formatValue(filter.value[1])];
    }
    return [formatValue(filter.value), ''];
  }, [filter.value, formatValue]);

  const onRangeValueChange = React.useCallback(
    (value: string, isMin?: boolean) => {
      const numValue = Number(value);
      const currentValues = Array.isArray(filter.value) ? filter.value : ['', ''];
      const otherValue = isMin ? (currentValues[1] ?? '') : (currentValues[0] ?? '');

      if (
        value === '' ||
        (!Number.isNaN(numValue) &&
          (isMin
            ? numValue >= min && numValue <= (Number(otherValue) || max)
            : numValue <= max && numValue >= (Number(otherValue) || min)))
      ) {
        onFilterUpdate(filter.filterId, {
          value: isMin ? [value, otherValue] : [otherValue, value],
        });
      }
    },
    [filter.filterId, filter.value, min, max, onFilterUpdate],
  );

  return (
    <div className={cn('flex w-full items-center gap-2', className)} data-slot="range" {...props}>
      <DebouncedInput
        aria-label={`${meta?.label} minimum value`}
        aria-valuemax={max}
        aria-valuemin={min}
        className="h-8 w-full rounded text-xs"
        data-slot="range-min"
        debounce={debounceMs}
        id={`${inputId}-min`}
        inputMode="numeric"
        max={max}
        min={min}
        onChange={(val) => onRangeValueChange(String(val), true)}
        placeholder={min.toString()}
        type="number"
        value={value[0]}
      />
      <span className="sr-only shrink-0 text-muted-foreground">to</span>
      <DebouncedInput
        aria-label={`${meta?.label} maximum value`}
        aria-valuemax={max}
        aria-valuemin={min}
        className="h-8 w-full rounded text-xs"
        data-slot="range-max"
        debounce={debounceMs}
        id={`${inputId}-max`}
        inputMode="numeric"
        max={max}
        min={min}
        onChange={(val) => onRangeValueChange(String(val))}
        placeholder={max.toString()}
        type="number"
        value={value[1]}
      />
    </div>
  );
}
