import type { Column } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { CalendarDays, XCircle } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { formatDateFilterTable } from '@/lib/date';
import type { DatePreset } from './types';

type DateSelection = Date[] | DateRange;

export function getIsDateRange(value: DateSelection): value is DateRange {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export function parseAsDate(timestamp: number | string | undefined): Date | undefined {
  if (!timestamp) return undefined;
  const numericTimestamp = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

export function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'number' || typeof item === 'string') {
        return item;
      }
      return undefined;
    });
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  return [];
}

interface DataTableDateFilterProps<TData> {
  column: Column<TData, unknown>;
  title?: string;
  multiple?: boolean;
  presets?: boolean | DatePreset[];
}

export function DataTableDateFilter<TData>({
  column,
  title,
  multiple,
  presets,
}: DataTableDateFilterProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const columnFilterValue = column.getFilterValue();

  const serializedFilterValue = React.useMemo(() => {
    if (columnFilterValue === undefined || columnFilterValue === null) {
      return '';
    }
    if (Array.isArray(columnFilterValue)) {
      return columnFilterValue.join(',');
    }
    return String(columnFilterValue);
  }, [columnFilterValue]);

  const selectedDates = React.useMemo<DateSelection>(() => {
    if (!columnFilterValue) {
      return multiple ? { from: undefined, to: undefined } : [];
    }

    if (multiple) {
      const timestamps = parseColumnFilterValue(columnFilterValue);
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1]),
      };
    }

    const timestamps = parseColumnFilterValue(columnFilterValue);
    const date = parseAsDate(timestamps[0]);
    return date ? [date] : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedFilterValue, multiple]);

  const onSelect = React.useCallback(
    (date: Date | DateRange | undefined) => {
      if (!date) {
        column.setFilterValue(undefined);
        return;
      }

      if (multiple && !('getTime' in date)) {
        const from = date.from?.getTime();
        const to = date.to?.getTime();
        column.setFilterValue(from || to ? [from, to] : undefined);
      } else if (!multiple && 'getTime' in date) {
        column.setFilterValue(date.getTime());
        setOpen(false);
      }
    },
    [column, multiple],
  );

  const onReset = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      column.setFilterValue(undefined);
      setOpen(false);
    },
    [column],
  );

  const hasValue = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return false;
      return selectedDates.from || selectedDates.to;
    }
    if (!Array.isArray(selectedDates)) return false;
    return selectedDates.length > 0;
  }, [multiple, selectedDates]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return '';
    if (range.from && range.to) {
      return `${formatDateFilterTable(range.from)} - ${formatDateFilterTable(range.to)}`;
    }
    return formatDateFilterTable(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return null;

      const hasSelectedDates = selectedDates.from || selectedDates.to;
      const dateText = hasSelectedDates ? formatDateRange(selectedDates) : 'Select date range';

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {hasSelectedDates && (
            <>
              <Separator
                className="mx-0.5 data-[orientation=vertical]:h-4"
                orientation="vertical"
              />
              <span>{dateText}</span>
            </>
          )}
        </span>
      );
    }

    if (getIsDateRange(selectedDates)) return null;

    const hasSelectedDate = selectedDates.length > 0;
    const dateText = hasSelectedDate ? formatDateFilterTable(selectedDates[0]) : 'Select date';

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {hasSelectedDate && (
          <>
            <Separator className="mx-0.5 data-[orientation=vertical]:h-4" orientation="vertical" />
            <span>{dateText}</span>
          </>
        )}
      </span>
    );
  }, [selectedDates, multiple, formatDateRange, title]);

  const disabled = column.columnDef.meta?.disabled;

  const resolvedPresetsOption =
    presets ?? column.columnDef.meta?.presets ?? (column.columnDef.meta as any)?.preset;
  const hasPresets =
    multiple && Array.isArray(resolvedPresetsOption) && resolvedPresetsOption.length > 0;
  const resolvedPresets = React.useMemo<DatePreset[]>(() => {
    return hasPresets ? (resolvedPresetsOption as DatePreset[]) : [];
  }, [hasPresets, resolvedPresetsOption]);

  const isPresetActive = React.useCallback(
    (presetValue: DateRange | [Date, Date] | (() => DateRange | [Date, Date])) => {
      let resolvedValue: DateRange;
      const val = typeof presetValue === 'function' ? presetValue() : presetValue;
      if (Array.isArray(val)) {
        resolvedValue = { from: val[0], to: val[1] };
      } else {
        resolvedValue = val;
      }

      const current = selectedDates;
      if (!getIsDateRange(current)) return false;

      if (!resolvedValue.from && !current.from && !resolvedValue.to && !current.to) return true;
      if (!resolvedValue.from || !current.from) return false;

      const sameFrom = dayjs(resolvedValue.from).isSame(current.from, 'day');
      const sameTo =
        resolvedValue.to && current.to
          ? dayjs(resolvedValue.to).isSame(current.to, 'day')
          : !resolvedValue.to && !current.to;

      return sameFrom && sameTo;
    },
    [selectedDates],
  );

  const handlePresetClick = React.useCallback(
    (presetValue: DateRange | [Date, Date] | (() => DateRange | [Date, Date])) => {
      let resolvedValue: DateRange;
      const val = typeof presetValue === 'function' ? presetValue() : presetValue;
      if (Array.isArray(val)) {
        resolvedValue = { from: val[0], to: val[1] };
      } else {
        resolvedValue = val;
      }

      const from = resolvedValue.from?.getTime();
      const to = resolvedValue.to?.getTime();
      column.setFilterValue(from || to ? [from, to] : undefined);
      setOpen(false);
    },
    [column],
  );

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button className="border-dashed font-normal" size="sm" variant="outline">
          {hasValue ? (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <>
            <div
              aria-label={`Clear ${title} filter`}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={onReset}
              role="button"
              tabIndex={0}
            >
              <XCircle />
            </div>
          ) : (
            <CalendarDays />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto p-0 divide-x divide-border bg-background text-foreground"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        {hasPresets && (
          <div className="hidden sm:flex flex-col gap-1 p-2.5 min-w-[140px]">
            {resolvedPresets.map((preset) => (
              <Button
                className="justify-start font-normal text-xs h-8 px-3.5 w-full rounded-md"
                key={preset.label}
                onClick={() => handlePresetClick(preset.value)}
                size="sm"
                variant={isPresetActive(preset.value) ? 'default' : 'ghost'}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
        <div className="flex flex-col">
          {multiple ? (
            <Calendar
              autoFocus
              captionLayout="label"
              disabled={disabled}
              mode="range"
              onSelect={onSelect}
              selected={
                getIsDateRange(selectedDates) ? selectedDates : { from: undefined, to: undefined }
              }
            />
          ) : (
            <Calendar
              captionLayout="label"
              disabled={disabled}
              mode="single"
              onSelect={onSelect}
              selected={!getIsDateRange(selectedDates) ? selectedDates[0] : undefined}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
