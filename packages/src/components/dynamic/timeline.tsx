import { cva } from 'class-variance-authority';
import { Direction as DirectionPrimitive, Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '@/components/hooks/use-isomorphic-layout-effect';
import { useLazyRef } from '@/components/hooks/use-lazy-ref';
import { useComposedRefs } from '@/lib/component-refs';
import { cn } from '@/lib/utils';

type Direction = 'ltr' | 'rtl';
type Orientation = 'vertical' | 'horizontal';
type Variant = 'default' | 'alternate';
type Status = 'completed' | 'active' | 'pending';

interface DivProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
}

type ItemElement = React.ComponentRef<typeof TimelineItem>;

const ROOT_NAME = 'Timeline';
const ITEM_NAME = 'TimelineItem';
const DOT_NAME = 'TimelineDot';
const CONNECTOR_NAME = 'TimelineConnector';
const CONTENT_NAME = 'TimelineContent';

function getItemStatus(itemIndex: number, activeIndex?: number): Status {
  if (activeIndex === undefined) return 'pending';
  if (itemIndex < activeIndex) return 'completed';
  if (itemIndex === activeIndex) return 'active';
  return 'pending';
}

function getSortedEntries(entries: [string, React.RefObject<ItemElement | null>][]) {
  return entries.sort((a, b) => {
    const elementA = a[1].current;
    const elementB = b[1].current;
    if (!elementA || !elementB) return 0;
    const position = elementA.compareDocumentPosition(elementB);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
}

function useStore<T>(selector: (store: Store) => T): T {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error(`\`useStore\` must be used within \`${ROOT_NAME}\``);
  }

  const getSnapshot = React.useCallback(() => selector(store), [store, selector]);

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

interface StoreState {
  items: Map<string, React.RefObject<ItemElement | null>>;
}

interface Store {
  subscribe: (callback: () => void) => () => void;
  getState: () => StoreState;
  notify: () => void;
  onItemRegister: (id: string, ref: React.RefObject<ItemElement | null>) => void;
  onItemUnregister: (id: string) => void;
  getNextItemStatus: (id: string, activeIndex?: number) => Status | undefined;
  getItemIndex: (id: string) => number;
}

const StoreContext = React.createContext<Store | null>(null);

function useStoreContext(consumerName: string) {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

interface TimelineContextValue {
  dir: Direction;
  orientation: Orientation;
  variant: Variant;
  activeIndex?: number;
}

const TimelineContext = React.createContext<TimelineContextValue | null>(null);

function useTimelineContext(consumerName: string) {
  const context = React.useContext(TimelineContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

const timelineVariants = cva(
  'relative flex [--timeline-connector-thickness:0.125rem] [--timeline-dot-size:0.875rem]',
  {
    compoundVariants: [
      {
        class: 'gap-6',
        orientation: 'vertical',
        variant: 'default',
      },
      {
        class: 'gap-8',
        orientation: 'horizontal',
        variant: 'default',
      },
      {
        class: 'relative w-full gap-3',
        orientation: 'vertical',
        variant: 'alternate',
      },
      {
        class: 'items-center gap-4',
        orientation: 'horizontal',
        variant: 'alternate',
      },
    ],
    defaultVariants: {
      orientation: 'vertical',
      variant: 'default',
    },
    variants: {
      orientation: {
        horizontal: 'flex-row items-start',
        vertical: 'flex-col',
      },
      variant: {
        alternate: '',
        default: '',
      },
    },
  },
);

interface TimelineProps extends DivProps {
  dir?: Direction;
  orientation?: Orientation;
  variant?: Variant;
  activeIndex?: number;
}

function Timeline(props: TimelineProps) {
  const {
    orientation = 'vertical',
    variant = 'default',
    dir: dirProp,
    activeIndex,
    asChild,
    className,
    ...rootProps
  } = props;

  const dir = DirectionPrimitive.useDirection(dirProp);

  const listenersRef = useLazyRef(() => new Set<() => void>());
  const stateRef = useLazyRef<StoreState>(() => ({
    items: new Map(),
  }));

  const store = React.useMemo<Store>(() => {
    return {
      getItemIndex: (id: string) => {
        const entries = Array.from(stateRef.current.items.entries());
        const sortedEntries = getSortedEntries(entries);
        return sortedEntries.findIndex(([key]) => key === id);
      },
      getNextItemStatus: (id: string, activeIndex?: number) => {
        const entries = Array.from(stateRef.current.items.entries());
        const sortedEntries = getSortedEntries(entries);

        const currentIndex = sortedEntries.findIndex(([key]) => key === id);
        if (currentIndex === -1 || currentIndex === sortedEntries.length - 1) {
          return undefined;
        }

        const nextItemIndex = currentIndex + 1;
        return getItemStatus(nextItemIndex, activeIndex);
      },
      getState: () => stateRef.current,
      notify: () => {
        for (const cb of listenersRef.current) {
          cb();
        }
      },
      onItemRegister: (id: string, ref: React.RefObject<ItemElement | null>) => {
        stateRef.current.items.set(id, ref);
        store.notify();
      },
      onItemUnregister: (id: string) => {
        stateRef.current.items.delete(id);
        store.notify();
      },
      subscribe: (cb) => {
        listenersRef.current.add(cb);
        return () => listenersRef.current.delete(cb);
      },
    };
  }, [listenersRef, stateRef]);

  const contextValue = React.useMemo<TimelineContextValue>(
    () => ({
      activeIndex,
      dir,
      orientation,
      variant,
    }),
    [dir, orientation, variant, activeIndex],
  );

  const RootPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <StoreContext.Provider value={store}>
      <TimelineContext.Provider value={contextValue}>
        <RootPrimitive
          aria-orientation={orientation}
          data-orientation={orientation}
          data-slot="timeline"
          data-variant={variant}
          dir={dir}
          role="list"
          {...rootProps}
          className={cn(timelineVariants({ className, orientation, variant }))}
        />
      </TimelineContext.Provider>
    </StoreContext.Provider>
  );
}

interface TimelineItemContextValue {
  id: string;
  status: Status;
  isAlternateRight: boolean;
}

const TimelineItemContext = React.createContext<TimelineItemContextValue | null>(null);

function useTimelineItemContext(consumerName: string) {
  const context = React.useContext(TimelineItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``);
  }
  return context;
}

const timelineItemVariants = cva('relative flex', {
  compoundVariants: [
    {
      class: 'gap-3 pb-8 last:pb-0',
      orientation: 'vertical',
      variant: 'default',
    },
    {
      class: 'flex-col gap-3',
      orientation: 'horizontal',
      variant: 'default',
    },
    {
      class: 'w-1/2 gap-3 pr-6 pb-12 last:pb-0',
      isAlternateRight: false,
      orientation: 'vertical',
      variant: 'alternate',
    },
    {
      class: 'ml-auto w-1/2 flex-row-reverse gap-3 pb-12 pl-6 last:pb-0',
      isAlternateRight: true,
      orientation: 'vertical',
      variant: 'alternate',
    },
    {
      class: 'grid min-w-0 grid-rows-[1fr_auto_1fr] gap-3',
      orientation: 'horizontal',
      variant: 'alternate',
    },
  ],
  defaultVariants: {
    isAlternateRight: false,
    orientation: 'vertical',
    variant: 'default',
  },
  variants: {
    isAlternateRight: {
      false: '',
      true: '',
    },
    orientation: {
      horizontal: '',
      vertical: '',
    },
    variant: {
      alternate: '',
      default: '',
    },
  },
});

function TimelineItem(props: DivProps) {
  const { asChild, className, id, ref, ...itemProps } = props;

  const { dir, orientation, variant, activeIndex } = useTimelineContext(ITEM_NAME);
  const store = useStoreContext(ITEM_NAME);

  const instanceId = React.useId();
  const itemId = id ?? instanceId;
  const itemRef = React.useRef<ItemElement | null>(null);
  const composedRef = useComposedRefs(ref, itemRef);

  const itemIndex = useStore((state) => state.getItemIndex(itemId));

  const status = React.useMemo<Status>(() => {
    return getItemStatus(itemIndex, activeIndex);
  }, [activeIndex, itemIndex]);

  useIsomorphicLayoutEffect(() => {
    store.onItemRegister(itemId, itemRef);
    return () => {
      store.onItemUnregister(itemId);
    };
  }, [id, store]);

  const isAlternateRight = variant === 'alternate' && itemIndex % 2 === 1;

  const itemContextValue = React.useMemo<TimelineItemContextValue>(
    () => ({ id: itemId, isAlternateRight, status }),
    [itemId, status, isAlternateRight],
  );

  const ItemPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <TimelineItemContext.Provider value={itemContextValue}>
      <ItemPrimitive
        aria-current={status === 'active' ? 'step' : undefined}
        data-alternate-right={isAlternateRight ? '' : undefined}
        data-orientation={orientation}
        data-slot="timeline-item"
        data-status={status}
        dir={dir}
        id={itemId}
        role="listitem"
        {...itemProps}
        className={cn(
          timelineItemVariants({
            className,
            isAlternateRight,
            orientation,
            variant,
          }),
        )}
        ref={composedRef}
      />
    </TimelineItemContext.Provider>
  );
}

const timelineContentVariants = cva('flex-1', {
  compoundVariants: [
    {
      class: 'text-right',
      isAlternateRight: false,
      orientation: 'vertical',
      variant: 'alternate',
    },
    {
      class: 'row-start-3 pt-2',
      isAlternateRight: false,
      orientation: 'horizontal',
      variant: 'alternate',
    },
    {
      class: 'row-start-1 pb-2',
      isAlternateRight: true,
      orientation: 'horizontal',
      variant: 'alternate',
    },
  ],
  defaultVariants: {
    isAlternateRight: false,
    orientation: 'vertical',
    variant: 'default',
  },
  variants: {
    isAlternateRight: {
      false: '',
      true: '',
    },
    orientation: {
      horizontal: '',
      vertical: '',
    },
    variant: {
      alternate: '',
      default: '',
    },
  },
});

function TimelineContent(props: DivProps) {
  const { asChild, className, ...contentProps } = props;

  const { variant, orientation } = useTimelineContext(CONTENT_NAME);
  const { status, isAlternateRight } = useTimelineItemContext(CONTENT_NAME);

  const ContentPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <ContentPrimitive
      data-slot="timeline-content"
      data-status={status}
      {...contentProps}
      className={cn(
        timelineContentVariants({
          className,
          isAlternateRight,
          orientation,
          variant,
        }),
      )}
    />
  );
}

const timelineDotVariants = cva(
  'relative z-10 flex size-[var(--timeline-dot-size)] shrink-0 items-center justify-center rounded-full border-2 bg-background',
  {
    compoundVariants: [
      {
        class:
          'absolute -right-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] bg-background',
        isAlternateRight: false,
        orientation: 'vertical',
        variant: 'alternate',
      },
      {
        class:
          'absolute -left-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] bg-background',
        isAlternateRight: true,
        orientation: 'vertical',
        variant: 'alternate',
      },
      {
        class: 'row-start-2 bg-background',
        orientation: 'horizontal',
        variant: 'alternate',
      },
      {
        class: 'bg-background',
        status: 'completed',
        variant: 'alternate',
      },
      {
        class: 'bg-background',
        status: 'active',
        variant: 'alternate',
      },
    ],
    defaultVariants: {
      isAlternateRight: false,
      orientation: 'vertical',
      status: 'pending',
      variant: 'default',
    },
    variants: {
      isAlternateRight: {
        false: '',
        true: '',
      },
      orientation: {
        horizontal: '',
        vertical: '',
      },
      status: {
        active: 'border-primary',
        completed: 'border-primary',
        pending: 'border-border',
      },
      variant: {
        alternate: '',
        default: '',
      },
    },
  },
);

function TimelineDot(props: DivProps) {
  const { asChild, className, ...dotProps } = props;

  const { orientation, variant } = useTimelineContext(DOT_NAME);
  const { status, isAlternateRight } = useTimelineItemContext(DOT_NAME);

  const DotPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <DotPrimitive
      data-orientation={orientation}
      data-slot="timeline-dot"
      data-status={status}
      {...dotProps}
      className={cn(
        timelineDotVariants({
          className,
          isAlternateRight,
          orientation,
          status,
          variant,
        }),
      )}
    />
  );
}

