import { RootProvider } from 'fumadocs-ui/provider/react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from 'react-router';
import './styles/global.css';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GoeyToaster } from './components/goey-toaster';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="https://storage.googleapis.com/komerce/assets/logo/favicon.ico" rel="icon" />
        <Meta />
        <Links />
      </head>
      <body>
        <RootProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </RootProvider>
        <GoeyToaster duration={3000} position="bottom-right" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const navigate = useNavigate();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">404</h1>
        <span className="font-medium">Oops! Page Not Found!</span>
        <p className="text-center text-muted-foreground">
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
