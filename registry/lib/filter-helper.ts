import dayjs from 'dayjs';
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
} from '@/components/data-table/types';

const DEFAULT_OPERATORS: Record<FilterOperator, string> = {
  eq: 'eq',
  gt: 'gt',
  gte: 'gte',
  iLike: 'contains',
  inArray: 'in',
  isBetween: 'between',
  isEmpty: 'isEmpty',
  isNotEmpty: 'isNotEmpty',
  isRelativeToToday: 'relative',
  lt: 'lt',
  lte: 'lte',
  ne: 'ne',
  notILike: 'notContains',
  notInArray: 'notIn',
};

function formatSingleDate(val: any, formatStr: string): string {
  if (!val) return '';
  const num = Number(val);
  const date = Number.isNaN(num) ? dayjs(val) : dayjs(num);
  return date.isValid() ? date.format(formatStr) : String(val);
}

function mergeParams(target: Record<string, any>, source: Record<string, any>) {
  Object.keys(source).forEach((key) => {
    if (key in target) {
      const existing = target[key];
      const nextVal = source[key];
      if (Array.isArray(existing)) {
        target[key] = [...existing, ...(Array.isArray(nextVal) ? nextVal : [nextVal])];
      } else {
        target[key] = [existing, ...(Array.isArray(nextVal) ? nextVal : [nextVal])];
      }
    } else {
      target[key] = source[key];
    }
  });
}

function formatFilterKeyValue<TData>(
  paramName: string,
  operator: FilterOperator,
  value: any,
  config: FilterResolutionConfig<TData, any>,
): Record<string, any> {
  const style = config.style ?? 'flat';
  const arrayFormat = config.arrayFormat ?? 'comma';

  // Format array values if applicable
  let keySuffix = '';
  let serializedValue = value;

  if (Array.isArray(value)) {
    if (arrayFormat === 'comma') {
      serializedValue = value.join(',');
    } else if (arrayFormat === 'brackets') {
      keySuffix = '[]';
      serializedValue = value;
    } else {
      serializedValue = value;
    }
  }

  // Handle PostgREST specifically
  if (style === 'postgrest') {
    if (operator === 'inArray' || operator === 'notInArray') {
      const arr = Array.isArray(value) ? value : [value];
      const opName = operator === 'inArray' ? 'in' : 'not.in';
      return { [paramName]: `${opName}.(${arr.join(',')})` };
    }
    if (operator === 'isEmpty') {
      return { [paramName]: 'is.null' };
    }
    if (operator === 'isNotEmpty') {
      return { [paramName]: 'not.is.null' };
    }
    const backendOp = config.operatorMap?.[operator] ?? DEFAULT_OPERATORS[operator] ?? operator;
    return { [paramName]: `${backendOp}.${serializedValue}` };
  }

  // Map operator to backend string
  const backendOp = config.operatorMap?.[operator] ?? DEFAULT_OPERATORS[operator] ?? operator;

  // Let's determine the key based on style
  let finalKey = paramName;
  if (backendOp) {
    if (style === 'suffix') {
      finalKey = `${paramName}_${backendOp}`;
    } else if (style === 'django') {
      finalKey = `${paramName}__${backendOp}`;
    } else if (style === 'nested') {
      finalKey = `${paramName}[${backendOp}]`;
    } else if (style === 'prefix') {
      finalKey = `${paramName}[$${backendOp}]`;
    }
  }

  // Append key suffix if brackets array format is used
  if (keySuffix) {
    finalKey = `${finalKey}${keySuffix}`;
  }

  // Handle empty operators for non-postgrest styles
  if (operator === 'isEmpty') {
    return { [finalKey]: true };
  }
  if (operator === 'isNotEmpty') {
    return { [finalKey]: false };
  }

  return { [finalKey]: serializedValue };
}