const timelineConnectorVariants = cva('absolute z-0', {
  compoundVariants: [
    {
      class:
        'start-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] top-3 h-[calc(100%+0.5rem)] w-[var(--timeline-connector-thickness)]',
      orientation: 'vertical',
      variant: 'default',
    },
    {
      class:
        'start-3 top-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] h-[var(--timeline-connector-thickness)] w-[calc(100%+0.5rem)]',
      orientation: 'horizontal',
      variant: 'default',
    },
    {
      class:
        'top-2 -right-[calc(var(--timeline-connector-thickness)/2)] h-full w-[var(--timeline-connector-thickness)]',
      isAlternateRight: false,
      orientation: 'vertical',
      variant: 'alternate',
    },
    {
      class:
        'top-2 -left-[calc(var(--timeline-connector-thickness)/2)] h-full w-[var(--timeline-connector-thickness)]',
      isAlternateRight: true,
      orientation: 'vertical',
      variant: 'alternate',
    },
    {
      class:
        'top-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] left-3 row-start-2 h-[var(--timeline-connector-thickness)] w-[calc(100%+0.5rem)]',
      orientation: 'horizontal',
      variant: 'alternate',
    },
  ],
  defaultVariants: {
    isAlternateRight: false,
    isCompleted: false,
    orientation: 'vertical',
    variant: 'default',
  },
  variants: {
    isAlternateRight: {
      false: '',
      true: '',
    },
    isCompleted: {
      false: 'bg-border',
      true: 'bg-primary',
    },
    orientation: {
      horizontal: '',
      vertical: '',
    },
    variant: {
      alternate: '',
      default: '',
    },
  },
});

