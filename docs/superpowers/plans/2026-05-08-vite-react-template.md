# Vite React Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the bare Vite + React 19 scaffold into a production-ready SPA template with auth routing, data layer, form validation, UI components, and full tooling.

**Architecture:** React Router v7 layout routes separate public (`AuthLayout`) from private (`AppLayout`), each redirecting based on Zustand auth state. Axios interceptors handle Bearer token injection and 401 auto-logout. Token persisted in localStorage via a thin wrapper that mirrors the RN template's SecureStore interface.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, React Router v7, TanStack React Query v5, Axios, Zustand v5, react-hook-form, Zod v4, Vitest, @testing-library/react, Husky, lint-staged, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-05-08-vite-react-template-design.md`

---

## File Map

**Create:**

- `src/lib/token-storage.ts` — localStorage wrapper (get/set/delete)
- `src/lib/api.ts` — Axios instance + interceptors
- `src/lib/__tests__/token-storage.test.ts`
- `src/stores/auth-store.ts` — Zustand auth state
- `src/stores/__tests__/auth-store.test.ts`
- `src/providers/QueryProvider.tsx` — React Query setup
- `src/features/auth/schemas/auth.ts` — Zod login schema
- `src/features/auth/hooks/useLogin.ts` — useMutation wrapping POST /auth/login
- `src/features/auth/LoginPage.tsx` — Login form with shadcn UI
- `src/features/auth/__tests__/LoginPage.test.tsx`
- `src/features/dashboard/DashboardPage.tsx` — Protected placeholder
- `src/features/not-found/NotFoundPage.tsx` — 404 page
- `src/routes/AuthLayout.tsx` — Public layout guard
- `src/routes/AppLayout.tsx` — Private layout guard
- `src/routes/router.tsx` — createBrowserRouter definition
- `src/test-setup.ts` — @testing-library/jest-dom setup
- `.prettierrc` — Prettier config
- `.prettierignore`
- `.lintstagedrc.js`
- `.husky/pre-commit`
- `.github/workflows/ci.yml`
- `.env.example`

**Modify:**

- `vite.config.ts` — add @tailwindcss/vite plugin + path alias + vitest config
- `tsconfig.app.json` — add baseUrl + paths + vitest/jest-dom types
- `eslint.config.js` — add eslint-config-prettier
- `package.json` — add scripts + dependencies
- `src/index.css` — replace with Tailwind v4 import (shadcn will add CSS vars)
- `src/App.tsx` — RouterProvider + QueryProvider + initAuth
- `src/main.tsx` — already correct, no change needed

---

## Task 1: Install Dependencies + Update Scripts

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd /Users/andersonsantanna/Documents/react/vite-react-template
pnpm add react-router-dom @tanstack/react-query axios zustand react-hook-form @hookform/resolvers zod
```

Expected: packages added to `dependencies` in package.json.

- [ ] **Step 2: Install dev dependencies**

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom @vitest/coverage-v8 jsdom @tailwindcss/vite tailwindcss prettier eslint-config-prettier husky lint-staged @types/node
```

Expected: packages added to `devDependencies`.

- [ ] **Step 3: Update scripts in package.json**

Open `package.json` and replace the `scripts` section with:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint . --max-warnings 0",
  "typecheck": "tsc --noEmit",
  "test": "vitest",
  "test:run": "vitest run",
  "format": "prettier --write .",
  "prepare": "husky"
}
```

- [ ] **Step 4: Commit**

```bash
git init
git add package.json pnpm-lock.yaml
git commit -m "chore: install dependencies and update scripts"
```

---

## Task 2: Configure Path Aliases

**Files:**

- Modify: `tsconfig.app.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Add baseUrl and paths to tsconfig.app.json**

Replace `tsconfig.app.json` content with:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Add path alias to vite.config.ts**

Replace `vite.config.ts` with:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary'],
    },
  },
});
```

- [ ] **Step 3: Verify typecheck passes**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.app.json vite.config.ts
git commit -m "chore: configure path alias and vitest in vite config"
```

---