function formatFilterItem<TData>(
  filter: ExtendedColumnFilter<TData>,
  config: FilterResolutionConfig<TData, any>,
): Record<string, any> {
  const { id, operator, value, variant } = filter;
  const columnId = id as string;
  const nameMap = (config.paramNameMap || {}) as Record<string, string>;
  const paramName = nameMap[columnId] || columnId;

  // 1. Custom mapper overrides everything
  const mappers = (config.customMappers || {}) as Record<
    string,
    (value: any, operator: FilterOperator) => Record<string, any>
  >;
  if (mappers[columnId]) {
    return mappers[columnId](value, operator);
  }

  const dateFormat = config.dateFormat ?? 'YYYY-MM-DD';
  const style = config.style ?? 'flat';

  // 2. Custom formatFilter hook
  if (config.formatFilter) {
    const backendOp = config.operatorMap?.[operator] ?? DEFAULT_OPERATORS[operator] ?? operator;
    return config.formatFilter(paramName, operator, value, backendOp);
  }

  // 3. Resolve empty checks
  const isEmptyOperator = operator === 'isEmpty' || operator === 'isNotEmpty';
  const isValueEmpty =
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (isValueEmpty && !isEmptyOperator) {
    return {};
  }

  // 4. Handle date formatting for single values/relative dates
  let resolvedValue = value;
  let resolvedOperator = operator;

  if (variant === 'date' || variant === 'dateRange') {
    if (operator === 'isRelativeToToday') {
      const days = Number(value);
      if (!Number.isNaN(days)) {
        resolvedValue = dayjs().add(days, 'day').format(dateFormat);
        resolvedOperator = 'eq';
      }
    } else if (operator !== 'isBetween' && !isEmptyOperator) {
      resolvedValue = formatSingleDate(value, dateFormat);
    }
  }

  // 5. Handle range (isBetween) decomposition
  if (resolvedOperator === 'isBetween') {
    if (Array.isArray(resolvedValue) && resolvedValue.length === 2) {
      let valStart = resolvedValue[0];
      let valEnd = resolvedValue[1];

      if (variant === 'date' || variant === 'dateRange') {
        valStart = formatSingleDate(valStart, dateFormat);
        valEnd = formatSingleDate(valEnd, dateFormat);
      }

      if (style === 'flat') {
        const suffix =
          config.flatRangeSuffix ??
          (variant === 'number' || variant === 'range' ? ['_min', '_max'] : ['_start', '_end']);
        return {
          [`${paramName}${suffix[0]}`]: valStart,
          [`${paramName}${suffix[1]}`]: valEnd,
        };
      } else {
        const startParams = formatFilterKeyValue(paramName, 'gte', valStart, config);
        const endParams = formatFilterKeyValue(paramName, 'lte', valEnd, config);
        const merged = { ...startParams };
        // Merge in case they map to the same key (like in postgrest)
        Object.keys(endParams).forEach((key) => {
          if (key in merged) {
            const existing = merged[key];
            const nextVal = endParams[key];
            merged[key] = Array.isArray(existing) ? [...existing, nextVal] : [existing, nextVal];
          } else {
            merged[key] = endParams[key];
          }
        });
        return merged;
      }
    }
  }

  // 6. Handle flat style legacy compatibility / defaults
  if (style === 'flat') {
    const optionsMap = (config.columnOptionsMap || {}) as Record<string, string[]>;

    if (resolvedOperator === 'notInArray' && optionsMap[columnId]) {
      const excluded = Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue];
      const allOptions = optionsMap[columnId];
      const complement = allOptions.filter((opt) => !excluded.includes(opt));
      return { [paramName]: complement.join(',') };
    }

    if (resolvedOperator === 'ne' && optionsMap[columnId]) {
      const excludedVal = String(resolvedValue);
      const allOptions = optionsMap[columnId];
      const complement = allOptions.filter((opt) => opt !== excludedVal);
      return { [paramName]: complement.join(',') };
    }

    if (resolvedOperator === 'inArray') {
      return {
        [paramName]: Array.isArray(resolvedValue) ? resolvedValue.join(',') : String(resolvedValue),
      };
    }

    if (resolvedOperator === 'eq') {
      return { [paramName]: String(resolvedValue) };
    }

    if (resolvedOperator === 'isEmpty') {
      return { [`${paramName}_is_empty`]: true };
    }
    if (resolvedOperator === 'isNotEmpty') {
      return { [`${paramName}_is_empty`]: false };
    }

    // Default fallback
    return { [paramName]: resolvedValue };
  }

  // 7. Handle non-flat styles (suffix, django, nested, prefix, postgrest)
  return formatFilterKeyValue(paramName, resolvedOperator, resolvedValue, config);
}

