# Vite React Template — Design Spec

**Date:** 2026-05-08  
**Reference:** `react-native-template` (same author, mirrored architecture)

---

## Goal

Configure `vite-react-template` as a production-ready React SPA template with:
- Public/private routing (login + dashboard)
- Auth flow (Zustand store + localStorage token)
- Data layer (Axios + React Query)
- Form validation (react-hook-form + Zod)
- UI (Tailwind v4 + shadcn/ui)
- 404 error page
- Tooling (Husky + lint-staged + CI)

---

## Stack

| Layer | Library |
|---|---|
| Build | Vite + TypeScript |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui |
| Router | React Router v7 (`createBrowserRouter`) |
| Server state | TanStack React Query v5 |
| HTTP | Axios (interceptors: Bearer token + 401 → logout) |
| Client state | Zustand v5 |
| Forms | react-hook-form + @hookform/resolvers + Zod v4 |
| Tests | Vitest + @testing-library/react |
| Git hooks | Husky + lint-staged |
| CI | GitHub Actions |

### Prettier config (mirrors RN template)
```json
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "semi": true,
  "endOfLine": "lf"
}
```

### lint-staged
- `src/**/*.{ts,tsx}` → eslint + prettier
- `*.{json,md}` → prettier

---

## Folder Structure

```
src/
  components/
    ui/                     ← shadcn/ui generated components
  features/
    auth/
      LoginPage.tsx         ← form UI, calls useLogin mutation
      schemas/
        auth.ts             ← Zod schema: email + password
      hooks/
        useLogin.ts         ← useMutation → api.post('/auth/login') → store.login()
      __tests__/
        LoginPage.test.tsx
    dashboard/
      DashboardPage.tsx     ← simple placeholder, shows user email
    not-found/
      NotFoundPage.tsx      ← 404 message + link back to /
  lib/
    api.ts                  ← axios instance + request/response interceptors
    token-storage.ts        ← localStorage wrapper (mirrors SecureStore from RN template)
  providers/
    QueryProvider.tsx       ← QueryClientProvider (staleTime 5min, retry 2)
  routes/
    AuthLayout.tsx          ← if authenticated → <Navigate to="/dashboard" />
    AppLayout.tsx           ← if not authenticated → <Navigate to="/login" />
    router.tsx              ← createBrowserRouter definition
  stores/
    auth-store.ts           ← Zustand store (mirrors RN template exactly)
  App.tsx                   ← RouterProvider + QueryProvider + initAuth on mount
  main.tsx                  ← ReactDOM.createRoot
```

---

## Auth Flow

### Initialization
1. App mounts → `useEffect` calls `initAuth()`
2. `initAuth()` reads token from localStorage
3. Sets `isAuthenticated: true` if token exists, then `isInitialized: true`
4. App renders `null` until `isInitialized` — prevents flash of wrong route

### Route protection
- `AuthLayout`: wraps public routes (`/login`). If `isAuthenticated` → `<Navigate to="/dashboard" replace />`
- `AppLayout`: wraps private routes (`/dashboard`). If `!isAuthenticated` → `<Navigate to="/login" replace />`
- Both layouts wait for `isInitialized` before redirecting (renders `null` meanwhile)

### Login submit
1. `LoginPage` submits form → `useLogin` mutation
2. `useLogin` calls `api.post('/auth/login', { email, password })`
3. On success → `store.login(user, token)` → token saved to localStorage → `isAuthenticated: true`
4. `AuthLayout` detects auth change → redirects to `/dashboard`

### Token refresh / 401
- Axios response interceptor catches 401 → calls `store.logout()`
- `store.logout()` clears localStorage token + sets `isAuthenticated: false`
- `AppLayout` detects state change → redirects to `/login`

---

## Routes

| Path | Layout | Component | Access |
|---|---|---|---|
| `/` | — | `<Navigate to="/dashboard" />` | — |
| `/login` | `AuthLayout` | `LoginPage` | Public |
| `/dashboard` | `AppLayout` | `DashboardPage` | Private |
| `*` | — | `NotFoundPage` | Public |

---

## Components

### `LoginPage`
- Fields: email + password
- Validation: Zod schema (email valid, password min 6 chars)
- Submit disabled until form valid
- Uses shadcn `Input`, `Button`, `Card`
- Portuguese labels (mirrors RN template)

### `DashboardPage`
- Shows authenticated user's email
- Logout button → `store.logout()`
- Minimal — template placeholder

### `NotFoundPage`
- "Página não encontrada" message
- Link back to `/`
- Accessible without authentication

### `AppLayout`
- Renders `<Outlet />` when authenticated
- Shows loading state while `!isInitialized`

### `AuthLayout`
- Renders `<Outlet />` when not authenticated
- Shows loading state while `!isInitialized`

---

## Data Layer

### `api.ts`
```typescript
// Request interceptor: attach Bearer token from Zustand store (no subscribe — getState())
// Response interceptor: 401 → store.logout()
```

### `token-storage.ts`
```typescript
// Mirrors RN template SecureStore interface: get(), set(token), delete()
// Implementation: localStorage
```

### `auth-store.ts`
```typescript
// State: isAuthenticated, isInitialized, user, token
// Actions: initAuth(), login(user, token?), logout(), reset()
// Mirrors RN template exactly — only difference: tokenStorage uses localStorage
```

### `QueryProvider.tsx`
```typescript
// QueryClient: staleTime 5min, retry 2
// Mirrors RN template
```

---

## Testing

- Vitest + @testing-library/react + jsdom
- Tests mirror RN template pattern:
  - `LoginPage.test.tsx` — renders form, validates fields, submits
  - `auth-store.test.ts` — initAuth, login, logout state transitions
  - `token-storage.test.ts` — localStorage get/set/delete

---

## CI (GitHub Actions)

File: `.github/workflows/ci.yml`  
Trigger: PR to any branch

Steps:
1. Checkout + Node 22 + pnpm
2. `pnpm install --frozen-lockfile`
3. `pnpm lint`
4. `pnpm typecheck`
5. `pnpm test --run --coverage`

---

## Path Aliases

`tsconfig.app.json` + `vite.config.ts`:
- `@/*` → `./src/*`

---

## Out of Scope

- Dark mode (not in scope for this template pass)
- i18n
- API mock server
- State persistence beyond token
