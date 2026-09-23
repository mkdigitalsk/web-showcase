import type { ComponentType } from 'react'
import { render } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import type { RouteConfigEntry } from '@react-router/dev/routes'
import routes from '../routes'
import App, { ErrorBoundary, HydrateFallback } from '../root'

type StubRoute = Parameters<typeof createRoutesStub>[0][number]

interface RouteModule {
  default?: ComponentType
  clientLoader?: StubRoute['loader']
  ErrorBoundary?: ComponentType
  HydrateFallback?: ComponentType
}

/** Keyed as `routes.ts` names a module, without its leading `./`. */
type Replacements = Record<string, ComponentType>

const routeModules = import.meta.glob<RouteModule>(['../**/*.{ts,tsx}', '!../**/*.test.{ts,tsx}', '!../test/**'])

const moduleKey = (file: string) => file.replace(/^\.\//, '')

async function stubRoute(entry: RouteConfigEntry, replacements: Replacements): Promise<StubRoute> {
  const load = routeModules[`../${moduleKey(entry.file)}`]
  if (!load) throw new Error(`routes.ts names ${entry.file}, which is not a module under src/`)
  const module = await load()
  const children = entry.children && (await Promise.all(entry.children.map((child) => stubRoute(child, replacements))))

  return {
    id: entry.id,
    path: entry.path,
    index: entry.index,
    Component: replacements[moduleKey(entry.file)] ?? module.default,
    ErrorBoundary: module.ErrorBoundary,
    HydrateFallback: module.HydrateFallback,
    loader: module.clientLoader,
    ...(children ? { children } : {}),
  }
}

/**
 * The production route table — root, session guard, layouts, boundaries and pages — rendered at a path, so a
 * test fails when `routes.ts` stops wiring what the app relies on. A replacement swaps one module's component
 * and keeps its place in the tree.
 */
export async function renderApp(path: string, { replace = {} }: { replace?: Replacements } = {}) {
  const children = await Promise.all(routes.map((entry) => stubRoute(entry, replace)))
  const Stub = createRoutesStub([{ id: 'root', Component: App, ErrorBoundary, HydrateFallback, children }])
  return render(<Stub initialEntries={[path]} />)
}
