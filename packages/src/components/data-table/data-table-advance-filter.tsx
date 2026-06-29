import type { Column, ColumnMeta, Table } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Check, ChevronsUpDown, ListFilter, Trash2 } from 'lucide-react';
import * as React from 'react';
import { getDefaultFilterOperator, getFilterOperators } from '../../lib/data-table';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { DebouncedInput } from '../ui/debounced-input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { dataTableConfig } from './data-table-config';
import { DataTableRangeFilter } from './data-table-range-filter';
import type {
  DataTableTranslations,
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
  Option,
} from './types';

const DEBOUNCE_MS = 300;

const DEFAULT_TRANSLATIONS = {
  addFilter: 'Add filter',
  and: 'and',
  enterValue: 'Enter a value...',
  filters: 'Filters',
  noFiltersApplied: 'No filters applied',
  operators: {
    eq: 'is',
    gt: 'is greater than',
    gte: 'is greater than or equal to',
    iLike: 'contains',
    inArray: 'has any of',
    isBetween: 'is between',
    isEmpty: 'is empty',
    isNotEmpty: 'is not empty',
    isRelativeToToday: 'is relative to today',
    lt: 'is less than',
    lte: 'is less than or equal to',
    ne: 'is not',
    notILike: 'does not contain',
    notInArray: 'has none of',
  },
  or: 'or',
  pickADate: 'Pick a date',
  resetFilters: 'Reset filters',
  searchFields: 'Search fields...',
  selectField: 'Select field',
  where: 'Where',
};

const generateId = () => Math.random().toString(36).substring(2, 10);

export interface DataTableAdvanceFilterProps<TData>
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  table: Table<TData>;
  translations?: DataTableTranslations;
  shallow?: boolean;
  debounceMs?: number;
  throttleMs?: number;
  disabled?: boolean;
}

