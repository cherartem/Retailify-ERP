import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree'

const router = createRouter({ routeTree, defaultPreload: 'intent' })

export function TanstackRouterProvider() {
  return <RouterProvider router={router} />
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