## Task 3: Setup Tailwind v4 + shadcn/ui

**Files:**

- Modify: `src/index.css`
- Create: `components.json` (by shadcn CLI)
- Create: `src/lib/utils.ts` (by shadcn CLI)

- [ ] **Step 1: Replace index.css**

Replace entire `src/index.css` with:

```css
@import 'tailwindcss';
```

shadcn init will append CSS variable definitions to this file in the next step.

- [ ] **Step 2: Run shadcn init**

```bash
npx shadcn@latest init
```

When prompted, answer:

- **Which style would you like to use?** → `Default`
- **Which color would you like to use as the base color?** → `Slate`
- **Would you like to use CSS variables for colors?** → `yes`

Expected: creates `components.json`, updates `src/index.css` with `:root` CSS vars, creates `src/lib/utils.ts`.

- [ ] **Step 3: Add shadcn components**

```bash
npx shadcn@latest add button input card
```

Expected: creates `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/card.tsx`.

- [ ] **Step 4: Start dev server and verify Tailwind works**

```bash
pnpm dev
```

Open `http://localhost:5173` — page should load without CSS errors in console.
Stop with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/components/ src/lib/utils.ts components.json
git commit -m "chore: setup Tailwind v4 and shadcn/ui with button, input, card"
```

---

## Task 4: Configure Prettier + ESLint

**Files:**

- Create: `.prettierrc`
- Create: `.prettierignore`
- Modify: `eslint.config.js`

- [ ] **Step 1: Create .prettierrc**

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

- [ ] **Step 2: Create .prettierignore**

```
dist
node_modules
pnpm-lock.yaml
.claude
```

- [ ] **Step 3: Update eslint.config.js to add prettier**

Replace `eslint.config.js` with:

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
```

- [ ] **Step 4: Run lint to verify no errors**

```bash
pnpm lint
```

Expected: no errors, no warnings.

- [ ] **Step 5: Run formatter**

```bash
pnpm format
```

Expected: files formatted with no diff.

- [ ] **Step 6: Commit**

```bash
git add .prettierrc .prettierignore eslint.config.js
git commit -m "chore: configure prettier and eslint-config-prettier"
```

---

## Task 5: Setup Vitest + Test Infrastructure

**Files:**

- Create: `src/test-setup.ts`

- [ ] **Step 1: Create test setup file**

Create `src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 2: Verify vitest runs**

```bash
pnpm test:run
```

Expected: `No test files found` or exits with 0 — confirms vitest config works.

- [ ] **Step 3: Commit**

```bash
git add src/test-setup.ts
git commit -m "chore: add vitest test setup with jest-dom matchers"
```

---

## Task 6: Husky + lint-staged + CI + .env.example

**Files:**

- Create: `.lintstagedrc.js`
- Create: `.husky/pre-commit`
- Create: `.github/workflows/ci.yml`
- Create: `.env.example`

- [ ] **Step 1: Initialize Husky**

```bash
pnpm exec husky init
```

Expected: creates `.husky/` directory with a sample pre-commit file.

- [ ] **Step 2: Write pre-commit hook**

Replace `.husky/pre-commit` with:

```bash
npx lint-staged
```

- [ ] **Step 3: Create .lintstagedrc.js**

```javascript
export default {
  'src/**/*.{ts,tsx}': ['eslint --max-warnings=0', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
```

- [ ] **Step 4: Create GitHub Actions CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: ['**']

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Typecheck
        run: pnpm run typecheck

      - name: Test
        run: pnpm run test:run --coverage
```

- [ ] **Step 5: Create .env.example**

```
VITE_API_URL=http://localhost:3000
```

- [ ] **Step 6: Commit**

```bash
git add .lintstagedrc.js .husky/ .github/ .env.example
git commit -m "chore: add husky pre-commit hook, lint-staged, CI workflow"
```

---

## Task 7: token-storage (TDD)

**Files:**

- Create: `src/lib/__tests__/token-storage.test.ts`
- Create: `src/lib/token-storage.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/token-storage.test.ts`:

```typescript
import { beforeEach, describe, expect, it } from 'vitest';
import { tokenStorage } from '../token-storage';

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no token stored', () => {
    expect(tokenStorage.get()).toBeNull();
  });

  it('stores and retrieves a token', () => {
    tokenStorage.set('abc123');
    expect(tokenStorage.get()).toBe('abc123');
  });

  it('deletes a stored token', () => {
    tokenStorage.set('abc123');
    tokenStorage.delete();
    expect(tokenStorage.get()).toBeNull();
  });

  it('overwrites existing token on set', () => {
    tokenStorage.set('first');
    tokenStorage.set('second');
    expect(tokenStorage.get()).toBe('second');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm test:run src/lib/__tests__/token-storage.test.ts
```

Expected: FAIL — `Cannot find module '../token-storage'`.

- [ ] **Step 3: Implement token-storage.ts**

Create `src/lib/token-storage.ts`:

```typescript
const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  delete: (): void => localStorage.removeItem(TOKEN_KEY),
};
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm test:run src/lib/__tests__/token-storage.test.ts
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/token-storage.ts src/lib/__tests__/token-storage.test.ts
git commit -m "feat: add localStorage token storage"
```

---

## Task 8: auth-store (TDD)

**Files:**

- Create: `src/stores/__tests__/auth-store.test.ts`
- Create: `src/stores/auth-store.ts`

- [ ] **Step 1: Write failing tests**

Create `src/stores/__tests__/auth-store.test.ts`:

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/token-storage', () => ({
  tokenStorage: {
    get: vi.fn(() => null),
    set: vi.fn(),
    delete: vi.fn(),
  },
}));

