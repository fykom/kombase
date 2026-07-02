# Kombase

## 2.0.0

### Major Changes

- A summary of features, optimizations, and refactorings implemented across the codebase.

  ***

  Introduced a highly modular, headless/styled file upload system with React/Radix and React Hook Form support.
  - **Interactive Area**: Support for drag-and-drop, click-to-trigger, paste events, and keyboard interactions.
  - **File Validation**: Integrated size validation, accepted MIME-type check, maximum files threshold, and custom validation callbacks (`onFileValidate`).
  - **Upload Progress & Cache**: Asynchronous upload handler (`onUpload`) with progress reporting per-file, success/error status management, and memory-safe URL object cleanup.
  - **Form Hook Integration**: Created `FormUpload` component wrapping `FileUpload` with full `react-hook-form` controller compatibility.
  - **Demos & Docs**:
    - Added complete markdown guides (`file-upload.mdx`, `form-upload.mdx`).
    - Created 5 copy-pasteable demos under `docs/app/examples/` (Chat Input, Circular Progress, Direct Upload, Fill Progress, Form Integration).

  ***

  Major refactoring of the filtering hook and calendar inputs to enable controlled filters and custom backend serializations.
  - **Filter Parameter Serializer (`filter-helper.ts`)**:
    - Implemented `resolveFiltersToFlatParams` supporting multiple serialization styles for backends: `flat`, `suffix`, `django`, `nested`, `prefix`, and `postgrest` (e.g. `status=eq.active`).
    - Implemented `mapDateFilterToParams` to serialize single date operators (`eq`, `lt`, `lte`, `gt`, `gte`), ranges (`isBetween`), and relative today dates into clean parameters.
  - **Controlled Filter State (`use-data-table.ts`)**:
    - Refactored `useDataTable` to support fully controlled external filters via `filterValues` and `onFilterValuesChange`, eliminating synchronization issues.
  - **Date Preset Support**:
    - Date filter calendars in both standard and advanced filters now dynamically render sidebar presets configured via column metadata.
  - **Calendar UI Cleanup (`calendar.tsx`)**:
    - Replaced Tailwind grid widths with flexible custom property spacing (`--cell-size` and `--cell-radius`).
    - Added RTL flip support for navigation chevrons and refactored modifiers styling.
  - **Toolbar Additions (`data-table-toolbar.tsx`)**:
    - Added support for `boolean` filter variant.
    - Added layout alignment property (`align: 'start' | 'center' | 'end'`).
    - Prevented manual "Reset" button showing when advanced filters side sheet is active.
  - **DebouncedInput Optimization**:
    - Wrapped `onChange` prop in a mutable ref to prevent resetting timer intervals when parent callbacks are re-created.
  - **Translations**:
    - Added Indonesian translation `selected: "terpilih"` to the core translations bundle.

## 1.3.4

### Patch Changes

- - Fixed a TypeScript type mismatch error in `DataTableRangeFilter` under `"noUncheckedIndexedAccess": true` by typing the values array as a fixed `[string, string]` tuple.
  - Resolved a bug in `DataTableToolbar` where children were duplicated on both the left and right sides. Added a new `actions` prop for custom right-side buttons/actions and updated the layout/docs examples.
  - Simplified manual filtering assignment in `useDataTable` hook to resolve a Biome lint warning.
  - Implement advanced data table filtering with custom operators and debounced input components

## 1.3.3

### Patch Changes

- fix: add alignment and custom class support to DataTable and register improve skill

## 1.3.2

### Patch Changes

- feat(data-table): enhance date filtering with presets and improve loading states

## 1.3.1

### Patch Changes

- add infinite scroll support, sticky headers, and customizable empty states to DataTable component.

## 1.3.0

### Minor Changes

- Refactored component exports, package dependencies, and added Tailwind CSS v4 support:
  - Added new `FormPick` and `FormRadio` components (replacing `FormRadioGroup`).
  - Removed deprecated `FormSwitch`, `FormRadioGroup`, and `Status` components.
  - Migrated from monolithic `radix-ui` dependency to granular `@radix-ui/*` package dependencies.
  - Configured Tailwind CSS v4 source scanning support via `@import "kombase/styles"`.
  - Updated peer dependencies for React 18/19, `@tanstack/react-table`, and `react-day-picker`.

## 1.2.2

### Patch Changes

- fix: resolve package types resolution for ESM/CJS consumers under node16/nodenext module resolution

## 1.2.1

### Patch Changes

- - **fix(datepicker)**: Fixed selected date reactivity in `FormDatePicker` by correctly passing binding props (`selected`, `onSelect`) to the form control. Updated grid styling to support `react-day-picker` v10.
  - **feat(date-utility)**: Replaced `date-fns` with `dayjs` for lighter and more consistent date handling across components.
  - **feat(build)**: Shifted `react-hook-form`, `react-day-picker`, and `@tanstack/react-table` to `peerDependencies` to avoid duplicate bundling in consuming projects.
  - **feat(build)**: Enhanced compilation output by enabling minification, code-splitting, and tree-shaking in `tsup` configuration.
  - **feat(demo)**: Integrated `goey-toast` notifications upon successful form submission across demo forms (inputs, radios, selects, switches, and textareas).
  - **docs**: Refined and clarified introductory content and installation instructions.

## 1.2.0

### Minor Changes

- **Tour Component**: Added a highly interactive and flexible step-by-step onboarding tour component (`Tour`, `TourStep`, `TourSpotlight`, `TourClose`, `TourNext`, etc.) built on top of `@floating-ui/react-dom`.
- **Avatar Group Component**: Added a new component to display collections of avatars with support for truncation, overflow counters, RTL layouts, and custom icons.
- **Rating Component**: Added a customizable star-rating component featuring controlled state management, custom themes, and seamless form integration.
- **Timeline Component**: Added a chronological timeline component supporting alternate positioning, horizontal layouts, custom dot indicators, and RTL options.
- **Stepper Component**: Added a progress steps component for multi-step flows, complete with vertical layout options and form validation examples.
- **Status Component**: Added a status badge/indicator component for clear visual feedback.
- **Goey Toaster Component**: Added an animated, liquid-like gooey toast notification component integrated directly into the core layout.
- **Form Components Directory Restructuring**: Moved all form-related MDX documentation files (`form-input`, `form-textarea`, `form-switch`, etc.) into a dedicated `content/form/` subdirectory.
- **Hooks Relocation**: Moved the `useLazyRef` hook to `packages/src/components/hooks/use-lazy-ref.ts` for a cleaner package architecture and optimized reference management.
- **Biome Linter**: Updated the Biome schema version and optimized formatting configurations.
- **Shared Types**: Added global shared type definitions (e.g., `EmptyProps`) in `docs/app/types.ts`.
- **Dependency Upgrades**: Cleaned up and updated package dependencies, and regenerated lockfile configurations.

## 1.1.0

### Minor Changes

- 25b80a3: feat: introduce new FormDatePicker, LongText, PhoneInput, ConfirmDialog, FormSearchSelect and other UI components, alongside massive type safety improvements for forms

## 1.1.0

### Minor Changes

- Initial release of the Kombase UI library. This version includes a core set of React components built with Radix UI, TanStack Table, and Tailwind CSS v4. It also features a centralized documentation system with automated changelog generation and standardized development workflows using Changesets.
