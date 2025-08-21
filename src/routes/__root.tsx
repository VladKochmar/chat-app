import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import type { AuthContextInterface } from '@/contexts/AuthContext'

interface ChatAppRouterContext {
  auth: AuthContextInterface
}

export const Route = createRootRouteWithContext<ChatAppRouterContext>()({
  component: () => (
    <>
      <HeadContent />
      <main className="flex min-h-screen items-center justify-center">
        <Outlet />
      </main>
      {import.meta.env.VITE_ENVIRONMENT === 'development' && (
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      )}
    </>
  ),
})