/**
 * Converts an array of column/advanced filters into a flat query parameters object.
 * Supports multiple formatting styles (flat, nested, suffix, prefix, django, postgrest)
 * and dynamically decomposes range operator (`isBetween`) and handles array formats.
 *
 * @template TData The data model of the table.
 * @template TParams The expected shape of the compiled API query parameters. Defaults to `Record<string, any>`.
 *
 * @param filters Array of filters to resolve.
 * @param config Optional configuration object to customize mapping, styling, and naming conventions.
 *
 * @returns The resolved query parameters matching the TParams shape.
 *
 * @example
 * ```ts
 * const queryParams = resolveFiltersToFlatParams<TicketItem, TicketApiParams>(filters, {
 *   style: 'nested',
 *   arrayFormat: 'brackets',
 *   paramNameMap: { ticket_status: 'status' }
 * });
 * ```
 */
export function resolveFiltersToFlatParams<TParams = Record<string, any>, TData = any>(
  filters: ExtendedColumnFilter<TData>[],
  config: FilterResolutionConfig<TData, TParams> = {},
): TParams {
  const params: Record<string, any> = {};

  filters.forEach((filter) => {
    const formatted = formatFilterItem(filter, config);
    mergeParams(params, formatted);
  });

  // Apply join operator if joinParamName and joinOperator are present
  if (config.joinParamName && config.joinOperator && filters.length > 0) {
    params[config.joinParamName] = config.joinOperator;
  }

  return params as TParams;
}

/**
 * Maps advanced date filter values and operators into flat API parameters.
 * Handles single comparisons (eq, lt, lte, gt, gte) as well as ranges (isBetween).
 *
 * @param val The selected timestamp value (either string/number for single dates, or string[] for ranges).
 * @param operator The date comparison operator (e.g. 'isBetween', 'eq', 'lte', 'gte').
 * @param startParamName Custom parameter name for the start date (defaults to 'start_date').
 * @param endParamName Custom parameter name for the end date (defaults to 'end_date').
 * @param formatStr Format string pattern for dayjs formatting (defaults to 'YYYY-MM-DD').
 *
 * @example
 * ```ts
 * customMappers: {
 *   date_updated: (val, operator) =>
 *     mapDateFilterToParams(val, operator, 'update_start_date', 'update_end_date', 'YYYY-MM-DD')
 * }
 * ```
 */
export function mapDateFilterToParams<
  TParams = Record<string, any>,
  TStart extends Extract<keyof TParams, string> = any,
  TEnd extends Extract<keyof TParams, string> = any,
>(
  val: any,
  operator: FilterOperator,
  startParamName: TStart = 'start_date' as any,
  endParamName: TEnd = 'end_date' as any,
  formatStr = 'YYYY-MM-DD',
): { [K in TStart]?: string } & { [K in TEnd]?: string } & Partial<TParams> & {
    [key: `${string}_is_empty`]: boolean;
  } {
  if (operator === 'isBetween') {
    if (Array.isArray(val) && val[0] && val[1]) {
      return {
        [startParamName]: dayjs(Number(val[0])).format(formatStr),
        [endParamName]: dayjs(Number(val[1])).format(formatStr),
      } as any;
    }
  } else if (operator === 'eq') {
    if (val) {
      const dateStr = dayjs(Number(val)).format(formatStr);
      return {
        [startParamName]: dateStr,
        [endParamName]: dateStr,
      } as any;
    }
  } else if (operator === 'lt' || operator === 'lte') {
    if (val) {
      return {
        [endParamName]: dayjs(Number(val)).format(formatStr),
      } as any;
    }
  } else if (operator === 'gt' || operator === 'gte') {
    if (val) {
      return {
        [startParamName]: dayjs(Number(val)).format(formatStr),
      } as any;
    }
  } else if (operator === 'isRelativeToToday') {
    if (val) {
      const days = Number(val);
      if (!Number.isNaN(days)) {
        const dateStr = dayjs().add(days, 'day').format(formatStr);
        return {
          [startParamName]: dateStr,
          [endParamName]: dateStr,
        } as any;
      }
    }
  } else if (operator === 'isEmpty') {
    const baseParamName = startParamName.replace(/(_?start_?)/gi, '');
    return {
      [`${baseParamName}_is_empty`]: true,
    } as any;
  } else if (operator === 'isNotEmpty') {
    const baseParamName = startParamName.replace(/(_?start_?)/gi, '');
    return {
      [`${baseParamName}_is_empty`]: false,
    } as any;
  }
  return {} as any;
}