import { tokenStorage } from '@/lib/token-storage';
import { useAuthStore } from '../auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
    vi.clearAllMocks();
  });

  it('starts uninitialized and unauthenticated', () => {
    const { isAuthenticated, isInitialized } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(isInitialized).toBe(false);
  });

  it('initAuth sets isInitialized true with no stored token', () => {
    vi.mocked(tokenStorage.get).mockReturnValue(null);
    useAuthStore.getState().initAuth();
    expect(useAuthStore.getState().isInitialized).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('initAuth authenticates when token exists in storage', () => {
    vi.mocked(tokenStorage.get).mockReturnValue('stored-token');
    useAuthStore.getState().initAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe('stored-token');
  });

  it('login sets authenticated state and persists token', () => {
    useAuthStore.getState().login({ email: 'user@example.com' }, 'my-token');
    const { isAuthenticated, user, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.email).toBe('user@example.com');
    expect(token).toBe('my-token');
    expect(tokenStorage.set).toHaveBeenCalledWith('my-token');
  });

  it('login without token does not call tokenStorage.set', () => {
    useAuthStore.getState().login({ email: 'user@example.com' });
    expect(tokenStorage.set).not.toHaveBeenCalled();
  });

  it('logout clears auth state and removes token', () => {
    useAuthStore.getState().login({ email: 'user@example.com' }, 'my-token');
    useAuthStore.getState().logout();
    const { isAuthenticated, user, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(tokenStorage.delete).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm test:run src/stores/__tests__/auth-store.test.ts
```

Expected: FAIL — `Cannot find module '../auth-store'`.

- [ ] **Step 3: Implement auth-store.ts**

Create `src/stores/auth-store.ts`:

```typescript
import { create } from 'zustand';
import { tokenStorage } from '@/lib/token-storage';

type User = { email: string };

type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  token: string | null;
  initAuth: () => void;
  login: (user: User, token?: string) => void;
  logout: () => void;
  reset: () => void;
};

const initialState: Pick<AuthState, 'isAuthenticated' | 'isInitialized' | 'user' | 'token'> = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  token: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  initAuth: () => {
    try {
      const token = tokenStorage.get();
      if (token) {
        set({ isAuthenticated: true, token, user: null });
      }
    } catch {
      // localStorage failure — treat as unauthenticated
    } finally {
      set({ isInitialized: true });
    }
  },
  login: (user, token) => {
    if (token) tokenStorage.set(token);
    set({ isAuthenticated: true, user, token: token ?? null });
  },
  logout: () => {
    tokenStorage.delete();
    set({ isAuthenticated: false, user: null, token: null });
  },
  reset: () => {
    tokenStorage.delete();
    set(initialState);
  },
}));
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm test:run src/stores/__tests__/auth-store.test.ts
```

Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stores/auth-store.ts src/stores/__tests__/auth-store.test.ts
git commit -m "feat: add Zustand auth store with localStorage persistence"
```

---

## Task 9: api.ts + QueryProvider

**Files:**

- Create: `src/lib/api.ts`
- Create: `src/providers/QueryProvider.tsx`

- [ ] **Step 1: Create api.ts**

Create `src/lib/api.ts`:

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
```

- [ ] **Step 2: Create QueryProvider.tsx**

Create `src/providers/QueryProvider.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

type Props = { children: ReactNode };

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/api.ts src/providers/QueryProvider.tsx
git commit -m "feat: add Axios instance with interceptors and QueryProvider"
```

---

## Task 10: Auth Schema + useLogin Hook

**Files:**

- Create: `src/features/auth/schemas/auth.ts`
- Create: `src/features/auth/hooks/useLogin.ts`

- [ ] **Step 1: Create Zod schema**

Create `src/features/auth/schemas/auth.ts`:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

- [ ] **Step 2: Create useLogin mutation hook**

Create `src/features/auth/hooks/useLogin.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { type LoginFormData } from '../schemas/auth';

type LoginResponse = {
  user: { email: string };
  token: string;
};

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      api.post<LoginResponse>('/auth/login', data).then((r) => r.data),
    onSuccess: ({ user, token }) => login(user, token),
  });
}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/schemas/auth.ts src/features/auth/hooks/useLogin.ts
git commit -m "feat: add login Zod schema and useLogin mutation hook"
```

---

## Task 11: LoginPage (TDD)

**Files:**

- Create: `src/features/auth/__tests__/LoginPage.test.tsx`
- Create: `src/features/auth/LoginPage.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/features/auth/__tests__/LoginPage.test.tsx`:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

vi.mock('../hooks/useLogin', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage', () => {
  it('renders email and password inputs', () => {
    renderLoginPage();
    expect(screen.getByTestId('login-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument();
  });

  it('submit button is disabled when form is empty', () => {
    renderLoginPage();
    expect(screen.getByTestId('login-button')).toBeDisabled();
  });

  it('shows email validation error on invalid email', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    await user.type(screen.getByTestId('login-email-input'), 'notanemail');
    await user.tab();
    await waitFor(() => {
      expect(screen.getByTestId('login-email-error')).toBeInTheDocument();
    });
  });

  it('shows password validation error when too short', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    await user.type(screen.getByTestId('login-password-input'), '123');
    await user.tab();
    await waitFor(() => {
      expect(screen.getByTestId('login-password-error')).toBeInTheDocument();
    });
  });

  it('enables submit button when form is valid', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    await user.type(screen.getByTestId('login-email-input'), 'user@example.com');
    await user.type(screen.getByTestId('login-password-input'), 'password123');
    await waitFor(() => {
      expect(screen.getByTestId('login-button')).not.toBeDisabled();
    });
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm test:run src/features/auth/__tests__/LoginPage.test.tsx
```

