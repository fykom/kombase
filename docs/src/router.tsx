import { createRouter as createTanStackRouter, notFound } from '@tanstack/react-router';
import { GeneralError } from './error/general-error';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createTanStackRouter({
    defaultErrorComponent: () => <GeneralError />,
    defaultNotFoundComponent: () => notFound,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
