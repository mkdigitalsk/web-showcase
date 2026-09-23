import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'
import { Routes } from './utils/routes'

/**
 * Every page sits under `routes/boundary.tsx` inside its layout, so a crash replaces the page and never the
 * chrome. The signed-in pages sit under `routes/signedIn.ts`, which admits nobody without a session.
 */
export default [
  index('./routes/firstScreen.ts', { id: 'first-screen' }),
  layout('./shared/components/layout/PublicLayout.tsx', [
    layout('./routes/boundary.tsx', { id: 'public-pages' }, [
      route(Routes.SIGN_IN, './features/auth/signIn/SignInPage.tsx'),
      route(Routes.SIGN_UP, './features/auth/signUp/SignUpPage.tsx'),
      route(Routes.PRIVACY, './features/privacy/PrivacyPage.tsx'),
    ]),
  ]),
  layout('./routes/signedIn.ts', [
    layout('./shared/components/layout/AppLayout.tsx', [
      layout('./routes/boundary.tsx', { id: 'app-pages' }, [
        route(Routes.NETWORKING, './features/networking/NetworkingPage.tsx'),
        route(Routes.STORAGE, './features/storage/StoragePage.tsx'),
        route(Routes.DATABASE, './features/database/DatabasePage.tsx'),
        route(Routes.UI_COMPONENTS, './features/ui-components/UiComponentsPage.tsx'),
        route(Routes.CAPABILITIES, './features/capabilities/CapabilitiesPage.tsx'),
        route(Routes.ACCOUNT, './features/account/AccountPage.tsx'),
      ]),
    ]),
  ]),
  route('*', './routes/firstScreen.ts', { id: 'unknown-path' }),
] satisfies RouteConfig
