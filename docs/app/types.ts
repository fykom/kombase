export type EmptyProps<
  T extends React.ElementType,
  K extends PropertyKey = keyof React.ComponentProps<T>,
> = Omit<React.ComponentProps<T>, K>;
