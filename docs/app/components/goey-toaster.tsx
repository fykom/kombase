import type { GooeyToasterProps } from 'goey-toast';
import { GooeyToaster, gooeyToast } from 'goey-toast';
import 'goey-toast/styles.css';

export type {
  GooeyPromiseData,
  GooeyToastAction,
  GooeyToastClassNames,
  GooeyToastOptions,
  GooeyToastTimings,
} from 'goey-toast';
export type { GooeyToasterProps };
export { gooeyToast };

function GoeyToaster(props: GooeyToasterProps) {
  return <GooeyToaster position="bottom-right" {...props} />;
}

export { GoeyToaster };
