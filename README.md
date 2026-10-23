# Web Showcase

A production-ready React web app showcasing modern frontend development with Base UI and CSS Modules, a wrapper-component design system, and the shared MK Digital brand tokens. The web counterpart of the [KMP mobile showcase](https://github.com/mkdigitalsk/kmp-showcase).

[![CI](https://github.com/mkdigitalsk/web-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/mkdigitalsk/web-showcase/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev)
[![Base UI](https://img.shields.io/badge/Base_UI-1-000000.svg)](https://base-ui.com)

> 🔗 **[View it live →](https://showcase.mkdigital.sk)** — it's a web app, just open it in a browser. No build, install, or device needed.

---

<!-- markdownlint-disable MD001 -->
<table>
<tr>
<td style="width:50%">

### 🎨 UI & Components

- Base UI + CSS Modules
- Wrapper-component design system
- Dark mode + theme toggle
- Responsive, intent-based sizing

</td>
<td style="width:50%">

### 🔌 Data & Network

- TanStack Query + Axios
- Showcase API (`/v1`)
- IndexedDB via Dexie
- Session in an HttpOnly cookie, held by the app's own `/v1` proxy

</td>
</tr>
<tr>
<td style="width:50%">

### 📝 Forms & Validation

- React Hook Form + Zod
- i18n error messages
- Type-safe schemas

</td>
<td style="width:50%">

### 🌍 i18n & Theming

- react-intl (en · sk · cs · de)
- Enforced key parity
- Server-synced locale per user

</td>
</tr>
</table>
<!-- markdownlint-enable MD001 -->

---

## Tech stack

React · TypeScript · Vite · React Router (framework mode, SPA) · Base UI + CSS Modules · Lucide · TanStack Query · Axios · Dexie (IndexedDB) · React Hook Form + Zod · react-intl · **[@mkdigitalsk/design-system](https://github.com/mkdigitalsk/design-system)**.

## Design system

Brand colors come from the shared **[@mkdigitalsk/design-system](https://github.com/mkdigitalsk/design-system)** package (single source → web + mobile). The CSS Modules read every colour, font, radius and space as a custom property — the package's `web.css`, extended in `src/shared/theme/tokens.css` — no hardcoded brand colors.

## Run locally

> To just _see_ it, use the live demo above — no setup needed. To develop:

```bash
npm install   # needs a GitHub Packages token for the private design-system (NODE_AUTH_TOKEN)
cp .env.example .env.local   # then set API_URL — the dev server refuses to start without it
npm run dev   # http://localhost:5173
```

| script                  | does                                                                            |
| ----------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`           | dev server (HMR)                                                                |
| `npm run build`         | type-check + production build                                                   |
| `npm run preview`       | serve the production build                                                      |
| `npm run format`        | Prettier, write                                                                 |
| `npm run format:check`  | Prettier, verify (CI gates)                                                     |
| `npm run lint`          | ESLint                                                                          |
| `npm run check-locales` | verify locale key parity                                                        |
| `npm run types:api`     | the API's types, generated from `../kmp-showcase`'s spec                        |
| `npm run e2e`           | the Playwright journey on a stack of its own — Docker, a JDK, `../kmp-showcase` |

## Architecture

`src/routes.ts` is the route table and `src/root.tsx` the document. Feature-based — `src/features/<name>/`: `auth` · `privacy` · `ui-components` · `networking` · `storage` · `database` · `capabilities` · `account`. Shared code in `src/shared/` (components, hooks, theme, services).