export interface FilterResolutionConfig<TData, TParams = Record<string, any>> {
  /**
   * Complete list of all possible values for select/multiSelect columns.
   * Key is the column ID, value is the array of all valid options.
   */
  columnOptionsMap?: Partial<Record<Extract<keyof TData, string>, string[]>>;

  /**
   * Simple mapping to rename parameter keys.
   * Example: { ticket_status: 'status' }
   */
  paramNameMap?: Partial<
    Record<Extract<keyof TData, string>, Extract<keyof TParams, string> | string>
  >;

  /**
   * Custom mapper functions for columns requiring special serialization (e.g. date ranges, custom query logic).
   * Callback should return a flat key-value parameters object.
   */
  customMappers?: Partial<
    Record<Extract<keyof TData, string>, (value: any, operator: FilterOperator) => Partial<TParams>>
  >;

  /**
   * Style of parameter formatting to support different backend conventions.
   * - 'flat': Maps directly to parameter name (standard flat API structure, no operator suffixes).
   * - 'suffix': Appends operator with an underscore (e.g. `status_eq=active`, `price_gte=100`).
   * - 'django': Appends operator with a double underscore (e.g. `status__eq=active`, `price__gte=100`).
   * - 'nested': Uses brackets for operator nesting (e.g. `status[eq]=active`, `price[gte]=100`).
   * - 'prefix': Uses brackets with a dollar sign prefix (e.g. `status[$eq]=active`, `price[$gte]=100`).
   * - 'postgrest': Flat keys with value prefixed by operator (e.g. `status=eq.active`, `price=gte.100`).
   * - 'custom': Relies entirely on the `formatFilter` hook.
   * @default 'flat'
   */
  style?: 'flat' | 'suffix' | 'django' | 'nested' | 'prefix' | 'postgrest' | 'custom';

  /**
   * Custom mapping of operators to backend representation.
   * E.g. { eq: '', inArray: 'in', notInArray: 'nin' }
   */
  operatorMap?: Partial<Record<FilterOperator, string>>;

  /**
   * How array/list values are serialized.
   * - 'comma': Joined into a comma-separated string (e.g., `status=active,inactive`).
   * - 'repeat': Returned as an array (e.g., `status=['active', 'inactive']`), which standard HTTP clients serialize as multiple parameters.
   * - 'brackets': Returned as an array with bracket keys (e.g., `status[]=['active', 'inactive']`).
   * @default 'comma'
   */
  arrayFormat?: 'comma' | 'repeat' | 'brackets';

  /**
   * Custom date format string for dayjs.
   * @default 'YYYY-MM-DD'
   */
  dateFormat?: string;

  /**
   * Custom suffix or key names for range fields (e.g., [minSuffix, maxSuffix] or [startSuffix, endSuffix])
   * used only when style is 'flat'.
   * @default ['_start', '_end']
   */
  flatRangeSuffix?: [string, string];

  /**
   * Optional custom hook to format any filter parameter.
   * Takes priority over default style formatting if provided.
   */
  formatFilter?: (
    paramName: string,
    operator: FilterOperator,
    value: any,
    backendOperator: string,
  ) => Record<string, any>;

  /**
   * Optional parameter name to represent the global join operator ('and' | 'or').
   * If provided, the join operator will be added to the parameters.
   * E.g. `_join: 'and'`
   */
  joinParamName?: Extract<keyof TParams, string> | string;

  /**
   * The active logical join operator ('and' | 'or').
   * Used to format the join parameter if joinParamName is specified.
   */
  joinOperator?: JoinOperator;
}
