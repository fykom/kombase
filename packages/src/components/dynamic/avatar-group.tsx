import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

const avatarGroupVariants = cva('flex items-center', {
  compoundVariants: [
    {
      className: '-space-x-1',
      dir: 'ltr',
      orientation: 'horizontal',
    },
    {
      className: 'flex-row-reverse -space-x-1 space-x-reverse',
      dir: 'rtl',
      orientation: 'horizontal',
    },
    {
      className: '-space-y-1',
      dir: 'ltr',
      orientation: 'vertical',
    },
    {
      className: 'flex-col-reverse -space-y-1 space-y-reverse',
      dir: 'rtl',
      orientation: 'vertical',
    },
  ],
  defaultVariants: {
    dir: 'ltr',
    orientation: 'horizontal',
  },
  variants: {
    dir: {
      ltr: '',
      rtl: '',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
});

interface AvatarGroupProps
  extends Omit<React.ComponentProps<'div'>, 'dir'>,
    VariantProps<typeof avatarGroupVariants> {
  size?: number;
  max?: number;
  asChild?: boolean;
  reverse?: boolean;
  renderOverflow?: (count: number) => React.ReactNode;
}

function AvatarGroup(props: AvatarGroupProps) {
  const {
    orientation = 'horizontal',
    dir = 'ltr',
    size = 40,
    max,
    asChild,
    reverse = false,
    renderOverflow,
    className,
    children,
    ...rootProps
  } = props;

  const childrenArray = React.Children.toArray(children).filter(React.isValidElement);
  const itemCount = childrenArray.length;
  const shouldTruncate = max && itemCount > max;
  const visibleItems = shouldTruncate ? childrenArray.slice(0, max - 1) : childrenArray;
  const overflowCount = shouldTruncate ? itemCount - (max - 1) : 0;
  const totalRenderedItems = shouldTruncate ? max : itemCount;

  const RootPrimitive = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <RootPrimitive
      data-orientation={orientation}
      data-slot="avatar-group"
      {...rootProps}
      className={cn(avatarGroupVariants({ dir, orientation }), className)}
    >
      {visibleItems.map((child, index) => (
        <AvatarGroupItem
          child={child}
          dir={dir}
          index={index}
          itemCount={totalRenderedItems}
          key={index}
          orientation={orientation}
          reverse={reverse}
          size={size}
        />
      ))}
      {shouldTruncate && (
        <AvatarGroupItem
          child={
            renderOverflow ? (
              renderOverflow(overflowCount)
            ) : (
              <div className="inline-flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
                +{overflowCount}
              </div>
            )
          }
          dir={dir}
          index={visibleItems.length}
          itemCount={totalRenderedItems}
          key="overflow"
          orientation={orientation}
          reverse={reverse}
          size={size}
        />
      )}
    </RootPrimitive>
  );
}

interface AvatarGroupItemProps
  extends Omit<React.ComponentProps<typeof SlotPrimitive.Slot>, 'dir'>,
    VariantProps<typeof avatarGroupVariants> {
  child: React.ReactNode;
  index: number;
  itemCount: number;
  size: number;
  reverse: boolean;
}

function AvatarGroupItem(props: AvatarGroupItemProps) {
  const {
    child,
    index,
    size,
    orientation,
    dir = 'ltr',
    reverse = false,
    itemCount,
    className,
    style,
    ...itemProps
  } = props;

  const maskStyle = React.useMemo<React.CSSProperties>(() => {
    let maskImage = '';

    let shouldMask = false;

    if (orientation === 'vertical' && dir === 'rtl' && reverse) {
      shouldMask = index !== itemCount - 1;
    } else {
      shouldMask = reverse ? index < itemCount - 1 : index > 0;
    }

    if (shouldMask) {
      const maskRadius = size / 2;
      const maskOffset = size / 4 + size / 10;

      if (orientation === 'vertical') {
        if (dir === 'ltr') {
          if (reverse) {
            maskImage = `radial-gradient(circle ${maskRadius}px at 50% ${size + maskOffset}px, transparent 99%, white 100%)`;
          } else {
            maskImage = `radial-gradient(circle ${maskRadius}px at 50% -${maskOffset}px, transparent 99%, white 100%)`;
          }
        } else {
          if (reverse) {
            maskImage = `radial-gradient(circle ${maskRadius}px at 50% -${maskOffset}px, transparent 99%, white 100%)`;
          } else {
            maskImage = `radial-gradient(circle ${maskRadius}px at 50% ${size + maskOffset}px, transparent 99%, white 100%)`;
          }
        }
      } else {
        if (dir === 'ltr') {
          if (reverse) {
            maskImage = `radial-gradient(circle ${maskRadius}px at ${size + maskOffset}px 50%, transparent 99%, white 100%)`;
          } else {
            maskImage = `radial-gradient(circle ${maskRadius}px at -${maskOffset}px 50%, transparent 99%, white 100%)`;
          }
        } else {
          if (reverse) {
            maskImage = `radial-gradient(circle ${maskRadius}px at -${maskOffset}px 50%, transparent 99%, white 100%)`;
          } else {
            maskImage = `radial-gradient(circle ${maskRadius}px at ${size + maskOffset}px 50%, transparent 99%, white 100%)`;
          }
        }
      }
    }

    return {
      height: size,
      maskImage,
      width: size,
    };
  }, [size, index, orientation, dir, reverse, itemCount]);

  return (
    <SlotPrimitive.Slot
      className={cn('size-full shrink-0 overflow-hidden rounded-full [&_img]:size-full', className)}
      data-slot="avatar-group-item"
      style={{
        ...maskStyle,
        ...style,
      }}
      {...itemProps}
    >
      {child}
    </SlotPrimitive.Slot>
  );
}

export { AvatarGroup };
