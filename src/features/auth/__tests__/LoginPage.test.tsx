import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

const mockMutate = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useLogin', () => ({
  useLogin: () => ({
    mutate: mockMutate,
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
  beforeEach(() => {
    mockMutate.mockClear();
  });

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

  it('calls login mutation with credentials on valid submit', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    await user.type(screen.getByTestId('login-email-input'), 'user@example.com');
    await user.type(screen.getByTestId('login-password-input'), 'password123');
    await user.click(screen.getByTestId('login-button'));
    expect(mockMutate).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });
});
