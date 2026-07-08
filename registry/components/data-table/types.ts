import type {
  ColumnSort,
  Row,
  RowData,
  ColumnDef as TanStackColumnDef,
} from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';
import type { DataTableConfig } from './data-table-config';

export interface DatePreset {
  label: string;
  value: DateRange | [Date, Date] | (() => DateRange | [Date, Date]);
}

export interface BaseColumnMeta {
  label?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  align?: 'left' | 'center' | 'right';
  thClass?: string;
  cellClass?: string;
}

export type ColumnFilterMeta =
  | {
      variant?: 'text';
      placeholder?: string;
    }
  | {
      variant: 'number';
      placeholder?: string;
      unit?: string;
    }
  | {
      variant: 'range';
      range?: [number, number];
      unit?: string;
    }
  | {
      variant: 'date';
      disabled?: import('react-day-picker').Matcher | import('react-day-picker').Matcher[];
    }
  | {
      variant: 'dateRange';
      presets?: boolean | DatePreset[];
      disabled?: import('react-day-picker').Matcher | import('react-day-picker').Matcher[];
    }
  | {
      variant: 'boolean';
      options?: Option[];
    }
  | {
      variant: 'select';
      options?: Option[];
      loading?: boolean;
    }
  | {
      variant: 'multiSelect';
      options?: Option[];
      loading?: boolean;
    };

export type ColumnMetaUnion = BaseColumnMeta & ColumnFilterMeta;

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type ColumnDef<TData extends RowData, TValue = unknown> = DistributiveOmit<
  TanStackColumnDef<TData, TValue>,
  'meta'
> & {
  meta?: ColumnMetaUnion;
};

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    loading?: boolean;
    disabled?: import('react-day-picker').Matcher | import('react-day-picker').Matcher[];
    presets?: boolean | DatePreset[];
    align?: 'left' | 'center' | 'right';
    thClass?: string;
    cellClass?: string;
  }
}

export type FilterOperator = DataTableConfig['operators'][number];
export type FilterVariant = DataTableConfig['filterVariants'][number];
export type JoinOperator = DataTableConfig['joinOperators'][number];

export interface FilterItemSchema {
  filterId: string;
  id: string;
  operator: FilterOperator;
  value: any;
  variant: FilterVariant;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: 'update' | 'delete';
}

export interface DataTableTranslations {
  where?: string;
  and?: string;
  or?: string;
  addFilter?: string;
  resetFilters?: string;
  filters?: string;
  noFiltersApplied?: string;
  selectField?: string;
  searchFields?: string;
  pickADate?: string;
  enterValue?: string;
  selected?: string;
  operators?: {
    eq?: string;
    ne?: string;
    iLike?: string;
    notILike?: string;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    isEmpty?: string;
    isNotEmpty?: string;
    isBetween?: string;
    inArray?: string;
    notInArray?: string;
    isRelativeToToday?: string;
  };
}