interface TimelineConnectorProps extends DivProps {
  forceMount?: boolean;
}

function TimelineConnector(props: TimelineConnectorProps) {
  const { asChild, forceMount, className, ...connectorProps } = props;

  const { orientation, variant, activeIndex } = useTimelineContext(CONNECTOR_NAME);
  const { id, status, isAlternateRight } = useTimelineItemContext(CONNECTOR_NAME);

  const nextItemStatus = useStore((state) => state.getNextItemStatus(id, activeIndex));

  const isLastItem = nextItemStatus === undefined;

  if (!forceMount && isLastItem) return null;

  const isConnectorCompleted = nextItemStatus === 'completed' || nextItemStatus === 'active';

  const ConnectorPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <ConnectorPrimitive
      aria-hidden="true"
      data-completed={isConnectorCompleted ? '' : undefined}
      data-orientation={orientation}
      data-slot="timeline-connector"
      data-status={status}
      {...connectorProps}
      className={cn(
        timelineConnectorVariants({
          className,
          isAlternateRight,
          isCompleted: isConnectorCompleted,
          orientation,
          variant,
        }),
      )}
    />
  );
}

function TimelineHeader(props: DivProps) {
  const { asChild, className, ...headerProps } = props;

  const HeaderPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <HeaderPrimitive
      data-slot="timeline-header"
      {...headerProps}
      className={cn('flex flex-col gap-1', className)}
    />
  );
}

function TimelineTitle(props: DivProps) {
  const { asChild, className, ...titleProps } = props;

  const TitlePrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <TitlePrimitive
      data-slot="timeline-title"
      {...titleProps}
      className={cn('font-semibold leading-none', className)}
    />
  );
}

function TimelineDescription(props: DivProps) {
  const { asChild, className, ...descriptionProps } = props;

  const DescriptionPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <DescriptionPrimitive
      data-slot="timeline-description"
      {...descriptionProps}
      className={cn('text-muted-foreground text-sm', className)}
    />
  );
}

interface TimelineTimeProps extends React.ComponentProps<'time'> {
  asChild?: boolean;
}

function TimelineTime(props: TimelineTimeProps) {
  const { asChild, className, ...timeProps } = props;

  const TimePrimitive = asChild ? SlotPrimitive.Slot : 'time';

  return (
    <TimePrimitive
      data-slot="timeline-time"
      {...timeProps}
      className={cn('text-muted-foreground text-xs', className)}
    />
  );
}

export {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  type TimelineProps,
  TimelineTime,
  TimelineTitle,
};