export function DataTableAdvanceFilter<TData>({
  table,
  translations: customTranslations,
  debounceMs = DEBOUNCE_MS,
  shallow,
  throttleMs,
  disabled,
  ...props
}: DataTableAdvanceFilterProps<TData>) {
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const translations = React.useMemo(() => {
    return {
      ...DEFAULT_TRANSLATIONS,
      ...customTranslations,
      operators: {
        ...DEFAULT_TRANSLATIONS.operators,
        ...customTranslations?.operators,
      },
    };
  }, [customTranslations]);

  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter(
        (column) =>
          column.columnDef.enableColumnFilter !== false &&
          column.id !== 'select' &&
          column.id !== 'actions',
      );
  }, [table]);

  // Read/write state from table meta
  const metaFilters = (table.options.meta as any)?.filters as
    | ExtendedColumnFilter<TData>[]
    | undefined;
  const metaSetFilters = (table.options.meta as any)?.setFilters as
    | ((val: any) => void)
    | undefined;
  const metaJoinOperator = (table.options.meta as any)?.joinOperator as JoinOperator | undefined;
  const metaSetJoinOperator = (table.options.meta as any)?.setJoinOperator as
    | ((val: JoinOperator) => void)
    | undefined;
  const metaDebounceMs = (table.options.meta as any)?.debounceMs as number | undefined;

  const [localFilters, setLocalFilters] = React.useState<ExtendedColumnFilter<TData>[]>([]);
  const [localJoinOperator, setLocalJoinOperator] = React.useState<JoinOperator>('and');

  const filters = metaFilters !== undefined ? metaFilters : localFilters;
  const setFilters = React.useCallback(
    (value: any) => {
      if (metaSetFilters) {
        metaSetFilters(value);
      } else {
        setLocalFilters(value);
      }
    },
    [metaSetFilters],
  );

  const joinOperator = metaJoinOperator !== undefined ? metaJoinOperator : localJoinOperator;
  const setJoinOperator = React.useCallback(
    (value: JoinOperator) => {
      if (metaSetJoinOperator) {
        metaSetJoinOperator(value);
      } else {
        setLocalJoinOperator(value);
      }
    },
    [metaSetJoinOperator],
  );

  const activeDebounceMs = metaDebounceMs !== undefined ? metaDebounceMs : debounceMs;

  const onFilterAdd = React.useCallback(() => {
    const column = columns[0];
    if (!column) return;

    setFilters([
      ...filters,
      {
        filterId: generateId(),
        id: column.id as Extract<keyof TData, string>,
        operator: getDefaultFilterOperator(column.columnDef.meta?.variant ?? 'text'),
        value: '',
        variant: column.columnDef.meta?.variant ?? 'text',
      },
    ]);
  }, [columns, filters, setFilters]);

  const onFilterUpdate = React.useCallback(
    (filterId: string, updates: Partial<Omit<ExtendedColumnFilter<TData>, 'filterId'>>) => {
      setFilters((prevFilters: ExtendedColumnFilter<TData>[]) => {
        return prevFilters.map((filter) => {
          if (filter.filterId === filterId) {
            return { ...filter, ...updates } as ExtendedColumnFilter<TData>;
          }
          return filter;
        });
      });
    },
    [setFilters],
  );

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter((filter) => filter.filterId !== filterId);
      setFilters(updatedFilters);
      requestAnimationFrame(() => {
        addButtonRef.current?.focus();
      });
    },
    [filters, setFilters],
  );

  const onFiltersReset = React.useCallback(() => {
    setFilters([]);
    setJoinOperator('and');
  }, [setFilters, setJoinOperator]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button className="font-normal h-8 text-xs gap-1.5" disabled={disabled} variant="outline">
          <ListFilter className="size-3.5 text-muted-foreground" />
          {translations.filters}
          {filters.length > 0 && (
            <Badge
              className="h-4 rounded px-1.5 font-mono font-normal text-[10px]"
              variant="secondary"
            >
              {filters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-describedby={descriptionId}
        aria-labelledby={labelId}
        className="flex w-full max-w-(--radix-popover-content-available-width) flex-col gap-3.5 p-4 sm:min-w-[380px]"
        {...props}
      >
        <div className="flex flex-col gap-1">
          <h4 className="font-medium leading-none text-sm" id={labelId}>
            {filters.length > 0 ? translations.filters : translations.noFiltersApplied}
          </h4>
        </div>
        {filters.length > 0 ? (
          <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-1" role="list">
            {filters.map((filter, index) => (
              <DataTableFilterItem<TData>
                columns={columns}
                debounceMs={activeDebounceMs}
                filter={filter}
                filterItemId={`filter-${filter.filterId}`}
                index={index}
                joinOperator={joinOperator}
                key={filter.filterId}
                onFilterRemove={onFilterRemove}
                onFilterUpdate={onFilterUpdate}
                setJoinOperator={setJoinOperator}
                translations={translations}
              />
            ))}
          </div>
        ) : null}
        <div className="flex w-full items-center gap-2">
          <Button
            className="rounded text-xs h-8"
            onClick={onFilterAdd}
            ref={addButtonRef}
            size="sm"
          >
            {translations.addFilter}
          </Button>
          {filters.length > 0 ? (
            <Button
              className="rounded text-xs h-8"
              onClick={onFiltersReset}
              size="sm"
              variant="outline"
            >
              {translations.resetFilters}
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DataTableFilterItemProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  index: number;
  filterItemId: string;
  joinOperator: JoinOperator;
  setJoinOperator: (value: JoinOperator) => void;
  columns: Column<TData, unknown>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, 'filterId'>>,
  ) => void;
  onFilterRemove: (filterId: string) => void;
  translations: any;
  debounceMs: number;
}

function DataTableFilterItem<TData>({
  filter,
  index,
  filterItemId,
  joinOperator,
  setJoinOperator,
  columns,
  onFilterUpdate,
  onFilterRemove,
  translations,
  debounceMs,
}: DataTableFilterItemProps<TData>) {
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);

  const column = columns.find((col) => col.id === filter.id);
  const columnMeta = column?.columnDef.meta;
  const filterOperators = React.useMemo(() => {
    return getFilterOperators(filter.variant);
  }, [filter.variant]);

  if (!column) return null;

  return (
    <div className="flex items-center gap-2" id={filterItemId} role="listitem" tabIndex={-1}>
      <div className="min-w-[72px] text-center">
        {index === 0 ? (
          <span className="text-muted-foreground text-xs font-medium">{translations.where}</span>
        ) : index === 1 ? (
          <Select
            onValueChange={(value: JoinOperator) => setJoinOperator(value)}
            value={joinOperator}
          >
            <SelectTrigger
              aria-label="Select join operator"
              className="rounded lowercase h-8 text-xs px-2"
            >
              <SelectValue
                placeholder={joinOperator === 'and' ? translations.and : translations.or}
              />
            </SelectTrigger>
            <SelectContent
              className="lowercase min-w-[72px]"
              position="popper"
              style={{ zIndex: 100 }}
            >
              <SelectGroup>
                {dataTableConfig.joinOperators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op === 'and' ? translations.and : translations.or}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <span className="text-muted-foreground text-xs lowercase font-medium">
            {joinOperator === 'and' ? translations.and : translations.or}
          </span>
        )}
      </div>
      <Popover onOpenChange={setShowFieldSelector} open={showFieldSelector}>
        <PopoverTrigger asChild>
          <Button
            className="w-32 justify-between rounded font-normal h-8 text-xs"
            variant="outline"
          >
            <span className="truncate">{columnMeta?.label ?? filter.id}</span>
            <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-0">
          <Command>
            <CommandInput className="h-8" placeholder={translations.searchFields} />
            <CommandList>
              <CommandEmpty>{translations.noResults ?? 'No fields found.'}</CommandEmpty>
              <CommandGroup>
                {columns.map((col) => (
                  <CommandItem
                    key={col.id}
                    onSelect={(value) => {
                      onFilterUpdate(filter.filterId, {
                        id: value as Extract<keyof TData, string>,
                        operator: getDefaultFilterOperator(col.columnDef.meta?.variant ?? 'text'),
                        value: '',
                        variant: col.columnDef.meta?.variant ?? 'text',
                      });
                      setShowFieldSelector(false);
                    }}
                    value={col.id}
                  >
                    <span className="truncate">{col.columnDef.meta?.label ?? col.id}</span>
                    <Check
                      className={cn(
                        'ml-auto size-4',
                        col.id === filter.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Select
        onValueChange={(value: FilterOperator) =>
          onFilterUpdate(filter.filterId, {
            operator: value,
            value: value === 'isEmpty' || value === 'isNotEmpty' ? '' : filter.value,
          })
        }
        value={filter.operator}
      >
        <SelectTrigger className="w-32 rounded h-8 text-xs lowercase">
          <div className="truncate">
            <SelectValue
              placeholder={translations.operators?.[filter.operator] ?? filter.operator}
            />
          </div>
        </SelectTrigger>
        <SelectContent position="popper" style={{ zIndex: 100 }}>
          <SelectGroup>
            {filterOperators.map((op) => (
              <SelectItem className="lowercase text-xs" key={op.value} value={op.value}>
                {translations.operators?.[op.value] ?? op.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="min-w-36 max-w-60 flex-1">
        {onFilterInputRender({
          column,
          columnMeta,
          debounceMs,
          filter,
          inputId: `${filterItemId}-input`,
          onFilterUpdate,
          translations,
        })}
      </div>
      <Button
        className="size-8 rounded shrink-0"
        onClick={() => onFilterRemove(filter.filterId)}
        size="icon"
        variant="outline"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function onFilterInputRender<TData>({
  filter,
  inputId,
  column,
  columnMeta,
  onFilterUpdate,
  translations,
  debounceMs,
}: {
  filter: ExtendedColumnFilter<TData>;
  inputId: string;
  column: Column<TData, unknown>;
  columnMeta?: ColumnMeta<TData, unknown>;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, 'filterId'>>,
  ) => void;
  translations: any;
  debounceMs: number;
}) {
  if (filter.operator === 'isEmpty' || filter.operator === 'isNotEmpty') {
    return (
      <div
        aria-label={`${columnMeta?.label} filter is empty`}
        aria-live="polite"
        className="h-8 w-full rounded border bg-transparent dark:bg-input/30"
        id={inputId}
        role="status"
      />
    );
  }

  switch (filter.variant) {
    case 'text':
    case 'number':
    case 'range': {
      if (filter.operator === 'isBetween') {
        return (
          <DataTableRangeFilter
            column={column}
            debounceMs={debounceMs}
            filter={filter}
            inputId={inputId}
            onFilterUpdate={onFilterUpdate}
          />
        );
      }

      const isNumber = filter.variant === 'number' || filter.variant === 'range';

      return (
        <DebouncedInput
          aria-label={`${columnMeta?.label} filter value`}
          className="h-8 w-full rounded text-xs"
          debounce={debounceMs}
          id={inputId}
          inputMode={isNumber ? 'numeric' : undefined}
          onChange={(val) =>
            onFilterUpdate(filter.filterId, {
              value: String(val),
            })
          }
          placeholder={columnMeta?.placeholder ?? translations.enterValue}
          type={isNumber ? 'number' : filter.variant}
          value={
            typeof filter.value === 'string' || typeof filter.value === 'number' ? filter.value : ''
          }
        />
      );
    }

    case 'boolean': {
      return (
        <Select
          onValueChange={(val) =>
            onFilterUpdate(filter.filterId, {
              value: val,
            })
          }
          value={String(filter.value)}
        >
          <SelectTrigger className="w-full rounded h-8 text-xs" id={inputId}>
            <SelectValue placeholder={filter.value ? 'True' : 'False'} />
          </SelectTrigger>
          <SelectContent position="popper" style={{ zIndex: 100 }}>
            <SelectGroup>
              <SelectItem className="text-xs" value="true">
                True
              </SelectItem>
              <SelectItem className="text-xs" value="false">
                False
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }

    case 'select':
    case 'multiSelect': {
      const multiple = filter.variant === 'multiSelect';
      return (
        <FacetedFilter
          multiple={multiple}
          onChange={(val) => {
            onFilterUpdate(filter.filterId, {
              value: val,
            });
          }}
          options={columnMeta?.options ?? []}
          placeholder={columnMeta?.placeholder}
          translations={translations}
          value={filter.value}
        />
      );
    }

    case 'date':
    case 'dateRange': {
      return (
        <DateFilterInput
          onChange={(val) => {
            onFilterUpdate(filter.filterId, {
              value: val,
            });
          }}
          operator={filter.operator}
          placeholder={columnMeta?.placeholder}
          translations={translations}
          value={filter.value}
        />
      );
    }

    default:
      return null;
  }
}

function FacetedFilter({
  options,
  value,
  onChange,
  multiple,
  placeholder,
  translations,
}: {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple: boolean;
  placeholder?: string;
  translations: any;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedValues = React.useMemo(() => {
    if (multiple) {
      return new Set(Array.isArray(value) ? value : []);
    }
    return new Set(typeof value === 'string' && value ? [value] : []);
  }, [value, multiple]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const next = new Set(selectedValues);
      if (next.has(optionValue)) {
        next.delete(optionValue);
      } else {
        next.add(optionValue);
      }
      onChange(Array.from(next));
    } else {
      onChange(optionValue);
      setOpen(false);
    }
  };

  const getLabel = (val: string) => {
    return options.find((o) => o.value === val)?.label ?? val;
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="w-full justify-between rounded font-normal h-8 text-xs px-2"
          variant="outline"
        >
          <span className="truncate">
            {selectedValues.size === 0
              ? (placeholder ?? translations.selectField)
              : multiple
                ? `${selectedValues.size} selected`
                : getLabel(Array.from(selectedValues)[0] ?? '')}
          </span>
          <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput className="h-8" placeholder={translations.searchFields} />
          <CommandList>
            <CommandEmpty>{translations.noResults ?? 'No options found.'}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    className="flex items-center gap-2 text-xs"
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    value={option.value}
                  >
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check className="size-3" />
                    </span>
                    {option.icon && <option.icon className="size-3.5" />}
                    <span className="truncate">{option.label}</span>
                    {option.count && (
                      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DateFilterInput({
  value,
  onChange,
  operator,
  placeholder,
  translations,
}: {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  operator: string;
  placeholder?: string;
  translations: any;
}) {
  const [open, setOpen] = React.useState(false);

  const dateValue = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).map((v) => new Date(Number(v)));
    }
    return value ? [new Date(Number(value))] : [];
  }, [value]);

  const startDate = dateValue[0];
  const endDate = dateValue[1];

  const displayValue = React.useMemo(() => {
    if (operator === 'isBetween' && startDate && endDate) {
      return `${dayjs(startDate).format('MMM D, YYYY')} - ${dayjs(endDate).format('MMM D, YYYY')}`;
    }
    return startDate
      ? dayjs(startDate).format('MMM D, YYYY')
      : (placeholder ?? translations.pickADate);
  }, [startDate, endDate, operator, placeholder, translations]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'w-full justify-start rounded text-left font-normal h-8 text-xs gap-2 px-2',
            !value && 'text-muted-foreground',
          )}
          variant="outline"
        >
          <CalendarIcon className="size-3.5 shrink-0" />
          <span className="truncate">{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        {operator === 'isBetween' ? (
          <Calendar
            mode="range"
            onSelect={(range) => {
              if (range?.from || range?.to) {
                const fromTime = range.from ? String(range.from.getTime()) : '';
                const toTime = range.to ? String(range.to.getTime()) : '';
                onChange([fromTime, toTime]);
              }
            }}
            selected={startDate && endDate ? { from: startDate, to: endDate } : undefined}
          />
        ) : (
          <Calendar
            mode="single"
            onSelect={(date) => {
              if (date) {
                onChange(String(date.getTime()));
                setOpen(false);
              }
            }}
            selected={startDate}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
