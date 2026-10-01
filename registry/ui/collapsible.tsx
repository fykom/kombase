'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const Collapsible = CollapsiblePrimitive.Root;

export const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

export const CollapsibleContent = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ children, className, ...props }, ref) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <CollapsiblePrimitive.CollapsibleContent
      className={cn(
        'overflow-hidden',
        mounted &&
          'data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down',
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
});
CollapsibleContent.displayName = 'CollapsibleContent';

export type CollapsibleProps = CollapsiblePrimitive.CollapsibleProps;
export type CollapsibleContentProps = CollapsiblePrimitive.CollapsibleContentProps;
export type CollapsibleTriggerProps = CollapsiblePrimitive.CollapsibleTriggerProps;
