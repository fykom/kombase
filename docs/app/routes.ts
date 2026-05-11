import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('docs/*', 'routes/docs.tsx'),
  route('api/search', 'routes/search.ts'),
] satisfies RouteConfig;
