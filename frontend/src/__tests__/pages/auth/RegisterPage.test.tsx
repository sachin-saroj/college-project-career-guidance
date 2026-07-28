import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterPage } from '../../../pages/auth/RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock the hook
const mockRegister = vi.fn();
vi.mock('../../../modules/auth/hooks/useAuth', () => ({
  useRegister: () => ({
    mutate: mockRegister,
    isPending: false,
  }),
}));

const renderRegisterPage = () => {
  render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form correctly', () => {
    renderRegisterPage();
    
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Password/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderRegisterPage();
    
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/last name must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });
});