Expected: FAIL — `Cannot find module '../LoginPage'`.

- [ ] **Step 3: Implement LoginPage.tsx**

Create `src/features/auth/LoginPage.tsx`:

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginFormData } from './schemas/auth';
import { useLogin } from './hooks/useLogin';

export default function LoginPage() {
  const { mutate: login, isPending, isError } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => login(data))} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <Input
                    {...field}
                    type='email'
                    placeholder='Email'
                    autoComplete='email'
                    data-testid='login-email-input'
                  />
                )}
              />
              {errors.email && (
                <p className='text-sm text-destructive' data-testid='login-email-error'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <Controller
                control={control}
                name='password'
                render={({ field }) => (
                  <Input
                    {...field}
                    type='password'
                    placeholder='Senha'
                    autoComplete='current-password'
                    data-testid='login-password-input'
                  />
                )}
              />
              {errors.password && (
                <p className='text-sm text-destructive' data-testid='login-password-error'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {isError && (
              <p className='text-sm text-destructive' data-testid='login-error'>
                Email ou senha inválidos
              </p>
            )}

            <Button
              type='submit'
              disabled={!isValid || isPending}
              data-testid='login-button'
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm test:run src/features/auth/__tests__/LoginPage.test.tsx
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/LoginPage.tsx src/features/auth/__tests__/LoginPage.test.tsx
git commit -m "feat: add LoginPage with react-hook-form, Zod validation, shadcn UI"
```

---

## Task 12: DashboardPage + NotFoundPage

**Files:**

- Create: `src/features/dashboard/DashboardPage.tsx`
- Create: `src/features/not-found/NotFoundPage.tsx`

- [ ] **Step 1: Create DashboardPage.tsx**

Create `src/features/dashboard/DashboardPage.tsx`:

```typescript
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      {user?.email && (
        <p className='text-muted-foreground' data-testid='dashboard-email'>
          {user.email}
        </p>
      )}
      <Button variant='outline' onClick={logout} data-testid='logout-button'>
        Sair
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Create NotFoundPage.tsx**

Create `src/features/not-found/NotFoundPage.tsx`:

```typescript
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className='text-muted-foreground'>Página não encontrada</p>
      <Button asChild variant='outline'>
        <Link to='/'>Voltar ao início</Link>
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/DashboardPage.tsx src/features/not-found/NotFoundPage.tsx
git commit -m "feat: add DashboardPage and NotFoundPage"
```

---

## Task 13: Route Layouts (AuthLayout + AppLayout)

**Files:**

- Create: `src/routes/AuthLayout.tsx`
- Create: `src/routes/AppLayout.tsx`

- [ ] **Step 1: Create AuthLayout.tsx**

Create `src/routes/AuthLayout.tsx`:

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return null;
  if (isAuthenticated) return <Navigate to='/dashboard' replace />;
  return <Outlet />;
}
```

- [ ] **Step 2: Create AppLayout.tsx**

Create `src/routes/AppLayout.tsx`:

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return null;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  return <Outlet />;
}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/AuthLayout.tsx src/routes/AppLayout.tsx
git commit -m "feat: add AuthLayout and AppLayout route guards"
```

---

## Task 14: Router + App.tsx

**Files:**

- Create: `src/routes/router.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create router.tsx**

Create `src/routes/router.tsx`:

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import AppLayout from './AppLayout';
import LoginPage from '@/features/auth/LoginPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import NotFoundPage from '@/features/not-found/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/dashboard' replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

- [ ] **Step 2: Replace App.tsx**

Replace `src/App.tsx` with:

```typescript
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/providers/QueryProvider';
import { useAuthStore } from '@/stores/auth-store';
import { router } from '@/routes/router';

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/router.tsx src/App.tsx
git commit -m "feat: wire router with public/private layouts and App entry point"
```

---

## Task 15: Final Checks

- [ ] **Step 1: Run all tests**

```bash
pnpm test:run
```

Expected: all tests PASS (token-storage: 4, auth-store: 6, LoginPage: 5 = 15 total).

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Run lint**

```bash
pnpm lint
```

Expected: no errors, no warnings.

- [ ] **Step 4: Start dev server and verify routing**

```bash
pnpm dev
```

Navigate to:

- `http://localhost:5173/` → should redirect to `/login` (not authenticated)
- `http://localhost:5173/login` → should show Login form
- `http://localhost:5173/dashboard` → should redirect to `/login`
- `http://localhost:5173/anything-else` → should show 404 page

Submit login form with email `test@test.com` / password `123456`:

- Should call `store.login()` (mutation will fail since no API, but auth state updates via `onSuccess` won't fire — that's expected for template)

Stop with `Ctrl+C`.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: template complete — auth routing, data layer, tooling configured"
```
