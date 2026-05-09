# vite-react-template

Production-ready React SPA template. Auth routing, data layer, form validation, UI components, and full tooling — ready to clone and build on.

Mirrors the architecture of [react-native-template](../react-native-template) for consistency across web and mobile.

## Stack

| Layer        | Library                                |
| ------------ | -------------------------------------- |
| Build        | Vite + TypeScript                      |
| UI           | React 19 + Tailwind CSS v4 + shadcn/ui |
| Router       | React Router v7                        |
| Server state | TanStack React Query v5                |
| HTTP         | Axios (Bearer token + 401 auto-logout) |
| Client state | Zustand v5                             |
| Forms        | react-hook-form + Zod                  |
| Tests        | Vitest + @testing-library/react        |
| Git hooks    | Husky + lint-staged                    |
| CI           | GitHub Actions                         |

## Structure

```
src/
  components/ui/        # shadcn/ui components
  features/
    auth/               # LoginPage, schema, useLogin hook, tests
    dashboard/          # DashboardPage (private placeholder)
    not-found/          # NotFoundPage (404)
  lib/
    api.ts              # Axios instance + interceptors
    token-storage.ts    # localStorage wrapper
  providers/
    QueryProvider.tsx
  routes/
    AuthLayout.tsx      # Public guard (redirects if authenticated)
    AppLayout.tsx       # Private guard (redirects if not authenticated)
    router.tsx
  stores/
    auth-store.ts       # Zustand auth store
  App.tsx
  main.tsx
```

## Routes

| Path         | Access  | Component                 |
| ------------ | ------- | ------------------------- |
| `/`          | —       | Redirects to `/dashboard` |
| `/login`     | Public  | LoginPage                 |
| `/dashboard` | Private | DashboardPage             |
| `*`          | Public  | NotFoundPage              |

## New Project Checklist

When using this template, search for `// TODO:` across the codebase. Each one marks something to change:

| File                                       | TODO                                            |
| ------------------------------------------ | ----------------------------------------------- |
| `index.html`                               | Update app title and favicon                    |
| `package.json`                             | Update `name`, `version`, `description`         |
| `.env.example` → `.env`                    | Set `VITE_API_URL` to your API base URL         |
| `src/stores/auth-store.ts`                 | Extend `User` type with fields your API returns |
| `src/features/auth/hooks/useLogin.ts`      | Update `LoginResponse` type + endpoint path     |
| `src/features/auth/LoginPage.tsx`          | Update branding and copy                        |
| `src/features/dashboard/DashboardPage.tsx` | Replace placeholder with real content           |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env file and set API URL
cp .env.example .env

# Start dev server
pnpm dev
```

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Type-check + build
pnpm typecheck    # TypeScript check only
pnpm lint         # ESLint (zero warnings)
pnpm format       # Prettier
pnpm test         # Vitest watch
pnpm test:run     # Vitest single run
```

## Auth Flow

1. App mounts → `initAuth()` reads token from localStorage
2. `AuthLayout` / `AppLayout` redirect based on auth state
3. Login form submits → `useLogin` mutation → `api.post('/auth/login')` → token stored
4. Axios response interceptor: 401 → `store.logout()` → redirect to `/login`

## Adding a New Private Route

1. Create `src/features/<name>/<Name>Page.tsx`
2. Add to `router.tsx` under the `AppLayout` children array

## Adding a New Public Route

1. Create `src/features/<name>/<Name>Page.tsx`
2. Add to `router.tsx` under the `AuthLayout` children array (or at root for unguarded)

## Environment Variables

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `VITE_API_URL` | Base URL for the API (e.g. `http://localhost:3000`) |

All Vite env vars must be prefixed with `VITE_`.

## Notes

- `user` in the auth store is `null` after page reload — only the token is persisted. Fetch the user profile from your API after authentication if needed.
- shadcn components live in `src/components/ui/` and are excluded from ESLint (auto-generated).
- Pre-commit hook runs ESLint + Prettier on staged files via lint-staged.
