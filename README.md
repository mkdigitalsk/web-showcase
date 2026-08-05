# Web Showcase

A production-ready React web app showcasing modern frontend development with MUI, a wrapper-component design system, and the shared MK Digital brand tokens. The web counterpart of the [KMP mobile showcase](https://github.com/mkdigitalsk/kmp-showcase).

[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev)
[![MUI](https://img.shields.io/badge/MUI-9-007FFF.svg?logo=mui&logoColor=white)](https://mui.com)
[![CI](https://github.com/mkdigitalsk/web-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/mkdigitalsk/web-showcase/actions/workflows/ci.yml)

> 🔗 **[View it live →](https://showcase.mkdigital.sk)** — it's a web app, just open it in a browser. No build, install, or device needed.

---

<table>
<tr>
<td style="width:50%">

### 🎨 UI & Components

- MUI v9 + Material Design 3
- Wrapper-component design system
- Dark mode + theme toggle
- Responsive, intent-based sizing

</td>
<td style="width:50%">

### 🔌 Data & Network

- TanStack Query + Axios
- Showcase API (`/v1`)
- IndexedDB via Dexie
- JWT auth (login)

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

---

## Tech stack

React · TypeScript · Vite · MUI v9 + Emotion · TanStack Query · Axios · Dexie (IndexedDB) · React Hook Form + Zod · react-intl · React Router · **[@mkdigitalsk/design-system](https://github.com/mkdigitalsk/design-system)**.

## Design system

Brand colors come from the shared **[@mkdigitalsk/design-system](https://github.com/mkdigitalsk/design-system)** package (single source → web + mobile). The MUI theme composes its palette from those tokens — no hardcoded brand colors.

## Run locally

> To just _see_ it, use the live demo above — no setup needed. To develop:

```bash
npm install   # needs a GitHub Packages token for the private design-system (NODE_AUTH_TOKEN)
npm run dev   # http://localhost:5173
```

| script                  | does                          |
| ----------------------- | ----------------------------- |
| `npm run dev`           | dev server (HMR)              |
| `npm run build`         | type-check + production build |
| `npm run preview`       | serve the production build    |
| `npm run format`        | Prettier, write               |
| `npm run format:check`  | Prettier, verify (CI gates)   |
| `npm run lint`          | ESLint                        |
| `npm run check-locales` | verify locale key parity      |

### The one advisory left open

`npm audit --omit=dev` reports one high on `react-router`: [RSC Mode CSRF Bypass][rsc-csrf]. It does not
reach this app — routing is `BrowserRouter` in the browser and no `@react-router/*` server package is
installed, so there is no RSC mode to bypass. It is fixed only in react-router 8; npm's suggested fix
downgrades to 7.11.0, which loses features for nothing.

[rsc-csrf]: https://github.com/advisories/GHSA-qwww-vcr4-c8h2

## Architecture

Feature-based — `src/features/<name>/`: `auth` · `home` · `ui-components` · `networking` · `storage` · `database` · `capabilities`. Shared code in `src/shared/` (components, hooks, theme, services).
