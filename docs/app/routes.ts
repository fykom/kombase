import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
  index('routes/index.ts'),
  route('docs/*', 'routes/docs.tsx'),
  route('api/search', 'routes/search.ts'),
  route('api/feedback', 'routes/api.feedback.ts'),
] satisfies RouteConfig;
